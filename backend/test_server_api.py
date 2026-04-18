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
        body = (
            f"--{boundary}\r\n"
            'Content-Disposition: form-data; name="audio"; filename="upload.wav"\r\n'
            "Content-Type: audio/wav\r\n\r\n"
        ).encode("utf-8") + audio + f"\r\n--{boundary}--\r\n".encode("utf-8")

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
        assert payload["mode"] in ("reference", "heuristic")
    finally:
        server.shutdown()
        server.server_close()


if __name__ == "__main__":
    test_upload_api_returns_score()
    print("server api tests passed")
