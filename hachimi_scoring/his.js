import { DEFAULT_RANGES, DEFAULT_WEIGHTS } from "./config.js";
import {
  chaosScoreFromFreqVariance,
  clamp,
  dbScoreFromAvgDb,
  durationScoreFromActiveDuration,
  freqScoreFromDominantFreq,
} from "./quantize.js";

export const DEFAULT_HIS_INPUT = Object.freeze({
  avgDB: 0,
  peakDB: 0,
  dominantFreq: 0,
  activeDuration: 0,
  freqVariance: 0,
  volumeVariance: 0,
});

export const HIS_LEVEL_PROFILES = Object.freeze(
  [
    {
      level: 1,
      label: "Lv.1",
      min: 0,
      max: 1.9,
      title: "软萌幼猫",
      analogy: "幼猫打喷嚏",
      description: "这……算是哈气吗？更像是一只刚睡醒的小奶猫打了个喷嚏。你的攻击性约等于棉花糖撞墙——软萌无害。",
      color: "#FFB6C1",
    },
    {
      level: 2,
      label: "Lv.2",
      min: 2.0,
      max: 2.9,
      title: "微愠猫咪",
      analogy: "轻微不满的咕噜",
      description: "你发出了轻微的不满信号，像一只发现罐头开错了口味的猫。不愤怒，但有点嫌弃。",
      color: "#FFA500",
    },
    {
      level: 3,
      label: "Lv.3",
      min: 3.0,
      max: 4.4,
      title: "警告哈气",
      analogy: "明确抗议的哈气",
      description: "这是一次标准的警告哈气——'我不好惹，别再靠近了'。你的哈气已经具备威慑力，路过的狗都要绕道走。",
      color: "#FFD700",
    },
    {
      level: 4,
      label: "Lv.4",
      min: 4.5,
      max: 5.9,
      title: "防御姿态",
      analogy: "飞机耳+弓背",
      description: "你的哈气已经进入防御模式——飞机耳、弓背、瞳孔放大三件套就位。这不是在开玩笑，这是在划地盘。",
      color: "#9ACD32",
    },
    {
      level: 5,
      label: "Lv.5",
      min: 6.0,
      max: 6.9,
      title: "威胁展示",
      analogy: "全面威胁姿态",
      description: "你的哈气是认真的威胁——声音够大、频率够高、持续时间够长。对方的本能反应是：退后。",
      color: "#32CD32",
    },
    {
      level: 6,
      label: "Lv.6",
      min: 7.0,
      max: 7.9,
      title: "暴怒哈气",
      analogy: "强烈攻击前兆",
      description: "你已经进入暴怒区间。你的哈气不再是警告，而是攻击前的最后通牒。耄耋看了都要点赞。",
      color: "#00CED1",
    },
    {
      level: 7,
      label: "Lv.7",
      min: 8.0,
      max: 8.9,
      title: "狂暴状态",
      analogy: "全面攻击模式",
      description: "你的哈气已经突破天际——尖锐、持久、混沌，三重属性拉满。这不是哈气，这是声波武器。",
      color: "#4169E1",
    },
    {
      level: 8,
      label: "Lv.8",
      min: 9.0,
      max: 9.9,
      title: "传说哈气",
      analogy: "猫界传说",
      description: "传说级别的哈气——据说只有猫界至尊才能发出这样的声音。你的哈气可以被收录进《猫科动物声学百科全书》了。",
      color: "#8A2BE2",
    },
    {
      level: 9,
      label: "Lv.9",
      min: 10.0,
      max: Infinity,
      title: "耄耋降临",
      analogy: "耄耋本耄",
      description: "恭喜你达到了哈气的最高境界——耄耋降临。你的哈气已经超越了猫的范畴，成为一种自然现象。地震局可能会联系你。",
      color: "#FF0000",
    },
  ].map((x) => Object.freeze(x)),
);

export function computeQuantizedScores(features = {}, { ranges = DEFAULT_RANGES } = {}) {
  const input = { ...DEFAULT_HIS_INPUT, ...(features ?? {}) };
  const scoreMin = ranges?.scoreMin ?? 0;
  const scoreMax = ranges?.scoreMax ?? 10;

  const dbScore = dbScoreFromAvgDb(input.avgDB, { scoreMin, scoreMax });
  const freqScore = freqScoreFromDominantFreq(input.dominantFreq, { scoreMin, scoreMax });
  const durationScore = durationScoreFromActiveDuration(input.activeDuration, { scoreMin, scoreMax });
  const chaosScore = chaosScoreFromFreqVariance(input.freqVariance, { scoreMin, scoreMax });

  return Object.freeze({ dbScore, freqScore, durationScore, chaosScore });
}

