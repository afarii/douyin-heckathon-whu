import { FeatureVectorValidationError } from "./errors.js";
import { createFeatureVector } from "./models.js";

const MIN_FREQ_HZ = 20;
const LOW_FREQ_HZ = 2000;
const SILENCE_DB = 25;
const SILENCE_RMS = 0.01;
const DB_REF_RMS = 0.00002;

export function featureVectorFromWav(arrayBuffer) {
  const { samples, sampleRate } = parsePcmWav(arrayBuffer);
  const partial = featureVectorFromSamples(samples, sampleRate);
  return createFeatureVector(partial);
}

export function parsePcmWav(arrayBuffer) {
  const view = new DataView(arrayBuffer);

  const riff = _readAscii(view, 0, 4);
  const wave = _readAscii(view, 8, 4);
  if (riff !== "RIFF" || wave !== "WAVE") {
    throw new FeatureVectorValidationError("仅支持 RIFF/WAVE PCM WAV");
  }

  let offset = 12;
  let fmt = null;
  let dataOffset = null;
  let dataSize = null;

  while (offset + 8 <= view.byteLength) {
    const chunkId = _readAscii(view, offset, 4);
    const chunkSize = view.getUint32(offset + 4, true);
    const chunkDataStart = offset + 8;
    const chunkDataEnd = chunkDataStart + chunkSize;

    if (chunkId === "fmt ") {
      const audioFormat = view.getUint16(chunkDataStart + 0, true);
      const numChannels = view.getUint16(chunkDataStart + 2, true);
      const sampleRate = view.getUint32(chunkDataStart + 4, true);
      const bitsPerSample = view.getUint16(chunkDataStart + 14, true);
      fmt = { audioFormat, numChannels, sampleRate, bitsPerSample };
    } else if (chunkId === "data") {
      dataOffset = chunkDataStart;
      dataSize = chunkSize;
      break;
    }

    offset = chunkDataEnd + (chunkSize % 2);
  }

  if (!fmt || dataOffset === null || dataSize === null) {
    throw new FeatureVectorValidationError("WAV 缺少 fmt 或 data 区块");
  }
  if (fmt.audioFormat !== 1) {
    throw new FeatureVectorValidationError("仅支持 PCM 编码 WAV");
  }

  const bytesPerSample = fmt.bitsPerSample / 8;
  if (![1, 2, 4].includes(bytesPerSample)) {
    throw new FeatureVectorValidationError("仅支持 8/16/32-bit PCM WAV");
  }
  if (![1, 2].includes(fmt.numChannels)) {
    throw new FeatureVectorValidationError("仅支持单声道或双声道 WAV");
  }

  const frameBytes = bytesPerSample * fmt.numChannels;
  const frameCount = Math.floor(dataSize / frameBytes);
  if (frameCount <= 0) {
    throw new FeatureVectorValidationError("音频为空");
  }

  const samples = new Float32Array(frameCount);
  let readOffset = dataOffset;
  for (let i = 0; i < frameCount; i += 1) {
    let sum = 0;
    for (let ch = 0; ch < fmt.numChannels; ch += 1) {
      const sample = _readPcmSample(view, readOffset, bytesPerSample);
      sum += sample;
      readOffset += bytesPerSample;
    }
    samples[i] = sum / fmt.numChannels;
  }

  return { samples, sampleRate: fmt.sampleRate };
}

