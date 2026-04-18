import { FeatureVectorValidationError } from "./errors.js";

export const FEATURE_VECTOR_FIELDS = Object.freeze([
  "avgDB",
  "peakDB",
  "dominantFreq",
  "peakFreq",
  "lowFreqRatio",
  "lowFreqDuration",
  "duration",
  "activeDuration",
  "silenceRatio",
  "volumeVariance",
  "pitchChangeRate",
  "freqVariance",
  "his",
]);

export function createFeatureVector(input = {}) {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new FeatureVectorValidationError("FeatureVector 必须是对象");
  }

  const keys = Object.keys(input);
  for (const key of keys) {
    if (!FEATURE_VECTOR_FIELDS.includes(key)) {
      throw new FeatureVectorValidationError(`FeatureVector 不允许字段：${key}`, { field: key });
    }
  }

  const vector = Object.create(null);
  for (const field of FEATURE_VECTOR_FIELDS) {
    vector[field] = Number.isFinite(input[field]) ? input[field] : 0;
  }

  _validateFeatureVector(vector);
  return vector;
}

function _validateFeatureVector(vector) {
  for (const field of FEATURE_VECTOR_FIELDS) {
    const value = vector[field];
    if (!Number.isFinite(value)) {
      throw new FeatureVectorValidationError(`${field} 必须是有限数值`, { field });
    }
  }

  const nonNegativeFields = [
    "peakDB",
    "dominantFreq",
    "peakFreq",
    "lowFreqDuration",
    "duration",
    "activeDuration",
    "pitchChangeRate",
    "freqVariance",
    "his",
  ];
  for (const field of nonNegativeFields) {
    if (vector[field] < 0) {
      throw new FeatureVectorValidationError(`${field} 不能为负`, { field });
    }
  }

  const ratioFields = ["lowFreqRatio", "silenceRatio", "volumeVariance"];
  for (const field of ratioFields) {
    if (vector[field] < 0 || vector[field] > 1) {
      throw new FeatureVectorValidationError(`${field} 必须在 0-1 之间`, { field });
    }
  }

  if (vector.activeDuration > vector.duration) {
    throw new FeatureVectorValidationError("activeDuration 不能大于 duration", { field: "activeDuration" });
  }

  if (vector.his > 10) {
    throw new FeatureVectorValidationError("his 不能大于 10", { field: "his" });
  }
}

export function createDimensionMatch({ dimension, letter, match, reason, hard }) {
  return Object.freeze({
    dimension,
    letter,
    match,
    reason,
    hard,
  });
}

export function createPersonalityAnalysis({
  personality,
  personalityMatch,
  dimensionMatches,
  personalityProfile,
}) {
  return Object.freeze({
    personality,
    personalityMatch,
    dimensionMatches: Object.freeze([...dimensionMatches]),
    personalityProfile,
  });
}

