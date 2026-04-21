const assert = require("assert");
const RankedLogic = require("../ranked_logic.js");

function testSeasonCycle() {
  const epoch = RankedLogic.epochMs;
  const seasonMs = RankedLogic.seasonMs;
  const s0 = RankedLogic.getSeasonInfo(epoch + 1);
  assert.strictEqual(s0.seasonId, "S1");
  assert.strictEqual(typeof s0.themeName, "string");
  assert.ok(s0.themeName.length > 0);
  const s11 = RankedLogic.getSeasonInfo(epoch + seasonMs * 11 + 1);
  assert.strictEqual(s11.seasonId, "S12");
  const s12 = RankedLogic.getSeasonInfo(epoch + seasonMs * 12 + 1);
  assert.strictEqual(s12.seasonId, "S1");
  assert.strictEqual(RankedLogic.seasonThemes.length, 12);
}

function testTierThresholds() {
  const bronze = RankedLogic.getTierInfo(0);
  assert.strictEqual(bronze.id, "bronze");
  const silver = RankedLogic.getTierInfo(3.0);
  assert.strictEqual(silver.id, "silver");
  const gold = RankedLogic.getTierInfo(5.0);
  assert.strictEqual(gold.id, "gold");
  const platinum = RankedLogic.getTierInfo(6.5);
  assert.strictEqual(platinum.id, "platinum");
  const diamond = RankedLogic.getTierInfo(7.5);
  assert.strictEqual(diamond.id, "diamond");
  const master = RankedLogic.getTierInfo(8.5);
  assert.strictEqual(master.id, "master");
  const legend = RankedLogic.getTierInfo(9.0);
  assert.strictEqual(legend.id, "legend");
  const supreme = RankedLogic.getTierInfo(9.5);
  assert.strictEqual(supreme.id, "supreme");

  assert.deepStrictEqual(
    {
      platinum: { icon: platinum.icon, color: platinum.color, minHis: platinum.minHis },
      diamond: { icon: diamond.icon, color: diamond.color, minHis: diamond.minHis },
      master: { icon: master.icon, color: master.color, minHis: master.minHis },
      legend: { icon: legend.icon, color: legend.color, minHis: legend.minHis },
      supreme: { icon: supreme.icon, color: supreme.color, accentColor: supreme.accentColor, minHis: supreme.minHis }
    },
    {
      platinum: { icon: "💎", color: "#E5E4E2", minHis: 6.5 },
      diamond: { icon: "💠", color: "#B9F2FF", minHis: 7.5 },
      master: { icon: "👑", color: "#FF6B35", minHis: 8.5 },
      legend: { icon: "🔥", color: "#8A2BE2", minHis: 9.0 },
      supreme: { icon: "⭐", color: "#FF0000", accentColor: "#FFD700", minHis: 9.5 }
    }
  );
}

function testDeltaRules() {
  const win = RankedLogic.computeDelta({ his: 7.0, outcome: "胜", dimensionScore: "3:2", isFirstWin: true, streakAfter: 3 });
  assert.deepStrictEqual(win, { baseDelta: 70, outcomeBonus: 15, firstWinBonus: 10, streakBonus: 5, delta: 100 });

  const loss = RankedLogic.computeDelta({ his: 7.0, outcome: "负", dimensionScore: "2:3", isFirstWin: false, streakAfter: 0 });
  assert.deepStrictEqual(loss, { baseDelta: 70, outcomeBonus: -5, firstWinBonus: 0, streakBonus: 0, delta: 65 });

  const draw = RankedLogic.computeDelta({ his: 7.0, outcome: "平", dimensionScore: "2:2", isFirstWin: false, streakAfter: 0 });
  assert.deepStrictEqual(draw, { baseDelta: 70, outcomeBonus: 5, firstWinBonus: 0, streakBonus: 0, delta: 75 });
}

function testProtection() {
  const tierSilver = RankedLogic.getTierInfo(3.0);
  const silverDrop = RankedLogic.applyProtection({ pointsBefore: 320, delta: -50, tierBefore: tierSilver, protectionsLeft: 2 });
  assert.strictEqual(silverDrop.pointsAfter, 300);
  assert.strictEqual(silverDrop.clampedAtFloor, true);

  const tierGold = RankedLogic.getTierInfo(5.0);
  const goldDropShield = RankedLogic.applyProtection({ pointsBefore: 510, delta: -50, tierBefore: tierGold, protectionsLeft: 2 });
  assert.strictEqual(goldDropShield.pointsAfter, 510);
  assert.strictEqual(goldDropShield.protectionUsed, true);
  assert.strictEqual(goldDropShield.protectionsLeftAfter, 1);

  const goldDropNoShield = RankedLogic.applyProtection({ pointsBefore: 510, delta: -50, tierBefore: tierGold, protectionsLeft: 0 });
  assert.strictEqual(goldDropNoShield.pointsAfter, 460);
}

testSeasonCycle();
testTierThresholds();
testDeltaRules();
testProtection();

console.log("ranked smoke tests passed");
