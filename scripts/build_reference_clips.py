from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LIB_PATH = ROOT / "data" / "reference_audio.v1.json"
RAW_DIR = ROOT / "data" / "reference_clips_raw"
OUT_DIR = ROOT / "data" / "reference_clips"
ALLOWED_EXTS = (".mp3", ".wav", ".m4a", ".aac", ".flac", ".ogg", ".mp4", ".webm")


def _run(cmd: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(cmd, check=True, text=True, capture_output=True, encoding="utf-8", errors="replace")


def _ffprobe_duration_seconds(input_path: Path) -> float:
    proc = _run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(input_path),
        ]
    )
    return float(proc.stdout.strip() or "0")


def _pick_best_start(duration: float, clip_duration: float) -> float:
    if duration <= 0:
        return 0.0
    if duration <= clip_duration:
        return 0.0
    return max(0.0, (duration - clip_duration) / 2.0)


def _build_ffmpeg_filter(clip_duration: float) -> str:
    fade_out_start = max(0.0, clip_duration - 0.12)
    return f"highpass=f=80,lowpass=f=10000,afade=t=in:st=0:d=0.06,afade=t=out:st={fade_out_start:.3f}:d=0.12"


def _find_raw_for_id(reference_id: str) -> Path | None:
    normalized = reference_id.strip()
    if not normalized:
        return None
    candidates = sorted(RAW_DIR.glob(f"{normalized}.*"))
    for path in candidates:
        if path.is_file() and path.suffix.lower() in ALLOWED_EXTS:
            return path
    return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--library", default=str(LIB_PATH))
    parser.add_argument("--raw-dir", default=str(RAW_DIR))
    parser.add_argument("--out-dir", default=str(OUT_DIR))
    parser.add_argument("--duration", type=float, default=6.0)
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    lib_path = Path(args.library)
    raw_dir = Path(args.raw_dir)
    out_dir = Path(args.out_dir)
    clip_duration = float(args.duration)

    if not (3.0 <= clip_duration <= 10.0):
        raise SystemExit("--duration 必须在 3 到 10 秒之间")

    if not lib_path.exists():
        raise SystemExit(f"找不到参考库文件：{lib_path}")

    raw_dir.mkdir(parents=True, exist_ok=True)
    out_dir.mkdir(parents=True, exist_ok=True)

    payload = json.loads(lib_path.read_text(encoding="utf-8"))
    references = payload.get("references")
    if not isinstance(references, list):
        raise SystemExit("reference_audio.v1.json 格式不正确：references 不是数组")

    generated = 0
    skipped = 0
    updated = False

    for item in references:
        if not isinstance(item, dict):
            continue
        ref_id = str(item.get("id") or "").strip()
        if not ref_id:
            continue

        raw_path = _find_raw_for_id(ref_id)
        if raw_path is None:
            skipped += 1
            continue

        out_path = out_dir / f"{ref_id}.mp3"
        if out_path.exists() and not args.overwrite:
            item["audioPath"] = f"./data/reference_clips/{ref_id}.mp3"
            updated = True
            skipped += 1
            continue

        duration = _ffprobe_duration_seconds(raw_path)
        start = _pick_best_start(duration, clip_duration)
        audio_filter = _build_ffmpeg_filter(clip_duration)

        _run(
            [
                "ffmpeg",
                "-y",
                "-ss",
                f"{start:.3f}",
                "-t",
                f"{clip_duration:.3f}",
                "-i",
                str(raw_path),
                "-vn",
                "-ac",
                "1",
                "-ar",
                "44100",
                "-af",
                audio_filter,
                "-c:a",
                "libmp3lame",
                "-q:a",
                "4",
                str(out_path),
            ]
        )

        item["audioPath"] = f"./data/reference_clips/{ref_id}.mp3"
        updated = True
        generated += 1

    if updated:
        lib_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"raw-dir: {raw_dir}")
    print(f"out-dir: {out_dir}")
    print(f"generated: {generated}")
    print(f"skipped: {skipped}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

