from __future__ import annotations

import json
from pathlib import Path


def _load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_his_levels_data_matches_expected() -> None:
    root = Path(__file__).resolve().parent.parent
    actual_path = root / "data" / "hisLevels.v1.json"
    expected_path = Path(__file__).resolve().parent / "expected" / "hisLevels.v1.json"

    actual = _load_json(actual_path)
    expected = _load_json(expected_path)
    assert actual == expected

    levels = actual["levels"]
    assert len(levels) == 9
    assert [item["level"] for item in levels] == list(range(1, 10))
    assert all(item["title"] for item in levels)
    assert all(isinstance(item["rewards"], list) for item in levels)
    assert levels[0]["hisRange"]["min"] == 0.0
    assert levels[-1]["hisRange"]["min"] == 10.0
    assert levels[-1]["hisRange"]["max"] is None


def test_achievements_data_matches_expected() -> None:
    root = Path(__file__).resolve().parent.parent
    actual_path = root / "data" / "achievements.v1.json"
    expected_path = Path(__file__).resolve().parent / "expected" / "achievements.v1.json"

    actual = _load_json(actual_path)
    expected = _load_json(expected_path)
    assert actual == expected

    achievements = actual["achievements"]
    assert len(achievements) == 23
    ids = [item["id"] for item in achievements]
    assert len(ids) == len(set(ids))
    assert all(item["name"] for item in achievements)
    assert all(item["description"] for item in achievements)
    assert all(item["triggerCondition"] for item in achievements)
    assert all(isinstance(item["reward"], list) for item in achievements)
    assert all("relatedCopy" in item and "unlocked" in item["relatedCopy"] for item in achievements)

    hidden = [item for item in achievements if item["category"] == "隐藏成就"]
    assert len(hidden) == 4
    assert all(item.get("showBeforeUnlock") is False for item in hidden)


if __name__ == "__main__":
    test_his_levels_data_matches_expected()
    test_achievements_data_matches_expected()
    print("ranking & achievements data tests passed")