export function featureVectorFromSamples(samples, sampleRate) {
  if (!(samples instanceof Float32Array) || samples.length === 0) {
    throw new FeatureVectorValidationError("音频为空");
  }
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new FeatureVectorValidationError("采样率非法");
  }

  const duration = samples.length / sampleRate;
  if (duration <= 0) {
    throw new FeatureVectorValidationError("音频为空");
  }

  const frameSize = _closestPow2(Math.max(256, Math.min(4096, Math.floor(sampleRate * 0.025))));
  const hopSize = Math.max(1, Math.floor(frameSize / 2));
  const hopSeconds = hopSize / sampleRate;

  const frames = _frame(samples, frameSize, hopSize);
  if (frames.length === 0) {
    throw new FeatureVectorValidationError("音频太短，无法分析");
  }

  const rmsValues = [];
  const dbValues = [];
  for (const frame of frames) {
    const rms = _rms(frame);
    rmsValues.push(rms);
    dbValues.push(_toDb(rms));
  }

  const activeMask = dbValues.map((db, idx) => {
    const rms = rmsValues[idx];
    return !(rms < SILENCE_RMS || db < SILENCE_DB);
  });

  const activeCount = activeMask.reduce((acc, value) => acc + (value ? 1 : 0), 0);
  if (activeCount === 0) {
    throw new FeatureVectorValidationError("没有检测到有效片段");
  }

  const silenceRatio = 1 - activeCount / activeMask.length;
  const activeDuration = duration * (1 - silenceRatio);

  const activeRms = [];
  const activeDb = [];
  const dominantFreqSeries = [];
  const peakFreqSeries = [];
  const lowFreqRatioSeries = [];

  for (let i = 0; i < frames.length; i += 1) {
    if (!activeMask[i]) continue;
    const frame = frames[i];
    const rms = rmsValues[i];
    activeRms.push(rms);
    activeDb.push(dbValues[i]);

    const { dominantFreq, peakFreq, lowFreqRatio } = _freqStats(frame, sampleRate);
    dominantFreqSeries.push(dominantFreq);
    peakFreqSeries.push(peakFreq);
    lowFreqRatioSeries.push(lowFreqRatio);
  }

  const avgDB = _mean(activeDb);
  const peakDB = Math.max(...activeDb);
  const dominantFreq = _median(dominantFreqSeries);
  const peakFreq = Math.max(...peakFreqSeries);
  const lowFreqRatio = _mean(lowFreqRatioSeries);

  const pitchChangeRate = dominantFreqSeries.length < 2 ? 0 : _meanAbsDiff(dominantFreqSeries) / hopSeconds;
  const freqVariance = _variance(dominantFreqSeries);

  const lowFreqFrames = dominantFreqSeries.filter((f) => f > 0 && f < 1500).length;
  const lowFreqDuration =
    dominantFreqSeries.length > 0 ? activeDuration * (lowFreqFrames / dominantFreqSeries.length) : 0;

  const volumeVariance = _normalizedVariance(activeRms);
  const his = _computeHis({
    avgDB,
    dominantFreq,
    activeDuration,
    freqVariance,
  });

  return {
    avgDB,
    peakDB,
    dominantFreq,
    peakFreq,
    lowFreqRatio,
    lowFreqDuration,
    duration,
    activeDuration,
    silenceRatio,
    volumeVariance,
    pitchChangeRate,
    freqVariance,
    his,
  };
}

function _readAscii(view, offset, length) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += String.fromCharCode(view.getUint8(offset + i));
  }
  return out;
}

function _readPcmSample(view, offset, bytesPerSample) {
  if (bytesPerSample === 1) {
    return (view.getUint8(offset) - 128) / 128;
  }
  if (bytesPerSample === 2) {
    return view.getInt16(offset, true) / 32768;
  }
  return view.getInt32(offset, true) / 2147483648;
}

function _closestPow2(value) {
  let n = 1;
  while (n < value) n <<= 1;
  return n;
}

function _frame(samples, frameSize, hopSize) {
  const out = [];
  for (let start = 0; start + frameSize <= samples.length; start += hopSize) {
    out.push(samples.subarray(start, start + frameSize));
  }
  return out;
}

function _rms(frame) {
  let sum = 0;
  for (let i = 0; i < frame.length; i += 1) {
    sum += frame[i] * frame[i];
  }
  return Math.sqrt(sum / frame.length);
}

function _toDb(rms) {
  if (rms <= 0) return -100;
  return 20 * Math.log10(rms / DB_REF_RMS);
}

