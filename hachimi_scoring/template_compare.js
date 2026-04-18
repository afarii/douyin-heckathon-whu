import { clamp } from "./quantize.js";
import { getHachimiTemplateById } from "./templates.js";

export const TEMPLATE_COMPARE_RATINGS = Object.freeze(
  [
    { min: 90, rating: "SSS", text: '"完美复刻！你就是耄耋转世！"', emoji: "🏆" },
    { min: 75, rating: "SS", text: '"非常接近！耄耋看了都要竖大拇指！"', emoji: "🎖️" },
    { min: 60, rating: "S", text: '"不错的哈气！有猫内味了！"', emoji: "⭐" },
    { min: 40, rating: "A", text: '"还需努力，多跟耄耋学习学习。"', emoji: "💪" },
    { min: 20, rating: "B", text: '"这……是哈气吗？再练练吧。"', emoji: "🤔" },
    { min: -Infinity, rating: "C", text: '"你是不是录错了？这听起来像在吹口哨。"', emoji: "😅" },
  ].map((x) => Object.freeze(x)),
);

export const TEMPLATE_COMPARE_DIMENSION_COPY = Object.freeze({
  loudness: Object.freeze({
    userWins: "你的哈气比{模板名}更响！响度+{差值}dB",
    templateWins: "你的哈气比{模板名}安静{差值}dB",
  }),
  pitch: Object.freeze({
    userWins: "你的哈气比{模板名}更尖锐！频率+{差值}Hz",
    templateWins: "你的哈气比{模板名}低沉{差值}Hz",
  }),
  endurance: Object.freeze({
    userWins: "你的哈气比{模板名}更长！+{差值}秒",
    templateWins: "你的哈气比{模板名}短{差值}秒",
  }),
  chaos: Object.freeze({
    userWins: "你的哈气比{模板名}更混乱！",
    templateWins: "你的哈气比{模板名}更有规律",
  }),
});

function formatNumber(value, { decimals = 1 } = {}) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  if (decimals <= 0) return String(Math.round(n));
  return n.toFixed(decimals).replace(/\.0+$/, "");
}

function replacePlaceholders(text, replacements) {
  return Object.entries(replacements).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), text);
}

function ratingFromSimilarity(similarity) {
  const s = Number.isFinite(similarity) ? similarity : 0;
  for (const r of TEMPLATE_COMPARE_RATINGS) {
    if (s >= r.min) return r;
  }
  return TEMPLATE_COMPARE_RATINGS[TEMPLATE_COMPARE_RATINGS.length - 1];
}

export function scoreAgainstTemplate(userFeatures = {}, templateOrId) {
  const template =
    typeof templateOrId === "string"
      ? getHachimiTemplateById(templateOrId)
      : templateOrId && typeof templateOrId === "object"
        ? templateOrId
        : null;

  if (!template) {
    return Object.freeze({
      ok: false,
      reason: "TEMPLATE_NOT_FOUND",
      similarity: 0,
      rating: "C",
      ratingText: TEMPLATE_COMPARE_RATINGS[TEMPLATE_COMPARE_RATINGS.length - 1].text,
      ratingEmoji: TEMPLATE_COMPARE_RATINGS[TEMPLATE_COMPARE_RATINGS.length - 1].emoji,
    });
  }

  const userDB = Number.isFinite(userFeatures.avgDB) ? userFeatures.avgDB : 0;
  const userFreq = Number.isFinite(userFeatures.dominantFreq) ? userFeatures.dominantFreq : 0;
  const userDur = Number.isFinite(userFeatures.activeDuration) ? userFeatures.activeDuration : 0;
  const userChaos = Number.isFinite(userFeatures.freqVariance) ? userFeatures.freqVariance : 0;

  const templateDB = Number.isFinite(template.features?.avgDB) ? template.features.avgDB : 0;
  const templateFreq = Number.isFinite(template.features?.dominantFreq) ? template.features.dominantFreq : 0;
  const templateDur = Number.isFinite(template.features?.activeDuration) ? template.features.activeDuration : 0;
  const templateChaos = Number.isFinite(template.features?.freqVariance) ? template.features.freqVariance : 0;

  const diffDB = Math.abs(userDB - templateDB) / 100;
  const diffFreq = Math.abs(userFreq - templateFreq) / 10000;
  const diffDur = Math.abs(userDur - templateDur) / 3.0;
  const diffChaos = Math.abs(userChaos - templateChaos) / 3000;

  const totalDiff = 0.35 * diffDB + 0.3 * diffFreq + 0.2 * diffDur + 0.15 * diffChaos;
  let similarity = (1 - totalDiff) * 100;
  similarity = clamp(similarity, 0, 100);

  let bonusScore = 0;
  if (userDB > templateDB && userFreq > templateFreq) {
    bonusScore = Math.min((userDB - templateDB) / 10 + (userFreq - templateFreq) / 1000, 20);
    similarity = Math.min(similarity + bonusScore, 100);
  }

  const rating = ratingFromSimilarity(similarity);

  const loudnessText = replacePlaceholders(
    userDB >= templateDB ? TEMPLATE_COMPARE_DIMENSION_COPY.loudness.userWins : TEMPLATE_COMPARE_DIMENSION_COPY.loudness.templateWins,
    { 模板名: template.name, 差值: formatNumber(Math.abs(userDB - templateDB), { decimals: 1 }) },
  );
  const pitchText = replacePlaceholders(
    userFreq >= templateFreq ? TEMPLATE_COMPARE_DIMENSION_COPY.pitch.userWins : TEMPLATE_COMPARE_DIMENSION_COPY.pitch.templateWins,
    { 模板名: template.name, 差值: formatNumber(Math.abs(userFreq - templateFreq), { decimals: 0 }) },
  );
  const enduranceText = replacePlaceholders(
    userDur >= templateDur ? TEMPLATE_COMPARE_DIMENSION_COPY.endurance.userWins : TEMPLATE_COMPARE_DIMENSION_COPY.endurance.templateWins,
    { 模板名: template.name, 差值: formatNumber(Math.abs(userDur - templateDur), { decimals: 1 }) },
  );
  const chaosText = replacePlaceholders(
    userChaos >= templateChaos ? TEMPLATE_COMPARE_DIMENSION_COPY.chaos.userWins : TEMPLATE_COMPARE_DIMENSION_COPY.chaos.templateWins,
    { 模板名: template.name },
  );

  return Object.freeze({
    ok: true,
    templateId: template.id,
    templateName: template.name,
    similarity,
    totalDiff,
    bonusScore,
    rating: rating.rating,
    ratingText: rating.text,
    ratingEmoji: rating.emoji,
    diffs: Object.freeze({ diffDB, diffFreq, diffDur, diffChaos }),
    comparisons: Object.freeze({
      loudness: loudnessText,
      pitch: pitchText,
      endurance: enduranceText,
      chaos: chaosText,
    }),
  });
}

