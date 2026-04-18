from __future__ import annotations

import math
import wave
from dataclasses import dataclass
from pathlib import Path


TARGET_RATE = 16000
FRAME_MS = 25
HOP_MS = 10
MAX_SECONDS = 8


@dataclass(frozen=True)
class AudioFeatures:
    duration: float
    active_duration: float
    active_ratio: float
    silence_ratio: float
    rms: float
    zcr: float
    pitch_hz: float
    tempo_hz: float
    bands: tuple[float, ...]
    contour: tuple[float, ...]


@dataclass(frozen=True)
class SimilarityResult:
    similarity: int
    grade: str
    comment: str
    mode: str
    confidence: float
    reasons: tuple[str, ...]
    details: dict[str, float]


def analyze_upload(upload_path: Path, reference_path: Path | None = None) -> SimilarityResult:
    samples, sample_rate = read_wav(upload_path)
    features = extract_features(samples, sample_rate)

    if reference_path and reference_path.exists():
        ref_samples, ref_rate = read_wav(reference_path)
        reference = extract_features(ref_samples, ref_rate)
        score, reasons, details = compare_features(features, reference)
        mode = "reference"
    else:
        score, reasons, details = score_hachimi_likeness(features)
        mode = "heuristic"

    similarity = max(0, min(100, round(score)))
    grade, comment = describe_score(similarity)
    confidence = confidence_from_features(features)
    return SimilarityResult(similarity, grade, comment, mode, confidence, tuple(reasons), details)


def read_wav(path: Path) -> tuple[list[float], int]:
    with wave.open(str(path), "rb") as wav:
        channels = wav.getnchannels()
        sample_width = wav.getsampwidth()
        sample_rate = wav.getframerate()
        frame_count = min(wav.getnframes(), sample_rate * MAX_SECONDS)
        raw = wav.readframes(frame_count)

    if sample_width not in (1, 2, 4):
        raise ValueError("仅支持 8/16/32-bit PCM WAV 音频")

    ints = _decode_pcm(raw, sample_width)
    if not ints:
        raise ValueError("音频为空")

    mono: list[float] = []
    scale = float(2 ** (sample_width * 8 - 1))
    for index in range(0, len(ints), channels):
        frame = ints[index : index + channels]
        if len(frame) == channels:
            mono.append(sum(frame) / (len(frame) * scale))

    return mono, sample_rate


def _decode_pcm(raw: bytes, sample_width: int) -> list[int]:
    if sample_width == 1:
        return [byte - 128 for byte in raw]

    values: list[int] = []
    for index in range(0, len(raw), sample_width):
        chunk = raw[index : index + sample_width]
        if len(chunk) == sample_width:
            values.append(int.from_bytes(chunk, "little", signed=True))
    return values


def extract_features(samples: list[float], sample_rate: int) -> AudioFeatures:
    normalized = _normalize(_remove_dc(_resample(samples, sample_rate, TARGET_RATE)))
    emphasized = _pre_emphasis(normalized)
    frames = _frame(emphasized, TARGET_RATE)

    if not frames:
        raise ValueError("音频太短，无法分析")

    energies = [_rms(frame) for frame in frames]
    threshold = _vad_threshold(energies)
    active_frames = [frame for frame, energy in zip(frames, energies) if energy >= threshold]

    if not active_frames:
        raise ValueError("没有检测到有效人声或旋律片段")

    active_ratio = len(active_frames) / len(frames)
    active_duration = len(active_frames) * HOP_MS / 1000
    silence_ratio = 1 - active_ratio
    rms = sum(_rms(frame) for frame in active_frames) / len(active_frames)
    zcr = sum(_zcr(frame) for frame in active_frames) / len(active_frames)
    pitch_hz = _median([pitch for pitch in (_pitch(frame, TARGET_RATE) for frame in active_frames) if pitch > 0])
    tempo_hz = _tempo_from_envelope(energies, TARGET_RATE)
    bands = _average_bands(active_frames, TARGET_RATE)
    contour = _energy_contour(energies)

    return AudioFeatures(
        duration=len(normalized) / TARGET_RATE,
        active_duration=active_duration,
        active_ratio=active_ratio,
        silence_ratio=silence_ratio,
        rms=rms,
        zcr=zcr,
        pitch_hz=pitch_hz,
        tempo_hz=tempo_hz,
        bands=bands,
        contour=contour,
    )