function _mean(values) {
  if (!values.length) return 0;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
}

function _median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

function _variance(values) {
  if (values.length < 2) return 0;
  const mean = _mean(values);
  let sum = 0;
  for (const v of values) {
    const d = v - mean;
    sum += d * d;
  }
  return sum / values.length;
}

function _normalizedVariance(values) {
  if (values.length < 2) return 0;
  const mean = _mean(values);
  const variance = _variance(values);
  const denom = mean * mean + 1e-9;
  const normalized = variance / denom;
  return Math.max(0, Math.min(1, normalized));
}

function _meanAbsDiff(values) {
  if (values.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < values.length; i += 1) {
    sum += Math.abs(values[i] - values[i - 1]);
  }
  return sum / (values.length - 1);
}

function _freqStats(frame, sampleRate) {
  const n = frame.length;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i += 1) {
    const window = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (n - 1));
    re[i] = frame[i] * window;
    im[i] = 0;
  }

  _fft(re, im);

  const half = Math.floor(n / 2);
  let maxMag = 0;
  let maxBin = 0;
  let totalEnergy = 0;
  let lowEnergy = 0;

  for (let bin = 1; bin < half; bin += 1) {
    const freq = (bin * sampleRate) / n;
    if (freq < MIN_FREQ_HZ) continue;
    const mag = re[bin] * re[bin] + im[bin] * im[bin];
    totalEnergy += mag;
    if (freq < LOW_FREQ_HZ) lowEnergy += mag;
    if (mag > maxMag) {
      maxMag = mag;
      maxBin = bin;
    }
  }

  const dominantFreq = (maxBin * sampleRate) / n;

  let peakBin = 0;
  const peakThreshold = maxMag * 0.3;
  for (let bin = half - 1; bin >= 1; bin -= 1) {
    const freq = (bin * sampleRate) / n;
    if (freq < MIN_FREQ_HZ) continue;
    const mag = re[bin] * re[bin] + im[bin] * im[bin];
    if (mag >= peakThreshold) {
      peakBin = bin;
      break;
    }
  }
  const peakFreq = (peakBin * sampleRate) / n;
  const lowFreqRatio = totalEnergy > 0 ? lowEnergy / totalEnergy : 0;

  return { dominantFreq, peakFreq, lowFreqRatio };
}

function _fft(re, im) {
  const n = re.length;
  let j = 0;
  for (let i = 1; i < n; i += 1) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }

  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wLenRe = Math.cos(ang);
    const wLenIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let wRe = 1;
      let wIm = 0;
      for (let k = 0; k < len / 2; k += 1) {
        const uRe = re[i + k];
        const uIm = im[i + k];
        const vRe = re[i + k + len / 2] * wRe - im[i + k + len / 2] * wIm;
        const vIm = re[i + k + len / 2] * wIm + im[i + k + len / 2] * wRe;
        re[i + k] = uRe + vRe;
        im[i + k] = uIm + vIm;
        re[i + k + len / 2] = uRe - vRe;
        im[i + k + len / 2] = uIm - vIm;
        const nextWRe = wRe * wLenRe - wIm * wLenIm;
        const nextWIm = wRe * wLenIm + wIm * wLenRe;
        wRe = nextWRe;
        wIm = nextWIm;
      }
    }
  }
}

function _clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function _computeHis({ avgDB, dominantFreq, activeDuration, freqVariance }) {
  const dbScore = _clamp(((avgDB - 20) / 80) * 10, 0, 10);
  const freqScore = _clamp(((dominantFreq - 1000) / 9000) * 10, 0, 10);
  const durationScore = _clamp(((activeDuration - 0.3) / 2.7) * 10, 0, 10);
  const chaosScore = _clamp((freqVariance / 3000) * 10, 0, 10);
  const his = 0.4 * dbScore + 0.25 * freqScore + 0.2 * durationScore + 0.15 * chaosScore;
  return Number(_clamp(his, 0, 10).toFixed(4));
}

