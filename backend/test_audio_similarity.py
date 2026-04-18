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


def write_hachimi_like(path: Path, pulse_hz: float = 3.4, seconds: float = 2.0, sample_rate: int = 16000) -> None:
    samples = []
    previous = 0.0
    for index in range(round(seconds * sample_rate)):
        t = index / sample_rate
        pulse = max(0.0, math.sin(2 * math.pi * pulse_hz * t)) ** 1.8
        noise = math.sin(index * 12.9898 + 0.73) * 43758.5453
        noise = (noise - math.floor(noise)) * 2 - 1
        hiss = noise - previous * 0.62
        previous = noise
        value = 0.38 * pulse * hiss
        samples.append(int(max(-1.0, min(1.0, value)) * 32767))

    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(b"".join(sample.to_bytes(2, "little", signed=True) for sample in samples))


def write_speech_like(path: Path, seconds: float = 4.0, sample_rate: int = 16000) -> None:
    samples = []
    phase = 0.0
    for index in range(round(seconds * sample_rate)):
        t = index / sample_rate
        syllable = 0.58 + 0.28 * math.sin(2 * math.pi * 2.4 * t)
        frequency = 185 + 26 * math.sin(2 * math.pi * 0.7 * t) + 9 * math.sin(2 * math.pi * 3.1 * t)
        phase += 2 * math.pi * frequency / sample_rate
        vowel = math.sin(phase) + 0.42 * math.sin(2 * phase) + 0.18 * math.sin(3 * phase)
        value = 0.36 * syllable * vowel
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

    write_hachimi_like(reference, 3.4)
    write_hachimi_like(close, 3.6)
    write_tone(far, 90, 0.8)

    close_score = analyze_upload(close, reference).similarity
    far_score = analyze_upload(far, reference).similarity

    assert close_score > far_score, (close_score, far_score)
    assert 0 <= close_score <= 100
    assert 0 <= far_score <= 100
    assert far_score <= 62


def test_speech_like_audio_is_capped() -> None:
    root = Path(__file__).resolve().parent / ".tmp" / "tests"
    root.mkdir(parents=True, exist_ok=True)
    reference = root / "reference.wav"
    speech = root / "speech-like.wav"

    write_hachimi_like(reference, 3.4, seconds=2.0)
    write_speech_like(speech, seconds=4.0)

    result = analyze_upload(speech, reference)

    assert result.similarity <= 42, (result.similarity, result.reasons, result.details)
    assert result.details["voicedRatio"] >= 0.68


def test_unrelated_audio_is_capped() -> None:
    root = Path(__file__).resolve().parent / ".tmp" / "tests"
    root.mkdir(parents=True, exist_ok=True)
    reference = root / "reference.wav"
    unrelated = root / "unrelated.wav"

    write_tone(reference, 330, 3.4, seconds=2.0)
    write_tone(unrelated, 1200, 0.4, seconds=5.0)

    result = analyze_upload(unrelated, reference)

    assert result.similarity <= 45, (result.similarity, result.reasons, result.details)
    assert any("限制" in reason for reason in result.reasons)


if __name__ == "__main__":
    test_similar_audio_scores_higher()
    test_speech_like_audio_is_capped()
    test_unrelated_audio_is_capped()
    print("audio similarity tests passed")