def compare_features(uploaded: AudioFeatures, reference: AudioFeatures) -> tuple[float, list[str], dict[str, float]]:
    band_similarity = _cosine(uploaded.bands, reference.bands)
    contour_similarity = _dtw_similarity(uploaded.contour, reference.contour)
    pitch_similarity = _ratio_score(uploaded.pitch_hz, reference.pitch_hz, tolerance=0.35)
    tempo_similarity = _ratio_score(uploaded.tempo_hz, reference.tempo_hz, tolerance=0.45)
    zcr_similarity = _ratio_score(uploaded.zcr, reference.zcr, tolerance=0.5)
    duration_similarity = _ratio_score(uploaded.active_duration, reference.active_duration, tolerance=0.75)
    score = (
        band_similarity * 30
        + contour_similarity * 25
        + zcr_similarity * 18
        + duration_similarity * 12
        + tempo_similarity * 10
        + pitch_similarity * 5
    )
    score, cap_reasons = _apply_reference_caps(
        score,
        uploaded,
        band_similarity,
        contour_similarity,
        zcr_similarity,
        duration_similarity,
        pitch_similarity,
    )
    details = {
        "bandSimilarity": round(band_similarity, 3),
        "contourSimilarity": round(contour_similarity, 3),
        "zcrSimilarity": round(zcr_similarity, 3),
        "durationSimilarity": round(duration_similarity, 3),
        "tempoSimilarity": round(tempo_similarity, 3),
        "pitchSimilarity": round(pitch_similarity, 3),
        "activeDuration": round(uploaded.active_duration, 3),
        "activeRatio": round(uploaded.active_ratio, 3),
        "pitchHz": round(uploaded.pitch_hz, 1),
        "tempoHz": round(uploaded.tempo_hz, 2),
    }
    reasons = [
        f"音色频带相似度约 {round(band_similarity * 100)}%，决定声音像不像示例。",
        f"节奏轮廓相似度约 {round(contour_similarity * 100)}%，用于判断哈气起伏是否贴近。",
        f"嘶嘶感接近度约 {round(zcr_similarity * 100)}%，用于区分哈气和普通说话/音乐。",
        f"有效时长接近度约 {round(duration_similarity * 100)}%，避免长音频或过短片段误判。",
        _pitch_reason(uploaded.pitch_hz, reference.pitch_hz, pitch_similarity),
        _tempo_reason(uploaded.tempo_hz, reference.tempo_hz, tempo_similarity),
    ]
    reasons.extend(cap_reasons)
    return score, reasons, details


def score_hachimi_likeness(features: AudioFeatures) -> tuple[float, list[str], dict[str, float]]:
    pitch_match = _range_score(features.pitch_hz, 180, 520)
    tempo_match = _range_score(features.tempo_hz, 2.0, 5.8)
    active_match = _range_score(features.active_ratio, 0.28, 0.95)
    clarity_match = _range_score(features.zcr, 0.03, 0.22)
    brightness_match = _range_score(features.bands[2] + features.bands[3], 0.2, 0.72)
    contour_match = _contour_liveliness(features.contour)
    score = (
        pitch_match * 24
        + tempo_match * 22
        + active_match * 16
        + clarity_match * 15
        + brightness_match * 13
        + contour_match * 10
    )
    score, cap_reasons = _apply_heuristic_caps(score, features, pitch_match, tempo_match, clarity_match)
    details = {
        "pitchMatch": round(pitch_match, 3),
        "tempoMatch": round(tempo_match, 3),
        "activeMatch": round(active_match, 3),
        "clarityMatch": round(clarity_match, 3),
        "brightnessMatch": round(brightness_match, 3),
        "contourMatch": round(contour_match, 3),
        "activeDuration": round(features.active_duration, 3),
        "activeRatio": round(features.active_ratio, 3),
    }
    reasons = [
        "当前没有生成参考 WAV，系统使用哈基米启发式特征评分。",
        f"音高约 {round(features.pitch_hz)}Hz，和短促明亮的哈气目标匹配度约 {round(pitch_match * 100)}%。",
        f"节奏速度约 {round(features.tempo_hz, 1)}Hz，重复起伏匹配度约 {round(tempo_match * 100)}%。",
        f"有效声音占比约 {round(features.active_ratio * 100)}%，用于降低静音和背景声影响。",
    ]
    reasons.extend(cap_reasons)
    return score, reasons, details


