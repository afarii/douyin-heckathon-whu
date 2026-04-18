from __future__ import annotations

import math
import wave
from pathlib import Path

from audio_similarity import analyze_upload


def write_tone(path: Path, frequency: float, pulse_hz: float, seconds: float = 2.0, sample_rate: int = 16000) -> None:
    samples = []
    for index in range(round(seconds * sample_rate)):
        t = index / sample_rate
        envelope = 0.35 + 0.65 * max(0.0, math.sin(2 * math.pi * pulse_hz * t))
        value = 0.55 * envelope * math.sin(2 * math.pi * frequency * t)
        samples.append(int(max(-1.0, min(1.0, value)) * 32767))

    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(b"".join(sample.to_bytes(2, "little", signed=True) for sample in samples))


def test_similar_audio_scores_higher() -> None:
    root = Path(__file__).resolve().parent / ".tmp" / "tests"
    root.mkdir(parents=True, exist_ok=True)
    reference = root / "reference.wav"
    close = root / "close.wav"
    far = root / "far.wav"

    write_tone(reference, 330, 3.4)
    write_tone(close, 350, 3.6)
    write_tone(far, 90, 0.8)

    close_score = analyze_upload(close, reference).similarity
    far_score = analyze_upload(far, reference).similarity

    assert close_score > far_score, (close_score, far_score)
    assert 0 <= close_score <= 100
    assert 0 <= far_score <= 100


if __name__ == "__main__":
    test_similar_audio_scores_higher()
    print("audio similarity tests passed")
