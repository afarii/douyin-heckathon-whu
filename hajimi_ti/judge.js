import { getPersonalityProfile } from "./catalog.js";
import { DEFAULT_MATCH_CONFIG, DEFAULT_THRESHOLDS } from "./config.js";
import { HiddenPersonalityCode } from "./enums.js";
import { createDimensionMatch, createFeatureVector, createPersonalityAnalysis } from "./models.js";

export function analyzePersonality(inputVector, { matchConfig = DEFAULT_MATCH_CONFIG, thresholds = DEFAULT_THRESHOLDS } = {}) {
  const vector = createFeatureVector(inputVector);

  const hiddenCode = _detectHidden(vector, thresholds);
  if (hiddenCode) {
    return createPersonalityAnalysis({
      personality: hiddenCode,
      personalityMatch: matchConfig.hiddenMatch,
      dimensionMatches: [],
      personalityProfile: getPersonalityProfile(hiddenCode),
    });
  }

  const d1 = _judgeDimension1(vector, thresholds, matchConfig);
  const d2 = _judgeDimension2(vector, thresholds, matchConfig);
  const d3 = _judgeDimension3(vector, thresholds, matchConfig);
  const d4 = _judgeDimension4(vector, thresholds, matchConfig);

  const personality = `${d1.letter}${d2.letter}${d3.letter}${d4.letter}`;
  const personalityMatch = (d1.match + d2.match + d3.match + d4.match) / 4;

  return createPersonalityAnalysis({
    personality,
    personalityMatch: Number(personalityMatch.toFixed(4)),
    dimensionMatches: [d1, d2, d3, d4],
    personalityProfile: getPersonalityProfile(personality),
  });
}

function _detectHidden(vector, thresholds) {
  const meooow = thresholds.hidden.meooow;
  if (vector.dominantFreq < meooow.dominantFreqHzLt && vector.lowFreqDuration > meooow.lowFreqDurationSecGt) {
    return HiddenPersonalityCode.MEOOOW;
  }

  const silent = thresholds.hidden.silent;
  if (vector.avgDB < silent.avgDBLt || vector.duration < silent.durationSecLt) {
    return HiddenPersonalityCode.SILENT;
  }

  return null;
}

function _judgeDimension1(vector, thresholds, matchConfig) {
  const hiss = thresholds.dimension1.hiss;
  if (vector.avgDB > hiss.avgDBGt && vector.peakFreq > hiss.peakFreqHzGt) {
    return createDimensionMatch({
      dimension: "H/S",
      letter: "H",
      match: matchConfig.hardDimensionMatch,
      reason: "avgDB > 65 且 peakFreq > 4000",
      hard: true,
    });
  }

  const silence = thresholds.dimension1.silence;
  if (vector.avgDB < silence.avgDBLt || vector.silenceRatio > silence.silenceRatioGt) {
    return createDimensionMatch({
      dimension: "H/S",
      letter: "S",
      match: matchConfig.hardDimensionMatch,
      reason: "avgDB < 45 或 silenceRatio > 0.6",
      hard: true,
    });
  }

  const boundary = thresholds.dimension1.boundary;
  if (vector.his > boundary.hisGt) {
    return createDimensionMatch({
      dimension: "H/S",
      letter: "H",
      match: matchConfig.boundaryDimensionMatch,
      reason: "边界分支：his > 5",
      hard: false,
    });
  }

  return createDimensionMatch({
    dimension: "H/S",
    letter: "S",
    match: matchConfig.boundaryDimensionMatch,
    reason: "边界分支：his <= 5",
    hard: false,
  });
}

