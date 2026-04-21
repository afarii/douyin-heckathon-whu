(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
    return;
  }
  root.RankedLogic = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const seasonMs = 30 * 24 * 60 * 60 * 1000;
  const epochMs = Date.UTC(2026, 0, 1);

  const seasonThemes = [
    { id: "S1", name: "初次哈气" },
    { id: "S2", name: "哈气觉醒" },
    { id: "S3", name: "暴怒之路" },
    { id: "S4", name: "耄耋降临" },
    { id: "S5", name: "哈气大师" },
    { id: "S6", name: "终极对决" },
    { id: "S7", name: "猫咪之战" },
    { id: "S8", name: "哈气风暴" },
    { id: "S9", name: "传说归来" },
    { id: "S10", name: "巅峰哈气" },
    { id: "S11", name: "无尽对决" },
    { id: "S12", name: "耄耋终章" }
  ];

  const tiers = [
    { id: "bronze", name: "青铜", icon: "🥉", color: "#CD7F32", minHis: 0.0 },
    { id: "silver", name: "白银", icon: "🥈", color: "#C0C0C0", minHis: 3.0 },
    { id: "gold", name: "黄金", icon: "🥇", color: "#FFD700", minHis: 5.0 },
    { id: "platinum", name: "铂金", icon: "💎", color: "#E5E4E2", minHis: 6.5 },
    { id: "diamond", name: "钻石", icon: "💠", color: "#B9F2FF", minHis: 7.5 },
    { id: "master", name: "大师", icon: "👑", color: "#FF6B35", minHis: 8.5 },
    { id: "legend", name: "传说", icon: "🔥", color: "#8A2BE2", minHis: 9.0 },
    { id: "supreme", name: "至尊", icon: "⭐", color: "#FF0000", accentColor: "#FFD700", minHis: 9.5 }
  ].map((tier) => ({ ...tier, minPoints: Math.round(tier.minHis * 100) }));

  const bonusByDimensionScore = {
    "5:0": 30,
    "4:1": 20,
    "3:2": 15,
    "2:3": -5,
    "1:4": -10,
    "0:5": -20
  };

  const streakMilestones = [
    { streak: 3, bonus: 5 },
    { streak: 5, bonus: 10 },
    { streak: 10, bonus: 20 }
  ];

  function clampNumber(value, min, max) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return min;
    }
    return Math.max(min, Math.min(max, num));
  }

  function formatYmd(timestamp) {
    const date = new Date(Number(timestamp) || Date.now());
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function getSeasonInfo(nowMs) {
    const now = Number(nowMs) || Date.now();
    const seasonIndex = Math.max(0, Math.floor((now - epochMs) / seasonMs));
    const start = epochMs + seasonIndex * seasonMs;
    const end = start + seasonMs;
    const theme = seasonThemes[seasonIndex % seasonThemes.length] || seasonThemes[0];
    return { seasonId: theme.id, themeName: theme.name, seasonIndex, start, end };
  }

  function getTierInfo(his) {
    const value = clampNumber(his, 0, 14);
    const sorted = tiers.slice().sort((a, b) => a.minHis - b.minHis);
    let current = sorted[0];
    for (const tier of sorted) {
      if (value >= tier.minHis) {
        current = tier;
      } else {
        break;
      }
    }
    return current || tiers[0];
  }

  function getTierInfoByPoints(points) {
    const value = Math.max(0, Math.round(Number(points) || 0));
    const sorted = tiers.slice().sort((a, b) => a.minPoints - b.minPoints);
    let current = sorted[0];
    for (const tier of sorted) {
      if (value >= tier.minPoints) {
        current = tier;
      } else {
        break;
      }
    }
    return current || tiers[0];
  }

  function compareDimension(myNum, opNum, step) {
    const s = Number(step);
    if (!Number.isFinite(myNum) || !Number.isFinite(opNum) || !Number.isFinite(s) || s <= 0) {
      return null;
    }
    const myQ = Math.round(myNum / s);
    const opQ = Math.round(opNum / s);
    if (myQ > opQ) {
      return true;
    }
    if (myQ < opQ) {
      return false;
    }
    if (myNum > opNum) {
      return true;
    }
    if (myNum < opNum) {
      return false;
    }
    return null;
  }

  function computeComparison(myPayload, opponentPayload) {
    const defs = [
      { key: "avgDB", step: 1 },
      { key: "dominantFreq", step: 200 },
      { key: "activeDuration", step: 0.2 },
      { key: "freqVariance", step: 100 },
      { key: "audioHis", step: 0.5 }
    ];
    let myWins = 0;
    let opWins = 0;
    const rows = defs.map((def) => {
      const myNum = Number(myPayload?.[def.key]);
      const opNum = Number(opponentPayload?.[def.key]);
      const win = compareDimension(myNum, opNum, def.step);
      if (win === true) {
        myWins += 1;
      } else if (win === false) {
        opWins += 1;
      }
      return { key: def.key, win, my: Number.isFinite(myNum) ? myNum : null, opponent: Number.isFinite(opNum) ? opNum : null };
    });

    let outcome = "平";
    if (myWins > opWins) {
      outcome = "胜";
    } else if (myWins < opWins) {
      outcome = "负";
    }

    const ties = Math.max(0, defs.length - myWins - opWins);
    const normalized = outcome === "胜" ? { my: myWins + ties, op: opWins } : outcome === "负" ? { my: myWins, op: opWins + ties } : { my: myWins, op: opWins };
    const diff = normalized.my - normalized.op;
    let title = "势均力敌";
    let copy = "五维打平，下一口哈气再来一把。";
    if (outcome !== "平") {
      if (Math.abs(diff) >= 3) {
        title = outcome === "胜" ? "碾压获胜" : "被碾压";
        copy = "五维优势明显，属于是把对手按在地上摩擦。";
      } else if (Math.abs(diff) === 2) {
        title = outcome === "胜" ? "优势获胜" : "略逊一筹";
        copy = "差距不小，但还有翻盘空间。";
      } else {
        title = outcome === "胜" ? "险胜" : "惜败";
        copy = "就差一点点，下一把注意细节。";
      }
    }

    return {
      myWins: normalized.my,
      opWins: normalized.op,
      dimensionScore: `${normalized.my}:${normalized.op}`,
      outcome,
      title,
      copy,
      rows
    };
  }

  function computeDelta({ his, outcome, dimensionScore, isFirstWin, streakAfter }) {
    const safeHis = clampNumber(his, 0, 14);
    const base = Math.round(safeHis * 10);
    const baseDelta = base;

    const scoreKey = String(dimensionScore || "");
    const outcomeBonus = outcome === "平" ? 5 : Number(bonusByDimensionScore[scoreKey] ?? 0);
    const firstWinBonus = isFirstWin ? 10 : 0;
    const streakBonus = streakMilestones.reduce((sum, item) => (streakAfter === item.streak ? sum + item.bonus : sum), 0);

    const delta = Math.round(baseDelta + outcomeBonus + firstWinBonus + streakBonus);
    return { baseDelta, outcomeBonus, firstWinBonus, streakBonus, delta };
  }

  function applyProtection({ pointsBefore, delta, tierBefore, protectionsLeft }) {
    const before = Math.max(0, Math.round(Number(pointsBefore) || 0));
    const d = Math.round(Number(delta) || 0);
    const tier = tierBefore && typeof tierBefore === "object" ? tierBefore : getTierInfoByPoints(before);
    const minPoints = Math.max(0, Math.round(Number(tier.minPoints) || 0));
    const left = Math.max(0, Math.round(Number(protectionsLeft) || 0));

    if (d >= 0) {
      return { pointsAfter: before + d, deltaApplied: d, protectionsLeftAfter: left, protectionUsed: false, clampedAtFloor: false };
    }

    const next = before + d;
    if (next >= minPoints) {
      return { pointsAfter: Math.max(0, next), deltaApplied: d, protectionsLeftAfter: left, protectionUsed: false, clampedAtFloor: false };
    }

    if (tier.id === "bronze" || tier.id === "silver") {
      const after = minPoints;
      return { pointsAfter: after, deltaApplied: after - before, protectionsLeftAfter: left, protectionUsed: false, clampedAtFloor: true };
    }

    if (left > 0) {
      return { pointsAfter: before, deltaApplied: 0, protectionsLeftAfter: left - 1, protectionUsed: true, clampedAtFloor: false };
    }

    return { pointsAfter: Math.max(0, next), deltaApplied: d, protectionsLeftAfter: left, protectionUsed: false, clampedAtFloor: false };
  }

  return {
    seasonMs,
    epochMs,
    seasonThemes,
    tiers,
    bonusByDimensionScore,
    streakMilestones,
    formatYmd,
    getSeasonInfo,
    getTierInfo,
    getTierInfoByPoints,
    computeComparison,
    computeDelta,
    applyProtection
  };
});
