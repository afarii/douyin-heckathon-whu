from __future__ import annotations

import json
import math
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LEVELS_PATH = ROOT / "data" / "hisLevels.v1.json"


@dataclass(frozen=True)
class HisLevel:
    level: int
    min_his: float
    max_his: float | None
    title: str
    color: str
    desc: str
    hint: str


def normalize_audio_his(audio_his: float) -> float:
    if audio_his is None or isinstance(audio_his, bool):
        return 0.0
    if not isinstance(audio_his, (int, float)):
        return 0.0
    if math.isnan(audio_his) or math.isinf(audio_his):
        return 0.0
    return round(max(0.0, float(audio_his)), 1)


@lru_cache(maxsize=2)
def load_his_levels(path: Path = DEFAULT_LEVELS_PATH) -> tuple[HisLevel, ...]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    levels = payload.get("levels", [])
    output: list[HisLevel] = []
    for item in levels:
        his_range = dict(item.get("hisRange") or {})
        output.append(
            HisLevel(
                level=int(item.get("level") or 0),
                min_his=float(his_range.get("min") or 0.0),
                max_his=None if his_range.get("max") is None else float(his_range.get("max")),
                title=str(item.get("title") or ""),
                color=str(item.get("color") or ""),
                desc=str(item.get("description") or ""),
                hint=str(item.get("upgradeTip") or ""),
            )
        )

    output.sort(key=lambda level: level.min_his)
    return tuple(output)


def map_audio_his_to_level(audio_his: float, levels: tuple[HisLevel, ...] | None = None) -> HisLevel:
    levels = levels or load_his_levels()
    if not levels:
        raise ValueError("hisLevels 数据为空")

    value = normalize_audio_his(audio_his)
    for level in levels:
        if value < level.min_his:
            continue
        if level.max_his is None or value <= level.max_his:
            return level

    candidates = [level for level in levels if value >= level.min_his]
    if candidates:
        return max(candidates, key=lambda level: level.min_his)
    return min(levels, key=lambda level: level.min_his)


def build_his_level_mapping(audio_his: float, *, include_audio_his: bool = False) -> dict[str, Any]:
    level = map_audio_his_to_level(audio_his)
    payload: dict[str, Any] = {
        "hisLevel": level.level,
        "title": level.title,
        "color": level.color,
        "desc": level.desc,
        "hint": level.hint,
    }
    if include_audio_his:
        payload["audioHis"] = normalize_audio_his(audio_his)
    return payload

