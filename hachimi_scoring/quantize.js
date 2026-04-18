export const DEFAULT_SCORE_MIN = 0;
export const DEFAULT_SCORE_MAX = 10;

export function clamp(value, min = DEFAULT_SCORE_MIN, max = DEFAULT_SCORE_MAX) {
  const safeMin = Number.isFinite(min) ? min : DEFAULT_SCORE_MIN;
  const safeMax = Number.isFinite(max) ? max : DEFAULT_SCORE_MAX;
  const safeValue = Number.isFinite(value) ? value : safeMin;
  return Math.max(safeMin, Math.min(safeMax, safeValue));
}

export function freqScoreFromDominantFreq(dominantFreq, { scoreMin = DEFAULT_SCORE_MIN, scoreMax = DEFAULT_SCORE_MAX } = {}) {
  const f = Number.isFinite(dominantFreq) ? dominantFreq : 0;
  return clamp(((f - 1000) / 9000) * 10, scoreMin, scoreMax);
}

export function dbScoreFromAvgDb(avgDB, { scoreMin = DEFAULT_SCORE_MIN, scoreMax = DEFAULT_SCORE_MAX } = {}) {
  const db = Number.isFinite(avgDB) ? avgDB : 0;
  return clamp(((db - 20) / 80) * 10, scoreMin, scoreMax);
}

export function durationScoreFromActiveDuration(activeDuration, { scoreMin = DEFAULT_SCORE_MIN, scoreMax = DEFAULT_SCORE_MAX } = {}) {
  const dur = Number.isFinite(activeDuration) ? activeDuration : 0;
  return clamp(((dur - 0.3) / 2.7) * 10, scoreMin, scoreMax);
}

export function chaosScoreFromFreqVariance(freqVariance, { scoreMin = DEFAULT_SCORE_MIN, scoreMax = DEFAULT_SCORE_MAX } = {}) {
  const variance = Number.isFinite(freqVariance) ? freqVariance : 0;
  return clamp((variance / 3000) * 10, scoreMin, scoreMax);
}

