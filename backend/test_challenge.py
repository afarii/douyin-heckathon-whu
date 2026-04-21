from __future__ import annotations

import hashlib
from pathlib import Path

from challenge import (
    CHALLENGE_PART_MOD,
    CHALLENGE_TTL_SECONDS,
    ChallengeExpiredError,
    ChallengeLimitError,
    ChallengeStore,
    base62_encode,
    build_challenge_code,
    compute_pk_rows,
    crc16_ccitt,
    validate_challenge_code,
)


def test_challenge_code_validate_and_fields() -> None:
    audio = b"RIFF" + b"\x00" * 64
    user_id = "user-001"
    created_at = 1_767_225_600 + 123 * 60
    code = build_challenge_code(user_id, created_at, audio)
    assert len(code) == 12

    uid_crc16 = crc16_ccitt(user_id.encode("utf-8")) & 0xFFFF
    ts24 = int(created_at) & 0xFFFFFF
    audio_digest24 = int.from_bytes(hashlib.sha256(audio).digest()[:3], "big") & 0xFFFFFF
    seed = (uid_crc16 << 48) | (ts24 << 24) | audio_digest24
    part = base62_encode(int(seed) % CHALLENGE_PART_MOD, 8)
    sig = f"{crc16_ccitt(part.encode('utf-8')):04X}"
    assert code == f"{part}{sig}"

    info = validate_challenge_code(code)
    assert info["code"] == code
    assert info["part"] == part
    assert info["sig"] == sig

    bad = code[:-1] + ("0" if code[-1] != "0" else "1")
    try:
        validate_challenge_code(bad)
        raise AssertionError("expected ValueError")
    except ValueError:
        pass


def test_challenge_expired_and_not_found() -> None:
    root = Path(__file__).resolve().parent / ".tmp" / "challenge"
    root.mkdir(parents=True, exist_ok=True)
    store_path = root / "challenges.test.json"
    store_path.unlink(missing_ok=True)
    store = ChallengeStore(store_path)

    audio = b"RIFF" + b"\x01" * 64
    created_at = 1_767_225_600
    item = store.create(user_id="u-expired", audio_bytes=audio, payload={"avgDB": 60}, now_ts=created_at)
    now = created_at + CHALLENGE_TTL_SECONDS + 10

    try:
        store.get(code=item.code, now_ts=now)
        raise AssertionError("expected ChallengeExpiredError")
    except ChallengeExpiredError:
        pass

    store_path.unlink(missing_ok=True)
    try:
        store.get(code=item.code, now_ts=created_at + 60)
        raise AssertionError("expected KeyError")
    except KeyError:
        pass


def test_challenge_limit_per_user() -> None:
    root = Path(__file__).resolve().parent / ".tmp" / "challenge"
    root.mkdir(parents=True, exist_ok=True)
    store_path = root / "challenges.limit.json"
    store_path.unlink(missing_ok=True)
    store = ChallengeStore(store_path)

    audio = b"RIFF" + b"\x02" * 64
    now = 1_767_225_600 + 999
    for index in range(10):
        item = store.create(user_id="u-limit", audio_bytes=audio, payload={"n": index}, now_ts=now)
        assert item.code
    try:
        store.create(user_id="u-limit", audio_bytes=audio, payload={"n": 11}, now_ts=now)
        raise AssertionError("expected ChallengeLimitError")
    except ChallengeLimitError:
        pass


def test_pk_outcome() -> None:
    mine = {"avgDB": 60, "dominantFreq": 2400, "activeDuration": 2.0, "freqVariance": 1400, "audioHis": 8.0}
    opponent = {"avgDB": 55, "dominantFreq": 2000, "activeDuration": 1.4, "freqVariance": 1100, "audioHis": 6.0}
    result = compute_pk_rows(mine, opponent)
    assert result["total"] == 100
    assert result["dimensionScore"] == "5:0"
    assert result["resultKey"] == "大胜"
    assert result["outcome"] == "胜"
    assert len(result["rows"]) == 5

    flipped = compute_pk_rows(opponent, mine)
    assert flipped["total"] == 0
    assert flipped["dimensionScore"] == "0:5"
    assert flipped["resultKey"] == "惨败"
    assert flipped["outcome"] == "负"

    tied = compute_pk_rows({**mine, "audioHis": 7.2}, {**opponent, "audioHis": 7.2})
    assert tied["total"] == 50
    assert tied["opponentTotal"] == 50
    assert tied["dimensionScore"] == "2.5:2.5"
    assert tied["resultKey"] == "平局"
    assert tied["outcome"] == "平"


if __name__ == "__main__":
    test_challenge_code_validate_and_fields()
    test_challenge_expired_and_not_found()
    test_challenge_limit_per_user()
    test_pk_outcome()
    print("challenge tests passed")
