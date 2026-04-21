from __future__ import annotations


def clamp_number(value: float, min_value: float, max_value: float) -> float:
    safe = float(value)
    if safe != safe:  # NaN
        return min_value
    return max(min_value, min(max_value, safe))


def template_grade_info(score: float) -> dict[str, object]:
    safe = clamp_number(score, 0.0, 140.0)
    if safe >= 130:
        return {"grade": "SS+", "copy": "你……就是耄耋转世吧？", "color": "#FFD700", "sparkle": True}
    if safe >= 115:
        return {"grade": "SS", "copy": "耄耋看了都要竖大拇指！", "color": "#FFD700", "sparkle": False}
    if safe >= 100:
        return {"grade": "S", "copy": "相当不错！耄耋认可你的哈气！", "color": "#8A2BE2", "sparkle": False}
    if safe >= 80:
        return {"grade": "A", "copy": "有点意思，继续练练！", "color": "#4169E1", "sparkle": False}
    if safe >= 60:
        return {"grade": "B", "copy": "还行吧，至少是哈气了。", "color": "#00CED1", "sparkle": False}
    if safe >= 40:
        return {"grade": "C", "copy": "这……是哈气吗？再练练。", "color": "#32CD32", "sparkle": False}
    if safe >= 20:
        return {"grade": "D", "copy": "你确定你在哈气？感觉在吹气。", "color": "#FFD166", "sparkle": False}
    return {"grade": "F", "copy": "……这不是哈气，这是呼吸。", "color": "#FFB6C1", "sparkle": False}


def compute_template_dim_score(
    *,
    user_value: float,
    template_value: float,
    base: int,
    step: float,
    bonus_per_step: int,
    bonus_cap: int,
) -> dict[str, object]:
    if step <= 0:
        raise ValueError("step must be positive")
    if user_value < template_value:
        return {"win": False, "points": 0, "bonus": 0}
    diff = user_value - template_value
    steps = int((diff + 1e-9) // step)
    bonus = int(clamp_number(steps * bonus_per_step, 0, bonus_cap))
    return {"win": True, "points": int(base + bonus), "bonus": bonus}


def test_template_grade_boundaries() -> None:
    cases = [
        (0, "F"),
        (19, "F"),
        (20, "D"),
        (39, "D"),
        (40, "C"),
        (59, "C"),
        (60, "B"),
        (79, "B"),
        (80, "A"),
        (99, "A"),
        (100, "S"),
        (114, "S"),
        (115, "SS"),
        (129, "SS"),
        (130, "SS+"),
        (140, "SS+"),
    ]
    for score, expected in cases:
        assert template_grade_info(float(score))["grade"] == expected


def test_template_dim_scoring_examples() -> None:
    his = compute_template_dim_score(
        user_value=7.2, template_value=5.6, base=20, step=0.5, bonus_per_step=3, bonus_cap=15
    )
    assert his["win"] is True
    assert his["points"] == 29

    chaos = compute_template_dim_score(
        user_value=950, template_value=800, base=15, step=100, bonus_per_step=1, bonus_cap=10
    )
    assert chaos["win"] is True
    assert chaos["points"] == 16

    endurance = compute_template_dim_score(
        user_value=1.3, template_value=1.5, base=15, step=0.2, bonus_per_step=2, bonus_cap=10
    )
    assert endurance["win"] is False
    assert endurance["points"] == 0


def test_template_dim_bonus_caps_at_limit() -> None:
    loudness = compute_template_dim_score(
        user_value=100, template_value=0, base=15, step=1, bonus_per_step=2, bonus_cap=10
    )
    assert loudness["points"] == 25

    pitch = compute_template_dim_score(
        user_value=100_000, template_value=0, base=15, step=200, bonus_per_step=1, bonus_cap=10
    )
    assert pitch["points"] == 25


if __name__ == "__main__":
    test_template_grade_boundaries()
    test_template_dim_scoring_examples()
    test_template_dim_bonus_caps_at_limit()
    print("template compare scoring tests passed")

