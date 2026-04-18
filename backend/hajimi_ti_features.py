from __future__ import annotations

import math
from pathlib import Path

from hajimi_ti_models import FeatureVector

import audio_similarity as similarity

try:
    import numpy as np
except Exception:
    np = None


TARGET_RATE = similarity.TARGET_RATE
FRAME_MS = similarity.FRAME_MS
HOP_MS = similarity.HOP_MS


def extract_feature_vector(samples: list[float], sample_rate: int) -> FeatureVector:
    if not samples or sample_rate <= 0:
        return FeatureVector()

    resampled = similarity._resample(samples, sample_rate, TARGET_RATE)
    if not resampled:
        return FeatureVector()

    centered = similarity._remove_dc(resampled)
    duration = len(centered) / TARGET_RATE
    frames = similarity._frame(centered, TARGET_RATE)
    if not frames:
        avg_db = _db_from_rms(_rms_signal(centered))
        return FeatureVector(
            avgDB=avg_db,
            peakFreq=0.0,
            silenceRatio=1.0,
            duration=duration,
            activeDuration=0.0,
            volumeVariance=0.0,
            dominantFreq=0.0,
            lowFreqRatio=0.0,
            pitchChangeRate=0.0,
            freqVariance=0.0,
            lowFreqDuration=0.0,
            hisStrength=_his_strength(avg_db, 0.0, 0.0, 0.0),
        )

    hop_seconds = HOP_MS / 1000.0
    rms_values = [similarity._rms(frame) for frame in frames]
    active_flags = [rms >= 0.008 for rms in rms_values]
    active_frames = [frame for frame, active in zip(frames, active_flags) if active]
    active_rms = [rms for rms, active in zip(rms_values, active_flags) if active]

    if active_frames:
        active_ratio = len(active_frames) / len(frames)
        silence_ratio = _clamp(1.0 - active_ratio, 0.0, 1.0)
        active_duration = len(active_frames) * hop_seconds
        avg_db = sum(_db_from_rms(rms) for rms in active_rms) / len(active_rms)
        volume_variance = _volume_variance(active_rms)
    else:
        silence_ratio = 1.0
        active_duration = 0.0
        avg_db = _db_from_rms(_rms_signal(centered))
        volume_variance = 0.0

    spectrum = _SpectrumAnalyzer(TARGET_RATE)
    dominant_track: list[float] = []
    peak_track: list[float] = []
    low_energy_total = 0.0
    total_energy_total = 0.0
    low_freq_frames = 0

    for frame in active_frames:
        dominant, peak, low_energy, total_energy = spectrum.frame_stats(frame)
        if dominant > 0:
            dominant_track.append(dominant)
            if dominant < 1500:
                low_freq_frames += 1
        if peak > 0:
            peak_track.append(peak)
        low_energy_total += low_energy
        total_energy_total += total_energy

    dominant_freq = _median(dominant_track)
    peak_freq = _percentile(peak_track, 0.9)
    low_freq_ratio = (low_energy_total / total_energy_total) if total_energy_total > 0 else 0.0
    low_freq_ratio = _clamp(low_freq_ratio, 0.0, 1.0)
    low_freq_duration = low_freq_frames * hop_seconds

    freq_variance = _variance(dominant_track)
    pitch_change_rate = _pitch_change_rate(dominant_track, hop_seconds)

    his_strength = _his_strength(avg_db, dominant_freq, active_duration, freq_variance)

    return FeatureVector(
        avgDB=max(0.0, avg_db),
        peakFreq=max(0.0, peak_freq),
        silenceRatio=_clamp(silence_ratio, 0.0, 1.0),
        duration=max(0.0, duration),
        activeDuration=max(0.0, active_duration),
        volumeVariance=_clamp(volume_variance, 0.0, 1.0),
        dominantFreq=max(0.0, dominant_freq),
        lowFreqRatio=low_freq_ratio,
        pitchChangeRate=max(0.0, pitch_change_rate),
        freqVariance=max(0.0, freq_variance),
        lowFreqDuration=max(0.0, low_freq_duration),
        hisStrength=_clamp(his_strength, 0.0, 10.0),
    )


def extract_feature_vector_from_wav(path: Path) -> FeatureVector:
    samples, rate = similarity.read_wav(path)
    return extract_feature_vector(samples, rate)


def _clamp(value: float, low: float, high: float) -> float:
    if value < low:
        return low
    if value > high:
        return high
    return value


def _rms_signal(samples: list[float]) -> float:
    if not samples:
        return 0.0
    return math.sqrt(sum(sample * sample for sample in samples) / len(samples))


def _db_from_rms(rms: float) -> float:
    if rms <= 0:
        return 0.0
    return max(0.0, 20.0 * math.log10(max(rms, 1e-12)) + 100.0)


def _volume_variance(rms_values: list[float]) -> float:
    if len(rms_values) < 2:
        return 0.0
    mean = sum(rms_values) / len(rms_values)
    if mean <= 0:
        return 0.0
    variance = sum((value - mean) ** 2 for value in rms_values) / len(rms_values)
    cv2 = variance / (mean * mean)
    return _clamp(cv2, 0.0, 1.0)


