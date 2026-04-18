import { createHmac, randomBytes } from "node:crypto";

export const CHALLENGE_CODE_COPY = Object.freeze({
  generated: "你的哈气挑战码已生成！分享给朋友，让他们来挑战你的哈气记录！",
  accept: "你正在挑战 {昵称} 的哈气记录！TA的HIS评分是 {分数}，人格类型是 {类型}。准备好了吗？",
  success: "你成功超越了 {昵称} 的哈气记录！差距：+{差值}分",
  fail: "挑战失败！{昵称} 的哈气比你强 {差值}分。再练练吧！",
  expired: "这个挑战码已经超过7天了，无法挑战。",
  invalid: "这个挑战码无效，可能已被篡改。",
});

export const CHALLENGE_CODE_TTL_SECONDS = 7 * 24 * 60 * 60;

function nowUnixSeconds(nowSec) {
  if (Number.isFinite(nowSec)) return Math.floor(nowSec);
  return Math.floor(Date.now() / 1000);
}

function base64EncodeUtf8(text) {
  return Buffer.from(String(text), "utf8").toString("base64");
}

function base64DecodeUtf8(b64) {
  return Buffer.from(String(b64), "base64").toString("utf8");
}

function isHex(str, len) {
  return typeof str === "string" && str.length === len && /^[0-9a-f]+$/.test(str);
}

function canonicalSignatureContent(payload) {
  const v = payload.v;
  const id = payload.id;
  const ts = payload.ts;
  const db = payload.db;
  const freq = payload.freq;
  const dur = payload.dur;
  const chaos = payload.chaos;
  const type = payload.type;
  const his = payload.his;

  return `${v}${id}${ts}${db}${freq}${dur}${chaos}${type}${his}`;
}

function hmacSha256Hex(content, secretKey) {
  return createHmac("sha256", secretKey).update(content).digest("hex");
}

function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, value: null };
  }
}

function replacePlaceholders(text, replacements) {
  return Object.entries(replacements).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), text);
}

export function generateChallengePayload(
  {
    nick = "",
    db = 0,
    freq = 0,
    dur = 0,
    chaos = 0,
    type = "",
    his = 0,
    lvl = 0,
  } = {},
  { nowSec } = {},
) {
  const payload = {
    v: 1,
    id: randomBytes(6).toString("hex"),
    ts: nowUnixSeconds(nowSec),
    nick: typeof nick === "string" ? nick : "",
    db: Number.isFinite(db) ? db : 0,
    freq: Number.isFinite(freq) ? freq : 0,
    dur: Number.isFinite(dur) ? dur : 0,
    chaos: Number.isFinite(chaos) ? chaos : 0,
    type: typeof type === "string" ? type : "",
    his: Number.isFinite(his) ? his : 0,
    lvl: Number.isFinite(lvl) ? Math.floor(lvl) : 0,
  };

  return Object.freeze(payload);
}

export function generateChallengeCode(payloadInput = {}, { secretKey, nowSec } = {}) {
  if (!secretKey) throw new Error("secretKey is required");

  const payload = generateChallengePayload(payloadInput, { nowSec });
  const content = canonicalSignatureContent(payload);
  const sig = hmacSha256Hex(content, secretKey);
  const full = Object.freeze({ ...payload, sig });

  return base64EncodeUtf8(JSON.stringify(full));
}

export function decodeChallengeCode(code) {
  const decoded = base64DecodeUtf8(code);
  const parsed = safeJsonParse(decoded);
  if (!parsed.ok) return Object.freeze({ ok: false, reason: "JSON_INVALID", payload: null });
  return Object.freeze({ ok: true, reason: null, payload: parsed.value });
}

export function verifyChallengeCode(code, { secretKey, nowSec } = {}) {
  if (!secretKey) throw new Error("secretKey is required");

  const decoded = decodeChallengeCode(code);
  if (!decoded.ok) return Object.freeze({ ok: false, expired: false, reason: decoded.reason, payload: null });

  const payload = decoded.payload;
  if (!payload || typeof payload !== "object") return Object.freeze({ ok: false, expired: false, reason: "PAYLOAD_INVALID", payload: null });

  if (payload.v !== 1) return Object.freeze({ ok: false, expired: false, reason: "VERSION_INVALID", payload: null });
  if (!isHex(payload.id, 12)) return Object.freeze({ ok: false, expired: false, reason: "ID_INVALID", payload: null });
  if (!Number.isFinite(payload.ts)) return Object.freeze({ ok: false, expired: false, reason: "TS_INVALID", payload: null });
  if (typeof payload.sig !== "string" || payload.sig.length < 16) {
    return Object.freeze({ ok: false, expired: false, reason: "SIG_INVALID", payload: null });
  }

  const now = nowUnixSeconds(nowSec);
  const age = now - Math.floor(payload.ts);
  if (age > CHALLENGE_CODE_TTL_SECONDS) return Object.freeze({ ok: false, expired: true, reason: "EXPIRED", payload: null });
  if (age < -60) return Object.freeze({ ok: false, expired: false, reason: "TS_FUTURE", payload: null });

  const expected = hmacSha256Hex(canonicalSignatureContent(payload), secretKey);
  if (expected !== payload.sig) return Object.freeze({ ok: false, expired: false, reason: "SIGNATURE_MISMATCH", payload: null });

  return Object.freeze({ ok: true, expired: false, reason: null, payload: Object.freeze(payload) });
}

export function challengeOutcome({ code, userHisScore } = {}, { secretKey, nowSec } = {}) {
  const verified = verifyChallengeCode(code, { secretKey, nowSec });
  if (!verified.ok) {
    const msg = verified.expired ? CHALLENGE_CODE_COPY.expired : CHALLENGE_CODE_COPY.invalid;
    return Object.freeze({ ok: false, expired: verified.expired, message: msg, payload: null });
  }

  const userScore = Number.isFinite(userHisScore) ? userHisScore : 0;
  const target = Number.isFinite(verified.payload.his) ? verified.payload.his : 0;
  const nick = verified.payload.nick || "对手";
  const diff = Math.abs(userScore - target);

  const isWin = userScore > target;
  const template = isWin ? CHALLENGE_CODE_COPY.success : CHALLENGE_CODE_COPY.fail;
  const message = replacePlaceholders(template, {
    昵称: nick,
    差值: diff.toFixed(1).replace(/\.0+$/, ""),
  });

  return Object.freeze({ ok: true, expired: false, win: isWin, message, payload: verified.payload });
}
