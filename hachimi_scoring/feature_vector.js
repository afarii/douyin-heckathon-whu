import { FeatureVectorValidationError } from "./errors.js";
import { HIS_LEVEL_MAX, HIS_LEVEL_MIN, RadarDimension } from "./enums.js";

export const RADAR_DATA_FIELDS = Object.freeze(Object.values(RadarDimension));

export const FEATURE_VECTOR_FIELDS = Object.freeze([
  "dominantFreq",
  "peakFreq",
  "avgFreq",
  "freqRange",
  "spectralCentroid",
  "lowFreqRatio",
  "avgDB",
  "peakDB",
  "minDB",
  "dbRange",
  "rmsEnergy",
  "duration",
  "activeDuration",
  "silenceRatio",
  "attackTime",
  "decayTime",
  "sustainLevel",
  "volumeVariance",
  "pitchChangeRate",
  "freqVariance",
  "dbScore",
  "freqScore",
  "durationScore",
  "chaosScore",
  "hisScore",
  "hisLevel",
  "personality",
  "personalityMatch",
  "radarData",
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

  const radarData = _createRadarData(input.radarData);

  const vector = Object.create(null);
  for (const field of FEATURE_VECTOR_FIELDS) {
    if (field === "radarData") {
      vector.radarData = radarData;
      continue;
    }

    if (field === "personality") {
      if (Object.prototype.hasOwnProperty.call(input, "personality") && typeof input.personality !== "string") {
        throw new FeatureVectorValidationError("personality 必须是字符串", { field: "personality" });
      }
      vector.personality = typeof input.personality === "string" ? input.personality : "";
      continue;
    }

    if (field === "hisLevel") {
      if (Object.prototype.hasOwnProperty.call(input, "hisLevel") && !Number.isInteger(input.hisLevel)) {
        throw new FeatureVectorValidationError("hisLevel 必须是整数", { field: "hisLevel" });
      }
      vector.hisLevel = Number.isInteger(input.hisLevel) ? input.hisLevel : 0;
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(input, field) && !Number.isFinite(input[field])) {
      throw new FeatureVectorValidationError(`${field} 必须是有限数值`, { field });
    }
    vector[field] = Number.isFinite(input[field]) ? input[field] : 0;
  }

  _validateFeatureVector(vector);
  return Object.freeze(vector);
}

export class FeatureVector {
  constructor(input = {}) {
    const vector = createFeatureVector(input);
    for (const field of FEATURE_VECTOR_FIELDS) {
      this[field] = vector[field];
    }
    Object.freeze(this);
  }
}

function _createRadarData(input) {
  if (input === undefined || input === null) {
    return Object.freeze(_defaultRadarData());
  }
  if (typeof input !== "object" || Array.isArray(input)) {
    throw new FeatureVectorValidationError("radarData 必须是对象", { field: "radarData" });
  }

  const keys = Object.keys(input);
  for (const key of keys) {
    if (!RADAR_DATA_FIELDS.includes(key)) {
      throw new FeatureVectorValidationError(`radarData 不允许字段：${key}`, { field: `radarData.${key}` });
    }
  }

  const radarData = Object.create(null);
  for (const field of RADAR_DATA_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(input, field) && !Number.isFinite(input[field])) {
      throw new FeatureVectorValidationError(`${field} 必须是有限数值`, { field: `radarData.${field}` });
    }
    radarData[field] = Number.isFinite(input[field]) ? input[field] : 0;
  }

  _validateRadarData(radarData);
  return Object.freeze(radarData);
}

function _defaultRadarData() {
  const radarData = Object.create(null);
  for (const field of RADAR_DATA_FIELDS) {
    radarData[field] = 0;
  }
  return radarData;
}

function _validateRadarData(radarData) {
  for (const field of RADAR_DATA_FIELDS) {
    const value = radarData[field];
    if (!Number.isFinite(value)) {
      throw new FeatureVectorValidationError(`${field} 必须是有限数值`, { field: `radarData.${field}` });
    }
    if (value < 0 || value > 10) {
      throw new FeatureVectorValidationError(`${field} 必须在 0-10 之间`, { field: `radarData.${field}` });
    }
  }
}

function _validateFeatureVector(vector) {
  const numberFields = FEATURE_VECTOR_FIELDS.filter(
    (field) => field !== "radarData" && field !== "personality" && field !== "hisLevel",
  );
  for (const field of numberFields) {
    const value = vector[field];
    if (!Number.isFinite(value)) {
      throw new FeatureVectorValidationError(`${field} 必须是有限数值`, { field });
    }
  }

  if (!Number.isInteger(vector.hisLevel)) {
    throw new FeatureVectorValidationError("hisLevel 必须是整数", { field: "hisLevel" });
  }
  if (vector.hisLevel !== 0 && (vector.hisLevel < HIS_LEVEL_MIN || vector.hisLevel > HIS_LEVEL_MAX)) {
    throw new FeatureVectorValidationError(`hisLevel 必须在 ${HIS_LEVEL_MIN}-${HIS_LEVEL_MAX} 之间`, {
      field: "hisLevel",
    });
  }

  if (typeof vector.personality !== "string") {
    throw new FeatureVectorValidationError("personality 必须是字符串", { field: "personality" });
  }
  if (vector.personality !== "" && !/^[A-Z]{4}$/.test(vector.personality)) {
    throw new FeatureVectorValidationError("personality 必须是 4 位大写字母", { field: "personality" });
  }

  const ratioFields = ["lowFreqRatio", "rmsEnergy", "silenceRatio", "volumeVariance", "personalityMatch"];
  for (const field of ratioFields) {
    const value = vector[field];
    if (value < 0 || value > 1) {
      throw new FeatureVectorValidationError(`${field} 必须在 0-1 之间`, { field });
    }
  }

  const scoreFields = ["dbScore", "freqScore", "durationScore", "chaosScore", "hisScore"];
  for (const field of scoreFields) {
    const value = vector[field];
    if (value < 0 || value > 10) {
      throw new FeatureVectorValidationError(`${field} 必须在 0-10 之间`, { field });
    }
  }

  const nonNegativeFields = [
    "dominantFreq",
    "peakFreq",
    "avgFreq",
    "freqRange",
    "spectralCentroid",
    "avgDB",
    "peakDB",
    "minDB",
    "dbRange",
    "duration",
    "activeDuration",
    "attackTime",
    "decayTime",
    "sustainLevel",
    "pitchChangeRate",
    "freqVariance",
  ];
  for (const field of nonNegativeFields) {
    if (vector[field] < 0) {
      throw new FeatureVectorValidationError(`${field} 不能为负`, { field });
    }
  }

  if (vector.activeDuration > vector.duration) {
    throw new FeatureVectorValidationError("activeDuration 不能大于 duration", { field: "activeDuration" });
  }

  _validateRadarData(vector.radarData);
}
