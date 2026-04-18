import test from "node:test";
import assert from "node:assert/strict";

import {
  CHALLENGE_CODE_COPY,
  CHALLENGE_CODE_TTL_SECONDS,
  HACHIMI_TEMPLATES,
  PK_RESULT_COPY,
  TEMPLATE_COMPARE_RATINGS,
  challengeOutcome,
  decodeChallengeCode,
  generateChallengeCode,
  scoreAgainstTemplate,
  scorePk,
  verifyChallengeCode,
} from "../hachimi_scoring/index.js";

test("hachimi_scoring templates: T1-T6 文案逐字一致", () => {
  const byId = Object.fromEntries(HACHIMI_TEMPLATES.map((x) => [x.id, x]));

  assert.equal(
    byId.T1.templateDescription,
    '"这是一只刚出生不到一个月的小奶猫发出的哈气。声音小得像在吹蒲公英，频率低得像在打哈欠。如果你连这个都比不过……建议先练练肺活量。"',
  );
  assert.equal(byId.T1.challengeHint, '"试着发出比小奶猫更响的哈气就行，很简单！"');

  assert.equal(
    byId.T2.templateDescription,
    `"这是一只普通室内短毛猫的标准哈气。不凶也不弱，属于'我有点不高兴了'的级别。大多数人的第一次哈气应该在这个水平附近。"`,
  );
  assert.equal(byId.T2.challengeHint, '"比普通家猫的哈气更响、更长、更尖锐就行！"');

  assert.equal(
    byId.T3.templateDescription,
    '"这是一只被抢了罐头的橘猫发出的哈气。响度明显提升，频率偏尖锐，持续时间较长——这是\'我真的很生气了\'的信号。橘猫的哈气在所有品种中排名靠前，别小看它们。"',
  );
  assert.equal(byId.T3.challengeHint, '"你需要比一只愤怒的橘猫更凶！试着提高音量和尖锐度。"');

  assert.equal(
    byId.T4.templateDescription,
    '"这是一只流浪猫在领地防御时发出的哈气。响度极高、频率尖锐、持续时间长、而且频率变化剧烈——这是\'退后否则我动手了\'的终极警告。野猫的哈气比家猫凶猛得多，因为它们需要真正靠哈气来保命。"',
  );
  assert.equal(
    byId.T4.challengeHint,
    '"这已经很困难了。你需要接近尖叫的音量和尖锐度，同时保持较长的持续时间。"',
  );

  assert.equal(
    byId.T5.templateDescription,
    '"这就是传说中的耄耋本耄——圆头耄耋，史上最暴躁的橘猫。它的哈气数据几乎在所有维度上都达到了顶级：响度接近疼痛阈值、频率进入超高频区间、持续时间超长、而且频率变化极其剧烈。据说听到耄耋哈气的狗，三天没敢出门。"',
  );
  assert.equal(
    byId.T5.challengeHint,
    '"传说级挑战！你需要发出接近人类极限的哈气。大多数人无法达到这个水平。"',
  );

  assert.equal(
    byId.T6.templateDescription,
    '"这是耄耋的暴怒模式——理论上的最大值。这个数据已经接近人类哈气的物理极限：90分贝的响度相当于站在摩托车旁边、8500Hz的频率已经接近猫科动物哈气的生物学上限、2.8秒的持续时间几乎耗尽了肺活量。如果你能超越这个模板……你可能不是人类。"',
  );
  assert.equal(
    byId.T6.challengeHint,
    '"地狱级挑战！这几乎是不可能完成的任务。如果你做到了，请录屏并上传到社交媒体，你会火的。"',
  );
});

