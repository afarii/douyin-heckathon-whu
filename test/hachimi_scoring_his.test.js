import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_HIS_INPUT,
  HIS_LEVEL_PROFILES,
  clamp,
  computeAudioHIS,
  computeHachimiHisScoring,
  computeQuantizedScores,
  hisLevelFromHisScore,
  radarDataFromInputs,
} from "../hachimi_scoring/index.js";

test("hachimi_scoring quantize: clamp handles bounds and NaN", () => {
  assert.equal(clamp(-1, 0, 10), 0);
  assert.equal(clamp(11, 0, 10), 10);
  assert.equal(clamp(Number.NaN, 0, 10), 0);
});

test("hachimi_scoring quantize: four formulas match spec", () => {
  const scores = computeQuantizedScores({
    avgDB: 60,
    dominantFreq: 5000,
    activeDuration: 1.5,
    freqVariance: 1500,
  });

  assert.ok(Math.abs(scores.dbScore - 5.0) < 1e-12);
  assert.ok(Math.abs(scores.freqScore - 4.444444444444445) < 1e-12);
  assert.ok(Math.abs(scores.durationScore - 4.444444444444445) < 1e-12);
  assert.ok(Math.abs(scores.chaosScore - 5.0) < 1e-12);
});

test("hachimi_scoring HIS: Audio_HIS formula uses weights (6.1/6.2)", () => {
  const his = computeAudioHIS({
    dbScore: 5.0,
    freqScore: 4.444444444444445,
    durationScore: 4.444444444444445,
    chaosScore: 5.0,
  });
  assert.ok(Math.abs(his - 4.75) < 1e-12);
});

test("hachimi_scoring HIS: hisLevel mapping follows 6.3 ranges", () => {
  assert.equal(hisLevelFromHisScore(0), 1);
  assert.equal(hisLevelFromHisScore(1.9), 1);
  assert.equal(hisLevelFromHisScore(2.0), 2);
  assert.equal(hisLevelFromHisScore(2.9), 2);
  assert.equal(hisLevelFromHisScore(3.0), 3);
  assert.equal(hisLevelFromHisScore(4.4), 3);
  assert.equal(hisLevelFromHisScore(4.5), 4);
  assert.equal(hisLevelFromHisScore(5.9), 4);
  assert.equal(hisLevelFromHisScore(6.0), 5);
  assert.equal(hisLevelFromHisScore(6.9), 5);
  assert.equal(hisLevelFromHisScore(7.0), 6);
  assert.equal(hisLevelFromHisScore(7.9), 6);
  assert.equal(hisLevelFromHisScore(8.0), 7);
  assert.equal(hisLevelFromHisScore(8.9), 7);
  assert.equal(hisLevelFromHisScore(9.0), 8);
  assert.equal(hisLevelFromHisScore(9.9), 8);
  assert.equal(hisLevelFromHisScore(10.0), 9);
  assert.equal(hisLevelFromHisScore(10.1), 9);
});

test("hachimi_scoring HIS: hisLevel profiles match title/description/color exactly", () => {
  const byLevel = new Map(HIS_LEVEL_PROFILES.map((x) => [x.level, x]));

  assert.equal(byLevel.get(1).title, "软萌幼猫");
  assert.equal(byLevel.get(1).description, "这……算是哈气吗？更像是一只刚睡醒的小奶猫打了个喷嚏。你的攻击性约等于棉花糖撞墙——软萌无害。");
  assert.equal(byLevel.get(1).color, "#FFB6C1");

  assert.equal(byLevel.get(2).title, "微愠猫咪");
  assert.equal(byLevel.get(2).description, "你发出了轻微的不满信号，像一只发现罐头开错了口味的猫。不愤怒，但有点嫌弃。");
  assert.equal(byLevel.get(2).color, "#FFA500");

  assert.equal(byLevel.get(3).title, "警告哈气");
  assert.equal(byLevel.get(3).description, "这是一次标准的警告哈气——'我不好惹，别再靠近了'。你的哈气已经具备威慑力，路过的狗都要绕道走。");
  assert.equal(byLevel.get(3).color, "#FFD700");

  assert.equal(byLevel.get(4).title, "防御姿态");
  assert.equal(byLevel.get(4).description, "你的哈气已经进入防御模式——飞机耳、弓背、瞳孔放大三件套就位。这不是在开玩笑，这是在划地盘。");
  assert.equal(byLevel.get(4).color, "#9ACD32");

  assert.equal(byLevel.get(5).title, "威胁展示");
  assert.equal(byLevel.get(5).description, "你的哈气是认真的威胁——声音够大、频率够高、持续时间够长。对方的本能反应是：退后。");
  assert.equal(byLevel.get(5).color, "#32CD32");

  assert.equal(byLevel.get(6).title, "暴怒哈气");
  assert.equal(byLevel.get(6).description, "你已经进入暴怒区间。你的哈气不再是警告，而是攻击前的最后通牒。耄耋看了都要点赞。");
  assert.equal(byLevel.get(6).color, "#00CED1");

  assert.equal(byLevel.get(7).title, "狂暴状态");
  assert.equal(byLevel.get(7).description, "你的哈气已经突破天际——尖锐、持久、混沌，三重属性拉满。这不是哈气，这是声波武器。");
  assert.equal(byLevel.get(7).color, "#4169E1");

  assert.equal(byLevel.get(8).title, "传说哈气");
  assert.equal(byLevel.get(8).description, "传说级别的哈气——据说只有猫界至尊才能发出这样的声音。你的哈气可以被收录进《猫科动物声学百科全书》了。");
  assert.equal(byLevel.get(8).color, "#8A2BE2");

  assert.equal(byLevel.get(9).title, "耄耋降临");
  assert.equal(byLevel.get(9).description, "恭喜你达到了哈气的最高境界——耄耋降临。你的哈气已经超越了猫的范畴，成为一种自然现象。地震局可能会联系你。");
  assert.equal(byLevel.get(9).color, "#FF0000");
});

test("hachimi_scoring HIS: radarData follows 6.4 formulas", () => {
  const radar = radarDataFromInputs({
    dbScore: 5.3,
    freqScore: 4.7,
    durationScore: 4.8,
    chaosScore: 3.7,
    volumeVariance: 0.18,
    peakDB: 78.3,
    avgDB: 62.5,
  });

  assert.ok(Math.abs(radar.loudness - 5.3) < 1e-12);
  assert.ok(Math.abs(radar.pitch - 4.7) < 1e-12);
  assert.ok(Math.abs(radar.endurance - 4.8) < 1e-12);
  assert.ok(Math.abs(radar.chaos - 3.7) < 1e-12);
  assert.ok(Math.abs(radar.stability - 8.2) < 1e-12);
  assert.ok(Math.abs(radar.burst - 5.266666666666667) < 1e-12);
});

test("hachimi_scoring HIS: computeHachimiHisScoring has explicit defaults and stable output shape", () => {
  assert.deepEqual(DEFAULT_HIS_INPUT, {
    avgDB: 0,
    peakDB: 0,
    dominantFreq: 0,
    activeDuration: 0,
    freqVariance: 0,
    volumeVariance: 0,
  });

  const out = computeHachimiHisScoring();
  assert.ok(Object.prototype.hasOwnProperty.call(out, "dbScore"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "freqScore"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "durationScore"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "chaosScore"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "hisScore"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "hisLevel"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "profile"));
  assert.ok(Object.prototype.hasOwnProperty.call(out, "radarData"));

  assert.equal(out.hisLevel, 1);
});