export function computeAudioHIS(scores = {}, { weights = DEFAULT_WEIGHTS, ranges = DEFAULT_RANGES } = {}) {
  const input = {
    dbScore: Number.isFinite(scores.dbScore) ? scores.dbScore : 0,
    freqScore: Number.isFinite(scores.freqScore) ? scores.freqScore : 0,
    durationScore: Number.isFinite(scores.durationScore) ? scores.durationScore : 0,
    chaosScore: Number.isFinite(scores.chaosScore) ? scores.chaosScore : 0,
  };

  const w = {
    dbScore: Number.isFinite(weights?.dbScore) ? weights.dbScore : DEFAULT_WEIGHTS.dbScore,
    freqScore: Number.isFinite(weights?.freqScore) ? weights.freqScore : DEFAULT_WEIGHTS.freqScore,
    durationScore: Number.isFinite(weights?.durationScore) ? weights.durationScore : DEFAULT_WEIGHTS.durationScore,
    chaosScore: Number.isFinite(weights?.chaosScore) ? weights.chaosScore : DEFAULT_WEIGHTS.chaosScore,
  };

  const scoreMin = ranges?.scoreMin ?? 0;
  const scoreMax = ranges?.scoreMax ?? 10;

  const his =
    w.dbScore * input.dbScore + w.freqScore * input.freqScore + w.durationScore * input.durationScore + w.chaosScore * input.chaosScore;

  return clamp(his, scoreMin, scoreMax);
}

export function hisLevelFromHisScore(hisScore) {
  const score = Number.isFinite(hisScore) ? hisScore : 0;

  if (score >= 10.0) return 9;
  if (score >= 9.0) return 8;
  if (score >= 8.0) return 7;
  if (score >= 7.0) return 6;
  if (score >= 6.0) return 5;
  if (score >= 4.5) return 4;
  if (score >= 3.0) return 3;
  if (score >= 2.0) return 2;
  return 1;
}

export function hisProfileFromHisLevel(level) {
  const lv = Number.isFinite(level) ? Math.floor(level) : 0;
  const found = HIS_LEVEL_PROFILES.find((x) => x.level === lv);
  return found ?? HIS_LEVEL_PROFILES[0];
}

export function hisProfileFromHisScore(hisScore) {
  return hisProfileFromHisLevel(hisLevelFromHisScore(hisScore));
}

export function radarDataFromInputs(
  {
    dbScore = 0,
    freqScore = 0,
    durationScore = 0,
    chaosScore = 0,
    volumeVariance = 0,
    peakDB = 0,
    avgDB = 0,
  } = {},
  { ranges = DEFAULT_RANGES } = {},
) {
  const scoreMin = ranges?.scoreMin ?? 0;
  const scoreMax = ranges?.scoreMax ?? 10;

  const vv = Number.isFinite(volumeVariance) ? volumeVariance : 0;
  const p = Number.isFinite(peakDB) ? peakDB : 0;
  const a = Number.isFinite(avgDB) ? avgDB : 0;

  return Object.freeze({
    loudness: clamp(dbScore, scoreMin, scoreMax),
    pitch: clamp(freqScore, scoreMin, scoreMax),
    endurance: clamp(durationScore, scoreMin, scoreMax),
    chaos: clamp(chaosScore, scoreMin, scoreMax),
    stability: clamp((1 - vv) * 10, scoreMin, scoreMax),
    burst: clamp(((p - a) / 30) * 10, scoreMin, scoreMax),
  });
}

export function computeHachimiHisScoring(features = {}, { weights = DEFAULT_WEIGHTS, ranges = DEFAULT_RANGES } = {}) {
  const input = { ...DEFAULT_HIS_INPUT, ...(features ?? {}) };
  const scores = computeQuantizedScores(input, { ranges });
  const hisScore = computeAudioHIS(scores, { weights, ranges });
  const hisLevel = hisLevelFromHisScore(hisScore);
  const radarData = radarDataFromInputs({ ...scores, volumeVariance: input.volumeVariance, peakDB: input.peakDB, avgDB: input.avgDB }, { ranges });
  const profile = hisProfileFromHisLevel(hisLevel);

  return Object.freeze({
    ...scores,
    hisScore,
    hisLevel,
    profile,
    radarData,
  });
}

