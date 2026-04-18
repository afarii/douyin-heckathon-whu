import test from "node:test";
import assert from "node:assert/strict";

import { createFeatureVector, extractAudioFeaturesFromWav } from "../hachimi_scoring/index.js";

test("hachimi_scoring audio features: tone dominantFreq approximates tone frequency", () => {
  const sampleRate = 44100;
  const seconds = 1;
  const frequency = 440;
  const amplitude = 0.1;
  const samples = new Float32Array(sampleRate * seconds);
  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * amplitude;
  }

  const wav = encodeWavMono16(samples, sampleRate);
  const features = extractAudioFeaturesFromWav(wav);
  createFeatureVector(features);

  assert.ok(features.duration > 0.9 && features.duration < 1.1);
  assert.ok(features.activeDuration > 0.8 && features.activeDuration <= features.duration);
  assert.ok(features.dominantFreq > 380 && features.dominantFreq < 520);
  assert.ok(features.lowFreqRatio > 0.8);
  assert.ok(features.pitchChangeRate < 30);
  assert.ok(features.freqVariance < 2000);
  assert.ok(features.avgDB > 50 && features.avgDB <= 100);
});

test("hachimi_scoring audio features: trims leading/trailing silence", () => {
  const sampleRate = 44100;
  const totalSeconds = 1;
  const toneSeconds = 0.6;
  const toneStart = 0.2;
  const frequency = 440;
  const amplitude = 0.08;

  const samples = new Float32Array(sampleRate * totalSeconds);
  const startSample = Math.floor(sampleRate * toneStart);
  const toneSamples = Math.floor(sampleRate * toneSeconds);
  for (let i = 0; i < toneSamples; i += 1) {
    const idx = startSample + i;
    samples[idx] = Math.sin((2 * Math.PI * frequency * idx) / sampleRate) * amplitude;
  }

  const wav = encodeWavMono16(samples, sampleRate);
  const features = extractAudioFeaturesFromWav(wav);
  createFeatureVector(features);

  assert.ok(features.duration > 0.9 && features.duration < 1.1);
  assert.ok(features.activeDuration < features.duration);
  assert.ok(features.silenceRatio > 0.1 && features.silenceRatio < 0.9);
  assert.ok(features.attackTime >= 0);
  assert.ok(features.decayTime >= 0);
  assert.ok(features.sustainLevel >= 0);
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