test("hachimi_scoring template_compare: 评分/评级/对比文案", () => {
  const template = HACHIMI_TEMPLATES.find((x) => x.id === "T2");
  assert.ok(template);

  const equal = scoreAgainstTemplate(template.features, "T2");
  assert.equal(equal.ok, true);
  assert.equal(equal.similarity, 100);
  assert.equal(equal.rating, "SSS");
  assert.equal(equal.ratingText, TEMPLATE_COMPARE_RATINGS[0].text);

  assert.ok(equal.comparisons.loudness.includes(template.name));
  assert.ok(equal.comparisons.pitch.includes(template.name));
  assert.ok(equal.comparisons.endurance.includes(template.name));
  assert.ok(equal.comparisons.chaos.includes(template.name));

  const slightlyOff = scoreAgainstTemplate(
    { ...template.features, avgDB: template.features.avgDB + 28.5714 },
    "T2",
  );
  assert.equal(slightlyOff.ok, true);
  assert.ok(Math.abs(slightlyOff.similarity - 90) < 0.2);
  assert.equal(slightlyOff.rating, "SSS");

  const bonusCase = scoreAgainstTemplate(
    { ...template.features, avgDB: template.features.avgDB + 5, dominantFreq: template.features.dominantFreq + 1000 },
    "T2",
  );
  assert.equal(bonusCase.ok, true);
  assert.ok(bonusCase.bonusScore > 0);
  assert.ok(bonusCase.similarity <= 100);
});

test("hachimi_scoring pk: bonus 与胜负文案", () => {
  const bigWin = scorePk(
    { avgDB: 100, peakDB: 130, peakFreq: 10000, activeDuration: 3.0, freqVariance: 3000 },
    { avgDB: 20, peakDB: 20, peakFreq: 1000, activeDuration: 0.3, freqVariance: 0 },
  );
  assert.equal(bigWin.result, "WIN");
  assert.ok(bigWin.delta > 30);
  assert.equal(bigWin.resultText, PK_RESULT_COPY.find((x) => x.key === "WIN_BIG").text);

  const draw = scorePk(
    { avgDB: 60, peakDB: 80, peakFreq: 6000, activeDuration: 1.5, freqVariance: 800 },
    { avgDB: 60, peakDB: 80, peakFreq: 6000, activeDuration: 1.5, freqVariance: 800 },
  );
  assert.equal(draw.result, "DRAW");
  assert.equal(draw.delta, 0);
  assert.equal(draw.resultText, PK_RESULT_COPY.find((x) => x.key === "DRAW").text);
});

test("hachimi_scoring challenge_code: Base64(JSON)+HMAC验签+7天过期+文案", () => {
  const secretKey = "unit-test-secret";
  const nowSec = 1713400000;

  const code = generateChallengeCode(
    { nick: "哈气侠", db: 65.3, freq: 5200, dur: 1.4, chaos: 900, type: "HLTR", his: 6.8, lvl: 5 },
    { secretKey, nowSec },
  );

  const verified = verifyChallengeCode(code, { secretKey, nowSec: nowSec + 1 });
  assert.equal(verified.ok, true);
  assert.equal(verified.payload.nick, "哈气侠");
  assert.equal(verified.payload.ts, nowSec);

  const decoded = decodeChallengeCode(code);
  assert.equal(decoded.ok, true);
  const tampered = { ...decoded.payload, his: 9.9 };
  const tamperedCode = Buffer.from(JSON.stringify(tampered), "utf8").toString("base64");
  const tamperedVerified = verifyChallengeCode(tamperedCode, { secretKey, nowSec });
  assert.equal(tamperedVerified.ok, false);
  assert.equal(tamperedVerified.reason, "SIGNATURE_MISMATCH");

  const expiredVerified = verifyChallengeCode(code, { secretKey, nowSec: nowSec + CHALLENGE_CODE_TTL_SECONDS + 1 });
  assert.equal(expiredVerified.ok, false);
  assert.equal(expiredVerified.expired, true);

  const winOutcome = challengeOutcome({ code, userHisScore: 7.0 }, { secretKey, nowSec: nowSec + 10 });
  assert.equal(winOutcome.ok, true);
  assert.equal(winOutcome.message, replace(CHALLENGE_CODE_COPY.success, { 昵称: "哈气侠", 差值: "0.2" }));

  const loseOutcome = challengeOutcome({ code, userHisScore: 6.0 }, { secretKey, nowSec: nowSec + 10 });
  assert.equal(loseOutcome.ok, true);
  assert.equal(loseOutcome.message, replace(CHALLENGE_CODE_COPY.fail, { 昵称: "哈气侠", 差值: "0.8" }));
});

function replace(text, replacements) {
  return Object.entries(replacements).reduce((acc, [k, v]) => acc.split(`{${k}}`).join(String(v)), text);
}

