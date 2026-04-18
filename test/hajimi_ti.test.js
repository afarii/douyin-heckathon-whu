import test from "node:test";
import assert from "node:assert/strict";

import {
  FeatureVectorValidationError,
  PERSONALITY_CATALOG,
  analyzePersonality,
  createFeatureVector,
  featureVectorFromWav,
  getPersonalityProfile,
} from "../hajimi_ti/index.js";

test("FeatureVector: default initialization uses explicit defaults and disallows extra fields", () => {
  const vector = createFeatureVector();
  assert.equal(typeof vector.avgDB, "number");
  assert.equal(vector.avgDB, 0);
  assert.equal(vector.silenceRatio, 0);

  assert.throws(() => createFeatureVector({ extra: 1 }), (err) => {
    assert.ok(err instanceof FeatureVectorValidationError);
    assert.equal(err.field, "extra");
    return true;
  });
});

test("FeatureVector: validation rejects illegal ratios and negative durations", () => {
  assert.throws(() => createFeatureVector({ silenceRatio: 1.1 }), FeatureVectorValidationError);
  assert.throws(() => createFeatureVector({ volumeVariance: -0.1 }), FeatureVectorValidationError);
  assert.throws(() => createFeatureVector({ duration: -1 }), FeatureVectorValidationError);
  assert.throws(
    () => createFeatureVector({ duration: 1, activeDuration: 2 }),
    FeatureVectorValidationError,
  );
});

test("Hidden personality: MEOOOW has priority over SILENT", () => {
  const analysis = analyzePersonality(
    createFeatureVector({
      dominantFreq: 1499,
      lowFreqDuration: 0.6,
      avgDB: 0,
      duration: 0.1,
    }),
  );
  assert.equal(analysis.personality, "MEOOOW");
  assert.equal(analysis.personalityProfile.code, "MEOOOW");
  assert.equal(analysis.dimensionMatches.length, 0);
});

test("Hidden personality: SILENT triggers by avgDB < 20 or duration < 0.3", () => {
  const byDb = analyzePersonality(createFeatureVector({ avgDB: 19.9, duration: 2 }));
  assert.equal(byDb.personality, "SILENT");

  const byDuration = analyzePersonality(createFeatureVector({ avgDB: 80, duration: 0.29 }));
  assert.equal(byDuration.personality, "SILENT");
});

test("Dimension 1 H/S: hard H, hard S, boundary by his", () => {
  const hardH = analyzePersonality(
    createFeatureVector({ avgDB: 66, peakFreq: 4001, duration: 2, activeDuration: 2 }),
  );
  assert.equal(hardH.dimensionMatches[0].letter, "H");
  assert.equal(hardH.dimensionMatches[0].hard, true);
  assert.equal(hardH.dimensionMatches[0].match, 0.9);

  const hardS = analyzePersonality(
    createFeatureVector({ avgDB: 44.9, peakFreq: 9999, duration: 2, activeDuration: 2 }),
  );
  assert.equal(hardS.dimensionMatches[0].letter, "S");
  assert.equal(hardS.dimensionMatches[0].hard, true);
  assert.equal(hardS.dimensionMatches[0].match, 0.9);

  const boundaryH = analyzePersonality(
    createFeatureVector({ avgDB: 55, peakFreq: 3000, silenceRatio: 0.1, his: 5.01, duration: 2, activeDuration: 1.2 }),
  );
  assert.equal(boundaryH.dimensionMatches[0].letter, "H");
  assert.equal(boundaryH.dimensionMatches[0].hard, false);
  assert.equal(boundaryH.dimensionMatches[0].match, 0.65);

  const boundaryS = analyzePersonality(
    createFeatureVector({ avgDB: 55, peakFreq: 3000, silenceRatio: 0.1, his: 5, duration: 2, activeDuration: 1.2 }),
  );
  assert.equal(boundaryS.dimensionMatches[0].letter, "S");
  assert.equal(boundaryS.dimensionMatches[0].hard, false);
  assert.equal(boundaryS.dimensionMatches[0].match, 0.65);
});

test("Dimension 2/3/4: boundary and hard branches produce correct letters", () => {
  const analysis = analyzePersonality(
    createFeatureVector({
      avgDB: 70,
      peakFreq: 8000,
      dominantFreq: 5200,
      activeDuration: 1.2,
      volumeVariance: 0.2,
      lowFreqRatio: 0.1,
      pitchChangeRate: 360,
      freqVariance: 900,
      duration: 2,
      his: 6,
    }),
  );

  assert.equal(analysis.dimensionMatches[1].dimension, "L/P");
  assert.equal(analysis.dimensionMatches[1].letter, "L");
  assert.equal(analysis.dimensionMatches[1].hard, false);

  assert.equal(analysis.dimensionMatches[2].dimension, "T/F");
  assert.equal(analysis.dimensionMatches[2].letter, "T");
  assert.equal(analysis.dimensionMatches[2].hard, true);

  assert.equal(analysis.dimensionMatches[3].dimension, "C/R");
  assert.equal(analysis.dimensionMatches[3].letter, "C");
  assert.equal(analysis.dimensionMatches[3].hard, false);
});

test("Personality composition: returns 4-letter code and profile", () => {
  const analysis = analyzePersonality(
    createFeatureVector({
      avgDB: 66,
      peakFreq: 9001,
      dominantFreq: 5201,
      activeDuration: 1.6,
      volumeVariance: 0.1,
      lowFreqRatio: 0.1,
      pitchChangeRate: 520,
      freqVariance: 1600,
      duration: 2.2,
      his: 8,
    }),
  );
  assert.equal(analysis.personality, "HLTC");
  assert.equal(analysis.personalityProfile.code, "HLTC");
  assert.equal(analysis.personalityMatch, 0.9);
});

test("Catalog: all 18 types exist and have stable field set", () => {
  const required = [
    "code",
    "name",
    "title",
    "dimensionCombo",
    "themeColor",
    "emoji",
    "rarityText",
    "rarityRateText",
    "coreDescription",
    "fullCopy",
    "hissPortrait",
    "knownCat",
    "socialTags",
  ];

  const codes = Object.keys(PERSONALITY_CATALOG);
  assert.equal(codes.length, 18);

  for (const code of codes) {
    const profile = PERSONALITY_CATALOG[code];
    for (const field of required) {
      assert.ok(Object.prototype.hasOwnProperty.call(profile, field), `${code} missing ${field}`);
      assert.notEqual(profile[field], undefined);
    }
  }

  assert.throws(() => getPersonalityProfile("NOPE"), (err) => err instanceof Error);
});

test("WAV feature extraction: dominantFreq approximates tone frequency", () => {
  const sampleRate = 44100;
  const seconds = 1;
  const frequency = 440;
  const samples = new Float32Array(sampleRate * seconds);
  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0.5;
  }
  const wav = encodeWavMono16(samples, sampleRate);
  const vector = featureVectorFromWav(wav);
  assert.ok(vector.duration > 0.9 && vector.duration < 1.1);
  assert.ok(vector.dominantFreq > 380 && vector.dominantFreq < 520);
});

function encodeWavMono16(samples, sampleRate) {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const dataSize = samples.length * bytesPerSample;
  const output = new ArrayBuffer(44 + dataSize);
  const view = new DataView(output);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (const sample of samples) {
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(offset, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
    offset += 2;
  }

  return output;
}

function writeString(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

