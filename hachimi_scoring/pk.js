import { clamp } from "./quantize.js";

export const PK_RESULT_COPY = Object.freeze(
  [
    { key: "WIN_BIG", text: '"完胜！你的哈气碾压了对手！对方已经被哈到怀疑猫生。"', emoji: "👑" },
    { key: "WIN_SMALL", text: '"险胜！你的哈气略胜一筹，但对手也不弱。"', emoji: "😎" },
    { key: "WIN_TINY", text: '"惜胜！双方实力接近，你以微弱优势获胜。"', emoji: "😅" },
    { key: "DRAW", text: '"平局！你们的哈气势均力敌，难分伯仲。"', emoji: "🤝" },
    { key: "LOSE_TINY", text: '"惜败！差一点点就赢了，下次加油！"', emoji: "😤" },
    { key: "LOSE_SMALL", text: '"落败。对方的哈气更凶猛，回去练练吧。"', emoji: "😿" },
    { key: "LOSE_BIG", text: '"惨败……对方的哈气完全压制了你。建议先从幼猫模板练起。"', emoji: "💀" },
  ].map((x) => Object.freeze(x)),
);

export const PK_DIMENSIONS = Object.freeze(
  [
    { key: "loudness", weight: 0.30, maxDiff: 80, get: (x) => (Number.isFinite(x.avgDB) ? x.avgDB : 0) },
    { key: "pitch", weight: 0.25, maxDiff: 9000, get: (x) => (Number.isFinite(x.peakFreq) ? x.peakFreq : 0) },
    { key: "endurance", weight: 0.20, maxDiff: 2.7, get: (x) => (Number.isFinite(x.activeDuration) ? x.activeDuration : 0) },
    { key: "chaos", weight: 0.15, maxDiff: 3000, get: (x) => (Number.isFinite(x.freqVariance) ? x.freqVariance : 0) },
    {
      key: "burst",
      weight: 0.10,
      maxDiff: 30,
      get: (x) => {
        const p = Number.isFinite(x.peakDB) ? x.peakDB : 0;
        const a = Number.isFinite(x.avgDB) ? x.avgDB : 0;
        return p - a;
      },
    },
  ].map((x) => Object.freeze(x)),
);

function copyByKey(key) {
  return PK_RESULT_COPY.find((x) => x.key === key) ?? PK_RESULT_COPY[3];
}

function bonusFromDiff(absDiff, maxDiff) {
  const d = Number.isFinite(absDiff) ? absDiff : 0;
  const m = Number.isFinite(maxDiff) && maxDiff > 0 ? maxDiff : 1;
  return clamp((d / m) * 5, 0, 5);
}

export function scorePk(player = {}, opponent = {}) {
  const dimensionResults = [];
  let playerWeighted = 0;
  let opponentWeighted = 0;

  for (const dim of PK_DIMENSIONS) {
    const a = dim.get(player);
    const b = dim.get(opponent);
    const diff = a - b;
    const absDiff = Math.abs(diff);
    const bonus = bonusFromDiff(absDiff, dim.maxDiff);

    let playerPts = 0;
    let opponentPts = 0;
    let winner = "DRAW";
    if (diff > 0) {
      playerPts = 10 + bonus;
      winner = "PLAYER";
    } else if (diff < 0) {
    } else if (diff < 0) {
      opponentPts = 10 + bonus;
      winner = "OPPONENT";
    }

    playerWeighted += dim.weight * playerPts;
    opponentWeighted += dim.weight * opponentPts;

    dimensionResults.push(
      Object.freeze({
        key: dim.key,
        playerValue: a,
        opponentValue: b,
        diff,
        bonus,
        playerPts,
        opponentPts,
        winner,
      }),
    );
  }

  const playerScore = playerWeighted * 10;
  const opponentScore = opponentWeighted * 10;
  const delta = playerScore - opponentScore;
  const absDelta = Math.abs(delta);

  let result = "DRAW";
  if (delta > 0) result = "WIN";
  if (delta < 0) result = "LOSE";

  let copyKey = "DRAW";
  if (result === "WIN" && absDelta > 30) copyKey = "WIN_BIG";
  else if (result === "WIN" && absDelta >= 10) copyKey = "WIN_SMALL";
  else if (result === "WIN") copyKey = "WIN_TINY";
  else if (result === "LOSE" && absDelta > 30) copyKey = "LOSE_BIG";
  else if (result === "LOSE" && absDelta >= 10) copyKey = "LOSE_SMALL";
  else if (result === "LOSE") copyKey = "LOSE_TINY";

  const copy = copyByKey(copyKey);

  return Object.freeze({
    playerScore,
    opponentScore,
    delta,
    result,
    resultText: copy.text,
    resultEmoji: copy.emoji,
    dimensions: Object.freeze(dimensionResults),
  });
}