def _variance(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    mean = sum(values) / len(values)
    return sum((value - mean) ** 2 for value in values) / len(values)


def _median(values: list[float]) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    middle = len(ordered) // 2
    if len(ordered) % 2:
        return float(ordered[middle])
    return float((ordered[middle - 1] + ordered[middle]) / 2)


def _percentile(values: list[float], percentile: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    position = _clamp(percentile, 0.0, 1.0) * (len(ordered) - 1)
    left = int(math.floor(position))
    right = int(math.ceil(position))
    if left == right:
        return float(ordered[left])
    fraction = position - left
    return float(ordered[left] * (1.0 - fraction) + ordered[right] * fraction)


def _trimmed_mean(values: list[float], trim_ratio: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    trim = int(len(ordered) * trim_ratio)
    slice_values = ordered[trim : len(ordered) - trim] if len(ordered) - 2 * trim >= 1 else ordered
    return sum(slice_values) / len(slice_values)


def _pitch_change_rate(freq_track: list[float], hop_seconds: float) -> float:
    if len(freq_track) < 2 or hop_seconds <= 0:
        return 0.0
    diffs = [abs(freq_track[index] - freq_track[index - 1]) for index in range(1, len(freq_track))]
    mean_diff = _trimmed_mean(diffs, 0.1)
    return mean_diff / hop_seconds


def _his_strength(avg_db: float, dominant_freq: float, active_duration: float, freq_variance: float) -> float:
    db_score = _clamp((avg_db - 20.0) / 80.0 * 10.0, 0.0, 10.0)
    freq_score = _clamp((dominant_freq - 1000.0) / 9000.0 * 10.0, 0.0, 10.0)
    duration_score = _clamp((active_duration - 0.3) / 2.7 * 10.0, 0.0, 10.0)
    chaos_score = _clamp(freq_variance / 3000.0 * 10.0, 0.0, 10.0)
    return 0.40 * db_score + 0.25 * freq_score + 0.20 * duration_score + 0.15 * chaos_score


class _SpectrumAnalyzer:
    def __init__(self, sample_rate: int) -> None:
        self.sample_rate = sample_rate
        self.max_freq = min(10000.0, sample_rate / 2 - 1.0)
        self.use_numpy = np is not None
        if self.use_numpy:
            self.n_fft = 2048
        else:
            step = 50
            start = 100
            stop = int(self.max_freq // step) * step
            self.freqs = [float(freq) for freq in range(start, max(start + step, stop + 1), step)]
            self.coefficients = [2.0 * math.cos(2.0 * math.pi * freq / sample_rate) for freq in self.freqs]

    def frame_stats(self, frame: list[float]) -> tuple[float, float, float, float]:
        if not frame:
            return 0.0, 0.0, 0.0, 0.0
        return self._frame_stats_numpy(frame) if self.use_numpy else self._frame_stats_goertzel(frame)

    def _frame_stats_numpy(self, frame: list[float]) -> tuple[float, float, float, float]:
        data = np.asarray(frame, dtype=np.float32)
        window = np.hanning(data.size).astype(np.float32, copy=False)
        windowed = data * window
        spec = np.fft.rfft(windowed, n=self.n_fft)
        power = np.abs(spec) ** 2
        freqs = np.fft.rfftfreq(self.n_fft, d=1.0 / self.sample_rate)
        mask = (freqs >= 50.0) & (freqs <= self.max_freq)
        if not mask.any():
            return 0.0, 0.0, 0.0, 0.0
        p = power[mask]
        f = freqs[mask]
        total = float(p.sum())
        if total <= 0:
            return 0.0, 0.0, 0.0, 0.0
        dominant = float(f[int(np.argmax(p))])
        max_power = float(p.max())
        threshold = max_power * 0.15
        peak_candidates = f[p >= threshold]
        peak = float(peak_candidates.max()) if peak_candidates.size else dominant
        low_energy = float(p[f < 2000.0].sum())
        return dominant, peak, low_energy, total

    def _frame_stats_goertzel(self, frame: list[float]) -> tuple[float, float, float, float]:
        low_energy = 0.0
        total_energy = 0.0
        best_freq = 0.0
        best_power = -1.0
        max_power = 0.0
        powers: list[float] = []

        for freq, coefficient in zip(self.freqs, self.coefficients):
            power = _goertzel_with_coefficient(frame, coefficient)
            powers.append(power)
            total_energy += power
            if freq < 2000.0:
                low_energy += power
            if power > best_power:
                best_power = power
                best_freq = freq
            if power > max_power:
                max_power = power

        if total_energy <= 0 or best_power <= 0:
            return 0.0, 0.0, 0.0, 0.0

        threshold = max_power * 0.15
        peak_freq = best_freq
        for freq, power in zip(reversed(self.freqs), reversed(powers)):
            if power >= threshold:
                peak_freq = freq
                break

        return best_freq, peak_freq, low_energy, total_energy


def _goertzel_with_coefficient(frame: list[float], coefficient: float) -> float:
    prev = 0.0
    prev2 = 0.0
    for sample in frame:
        current = sample + coefficient * prev - prev2
        prev2 = prev
        prev = current
    return prev2 * prev2 + prev * prev - coefficient * prev * prev2