def describe_score(score: int) -> tuple[str, str]:
    if score >= 85:
        return "神级哈基米", "你登上哈基宇宙排行榜了！"
    if score >= 60:
        return "真哈基米", "听起来有点哈基米节奏。"
    if score >= 30:
        return "半哈基米", "有点味道，但还不是我想要的。"
    return "不像哈基米", "这不是哈基米，像隔壁的喵声。"


def confidence_from_features(features: AudioFeatures) -> float:
    duration_score = _range_score(features.duration, 1.0, MAX_SECONDS)
    active_score = _range_score(features.active_ratio, 0.25, 0.95)
    signal_score = _range_score(features.rms, 0.01, 0.22)
    return round(max(0.15, min(0.98, (duration_score + active_score + signal_score) / 3)), 2)


def _apply_reference_caps(
    score: float,
    features: AudioFeatures,
    band_similarity: float,
    contour_similarity: float,
    zcr_similarity: float,
    duration_similarity: float,
    pitch_similarity: float,
) -> tuple[float, list[str]]:
    caps: list[tuple[float, str]] = []

    if features.active_duration < 0.28:
        caps.append((30, "有效哈气片段太短，分数被限制在 30 分以内。"))
    if features.active_ratio < 0.12:
        caps.append((40, "有效声音占比偏低，可能主要是静音或背景声，分数被限制在 40 分以内。"))
    if band_similarity < 0.55:
        caps.append((45, "音色频带和示例差异明显，分数被限制在 45 分以内。"))
    if contour_similarity < 0.45:
        caps.append((55, "节奏轮廓不像示例，分数被限制在 55 分以内。"))
    if zcr_similarity < 0.35:
        caps.append((58, "嘶嘶感不足，更像普通声音而不是哈气，分数被限制在 58 分以内。"))
    if duration_similarity < 0.35:
        caps.append((60, "有效时长和示例差距较大，分数被限制在 60 分以内。"))
    if pitch_similarity < 0.25:
        caps.append((62, "音高和示例差距过大，分数被限制在 62 分以内。"))

    critical_failures = sum(
        (
            band_similarity < 0.55,
            contour_similarity < 0.45,
            zcr_similarity < 0.35,
            duration_similarity < 0.35,
            pitch_similarity < 0.25,
        )
    )
    if critical_failures >= 3:
        caps.append((28, "多个关键特征同时不像示例，系统判定为不相关音频，分数被限制在 28 分以内。"))
    elif critical_failures >= 2:
        caps.append((38, "至少两个关键特征不像示例，分数被限制在 38 分以内。"))

    if not caps:
        return score, []

    cap, reason = min(caps, key=lambda item: item[0])
    return min(score, cap), [reason]


def _apply_heuristic_caps(
    score: float,
    features: AudioFeatures,
    pitch_match: float,
    tempo_match: float,
    clarity_match: float,
) -> tuple[float, list[str]]:
    caps: list[tuple[float, str]] = []

    if features.active_duration < 0.28:
        caps.append((30, "有效哈气片段太短，启发式分数被限制在 30 分以内。"))
    if features.active_ratio < 0.12:
        caps.append((40, "有效声音占比偏低，启发式分数被限制在 40 分以内。"))
    if clarity_match < 0.35:
        caps.append((50, "嘶嘶感不足，启发式分数被限制在 50 分以内。"))
    if pitch_match < 0.25 and tempo_match < 0.35:
        caps.append((42, "音高和节奏都不符合哈基米特征，启发式分数被限制在 42 分以内。"))

    if not caps:
        return score, []

    cap, reason = min(caps, key=lambda item: item[0])
    return min(score, cap), [reason]


