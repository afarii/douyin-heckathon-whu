from __future__ import annotations

import json
import threading
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

from server import HachimiHandler
from test_audio_similarity import write_tone


def test_upload_api_returns_score() -> None:
    root = Path(__file__).resolve().parent / ".tmp" / "api"
    root.mkdir(parents=True, exist_ok=True)
    audio_path = root / "upload.wav"
    write_tone(audio_path, 330, 3.4)

    server = ThreadingHTTPServer(("127.0.0.1", 0), HachimiHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        boundary = "----hachimi-test-boundary"
        audio = audio_path.read_bytes()
        reference = audio_path.read_bytes()
        body = (
            f"--{boundary}\r\n"
            'Content-Disposition: form-data; name="audio"; filename="upload.wav"\r\n'
            "Content-Type: audio/wav\r\n\r\n"
        ).encode("utf-8") + audio + (
            f"\r\n--{boundary}\r\n"
            'Content-Disposition: form-data; name="reference"; filename="haqi-reference.wav"\r\n'
            "Content-Type: audio/wav\r\n\r\n"
        ).encode("utf-8") + reference + f"\r\n--{boundary}--\r\n".encode("utf-8")

        request = urllib.request.Request(
            f"http://127.0.0.1:{server.server_port}/api/upload",
            data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="POST",
        )

        with urllib.request.urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))

        assert 0 <= payload["similarity"] <= 100
        assert payload["grade"]
        assert payload["comment"]
        assert payload["mode"] == "reference"
        assert payload["reasons"]
        assert payload["details"]["bandSimilarity"] >= 0
        assert 0.0 <= payload["audioHis"] <= 10.0
        assert 1 <= payload["hisLevel"] <= 9
        assert payload["hisLevelInfo"]["hisLevel"] == payload["hisLevel"]
        assert payload["hisLevelInfo"]["title"]
        assert payload["hisLevelInfo"]["color"].startswith("#")
        assert payload["hisLevelInfo"]["desc"]
        assert payload["hisLevelInfo"]["hint"]
        assert payload["peakFreq"] >= 0.0
        assert payload["activeDuration"] >= 0.0
        assert payload["freqVariance"] >= 0.0
        assert 0.0 <= payload["volumeVariance"] <= 1.0
        assert payload["dominantFreq"] >= 0.0
        assert payload["avgDB"] >= 0.0
    finally:
        server.shutdown()
        server.server_close()


def test_reference_list_api_returns_items() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 0), HachimiHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{server.server_port}/api/reference/list", timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))

        assert payload["version"]
        references = payload["references"]
        assert isinstance(references, list)
        assert len(references) >= 30
        assert any(item.get("id") == "R01" for item in references if isinstance(item, dict))
    finally:
        server.shutdown()
        server.server_close()


def test_reference_detail_api_returns_item() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 0), HachimiHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        with urllib.request.urlopen(f"http://127.0.0.1:{server.server_port}/api/reference/R01", timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))

        reference = payload["reference"]
        assert reference["id"] == "R01"
        assert reference["name"]
        assert reference["personalityType"]
        assert reference["difficulty"]
    finally:
        server.shutdown()
        server.server_close()


def test_challenge_create_and_get() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    store_path = repo_root / "backend" / ".tmp" / "challenges.v1.json"
    store_path.unlink(missing_ok=True)

    root = Path(__file__).resolve().parent / ".tmp" / "api"
    root.mkdir(parents=True, exist_ok=True)
    audio_path = root / "challenge.wav"
    write_tone(audio_path, 420, 2.8)

    server = ThreadingHTTPServer(("127.0.0.1", 0), HachimiHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()

    try:
        boundary = "----hachimi-test-challenge-boundary"
        audio = audio_path.read_bytes()
        result = json.dumps({"avgDB": 60, "dominantFreq": 2400, "activeDuration": 1.6, "freqVariance": 1200, "audioHis": 7.2}, ensure_ascii=False).encode(
            "utf-8"
        )
        user_id = b"u-api-test"
        body = (
            f"--{boundary}\r\n"
            'Content-Disposition: form-data; name="audio"; filename="challenge.wav"\r\n'
            "Content-Type: audio/wav\r\n\r\n"
        ).encode("utf-8") + audio + (
            f"\r\n--{boundary}\r\n"
            'Content-Disposition: form-data; name="userId"\r\n\r\n'
        ).encode("utf-8") + user_id + (
            f"\r\n--{boundary}\r\n"
            'Content-Disposition: form-data; name="result"\r\n\r\n'
        ).encode("utf-8") + result + f"\r\n--{boundary}--\r\n".encode("utf-8")

        request = urllib.request.Request(
            f"http://127.0.0.1:{server.server_port}/api/challenge/create",
            data=body,
            headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
            method="POST",
        )

        with urllib.request.urlopen(request, timeout=5) as response:
            payload = json.loads(response.read().decode("utf-8"))

        code = payload["code"]
        assert isinstance(code, str)
        assert len(code) == 12

        with urllib.request.urlopen(f"http://127.0.0.1:{server.server_port}/api/challenge/{code}", timeout=5) as response:
            detail = json.loads(response.read().decode("utf-8"))

        challenge = detail["challenge"]
        assert challenge["code"] == code
        assert challenge["expiresAt"] > challenge["createdAt"]
        assert challenge["payload"]["audioHis"] == 7.2
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    test_upload_api_returns_score()
    test_reference_list_api_returns_items()
    test_reference_detail_api_returns_item()
    test_challenge_create_and_get()
    print("server api tests passed")
