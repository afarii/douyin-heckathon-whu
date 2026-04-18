import { FeatureVectorValidationError } from "./errors.js";

export const DEFAULT_AUDIO_FEATURE_OPTIONS = Object.freeze({
  targetSampleRate: 44100,
  fftSize: 4096,
  smoothingTimeConstant: 0.3,
  minDecibels: -90,
  maxDecibels: -10,
  silenceRmsThreshold: 0.01,
  silenceDbThreshold: 25,
  minFreqHz: 20,
  maxFreqHz: 20000,
  lowFreqHz: 2000,
  peakRelativeThreshold: 0.3,
  meaningfulRelativeThreshold: 0.05,
  minActiveRunFrames: 3,
});

export function extractAudioFeaturesFromWav(arrayBuffer, options = {}) {
  const { samples, sampleRate } = parsePcmWav(arrayBuffer);
  return extractAudioFeaturesFromSamples(samples, sampleRate, options);
}

export function parsePcmWav(arrayBuffer) {
  if (!(arrayBuffer instanceof ArrayBuffer)) {
    throw new FeatureVectorValidationError("WAV 必须是 ArrayBuffer");
  }

  const view = new DataView(arrayBuffer);
  if (view.byteLength < 44) {
    throw new FeatureVectorValidationError("WAV 数据不完整");
  }

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

    if (chunkDataEnd > view.byteLength) break;

    if (chunkId === "fmt ") {
      if (chunkSize < 16) {
        throw new FeatureVectorValidationError("WAV fmt 区块不完整");
      }
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
  if (!Number.isFinite(fmt.sampleRate) || fmt.sampleRate <= 0) {
    throw new FeatureVectorValidationError("采样率非法");
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

export function extractAudioFeaturesFromSamples(inputSamples, inputSampleRate, options = {}) {
  const opt = { ...DEFAULT_AUDIO_FEATURE_OPTIONS, ...options };

  if (!(inputSamples instanceof Float32Array) || inputSamples.length === 0) {
    throw new FeatureVectorValidationError("音频为空");
  }
  if (!Number.isFinite(inputSampleRate) || inputSampleRate <= 0) {
    throw new FeatureVectorValidationError("采样率非法");
  }

  if (!Number.isFinite(opt.targetSampleRate) || opt.targetSampleRate <= 0) {
    throw new FeatureVectorValidationError("targetSampleRate 非法", { field: "targetSampleRate" });
  }
  if (!Number.isInteger(opt.fftSize) || opt.fftSize <= 0 || (opt.fftSize & (opt.fftSize - 1)) !== 0) {
    throw new FeatureVectorValidationError("fftSize 必须是 2 的幂", { field: "fftSize" });
  }

  const samples = inputSampleRate === opt.targetSampleRate ? inputSamples : _resampleLinear(inputSamples, inputSampleRate, opt.targetSampleRate);
  const sampleRate = opt.targetSampleRate;
  const duration = samples.length / sampleRate;
  if (!(duration > 0)) {
    throw new FeatureVectorValidationError("音频为空");
  }

  const fftSize = opt.fftSize;
  const hopSize = Math.max(1, Math.floor(fftSize / 2));
  const hopSeconds = hopSize / sampleRate;

  const frameCount = _frameCount(samples.length, fftSize, hopSize);
  if (frameCount <= 0) {
    throw new FeatureVectorValidationError("音频太短，无法分析");
  }

  const window = _hannWindow(fftSize);
  const rmsValues = new Float64Array(frameCount);
  const dbValues = new Float64Array(frameCount);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const start = frameIndex * hopSize;
    let sumSquares = 0;
    for (let i = 0; i < fftSize; i += 1) {
      const idx = start + i;
      const v = idx < samples.length ? samples[idx] : 0;
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / fftSize);
    rmsValues[frameIndex] = rms;
    dbValues[frameIndex] = _scaledDbFromRms(rms, opt.minDecibels, opt.maxDecibels);
  }

  const activeMask = new Array(frameCount);
  for (let i = 0; i < frameCount; i += 1) {
    const rms = rmsValues[i];
    const db = dbValues[i];
    activeMask[i] = !(rms < opt.silenceRmsThreshold || db < opt.silenceDbThreshold);
  }

  const activeRange = _findActiveRange(activeMask, opt.minActiveRunFrames);
  if (!activeRange) {
    throw new FeatureVectorValidationError("没有检测到有效片段");
  }

  const { startFrame, endFrame } = activeRange;
  const activeStartSample = startFrame * hopSize;
  const activeEndSample = Math.min(samples.length, endFrame * hopSize + fftSize);
  const activeDuration = Math.max(0, (activeEndSample - activeStartSample) / sampleRate);
  const silenceRatio = _clamp(1 - activeDuration / duration, 0, 1);

  let peakFrame = startFrame;
  let peakDb = -Infinity;

  const activeDb = [];
  const activeRms = [];

  for (let i = startFrame; i <= endFrame; i += 1) {
    if (!activeMask[i]) continue;
    const db = dbValues[i];
    const rms = rmsValues[i];
    activeDb.push(db);
    activeRms.push(rms);
    if (db > peakDb) {
      peakDb = db;
      peakFrame = i;
    }
  }

  if (activeDb.length === 0) {
    throw new FeatureVectorValidationError("没有检测到有效片段");
  }

  const avgDB = _mean(activeDb);
  const minDB = Math.max(0, Math.min(...activeDb));
  const dbRange = Math.max(0, peakDb - minDB);

  const rmsEnergy = _clamp(_rms(samples.subarray(activeStartSample, activeEndSample)), 0, 1);
  const volumeVariance = _normalizedVariance(activeRms);

  const half = Math.floor(fftSize / 2);
  const prevSmoothed = new Float64Array(half);
  const sumSmoothed = new Float64Array(half);

  const re = new Float64Array(fftSize);
  const im = new Float64Array(fftSize);

  const dominantFreqSeries = [];
  let activeFrameCount = 0;

  for (let frameIndex = startFrame; frameIndex <= endFrame; frameIndex += 1) {
    if (!activeMask[frameIndex]) continue;
    const start = frameIndex * hopSize;
    for (let i = 0; i < fftSize; i += 1) {
      const idx = start + i;
      const v = idx < samples.length ? samples[idx] : 0;
      re[i] = v * window[i];
      im[i] = 0;
    }

    _fftRadix2(re, im);

    let frameMax = 0;
    let frameMaxBin = 1;
    for (let bin = 1; bin < half; bin += 1) {
      const freq = (bin * sampleRate) / fftSize;
      if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
      const energy = re[bin] * re[bin] + im[bin] * im[bin];
      const smoothed = opt.smoothingTimeConstant * prevSmoothed[bin] + (1 - opt.smoothingTimeConstant) * energy;
      prevSmoothed[bin] = smoothed;
      sumSmoothed[bin] += smoothed;
      if (smoothed > frameMax) {
        frameMax = smoothed;
        frameMaxBin = bin;
      }
    }

    dominantFreqSeries.push((frameMaxBin * sampleRate) / fftSize);
    activeFrameCount += 1;
  }

  if (activeFrameCount === 0) {
    throw new FeatureVectorValidationError("没有检测到有效片段");
  }

  const avgEnergy = new Float64Array(half);
  for (let bin = 0; bin < half; bin += 1) {
    avgEnergy[bin] = sumSmoothed[bin] / activeFrameCount;
  }

  const freqStats = _freqStatsFromAverageSpectrum(avgEnergy, sampleRate, fftSize, opt);

  const pitchChangeRate = dominantFreqSeries.length < 2 ? 0 : _meanAbsDiff(dominantFreqSeries) / hopSeconds;
  const freqVariance = _variance(dominantFreqSeries);

  const activeStartTime = activeStartSample / sampleRate;
  const activeEndTime = activeEndSample / sampleRate;
  const peakTime = (peakFrame * hopSize) / sampleRate;
  const attackTime = _clamp(peakTime - activeStartTime, 0, duration);
  const decayTime = _clamp(activeEndTime - peakTime, 0, duration);

  const sustainLevel = _sustainLevel(dbValues, activeMask, startFrame, endFrame, opt);

  return {
    dominantFreq: freqStats.dominantFreq,
    peakFreq: freqStats.peakFreq,
    avgFreq: freqStats.avgFreq,
    freqRange: freqStats.freqRange,
    spectralCentroid: freqStats.spectralCentroid,
    lowFreqRatio: freqStats.lowFreqRatio,
    avgDB,
    peakDB: Math.max(0, peakDb),
    minDB,
    dbRange,
    rmsEnergy,
    duration,
    activeDuration,
    silenceRatio,
    attackTime,
    decayTime,
    sustainLevel,
    volumeVariance,
    pitchChangeRate,
    freqVariance,
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

function _resampleLinear(samples, fromRate, toRate) {
  const outLength = Math.max(1, Math.round((samples.length * toRate) / fromRate));
  const out = new Float32Array(outLength);
  const ratio = fromRate / toRate;
  for (let i = 0; i < outLength; i += 1) {
    const pos = i * ratio;
    const idx = Math.floor(pos);
    const frac = pos - idx;
    const a = idx < samples.length ? samples[idx] : 0;
    const b = idx + 1 < samples.length ? samples[idx + 1] : a;
    out[i] = a + (b - a) * frac;
  }
  return out;
}

function _frameCount(sampleCount, frameSize, hopSize) {
  if (sampleCount <= 0) return 0;
  if (sampleCount <= frameSize) return 1;
  return Math.floor((sampleCount - frameSize) / hopSize) + 1;
}

function _hannWindow(n) {
  const window = new Float64Array(n);
  const denom = Math.max(1, n - 1);
  for (let i = 0; i < n; i += 1) {
    window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / denom);
  }
  return window;
}

function _rms(samples) {
  if (samples.length === 0) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const v = samples[i];
    sum += v * v;
  }
  return Math.sqrt(sum / samples.length);
}

function _mean(values) {
  if (!values.length) return 0;
  let sum = 0;
  for (const v of values) sum += v;
  return sum / values.length;
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
  const denom = mean * mean + 1e-12;
  return _clamp(variance / denom, 0, 1);
}

function _meanAbsDiff(values) {
  if (values.length < 2) return 0;
  let sum = 0;
  for (let i = 1; i < values.length; i += 1) {
    sum += Math.abs(values[i] - values[i - 1]);
  }
  return sum / (values.length - 1);
}

function _clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function _scaledDbFromRms(rms, minDecibels, maxDecibels) {
  const safeRms = rms <= 0 ? 1e-12 : rms;
  const dbfs = 20 * Math.log10(safeRms);
  const clamped = _clamp(dbfs, minDecibels, maxDecibels);
  const denom = maxDecibels - minDecibels;
  if (!(denom > 0)) return 0;
  return _clamp(((clamped - minDecibels) / denom) * 100, 0, 100);
}

function _findActiveRange(activeMask, minRun) {
  const run = Math.max(1, Math.floor(minRun));
  let startFrame = null;

  let streak = 0;
  for (let i = 0; i < activeMask.length; i += 1) {
    if (activeMask[i]) {
      streak += 1;
      if (streak >= run) {
        startFrame = i - run + 1;
        break;
      }
    } else {
      streak = 0;
    }
  }

  if (startFrame === null) return null;

  let endFrame = null;
  streak = 0;
  for (let i = activeMask.length - 1; i >= 0; i -= 1) {
    if (activeMask[i]) {
      streak += 1;
      if (streak >= run) {
        endFrame = i + run - 1;
        break;
      }
    } else {
      streak = 0;
    }
  }

  endFrame = endFrame === null ? activeMask.length - 1 : Math.min(activeMask.length - 1, endFrame);
  if (endFrame < startFrame) return null;
  return { startFrame, endFrame };
}

function _freqStatsFromAverageSpectrum(avgEnergy, sampleRate, fftSize, opt) {
  const half = avgEnergy.length;

  let maxEnergy = 0;
  let maxBin = 1;
  for (let bin = 1; bin < half; bin += 1) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
    const e = avgEnergy[bin];
    if (e > maxEnergy) {
      maxEnergy = e;
      maxBin = bin;
    }
  }

  const dominantFreq = (maxBin * sampleRate) / fftSize;

  let totalEnergy = 0;
  let lowEnergy = 0;
  for (let bin = 1; bin < half; bin += 1) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
    const e = avgEnergy[bin];
    totalEnergy += e;
    if (freq < opt.lowFreqHz) lowEnergy += e;
  }
  const lowFreqRatio = totalEnergy > 0 ? _clamp(lowEnergy / totalEnergy, 0, 1) : 0;

  const meaningfulThreshold = maxEnergy * opt.meaningfulRelativeThreshold;
  let minMeaningfulBin = null;
  let maxMeaningfulBin = null;
  for (let bin = 1; bin < half; bin += 1) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
    if (avgEnergy[bin] >= meaningfulThreshold) {
      minMeaningfulBin = bin;
      break;
    }
  }
  for (let bin = half - 1; bin >= 1; bin -= 1) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
    if (avgEnergy[bin] >= meaningfulThreshold) {
      maxMeaningfulBin = bin;
      break;
    }
  }

  const freqRange =
    minMeaningfulBin === null || maxMeaningfulBin === null ? 0 : Math.max(0, ((maxMeaningfulBin - minMeaningfulBin) * sampleRate) / fftSize);

  let centroidNumer = 0;
  let centroidDenom = 0;
  let avgNumer = 0;
  let avgDenom = 0;
  if (minMeaningfulBin !== null && maxMeaningfulBin !== null) {
    for (let bin = minMeaningfulBin; bin <= maxMeaningfulBin; bin += 1) {
      const freq = (bin * sampleRate) / fftSize;
      if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
      const e = avgEnergy[bin];
      const mag = Math.sqrt(Math.max(0, e));
      centroidNumer += freq * e;
      centroidDenom += e;
      avgNumer += freq * mag;
      avgDenom += mag;
    }
  }

  const spectralCentroid = centroidDenom > 0 ? centroidNumer / centroidDenom : 0;
  const avgFreq = avgDenom > 0 ? avgNumer / avgDenom : 0;

  let peakBin = 0;
  const peakThreshold = maxEnergy * opt.peakRelativeThreshold;
  for (let bin = half - 2; bin >= 2; bin -= 1) {
    const freq = (bin * sampleRate) / fftSize;
    if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
    const e = avgEnergy[bin];
    if (e < peakThreshold) continue;
    if (e >= avgEnergy[bin - 1] && e >= avgEnergy[bin + 1]) {
      peakBin = bin;
      break;
    }
  }
  if (peakBin === 0) {
    for (let bin = half - 1; bin >= 1; bin -= 1) {
      const freq = (bin * sampleRate) / fftSize;
      if (freq < opt.minFreqHz || freq > opt.maxFreqHz) continue;
      if (avgEnergy[bin] >= peakThreshold) {
        peakBin = bin;
        break;
      }
    }
  }

  const peakFreq = peakBin > 0 ? (peakBin * sampleRate) / fftSize : 0;

  return {
    dominantFreq: Math.max(0, dominantFreq),
    peakFreq: Math.max(0, peakFreq),
    avgFreq: Math.max(0, avgFreq),
    freqRange: Math.max(0, freqRange),
    spectralCentroid: Math.max(0, spectralCentroid),
    lowFreqRatio,
  };
}

function _sustainLevel(dbValues, activeMask, startFrame, endFrame, opt) {
  const frameCount = endFrame - startFrame + 1;
  const start = startFrame + Math.floor(frameCount * 0.3);
  const end = startFrame + Math.floor(frameCount * 0.7);

  const values = [];
  for (let i = start; i <= end && i <= endFrame; i += 1) {
    if (!activeMask[i]) continue;
    values.push(dbValues[i]);
  }

  if (values.length) return Math.max(0, _mean(values));

  const fallback = [];
  for (let i = startFrame; i <= endFrame; i += 1) {
    if (!activeMask[i]) continue;
    fallback.push(dbValues[i]);
  }
  if (!fallback.length) return 0;
  return Math.max(0, _mean(fallback));
}

function _fftRadix2(re, im) {
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