def _pitch_reason(uploaded: float, reference: float, similarity: float) -> str:
    if uploaded <= 0 or reference <= 0:
        return "音高不够稳定，系统主要依据音色和节奏给分。"
    direction = "更高" if uploaded > reference else "更低"
    return f"你的主音高约 {round(uploaded)}Hz，比示例{direction}；音高接近度约 {round(similarity * 100)}%。"


def _tempo_reason(uploaded: float, reference: float, similarity: float) -> str:
    if uploaded <= 0 or reference <= 0:
        return "节奏起伏不明显，建议模仿示例里的短促重复感。"
    direction = "更快" if uploaded > reference else "更慢"
    return f"你的节奏约 {round(uploaded, 1)}Hz，比示例{direction}；节奏接近度约 {round(similarity * 100)}%。"


def _remove_dc(samples: list[float]) -> list[float]:
    mean = sum(samples) / len(samples)
    return [sample - mean for sample in samples]


def _normalize(samples: list[float]) -> list[float]:
    peak = max(abs(sample) for sample in samples) or 1.0
    return [sample / peak for sample in samples]


def _pre_emphasis(samples: list[float], factor: float = 0.97) -> list[float]:
    if not samples:
        return []
    output = [samples[0]]
    output.extend(samples[index] - factor * samples[index - 1] for index in range(1, len(samples)))
    return output


def _resample(samples: list[float], source_rate: int, target_rate: int) -> list[float]:
    if source_rate == target_rate:
        return samples
    target_length = max(1, round(len(samples) * target_rate / source_rate))
    ratio = source_rate / target_rate
    output: list[float] = []
    for index in range(target_length):
        position = index * ratio
        left = min(int(position), len(samples) - 1)
        right = min(left + 1, len(samples) - 1)
        fraction = position - left
        output.append(samples[left] * (1 - fraction) + samples[right] * fraction)
    return output


def _frame(samples: list[float], sample_rate: int) -> list[list[float]]:
    frame_size = round(sample_rate * FRAME_MS / 1000)
    hop_size = round(sample_rate * HOP_MS / 1000)
    if len(samples) < frame_size:
        return []
    return [samples[start : start + frame_size] for start in range(0, len(samples) - frame_size + 1, hop_size)]


def _rms(frame: list[float]) -> float:
    return math.sqrt(sum(sample * sample for sample in frame) / len(frame))


def _zcr(frame: list[float]) -> float:
    crossings = 0
    for index in range(1, len(frame)):
        if (frame[index - 1] >= 0) != (frame[index] >= 0):
            crossings += 1
    return crossings / len(frame)


