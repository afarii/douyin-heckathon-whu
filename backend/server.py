from __future__ import annotations

import json
import os
import tempfile
from email.parser import BytesParser
from email.policy import default
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from audio_similarity import analyze_upload
from hajimi_ti_catalog import get_personality_by_code
from hajimi_ti_features import extract_feature_vector_from_wav
from hajimi_ti_judge import judge
from his_levels import build_his_level_mapping, normalize_audio_his


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_AUDIO = ROOT / "backend" / "reference" / "hachimi.wav"
TEMP_DIR = ROOT / "backend" / ".tmp"
MAX_UPLOAD_BYTES = 8 * 1024 * 1024


class HachimiHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_POST(self) -> None:
        if self.path != "/api/upload":
            self.send_error(HTTPStatus.NOT_FOUND, "接口不存在")
            return

        try:
            wav_bytes, filename, reference_bytes = self._read_audio_fields()
            TEMP_DIR.mkdir(parents=True, exist_ok=True)
            with tempfile.NamedTemporaryFile(suffix=Path(filename).suffix or ".wav", dir=TEMP_DIR, delete=False) as temp:
                temp.write(wav_bytes)
                temp_path = Path(temp.name)
            reference_path = REFERENCE_AUDIO
            if reference_bytes:
                with tempfile.NamedTemporaryFile(suffix=".wav", dir=TEMP_DIR, delete=False) as reference_temp:
                    reference_temp.write(reference_bytes)
                    reference_temp_path = Path(reference_temp.name)
                reference_path = reference_temp_path

            result = analyze_upload(temp_path, reference_path)
            features = extract_feature_vector_from_wav(temp_path)
            judge_result = judge(features)
            profile = get_personality_by_code(judge_result.personalityCode)
            audio_his = normalize_audio_his(features.hisStrength)
            his_level_info = build_his_level_mapping(audio_his)
            self._json(
                {
                    "similarity": result.similarity,
                    "grade": result.grade,
                    "comment": result.comment,
                    "mode": result.mode,
                    "confidence": result.confidence,
                    "reasons": list(result.reasons),
                    "details": result.details,
                    "audioHis": audio_his,
                    "hisLevel": his_level_info["hisLevel"],
                    "hisLevelInfo": his_level_info,
                    "peakFreq": features.peakFreq,
                    "activeDuration": features.activeDuration,
                    "freqVariance": features.freqVariance,
                    "volumeVariance": features.volumeVariance,
                    "dominantFreq": features.dominantFreq,
                    "avgDB": features.avgDB,
                    "personalityCode": judge_result.personalityCode,
                    "personalityMatch": judge_result.personalityMatch,
                    "dimensionMatches": [
                        {"dimension": item.dimension, "letter": item.letter, "match": item.match}
                        for item in judge_result.dimensionMatches
                    ],
                    "personalityProfile": {
                        "code": profile.code,
                        "name": profile.name,
                        "title": profile.title,
                        "themeColor": profile.themeColor,
                        "emoji": profile.emoji,
                        "rarity": profile.rarity,
                        "coreDescription": profile.coreDescription,
                        "funCopy": profile.funCopy,
                        "portrait6d": dict(profile.portrait6d),
                        "tags": list(profile.tags),
                    },
                }
            )
        except ValueError as error:
            self._json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except Exception as error:
            self._json({"error": f"音频分析失败：{error}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
        finally:
            if "temp_path" in locals():
                temp_path.unlink(missing_ok=True)
            if "reference_temp_path" in locals():
                reference_temp_path.unlink(missing_ok=True)

    def _read_audio_fields(self) -> tuple[bytes, str, bytes | None]:
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            raise ValueError("没有收到上传内容")
        if content_length > MAX_UPLOAD_BYTES:
            raise ValueError("音频文件过大，请控制在 8MB 以内")

        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            raise ValueError("请使用 multipart/form-data 上传音频")

        body = self.rfile.read(content_length)
        message = BytesParser(policy=default).parsebytes(
            b"Content-Type: " + content_type.encode("utf-8") + b"\r\n\r\n" + body
        )

        audio_payload = None
        reference_payload = None
        filename = "upload.wav"

        for part in message.iter_parts():
            field_name = part.get_param("name", header="content-disposition")
            if field_name == "audio":
                filename = part.get_filename() or "upload.wav"
                payload = part.get_payload(decode=True)
                if not payload:
                    raise ValueError("上传音频为空")
                if not payload.startswith(b"RIFF"):
                    raise ValueError("当前后端接收 WAV 音频；请通过前端自动转换后提交")
                audio_payload = payload
            elif field_name == "reference":
                payload = part.get_payload(decode=True)
                if payload and payload.startswith(b"RIFF"):
                    reference_payload = payload

        if not audio_payload:
            raise ValueError("缺少 audio 字段")

        return audio_payload, filename, reference_payload

    def _json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    port = int(os.environ.get("PORT", "4173"))
    server = ThreadingHTTPServer(("127.0.0.1", port), HachimiHandler)
    print(f"Hachimi server running at http://127.0.0.1:{port}/")
    print("Reference audio:", REFERENCE_AUDIO if REFERENCE_AUDIO.exists() else "not configured; using heuristic mode")
    server.serve_forever()


if __name__ == "__main__":
    main()
