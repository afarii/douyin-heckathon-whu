from __future__ import annotations

import json
import os
import tempfile
import time
from email.parser import BytesParser
from email.policy import default
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

from audio_similarity import analyze_upload
from challenge import (
    ChallengeExpiredError,
    ChallengeLimitError,
    ChallengeNotFoundError,
    ChallengeStore,
    compute_pk_rows,
    validate_challenge_code,
)
from hajimi_ti_catalog import get_personality_by_code
from hajimi_ti_features import extract_feature_vector_from_wav
from hajimi_ti_judge import judge
from his_levels import build_his_level_mapping, normalize_audio_his


ROOT = Path(__file__).resolve().parents[1]
REFERENCE_AUDIO = ROOT / "backend" / "reference" / "hachimi.wav"
REFERENCE_AUDIO_LIBRARY = ROOT / "data" / "reference_audio.v1.json"
TEMP_DIR = ROOT / "backend" / ".tmp"
MAX_UPLOAD_BYTES = 8 * 1024 * 1024
CHALLENGE_STORE = ChallengeStore(TEMP_DIR / "challenges.v1.json")


class HachimiHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/challenge/") or parsed.path.startswith("/c/"):
            self.path = "/index.html"
            super().do_GET()
            return

        if parsed.path.startswith("/audio/reference/"):
            filename = unquote(parsed.path[len("/audio/reference/") :]).strip()
            reference_id = Path(filename).stem.upper()
            audio_path = ROOT / "data" / "reference_clips" / f"{reference_id}.mp3"
            if not audio_path.exists():
                self.send_error(HTTPStatus.NOT_FOUND, "参考音频不存在")
                return
            self.path = f"/data/reference_clips/{reference_id}.mp3"
            super().do_GET()
            return

        if parsed.path.startswith("/api/challenge/"):
            code = unquote(parsed.path[len("/api/challenge/") :]).strip()
            if not code:
                self._json({"error": "缺少挑战码"}, status=HTTPStatus.BAD_REQUEST)
                return
            try:
                validate_challenge_code(code)
                item = CHALLENGE_STORE.get(code=code, now_ts=int(time.time()))
                masked = item.userId[:2] + "***" + item.userId[-2:] if len(item.userId) >= 6 else "***"
                self._json(
                    {
                        "challenge": {
                            "code": item.code,
                            "createdAt": item.createdAt,
                            "expiresAt": item.expiresAt,
                            "creator": {"userIdMasked": masked},
                            "payload": item.payload,
                        }
                    }
                )
            except ChallengeExpiredError as error:
                self._json({"error": str(error)}, status=HTTPStatus.GONE)
            except ChallengeNotFoundError:
                self._json({"error": "挑战不存在或已失效"}, status=HTTPStatus.NOT_FOUND)
            except ValueError as error:
                self._json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as error:
                self._json({"error": f"读取挑战失败：{error}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if parsed.path == "/api/reference/list":
            try:
                payload = self._load_reference_audio_library()
                self._json(payload)
            except Exception as error:
                self._json({"error": f"读取参考音频库失败：{error}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if parsed.path.startswith("/api/reference/"):
            reference_id = unquote(parsed.path[len("/api/reference/") :]).strip()
            if not reference_id:
                self._json({"error": "缺少参考音频编号"}, status=HTTPStatus.BAD_REQUEST)
                return
            try:
                payload = self._load_reference_audio_library()
                references = payload.get("references") if isinstance(payload, dict) else None
                if not isinstance(references, list):
                    raise ValueError("参考音频数据格式不正确")
                normalized = reference_id.upper()
                item = next(
                    (entry for entry in references if isinstance(entry, dict) and str(entry.get("id", "")).upper() == normalized),
                    None,
                )
                if item is None:
                    self._json({"error": f"参考音频不存在：{reference_id}"}, status=HTTPStatus.NOT_FOUND)
                    return
                self._json({"reference": item})
            except ValueError as error:
                self._json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as error:
                self._json({"error": f"读取参考音频失败：{error}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        super().do_GET()

    def do_POST(self) -> None:
        if self.path == "/api/challenge/create":
            try:
                audio_bytes, filename, user_id, payload = self._read_challenge_create_fields()
                item = CHALLENGE_STORE.create(
                    user_id=user_id,
                    audio_bytes=audio_bytes,
                    payload=payload,
                    now_ts=int(time.time()),
                )
                self._json(
                    {
                        "code": item.code,
                        "createdAt": item.createdAt,
                        "expiresAt": item.expiresAt,
                        "url": f"/challenge/{item.code}",
                    }
                )
            except ChallengeLimitError as error:
                self._json({"error": str(error)}, status=HTTPStatus.TOO_MANY_REQUESTS)
            except ValueError as error:
                self._json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            except Exception as error:
                self._json({"error": f"创建挑战失败：{error}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
            return

        if self.path != "/api/upload":
            self.send_error(HTTPStatus.NOT_FOUND, "接口不存在")
            return

        try:
            wav_bytes, filename, reference_bytes, challenge_code = self._read_audio_fields()
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
            response_payload = {
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

            if challenge_code:
                validate_challenge_code(challenge_code)
                item = CHALLENGE_STORE.get(code=challenge_code, now_ts=int(time.time()))
                masked = item.userId[:2] + "***" + item.userId[-2:] if len(item.userId) >= 6 else "***"
                my_pk_payload = {
                    "avgDB": features.avgDB,
                    "dominantFreq": features.dominantFreq,
                    "activeDuration": features.activeDuration,
                    "freqVariance": features.freqVariance,
                    "audioHis": audio_his,
                }
                response_payload["pk"] = {
                    "challenge": {
                        "code": item.code,
                        "createdAt": item.createdAt,
                        "expiresAt": item.expiresAt,
                        "creator": {"userIdMasked": masked},
                    },
                    "result": compute_pk_rows(my_pk_payload, item.payload),
                }

            self._json(response_payload)
        except ValueError as error:
            self._json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except ChallengeExpiredError as error:
            self._json({"error": str(error)}, status=HTTPStatus.GONE)
        except ChallengeNotFoundError:
            self._json({"error": "挑战不存在或已失效"}, status=HTTPStatus.NOT_FOUND)
        except Exception as error:
            self._json({"error": f"音频分析失败：{error}"}, status=HTTPStatus.INTERNAL_SERVER_ERROR)
        finally:
            if "temp_path" in locals():
                temp_path.unlink(missing_ok=True)
            if "reference_temp_path" in locals():
                reference_temp_path.unlink(missing_ok=True)

    def _read_audio_fields(self) -> tuple[bytes, str, bytes | None, str]:
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
        challenge_code = ""

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
            elif field_name in ("challengeCode", "challenge", "code"):
                raw = part.get_payload(decode=True) or b""
                challenge_code = raw.decode("utf-8", errors="ignore").strip()

        if not audio_payload:
            raise ValueError("缺少 audio 字段")

        return audio_payload, filename, reference_payload, challenge_code

    def _read_challenge_create_fields(self) -> tuple[bytes, str, str, dict]:
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            raise ValueError("没有收到上传内容")
        if content_length > MAX_UPLOAD_BYTES:
            raise ValueError("音频文件过大，请控制在 8MB 以内")

        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            raise ValueError("请使用 multipart/form-data 创建挑战")

        body = self.rfile.read(content_length)
        message = BytesParser(policy=default).parsebytes(
            b"Content-Type: " + content_type.encode("utf-8") + b"\r\n\r\n" + body
        )

        audio_payload: bytes | None = None
        filename = "upload.wav"
        user_id = ""
        payload: dict = {}

        for part in message.iter_parts():
            field_name = part.get_param("name", header="content-disposition")
            if field_name == "audio":
                filename = part.get_filename() or "upload.wav"
                audio = part.get_payload(decode=True)
                if not audio:
                    raise ValueError("上传音频为空")
                if not audio.startswith(b"RIFF"):
                    raise ValueError("当前后端接收 WAV 音频；请通过前端自动转换后提交")
                audio_payload = audio
            elif field_name == "userId":
                raw = part.get_payload(decode=True) or b""
                user_id = raw.decode("utf-8", errors="ignore").strip()
            elif field_name in ("result", "payload"):
                raw = part.get_payload(decode=True) or b""
                text = raw.decode("utf-8", errors="ignore").strip()
                if text:
                    loaded = json.loads(text)
                    payload = loaded if isinstance(loaded, dict) else {}

        if not audio_payload:
            raise ValueError("缺少 audio 字段")
        if not user_id:
            raise ValueError("缺少 userId 字段")

        return audio_payload, filename, user_id, payload

    def _load_reference_audio_library(self) -> dict:
        if not REFERENCE_AUDIO_LIBRARY.exists():
            raise ValueError("参考音频库文件不存在")
        with REFERENCE_AUDIO_LIBRARY.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)
        if not isinstance(payload, dict):
            raise ValueError("参考音频库文件格式不正确")
        references = payload.get("references")
        if isinstance(references, list):
            for item in references:
                if not isinstance(item, dict):
                    continue
                reference_id = str(item.get("id") or "").strip()
                if reference_id:
                    item.setdefault("audioUrl", f"/audio/reference/{reference_id}.mp3")
                    item.setdefault("audioPath", f"./data/reference_clips/{reference_id}.mp3")
                difficulty = item.get("difficulty")
                diff_num = int(difficulty) if isinstance(difficulty, (int, float, str)) and str(difficulty).strip().isdigit() else None
                if diff_num is not None and 1 <= diff_num <= 6:
                    item.setdefault("difficultyStars", "⭐" * diff_num)
                if "funCopy" not in item and "funQuote" in item:
                    item["funCopy"] = item.get("funQuote")
        return payload

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
