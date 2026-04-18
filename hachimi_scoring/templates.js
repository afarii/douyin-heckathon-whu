export const HACHIMI_TEMPLATES = Object.freeze(
  [
    {
      id: "T1",
      name: "幼猫哈气",
      difficulty: "⭐ 入门",
      setting: "刚出生的小奶猫第一次哈气",
      estimatedHIS: 1.5,
      features: Object.freeze({
        avgDB: 25,
        dominantFreq: 2500,
        peakFreq: 3500,
        activeDuration: 0.4,
        freqVariance: 200,
        volumeVariance: 0.08,
      }),
      templateDescription:
        '"这是一只刚出生不到一个月的小奶猫发出的哈气。声音小得像在吹蒲公英，频率低得像在打哈欠。如果你连这个都比不过……建议先练练肺活量。"',
      challengeHint: '"试着发出比小奶猫更响的哈气就行，很简单！"',
    },
    {
      id: "T2",
      name: "室内短毛猫",
      difficulty: "⭐⭐ 简单",
      setting: "普通家猫的标准哈气",
      estimatedHIS: 3.5,
      features: Object.freeze({
        avgDB: 45,
        dominantFreq: 3500,
        peakFreq: 5000,
        activeDuration: 1.0,
        freqVariance: 500,
        volumeVariance: 0.12,
      }),
      templateDescription:
        `"这是一只普通室内短毛猫的标准哈气。不凶也不弱，属于'我有点不高兴了'的级别。大多数人的第一次哈气应该在这个水平附近。"`,
      challengeHint: '"比普通家猫的哈气更响、更长、更尖锐就行！"',
    },
    {
      id: "T3",
      name: "橘猫警告",
      difficulty: "⭐⭐⭐ 中等",
      setting: "一只被抢了罐头的橘猫",
      estimatedHIS: 5.5,
      features: Object.freeze({
        avgDB: 60,
        dominantFreq: 4500,
        peakFreq: 6500,
        activeDuration: 1.5,
        freqVariance: 800,
        volumeVariance: 0.18,
      }),
      templateDescription:
        '"这是一只被抢了罐头的橘猫发出的哈气。响度明显提升，频率偏尖锐，持续时间较长——这是\'我真的很生气了\'的信号。橘猫的哈气在所有品种中排名靠前，别小看它们。"',
      challengeHint: '"你需要比一只愤怒的橘猫更凶！试着提高音量和尖锐度。"',
    },
    {
      id: "T4",
      name: "野猫对峙",
      difficulty: "⭐⭐⭐⭐ 困难",
      setting: "流浪猫领地防御哈气",
      estimatedHIS: 7.5,
      features: Object.freeze({
        avgDB: 70,
        dominantFreq: 5500,
        peakFreq: 8000,
        activeDuration: 1.8,
        freqVariance: 1200,
        volumeVariance: 0.22,
      }),
      templateDescription:
        '"这是一只流浪猫在领地防御时发出的哈气。响度极高、频率尖锐、持续时间长、而且频率变化剧烈——这是\'退后否则我动手了\'的终极警告。野猫的哈气比家猫凶猛得多，因为它们需要真正靠哈气来保命。"',
      challengeHint: '"这已经很困难了。你需要接近尖叫的音量和尖锐度，同时保持较长的持续时间。"',
    },
    {
      id: "T5",
      name: "耄耋本耄",
      difficulty: "⭐⭐⭐⭐⭐ 传说",
      setting: "传说中最暴躁的橘猫",
      estimatedHIS: 9.0,
      features: Object.freeze({
        avgDB: 80,
        dominantFreq: 7000,
        peakFreq: 9000,
        activeDuration: 2.2,
        freqVariance: 2000,
        volumeVariance: 0.28,
      }),
      templateDescription:
        '"这就是传说中的耄耋本耄——圆头耄耋，史上最暴躁的橘猫。它的哈气数据几乎在所有维度上都达到了顶级：响度接近疼痛阈值、频率进入超高频区间、持续时间超长、而且频率变化极其剧烈。据说听到耄耋哈气的狗，三天没敢出门。"',
      challengeHint: '"传说级挑战！你需要发出接近人类极限的哈气。大多数人无法达到这个水平。"',
    },
    {
      id: "T6",
      name: "终极耄耋",
      difficulty: "⭐⭐⭐⭐⭐⭐ 地狱",
      setting: "耄耋暴怒模式（理论最大值）",
      estimatedHIS: 10.0,
      features: Object.freeze({
        avgDB: 90,
        dominantFreq: 8500,
        peakFreq: 9500,
        activeDuration: 2.8,
        freqVariance: 2800,
        volumeVariance: 0.35,
      }),
      templateDescription:
        '"这是耄耋的暴怒模式——理论上的最大值。这个数据已经接近人类哈气的物理极限：90分贝的响度相当于站在摩托车旁边、8500Hz的频率已经接近猫科动物哈气的生物学上限、2.8秒的持续时间几乎耗尽了肺活量。如果你能超越这个模板……你可能不是人类。"',
      challengeHint: '"地狱级挑战！这几乎是不可能完成的任务。如果你做到了，请录屏并上传到社交媒体，你会火的。"',
    },
  ].map((x) => Object.freeze(x)),
);

export function getHachimiTemplateById(id) {
  const found = HACHIMI_TEMPLATES.find((x) => x.id === id);
  return found ?? null;
}