function _judgeDimension2(vector, thresholds, matchConfig) {
  const long = thresholds.dimension2.long;
  if (vector.activeDuration > long.activeDurationSecGt && vector.volumeVariance < long.volumeVarianceLt) {
    return createDimensionMatch({
      dimension: "L/P",
      letter: "L",
      match: matchConfig.hardDimensionMatch,
      reason: "activeDuration > 1.5 且 volumeVariance < 0.15",
      hard: true,
    });
  }

  const pulse = thresholds.dimension2.pulse;
  if (vector.activeDuration < pulse.activeDurationSecLt || vector.volumeVariance > pulse.volumeVarianceGt) {
    return createDimensionMatch({
      dimension: "L/P",
      letter: "P",
      match: matchConfig.hardDimensionMatch,
      reason: "activeDuration < 0.8 或 volumeVariance > 0.3",
      hard: true,
    });
  }

  const boundary = thresholds.dimension2.boundary;
  if (vector.activeDuration > boundary.durationMedianSec) {
    return createDimensionMatch({
      dimension: "L/P",
      letter: "L",
      match: matchConfig.boundaryDimensionMatch,
      reason: "边界分支：activeDuration > 1.0",
      hard: false,
    });
  }

  return createDimensionMatch({
    dimension: "L/P",
    letter: "P",
    match: matchConfig.boundaryDimensionMatch,
    reason: "边界分支：activeDuration <= 1.0",
    hard: false,
  });
}

function _judgeDimension3(vector, thresholds, matchConfig) {
  const treble = thresholds.dimension3.treble;
  if (vector.dominantFreq > treble.dominantFreqHzGt || vector.peakFreq > treble.peakFreqHzGt) {
    return createDimensionMatch({
      dimension: "T/F",
      letter: "T",
      match: matchConfig.hardDimensionMatch,
      reason: "dominantFreq > 5000 或 peakFreq > 7000",
      hard: true,
    });
  }

  const flat = thresholds.dimension3.flat;
  if (vector.dominantFreq < flat.dominantFreqHzLt && vector.lowFreqRatio > flat.lowFreqRatioGt) {
    return createDimensionMatch({
      dimension: "T/F",
      letter: "F",
      match: matchConfig.hardDimensionMatch,
      reason: "dominantFreq < 3000 且 lowFreqRatio > 0.4",
      hard: true,
    });
  }

  const boundary = thresholds.dimension3.boundary;
  if (vector.dominantFreq > boundary.dominantMedianHz) {
    return createDimensionMatch({
      dimension: "T/F",
      letter: "T",
      match: matchConfig.boundaryDimensionMatch,
      reason: "边界分支：dominantFreq > 4000",
      hard: false,
    });
  }

  return createDimensionMatch({
    dimension: "T/F",
    letter: "F",
    match: matchConfig.boundaryDimensionMatch,
    reason: "边界分支：dominantFreq <= 4000",
    hard: false,
  });
}

function _judgeDimension4(vector, thresholds, matchConfig) {
  const chaos = thresholds.dimension4.chaos;
  if (vector.pitchChangeRate > chaos.pitchChangeRateHzPerSecGt || vector.freqVariance > chaos.freqVarianceHz2Gt) {
    return createDimensionMatch({
      dimension: "C/R",
      letter: "C",
      match: matchConfig.hardDimensionMatch,
      reason: "pitchChangeRate > 500 或 freqVariance > 1500",
      hard: true,
    });
  }

  const rhythm = thresholds.dimension4.rhythm;
  if (vector.pitchChangeRate < rhythm.pitchChangeRateHzPerSecLt && vector.freqVariance < rhythm.freqVarianceHz2Lt) {
    return createDimensionMatch({
      dimension: "C/R",
      letter: "R",
      match: matchConfig.hardDimensionMatch,
      reason: "pitchChangeRate < 200 且 freqVariance < 500",
      hard: true,
    });
  }

  const boundary = thresholds.dimension4.boundary;
  if (vector.pitchChangeRate > boundary.pitchChangeMedianHzPerSec) {
    return createDimensionMatch({
      dimension: "C/R",
      letter: "C",
      match: matchConfig.boundaryDimensionMatch,
      reason: "边界分支：pitchChangeRate > 350",
      hard: false,
    });
  }

  return createDimensionMatch({
    dimension: "C/R",
    letter: "R",
    match: matchConfig.boundaryDimensionMatch,
    reason: "边界分支：pitchChangeRate <= 350",
    hard: false,
  });
}

