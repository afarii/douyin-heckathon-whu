from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping


@dataclass(frozen=True)
class FeatureVector:
    avgDB: float = 0.0
    peakFreq: float = 0.0
    silenceRatio: float = 0.0
    duration: float = 0.0
    activeDuration: float = 0.0
    volumeVariance: float = 0.0
    dominantFreq: float = 0.0
    lowFreqRatio: float = 0.0
    pitchChangeRate: float = 0.0
    freqVariance: float = 0.0
    lowFreqDuration: float = 0.0
    hisStrength: float = 0.0

    @classmethod
    def from_mapping(cls, payload: Mapping[str, Any] | None) -> "FeatureVector":
        data = dict(payload or {})
        values: dict[str, float] = {}

        for field in cls.__dataclass_fields__.values():
            name = field.name
            raw = data.get(name, field.default)
            values[name] = _coerce_number(name, raw)

        _validate_feature_vector(values)
        return cls(**values)

    def to_dict(self) -> dict[str, float]:
        return {
            "avgDB": self.avgDB,
            "peakFreq": self.peakFreq,
            "silenceRatio": self.silenceRatio,
            "duration": self.duration,
            "activeDuration": self.activeDuration,
            "volumeVariance": self.volumeVariance,
            "dominantFreq": self.dominantFreq,
            "lowFreqRatio": self.lowFreqRatio,
            "pitchChangeRate": self.pitchChangeRate,
            "freqVariance": self.freqVariance,
            "lowFreqDuration": self.lowFreqDuration,
            "hisStrength": self.hisStrength,
        }


@dataclass(frozen=True)
class DimensionMatch:
    dimension: str
    letter: str
    match: int


@dataclass(frozen=True)
class JudgeResult:
    personalityCode: str
    personalityMatch: int
    dimensionMatches: tuple[DimensionMatch, ...]
    hidden: bool

    def to_dict(self) -> dict[str, Any]:
        return {
            "personalityCode": self.personalityCode,
            "personalityMatch": self.personalityMatch,
            "dimensionMatches": [
                {"dimension": item.dimension, "letter": item.letter, "match": item.match}
                for item in self.dimensionMatches
            ],
            "hidden": self.hidden,
        }


def _coerce_number(name: str, value: Any) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"FeatureVector.{name} 必须是数字")
    return float(value)


def _validate_feature_vector(values: Mapping[str, float]) -> None:
    _validate_non_negative(values, "avgDB")
    _validate_non_negative(values, "peakFreq")
    _validate_ratio(values, "silenceRatio")
    _validate_non_negative(values, "duration")
    _validate_non_negative(values, "activeDuration")
    _validate_ratio(values, "volumeVariance")
    _validate_non_negative(values, "dominantFreq")
    _validate_ratio(values, "lowFreqRatio")
    _validate_non_negative(values, "pitchChangeRate")
    _validate_non_negative(values, "freqVariance")
    _validate_non_negative(values, "lowFreqDuration")
    _validate_range(values, "hisStrength", 0.0, 10.0)


def _validate_non_negative(values: Mapping[str, float], key: str) -> None:
    if values[key] < 0:
        raise ValueError(f"FeatureVector.{key} 不能为负数")


def _validate_ratio(values: Mapping[str, float], key: str) -> None:
    _validate_range(values, key, 0.0, 1.0)


def _validate_range(values: Mapping[str, float], key: str, low: float, high: float) -> None:
    value = values[key]
    if value < low or value > high:
        raise ValueError(f"FeatureVector.{key} 超出范围：{low}–{high}")
