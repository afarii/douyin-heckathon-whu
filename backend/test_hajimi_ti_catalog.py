from __future__ import annotations

from hajimi_ti_catalog import get_personality_by_code, list_all_personalities


def test_catalog_has_18_items() -> None:
    items = list_all_personalities()
    assert len(items) == 18
    assert len({item.code for item in items}) == 18


def test_catalog_get_by_code() -> None:
    profile = get_personality_by_code("hltc")
    assert profile.code == "HLTC"
    assert profile.name == "耄耋本耄"
    assert profile.title == "暴躁橘猫王"
    assert profile.themeColor.startswith("#")
    assert profile.emoji
    assert profile.rarity
    assert profile.coreDescription
    assert profile.funCopy
    assert set(profile.portrait6d.keys()) == {"响度", "音调", "持久", "混沌", "稳定", "爆发"}
    assert all(0 <= value <= 10 for value in profile.portrait6d.values())
    assert profile.tags


def test_catalog_hidden_silent_portrait() -> None:
    silent = get_personality_by_code("SILENT")
    assert all(value == 0 for value in silent.portrait6d.values())


def test_catalog_unknown_code() -> None:
    try:
        get_personality_by_code("UNKNOWN")
    except ValueError as error:
        assert "UNKNOWN" in str(error)
    else:
        raise AssertionError("expected ValueError for unknown personality code")


if __name__ == "__main__":
    test_catalog_has_18_items()
    test_catalog_get_by_code()
    test_catalog_hidden_silent_portrait()
    test_catalog_unknown_code()
    print("hajimi ti catalog tests passed")

