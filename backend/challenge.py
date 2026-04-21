from __future__ import annotations

import hashlib
import json
import time
from dataclasses import dataclass
from pathlib import Path


BASE62_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
BASE62_INDEX = {ch: index for index, ch in enumerate(BASE62_ALPHABET)}
BASE62_BASE = 62

CHALLENGE_BASE62_LEN = 8
CHALLENGE_CRC_LEN = 4
CHALLENGE_CODE_LEN = CHALLENGE_BASE62_LEN + CHALLENGE_CRC_LEN

CHALLENGE_TTL_SECONDS = 7 * 24 * 60 * 60
CHALLENGE_MAX_PER_USER = 10

CHALLENGE_PART_MOD = BASE62_BASE**CHALLENGE_BASE62_LEN


class ChallengeNotFoundError(KeyError):
    pass


class ChallengeExpiredError(ValueError):
    pass


class ChallengeLimitError(ValueError):
    pass


def crc16_ccitt(data: bytes, init: int = 0xFFFF) -> int:
    crc = init & 0xFFFF
    for byte in data:
        crc ^= byte << 8
        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF
    return crc & 0xFFFF


def base62_encode(value: int, length: int) -> str:
    if value < 0:
        raise ValueError("base62 value must be non-negative")
    out = []
    n = value
    while n:
        n, rem = divmod(n, BASE62_BASE)
        out.append(BASE62_ALPHABET[rem])
    encoded = "".join(reversed(out)) if out else "0"
    if len(encoded) > length:
        raise ValueError("base62 value exceeds fixed length")
    return encoded.rjust(length, "0")


def base62_decode(text: str) -> int:
    if not text:
        raise ValueError("base62 text is empty")
    value = 0
    for ch in text:
        if ch not in BASE62_INDEX:
            raise ValueError("invalid base62 character")
        value = value * BASE62_BASE + BASE62_INDEX[ch]
    return value


def build_challenge_part(*, user_id: str, created_at_ts: int, audio_bytes: bytes) -> str:
    uid_crc16 = crc16_ccitt(str(user_id).encode("utf-8")) & 0xFFFF
    ts24 = int(created_at_ts) & 0xFFFFFF
    audio_digest24 = int.from_bytes(hashlib.sha256(audio_bytes).digest()[:3], "big") & 0xFFFFFF
    seed = (uid_crc16 << 48) | (ts24 << 24) | audio_digest24
    value = int(seed) % CHALLENGE_PART_MOD
    return base62_encode(value, CHALLENGE_BASE62_LEN)


def sign_challenge_part(part: str) -> str:
    return f"{crc16_ccitt(part.encode('utf-8')):04X}"


def build_challenge_code(user_id: str, created_at_ts: int, audio_bytes: bytes) -> str:
    part = build_challenge_part(user_id=str(user_id), created_at_ts=int(created_at_ts), audio_bytes=audio_bytes)
    return f"{part}{sign_challenge_part(part)}"


def validate_challenge_code(code: str) -> dict:
    raw = str(code or "").strip()
    if len(raw) != CHALLENGE_CODE_LEN:
        raise ValueError("挑战码长度不正确")
    part = raw[:CHALLENGE_BASE62_LEN]
    sig_text = raw[CHALLENGE_BASE62_LEN:]
    if any(ch not in BASE62_INDEX for ch in part):
        raise ValueError("挑战码格式不正确")
    try:
        expected_sig = int(sig_text, 16)
    except ValueError as error:
        raise ValueError("挑战码校验位不正确") from error
    actual_sig = crc16_ccitt(part.encode("utf-8"))
    if actual_sig != expected_sig:
        raise ValueError("挑战码校验失败")
    packed = base62_decode(part)
    return {"code": raw, "part": part, "sig": f"{expected_sig:04X}", "packed": packed}


def is_expired(created_at_ts: int, now_ts: int | None = None) -> bool:
    now = int(time.time()) if now_ts is None else int(now_ts)
    return now - int(created_at_ts) > CHALLENGE_TTL_SECONDS


@dataclass(frozen=True)
class ChallengeItem:
    code: str
    userId: str
    createdAt: int
    expiresAt: int
    payload: dict


