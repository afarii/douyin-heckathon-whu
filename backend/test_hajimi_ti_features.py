from __future__ import annotations

import math

from hajimi_ti_features import extract_feature_vector


def _tone_samples(
    frequency: float,
    seconds: float,
    sample_rate: int,
    amplitude: float = 0.2,
) -> list[float]:
    length = max(1, round(seconds * sample_rate))
    samples: list[float] = []
    for index in range(length):
        t = index / sample_rate
        samples.append(amplitude * math.sin(2 * math.pi * frequency * t))
    return samples


def test_low_freq_tone_has_low_freq_duration() -> None:
    sample_rate = 16000
    samples = _tone_samples(600.0, seconds=1.2, sample_rate=sample_rate, amplitude=0.2)
    features = extract_feature_vector(samples, sample_rate)
    assert features.duration > 1.0
    assert 450 <= features.dominantFreq <= 750, features
    assert features.lowFreqRatio >= 0.4, features
    assert features.lowFreqDuration >= 0.5, features
    assert features.avgDB >= 65, features


def test_high_freq_tone_has_high_peak_freq() -> None:
    sample_rate = 16000
    samples = _tone_samples(7000.0, seconds=1.0, sample_rate=sample_rate, amplitude=0.18)
    features = extract_feature_vector(samples, sample_rate)
    assert features.dominantFreq >= 6000, features
    assert features.peakFreq >= 5000, features
    assert features.lowFreqRatio <= 0.6, features


def test_silence_returns_silence_ratio_one() -> None:
    sample_rate = 16000
    samples = [0.0 for _ in range(sample_rate)]
    features = extract_feature_vector(samples, sample_rate)
    assert features.duration > 0.9
    assert features.silenceRatio == 1.0
    assert features.activeDuration == 0.0
    assert features.dominantFreq == 0.0


if __name__ == "__main__":
    test_low_freq_tone_has_low_freq_duration()
    test_high_freq_tone_has_high_peak_freq()
    test_silence_returns_silence_ratio_one()
    print("hajimi ti features tests passed")