def _vad_threshold(energies: list[float]) -> float:
    sorted_energies = sorted(energies)
    floor_count = max(1, len(sorted_energies) // 5)
    noise_floor = sum(sorted_energies[:floor_count]) / floor_count
    median_energy = _median(sorted_energies)
    return max(noise_floor * 2.4, median_energy * 0.32, 0.008)


def _pitch(frame: list[float], sample_rate: int) -> float:
    min_lag = sample_rate // 520
    max_lag = sample_rate // 70
    best_lag = 0
    best_score = 0.0
    energy = sum(sample * sample for sample in frame) or 1.0

    for lag in range(min_lag, max_lag):
        score = sum(frame[index] * frame[index - lag] for index in range(lag, len(frame))) / energy
        if score > best_score:
            best_score = score
            best_lag = lag

    if best_score < 0.22 or best_lag == 0:
        return 0.0
    return sample_rate / best_lag


def _tempo_from_envelope(energies: list[float], sample_rate: int) -> float:
    if len(energies) < 8:
        return 0.0
    hop_rate = sample_rate / round(sample_rate * HOP_MS / 1000)
    envelope = _normalize([energy - min(energies) for energy in energies])
    min_lag = max(1, round(hop_rate / 7.0))
    max_lag = max(min_lag + 1, round(hop_rate / 1.2))
    best_lag = min_lag
    best_score = 0.0

    for lag in range(min_lag, min(max_lag, len(envelope) // 2)):
        score = sum(envelope[index] * envelope[index - lag] for index in range(lag, len(envelope)))
        if score > best_score:
            best_score = score
            best_lag = lag
    return hop_rate / best_lag if best_lag else 0.0


def _average_bands(frames: list[list[float]], sample_rate: int) -> tuple[float, ...]:
    centers = (180, 360, 720, 1440, 2880)
    totals = [0.0 for _ in centers]
    for frame in frames[:: max(1, len(frames) // 80)]:
        powers = [_goertzel(frame, sample_rate, center) for center in centers]
        total = sum(powers) or 1.0
        for index, power in enumerate(powers):
            totals[index] += power / total
    count = max(1, min(len(frames), 80))
    return tuple(value / count for value in totals)


def _goertzel(frame: list[float], sample_rate: int, frequency: int) -> float:
    coefficient = 2 * math.cos(2 * math.pi * frequency / sample_rate)
    prev = 0.0
    prev2 = 0.0
    for sample in frame:
        current = sample + coefficient * prev - prev2
        prev2 = prev
        prev = current
    return prev2 * prev2 + prev * prev - coefficient * prev * prev2


def _energy_contour(energies: list[float], buckets: int = 32) -> tuple[float, ...]:
    if not energies:
        return tuple(0.0 for _ in range(buckets))
    values: list[float] = []
    for bucket in range(buckets):
        start = bucket * len(energies) // buckets
        end = max(start + 1, (bucket + 1) * len(energies) // buckets)
        values.append(sum(energies[start:end]) / (end - start))
    return tuple(_normalize(values))


def _cosine(left: tuple[float, ...], right: tuple[float, ...]) -> float:
    dot = sum(a * b for a, b in zip(left, right))
    left_norm = math.sqrt(sum(value * value for value in left))
    right_norm = math.sqrt(sum(value * value for value in right))
    if not left_norm or not right_norm:
        return 0.0
    return max(0.0, min(1.0, dot / (left_norm * right_norm)))


def _dtw_similarity(left: tuple[float, ...], right: tuple[float, ...]) -> float:
    rows = len(left) + 1
    cols = len(right) + 1
    previous = [float("inf")] * cols
    previous[0] = 0.0

    for row in range(1, rows):
        current = [float("inf")] * cols
        for col in range(1, cols):
            cost = abs(left[row - 1] - right[col - 1])
            current[col] = cost + min(previous[col], current[col - 1], previous[col - 1])
        previous = current

    distance = previous[-1] / max(len(left), len(right))
    return max(0.0, 1.0 - distance)


def _ratio_score(value: float, reference: float, tolerance: float) -> float:
    if value <= 0 or reference <= 0:
        return 0.0
    ratio = abs(math.log(value / reference))
    return max(0.0, 1.0 - ratio / tolerance)


def _range_score(value: float, low: float, high: float) -> float:
    if value <= 0:
        return 0.0
    if low <= value <= high:
        return 1.0
    target = low if value < low else high
    return max(0.0, 1.0 - abs(value - target) / max(target, 0.001))


def _contour_liveliness(contour: tuple[float, ...]) -> float:
    if len(contour) < 2:
        return 0.0
    movement = sum(abs(contour[index] - contour[index - 1]) for index in range(1, len(contour)))
    return max(0.0, min(1.0, movement / 5.0))


def _median(values: list[float]) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    middle = len(ordered) // 2
    if len(ordered) % 2:
        return ordered[middle]
    return (ordered[middle - 1] + ordered[middle]) / 2
