from __future__ import annotations

from his_levels import build_his_level_mapping, map_audio_his_to_level, normalize_audio_his


def test_normalize_audio_his_rounds_to_one_decimal() -> None:
    assert normalize_audio_his(-1.0) == 0.0
    assert normalize_audio_his(0.04) == 0.0
    assert normalize_audio_his(4.44) == 4.4
    assert normalize_audio_his(4.45) == 4.5


def test_his_level_mapping_boundaries() -> None:
    cases = [
        (0.0, 1),
        (1.9, 1),
        (2.0, 2),
        (2.9, 2),
        (3.0, 3),
        (4.4, 3),
        (4.5, 4),
        (5.9, 4),
        (6.0, 5),
        (6.9, 5),
        (7.0, 6),
        (7.9, 6),
        (8.0, 7),
        (8.9, 7),
        (9.0, 8),
        (9.9, 8),
        (10.0, 9),
        (10.1, 9),
        (50.0, 9),
    ]

    for value, expected in cases:
        assert map_audio_his_to_level(value).level == expected, (value, map_audio_his_to_level(value))


def test_his_level_mapping_payload_fields() -> None:
    payload = build_his_level_mapping(10.0, include_audio_his=True)
    assert payload["audioHis"] == 10.0
    assert payload["hisLevel"] == 9
    assert payload["title"]
    assert payload["color"].startswith("#")
    assert payload["desc"]
    assert payload["hint"]


if __name__ == "__main__":
    test_normalize_audio_his_rounds_to_one_decimal()
    test_his_level_mapping_boundaries()
    test_his_level_mapping_payload_fields()
    print("his levels mapping tests passed")

