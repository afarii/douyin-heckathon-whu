export { DEFAULT_RANGES, DEFAULT_WEIGHTS } from "./config.js";
export { HIS_LEVEL_MAX, HIS_LEVEL_MIN, RadarDimension } from "./enums.js";
export { FeatureVectorValidationError, HachimiScoringError } from "./errors.js";
export { FEATURE_VECTOR_FIELDS, RADAR_DATA_FIELDS, FeatureVector, createFeatureVector } from "./feature_vector.js";
export {
  DEFAULT_AUDIO_FEATURE_OPTIONS,
  extractAudioFeaturesFromSamples,
  extractAudioFeaturesFromWav,
  parsePcmWav,
} from "./audio_features.js";
export {
  DEFAULT_HIS_INPUT,
  HIS_LEVEL_PROFILES,
  computeAudioHIS,
  computeHachimiHisScoring,
  computeQuantizedScores,
  hisLevelFromHisScore,
  hisProfileFromHisLevel,
  hisProfileFromHisScore,
  radarDataFromInputs,
} from "./his.js";
export {
  DEFAULT_SCORE_MAX,
  DEFAULT_SCORE_MIN,
  chaosScoreFromFreqVariance,
  clamp,
  dbScoreFromAvgDb,
  durationScoreFromActiveDuration,
  freqScoreFromDominantFreq,
} from "./quantize.js";

export { HACHIMI_TEMPLATES, getHachimiTemplateById } from "./templates.js";
export { TEMPLATE_COMPARE_DIMENSION_COPY, TEMPLATE_COMPARE_RATINGS, scoreAgainstTemplate } from "./template_compare.js";
export { PK_DIMENSIONS, PK_RESULT_COPY, scorePk } from "./pk.js";
export {
  CHALLENGE_CODE_COPY,
  CHALLENGE_CODE_TTL_SECONDS,
  challengeOutcome,
  decodeChallengeCode,
  generateChallengeCode,
  generateChallengePayload,
  verifyChallengeCode,
} from "./challenge_code.js";