class ChallengeStore:
    def __init__(self, path: Path):
        self.path = path

    def _load(self) -> dict:
        if not self.path.exists():
            return {"version": 1, "items": []}
        with self.path.open("r", encoding="utf-8") as handle:
            payload = json.load(handle)
        if not isinstance(payload, dict):
            return {"version": 1, "items": []}
        items = payload.get("items")
        if not isinstance(items, list):
            items = []
        return {"version": 1, "items": items}

    def _save(self, items: list[dict]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        temp = self.path.with_suffix(self.path.suffix + ".tmp")
        with temp.open("w", encoding="utf-8") as handle:
            json.dump({"version": 1, "items": items}, handle, ensure_ascii=False)
        temp.replace(self.path)

    def _cleanup(self, items: list[dict], now_ts: int) -> list[dict]:
        output: list[dict] = []
        now = int(now_ts)
        for item in items:
            if not isinstance(item, dict):
                continue
            created_at = int(item.get("createdAt") or 0)
            expires_at = int(item.get("expiresAt") or 0)
            if expires_at and now > expires_at:
                continue
            if created_at and is_expired(created_at, now):
                continue
            output.append(item)
        return output

    def create(self, *, user_id: str, audio_bytes: bytes, payload: dict, now_ts: int | None = None) -> ChallengeItem:
        now = int(time.time()) if now_ts is None else int(now_ts)
        user = str(user_id or "").strip()
        if not user:
            raise ValueError("缺少 userId")
        if not audio_bytes:
            raise ValueError("缺少音频内容")
        stored = self._load()
        items = self._cleanup(list(stored["items"]), now)
        active_count = sum(1 for entry in items if isinstance(entry, dict) and str(entry.get("userId") or "") == user)
        if active_count >= CHALLENGE_MAX_PER_USER:
            raise ChallengeLimitError("单用户最多同时存在 10 个有效挑战")

        existing = {str(entry.get("code") or "") for entry in items if isinstance(entry, dict)}
        for _ in range(12):
            code = build_challenge_code(user, now, audio_bytes)
            if code not in existing:
                break
            now += 1
        else:
            raise ValueError("生成挑战码失败")

        item = {
            "code": code,
            "userId": user,
            "createdAt": now,
            "expiresAt": now + CHALLENGE_TTL_SECONDS,
            "payload": payload if isinstance(payload, dict) else {},
        }
        items.append(item)
        self._save(items)
        return ChallengeItem(
            code=code,
            userId=user,
            createdAt=int(item["createdAt"]),
            expiresAt=int(item["expiresAt"]),
            payload=dict(item["payload"]),
        )

    def get(self, *, code: str, now_ts: int | None = None) -> ChallengeItem:
        now = int(time.time()) if now_ts is None else int(now_ts)
        wanted = validate_challenge_code(code)["code"]
        stored = self._load()
        stored_items = list(stored["items"])
        found = next(
            (entry for entry in stored_items if isinstance(entry, dict) and str(entry.get("code") or "") == wanted),
            None,
        )
        if found is None:
            cleaned = self._cleanup(stored_items, now)
            if len(cleaned) != len(stored_items):
                self._save(cleaned)
            raise ChallengeNotFoundError(wanted)

        expires_at = int(found.get("expiresAt") or 0)
        created_at = int(found.get("createdAt") or 0)
        if (expires_at and now > expires_at) or (created_at and is_expired(created_at, now)):
            remaining = [
                entry
                for entry in stored_items
                if isinstance(entry, dict) and str(entry.get("code") or "") != wanted
            ]
            self._save(self._cleanup(remaining, now))
            raise ChallengeExpiredError("挑战码已过期（有效期 7 天）")

        cleaned = self._cleanup(stored_items, now)
        if len(cleaned) != len(stored_items):
            self._save(cleaned)
        payload = found.get("payload")
        return ChallengeItem(
            code=wanted,
            userId=str(found.get("userId") or ""),
            createdAt=int(found.get("createdAt") or 0),
            expiresAt=int(found.get("expiresAt") or 0),
            payload=payload if isinstance(payload, dict) else {},
        )


def compute_pk_rows(my_payload: dict, opponent_payload: dict) -> dict:
    defs = [
        {"key": "avgDB", "label": "🔊 响度", "unit": "dB"},
        {"key": "dominantFreq", "label": "🎵 音调", "unit": "Hz"},
        {"key": "activeDuration", "label": "⏱️ 持久", "unit": "s"},
        {"key": "freqVariance", "label": "🌀 混沌", "unit": "Hz²"},
        {"key": "audioHis", "label": "🎯 综合", "unit": ""},
    ]

    pk_copy_table = {
        "大胜": {
            "dimensionScore": "5:0",
            "title": "🏆 完美碾压！",
            "copy": "对手的哈气在你面前就像微风一样不值一提。你就是耄耋本耄！",
            "emoji": "😾🔥",
        },
        "胜利": {
            "dimensionScore": "4:1",
            "title": "🎉 实力碾压！",
            "copy": "四个维度全面压制，对手几乎没有还手之力。哈气王者就是你！",
            "emoji": "😼💪",
        },
        "险胜": {
            "dimensionScore": "3:2",
            "title": "⚡ 险胜！",
            "copy": "差一点就翻车了！但关键时刻你的哈气爆发力拯救了局面。",
            "emoji": "😸💦",
        },
        "惜败": {
            "dimensionScore": "2:3",
            "title": "😤 惜败！",
            "copy": "只差一个维度！你的哈气已经很凶了，下次一定能赢回来！",
            "emoji": "🙀😤",
        },
        "落败": {
            "dimensionScore": "1:4",
            "title": "😿 落败…",
            "copy": "对手的哈气确实比你凶。不过别灰心，回去多练练再来！",
            "emoji": "😿",
        },
        "惨败": {
            "dimensionScore": "0:5",
            "title": "💀 被碾压…",
            "copy": "你的哈气……和对手完全不在一个量级。建议先去练练基础哈气。",
            "emoji": "😹💀",
        },
        "平局": {
            "dimensionScore": "2.5:2.5",
            "title": "🤝 平局！",
            "copy": "你们的哈气竟然一模一样！这是什么缘分？猫系双胞胎？",
            "emoji": "🐱🐱",
        },
    }

    my_his = my_payload.get("audioHis")
    op_his = opponent_payload.get("audioHis")
    my_his_num = float(my_his) if isinstance(my_his, (int, float)) else None
    op_his_num = float(op_his) if isinstance(op_his, (int, float)) else None
    his_equal = my_his_num is not None and op_his_num is not None and abs(my_his_num - op_his_num) < 1e-9

    rows: list[dict] = []
    my_wins = 0
    op_wins = 0

    for definition in defs:
        key = definition["key"]
        my_val = my_payload.get(key)
        op_val = opponent_payload.get(key)
        my_num = float(my_val) if isinstance(my_val, (int, float)) else None
        op_num = float(op_val) if isinstance(op_val, (int, float)) else None

        win: bool | None
        if my_num is None or op_num is None:
            win = None
        elif my_num > op_num:
            win = True
        elif my_num < op_num:
            win = False
        else:
            if his_equal:
                win = None
            else:
                if my_his_num is None or op_his_num is None:
                    win = True
                else:
                    win = True if my_his_num > op_his_num else False

        if win is True:
            my_wins += 1
        elif win is False:
            op_wins += 1

        rows.append(
            {
                "key": key,
                "label": definition["label"],
                "unit": definition["unit"],
                "points": 20 if win is True else 0,
                "win": win,
                "my": my_num,
                "opponent": op_num,
            }
        )

    if his_equal:
        my_total = 50
        op_total = 50
        dimension_score = "2.5:2.5"
        result_key = "平局"
    else:
        my_total = my_wins * 20
        op_total = op_wins * 20
        dimension_score = f"{my_wins}:{op_wins}"
        if my_wins == 5:
            result_key = "大胜"
        elif my_wins == 4:
            result_key = "胜利"
        elif my_wins == 3:
            result_key = "险胜"
        elif my_wins == 2:
            result_key = "惜败"
        elif my_wins == 1:
            result_key = "落败"
        else:
            result_key = "惨败"

    info = pk_copy_table[result_key]
    outcome = "平" if result_key == "平局" else "胜" if my_total > op_total else "负"

    return {
        "total": int(max(0, min(100, my_total))),
        "opponentTotal": int(max(0, min(100, op_total))),
        "dimensionScore": dimension_score,
        "resultKey": result_key,
        "outcome": outcome,
        "title": info["title"],
        "copy": info["copy"],
        "emoji": info["emoji"],
        "rows": rows,
    }
