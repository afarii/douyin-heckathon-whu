import { analyzePersonality, featureVectorFromWav } from "./hajimi_ti/index.js";
import { computeHachimiHisScoring, createFeatureVector, extractAudioFeaturesFromWav } from "./hachimi_scoring/browser.js";
import { UI_COPY, renderCopy } from "./ui_copy/index.js";

const recordButton = document.querySelector("#recordButton");
const resetButton = document.querySelector("#resetButton");
const checkButton = document.querySelector("#checkButton");
const fileInput = document.querySelector("#fileInput");
const audioPreview = document.querySelector("#audioPreview");
const statusText = document.querySelector("#statusText");
const timerText = document.querySelector("#timerText");
const meter = document.querySelector(".meter");
const scoreRing = document.querySelector("#scoreRing");
const scoreText = document.querySelector("#scoreText");
const gradeText = document.querySelector("#gradeText");
const commentText = document.querySelector("#commentText");
const modeText = document.querySelector("#modeText");
const stagePage = document.querySelector(".stage");
const settlementPage = document.querySelector("#settlementPage");
const settlementBadge = document.querySelector("#settlementBadge");
const settlementLead = document.querySelector("#settlementLead");
const finalScore = document.querySelector("#finalScore");
const finalGrade = document.querySelector("#finalGrade");
const finalComment = document.querySelector("#finalComment");
const shareText = document.querySelector("#shareText");
const reasonList = document.querySelector("#reasonList");
const shareButton = document.querySelector("#shareButton");
const againButton = document.querySelector("#againButton");

let mediaRecorder;
let stream;
let chunks = [];
let audioBlob;
let audioFileName = "hachimi-recording.webm";
let startedAt = 0;
let timerId;
const MAX_RECORD_SECONDS = 5;
let lastPointerDownAt = 0;

const COPY_GLOBAL = UI_COPY["一、全局文案"];
const COPY_RECORD = UI_COPY["三、录制页面"];
const COPY_LOADING = UI_COPY["四、分析加载页"];
const COPY_RESULT = UI_COPY["五、结果页面"];
const COPY_SHARE = UI_COPY["九、分享功能文案"];
const COPY_AUDIO_ERRORS = UI_COPY["十一、错误与异常文案"]["11.2 音频错误"];

const ringLength = 326.73;
const sampleAudioPath = "./基米素材/haqi.mp3";

const localComments = [
  "这不是普通音频，这是正在向猫猫频道发射的哈基米电波。",
  "味儿对了，节奏也在路上，建议立刻奖励自己一口蜂蜜水。",
  "听感已经开始摇摆，哈基米指数正在悄悄上桌。",
  "有点抽象，有点可爱，还有一点不讲道理的上头。"
];

let latestShareCopy = "";

const recordingSupport = getRecordingSupport();
if (!recordingSupport.ok) {
  recordButton.disabled = true;
  setStatus(recordingSupport.statusText);
  commentText.textContent = recordingSupport.detailText;
}

function setStatus(text) {
  statusText.textContent = text;
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function startTimer() {
  startedAt = Date.now();
  timerText.textContent = "00:00";
  timerId = window.setInterval(() => {
    const elapsed = Date.now() - startedAt;
    timerText.textContent = formatTime(elapsed);
    const remainingSeconds = Math.max(0, MAX_RECORD_SECONDS - Math.floor(elapsed / 1000));
    setStatus(renderCopy(COPY_RECORD["3.2 录制中状态"].实时提示, { 剩余秒数: remainingSeconds }));
    if (elapsed >= MAX_RECORD_SECONDS * 1000) {
      stopRecording();
    }
  }, 250);
}

function stopTimer() {
  window.clearInterval(timerId);
}

function setAudio(blob, fileName) {
  audioBlob = blob;
  audioFileName = fileName;
  audioPreview.src = URL.createObjectURL(blob);
  audioPreview.hidden = false;
  checkButton.disabled = false;
  resetButton.disabled = false;
}

function resetAudio() {
  chunks = [];
  audioBlob = null;
  fileInput.value = "";
  audioPreview.removeAttribute("src");
  audioPreview.hidden = true;
  audioPreview.load();
  checkButton.disabled = true;
  resetButton.disabled = true;
  recordButton.textContent = COPY_RECORD["3.2 录制前状态"].按钮文案.主按钮;
  timerText.textContent = "00:00";
  meter.classList.remove("recording");
  setStatus(COPY_RECORD["3.2 录制前状态"].提示文案.split("\n")[0] || "准备好了吗？");
  setScore(null);
  gradeText.textContent = COPY_RESULT["5.2 HIS评分展示区"].评分标题;
  commentText.textContent = COPY_RECORD["3.3 录制后状态"].自动跳转提示;
  showEntryPage();
}

async function startRecording() {
  if (!recordingSupport.ok) {
    setStatus(recordingSupport.statusText);
    commentText.textContent = recordingSupport.detailText;
    return;
  }
  let pendingUserMediaPromise;
  let timeoutId;
  try {
    pendingUserMediaPromise = navigator.mediaDevices.getUserMedia({ audio: true });
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = window.setTimeout(() => {
        const err = new Error("getUserMedia timeout");
        err.name = "TimeoutError";
        reject(err);
      }, 10000);
    });
    stream = await Promise.race([pendingUserMediaPromise, timeoutPromise]);
    window.clearTimeout(timeoutId);
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", () => {
      const type = mediaRecorder.mimeType || "audio/webm";
      setAudio(new Blob(chunks, { type }), "hachimi-recording.webm");
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
      meter.classList.remove("recording");
      setStatus(COPY_RECORD["3.3 录制后状态"].自动跳转提示);
    });

    mediaRecorder.start();
    recordButton.textContent = COPY_RECORD["3.2 录制中状态"].停止按钮;
    setStatus(renderCopy(COPY_RECORD["3.2 录制中状态"].实时提示, { 剩余秒数: MAX_RECORD_SECONDS }));
    meter.classList.add("recording");
    startTimer();
  } catch (error) {
    window.clearTimeout(timeoutId);
    if (error && typeof error === "object" && error.name === "TimeoutError") {
      pendingUserMediaPromise?.then((lateStream) => {
        lateStream.getTracks().forEach((track) => track.stop());
      }).catch(() => {});
    }
    const { statusText, detailText } = mapRecordingError(error);
    setStatus(statusText);
    commentText.textContent = detailText;
  }
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state !== "recording") {
    return;
  }

  mediaRecorder.stop();
  stopTimer();
  recordButton.textContent = COPY_RECORD["3.2 录制前状态"].按钮文案.主按钮;
}

recordButton.addEventListener("pointerdown", (event) => {
  lastPointerDownAt = Date.now();
  if (recordButton.disabled) return;
  if (mediaRecorder?.state === "recording") return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  startRecording();
});

recordButton.addEventListener("pointerup", () => {
  stopRecording();
});

recordButton.addEventListener("pointercancel", () => {
  stopRecording();
});

recordButton.addEventListener("click", () => {
  if (Date.now() - lastPointerDownAt < 400) {
    return;
  }
  if (mediaRecorder?.state === "recording") {
    stopRecording();
    return;
  }

  startRecording();
});

resetButton.addEventListener("click", resetAudio);

fileInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  if (!file.type.startsWith("audio/")) {
    setStatus(COPY_AUDIO_ERRORS.音频分析失败);
    commentText.textContent = COPY_AUDIO_ERRORS.音频分析失败;
    return;
  }

  stopRecording();
  setAudio(file, file.name);
  setStatus(COPY_RECORD["3.3 录制后状态"].自动跳转提示);
  timerText.textContent = "已选择";
});

function getRecordingSupport() {
  if (!window.isSecureContext) {
    return {
      ok: false,
      statusText: COPY_RECORD["3.4 录制错误提示"].HTTPS要求,
      detailText: COPY_RECORD["3.4 录制错误提示"].HTTPS要求,
    };
  }
  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
    return {
      ok: false,
      statusText: COPY_GLOBAL["1.3 全局提示语"].浏览器不支持,
      detailText: COPY_GLOBAL["1.3 全局提示语"].浏览器不支持,
    };
  }
  if (typeof MediaRecorder === "undefined") {
    return {
      ok: false,
      statusText: COPY_GLOBAL["1.3 全局提示语"].浏览器不支持,
      detailText: COPY_GLOBAL["1.3 全局提示语"].Safari特别提示,
    };
  }
  return { ok: true, statusText: "", detailText: "" };
}

function mapRecordingError(error) {
  const name = error && typeof error === "object" ? error.name : "";
  if (name === "TimeoutError") {
    return {
      statusText: COPY_GLOBAL["1.3 全局提示语"].浏览器不支持,
      detailText: COPY_GLOBAL["1.3 全局提示语"].浏览器不支持,
    };
  }
  if (!window.isSecureContext || name === "SecurityError") {
    return {
      statusText: COPY_RECORD["3.4 录制错误提示"].HTTPS要求,
      detailText: COPY_RECORD["3.4 录制错误提示"].HTTPS要求,
    };
  }
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return {
      statusText: COPY_RECORD["3.4 录制错误提示"].麦克风权限被拒绝,
      detailText: COPY_RECORD["3.4 录制错误提示"].麦克风权限被拒绝,
    };
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return {
      statusText: COPY_RECORD["3.4 录制错误提示"].麦克风不可用,
      detailText: COPY_RECORD["3.4 录制错误提示"].麦克风不可用,
    };
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return {
      statusText: COPY_AUDIO_ERRORS.音频中断,
      detailText: COPY_AUDIO_ERRORS.音频中断,
    };
  }
  return {
    statusText: COPY_AUDIO_ERRORS.音频分析失败,
    detailText: COPY_AUDIO_ERRORS.音频分析失败,
  };
}

function getLocalResult() {
  const fileFactor = Math.min((audioBlob?.size || 1) / 24000, 1);
  const entropy = Math.abs(Math.sin((audioBlob?.size || 7) * 0.00137));
  const similarity = Math.round(28 + fileFactor * 35 + entropy * 37);
  return decorateResult({ similarity });
}

function decorateResult(result) {
  const similarity = Math.max(0, Math.min(100, Math.round(result.similarity ?? 0)));
  let grade = "不像哈基米";
  let comment = "这不是哈基米，像隔壁的喵声。";

  if (similarity >= 85) {
    grade = "神级哈基米";
    comment = "你登上哈基宇宙排行榜了！";
  } else if (similarity >= 60) {
    grade = "真哈基米";
    comment = "听起来有点哈基米节奏。";
  } else if (similarity >= 30) {
    grade = "半哈基米";
    comment = "有点味道，但还不是我想要的。";
  }

  return {
    similarity,
    grade: result.grade || grade,
    comment: result.comment || localComments[similarity % localComments.length] || comment,
    reasons: result.reasons || getLocalReasons(similarity)
  };
}

function getLocalReasons(similarity) {
  if (similarity >= 85) {
    return ["节奏和示例很接近，哈气起伏抓得很稳。", "音色足够明亮，听起来很像参考素材。", "有效声音占比高，几乎没有空白水分。"];
  }

  if (similarity >= 60) {
    return ["整体节奏已经有哈基米味道。", "音色和示例有相似部分，但尖锐度还可以再贴近。", "录音中有效声音足够用于判断。"];
  }

  if (similarity >= 30) {
    return ["能听到哈气动作，但节奏轮廓和示例还有差距。", "音高或明亮度不够接近参考素材。", "可以先播放示例，再模仿它的短促起伏。"];
  }

  return ["节奏、音色和示例差异都比较明显。", "有效哈气片段偏少或声音不够清晰。", "建议靠近麦克风，听一遍示例后重新录制。"];
}

function getBadgeText(similarity) {
  if (similarity >= 85) {
    return "神级认证";
  }

  if (similarity >= 60) {
    return "正牌认证";
  }

  if (similarity >= 30) {
    return "半熟认证";
  }

  return "待修炼认证";
}

function getLeadText(similarity) {
  if (similarity >= 85) {
    return "哈基米浓度爆表，猫猫频道已经收到你的信号。";
  }

  if (similarity >= 60) {
    return "节奏、味道、可爱电波都在线，已经很哈基米了。";
  }

  if (similarity >= 30) {
    return "有一点哈基米味儿，还差一口蜂蜜水的距离。";
  }

  return "这次还在热身，下一声也许就会突然变哈基米。";
}

function buildShareCopy(result) {
  return COPY_SHARE["9.2 分享文案（复制到剪贴板）"].文案;
}

function showEntryPage() {
  stagePage.hidden = false;
  settlementPage.hidden = true;
}

function showSettlementPage() {
  stagePage.hidden = true;
  settlementPage.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setScore(value) {
  if (value === null) {
    scoreText.textContent = "--";
    scoreRing.style.strokeDashoffset = ringLength;
    scoreRing.style.stroke = "var(--teal)";
    return;
  }

  const safeValue = Math.max(0, Math.min(100, value));
  scoreText.textContent = `${safeValue}%`;
  scoreRing.style.strokeDashoffset = ringLength - (ringLength * safeValue) / 100;
  scoreRing.style.stroke = safeValue >= 85 ? "var(--rose)" : safeValue >= 60 ? "var(--green)" : "var(--teal)";
}

async function uploadAudio() {
  const uploadBlob = await toWavBlob(audioBlob);
<<<<<<< Updated upstream
  const referenceBlob = await getReferenceWavBlob();
=======
  const scoringResult = await analyzeScoringFromWav(uploadBlob);
  const personalityResult = await analyzePersonalityFromWav(uploadBlob);
>>>>>>> Stashed changes
  const formData = new FormData();
  formData.append("audio", uploadBlob, audioFileName.replace(/\.[^.]+$/, "") + ".wav");
  if (referenceBlob) {
    formData.append("reference", referenceBlob, "haqi-reference.wav");
  }

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`);
  }

  const result = decorateResult(await response.json());
  return mergeAnalysis(result, scoringResult, personalityResult);
}

async function getReferenceWavBlob() {
  try {
    const response = await fetch(sampleAudioPath);
    if (!response.ok) {
      return null;
    }
    return await toWavBlob(await response.blob());
  } catch (error) {
    return null;
  }
}

async function toWavBlob(blob) {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();
    const buffer = await audioContext.decodeAudioData(await blob.arrayBuffer());
    const wav = encodeWav(buffer);
    await audioContext.close();
    return new Blob([wav], { type: "audio/wav" });
  } catch (error) {
    return blob;
  }
}

function encodeWav(buffer) {
  const channelCount = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const samples = mixToMono(buffer, channelCount);
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

function mixToMono(buffer, channelCount) {
  const samples = new Float32Array(buffer.length);
  for (let channel = 0; channel < channelCount; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < data.length; index += 1) {
      samples[index] += data[index] / channelCount;
    }
  }
  return samples;
}

function writeString(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

async function analyzePersonalityFromWav(blob) {
  try {
    const buffer = await blob.arrayBuffer();
    const vector = featureVectorFromWav(buffer);
    return analyzePersonality(vector);
  } catch (error) {
    return null;
  }
}

async function analyzeScoringFromWav(blob) {
  try {
    const buffer = await blob.arrayBuffer();
    const features = extractAudioFeaturesFromWav(buffer);
    const his = computeHachimiHisScoring(features);
    const featureVector02 = createFeatureVector({
      ...features,
      ...his,
      hisLevel: his.hisLevel,
      radarData: his.radarData,
      personality: "",
      personalityMatch: 0,
    });
    return {
      featureVector02,
      hisScore: his.hisScore,
      hisLevel: his.hisLevel,
      hisTitle: his.profile.title,
      hisDescription: his.profile.description,
      hisColor: his.profile.color,
      radarData: his.radarData,
    };
  } catch (error) {
    return null;
  }
}

function mergeAnalysis(base, scoringResult, personalityResult) {
  const merged = { ...base };
  if (scoringResult) {
    Object.assign(merged, scoringResult);
  }
  if (personalityResult) {
    Object.assign(merged, personalityResult);
  }
  if (merged.featureVector02 && personalityResult) {
    try {
      merged.featureVector02 = createFeatureVector({
        ...merged.featureVector02,
        personality: personalityResult.personality,
        personalityMatch: personalityResult.personalityMatch,
      });
    } catch (error) {
      merged.featureVector02 = merged.featureVector02;
    }
  }
  return merged;
}

checkButton.addEventListener("click", async () => {
  if (!audioBlob) {
    return;
  }

  checkButton.disabled = true;
  const steps = COPY_LOADING["4.1 加载动画文案"].步骤;
  let stepIndex = 0;
  setStatus(steps[0] || COPY_GLOBAL["1.3 全局提示语"].页面加载中);
  gradeText.textContent = steps[1] || steps[0] || gradeText.textContent;
  commentText.textContent = steps[2] || steps[1] || commentText.textContent;
  const stepTimer = window.setInterval(() => {
    stepIndex = (stepIndex + 1) % steps.length;
    const current = steps[stepIndex];
    if (current) {
      setStatus(current);
    }
  }, 500);

  try {
    const result = await uploadAudio();
    modeText.textContent = " ";
    renderResult(result);
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    modeText.textContent = " ";
    const local = getLocalResult();
    const wav = await toWavBlob(audioBlob);
    const scoringResult = await analyzeScoringFromWav(wav);
    const personalityResult = await analyzePersonalityFromWav(wav);
    renderResult(mergeAnalysis(local, scoringResult, personalityResult));
  } finally {
    window.clearInterval(stepTimer);
    checkButton.disabled = false;
    setStatus(COPY_RESULT["5.6 结果页底部提示"].提示.split("\n")[0] || "");
  }
});

function renderResult(result) {
  setScore(result.similarity);
  gradeText.textContent =
    result.hisLevel && result.hisTitle ? `Lv.${result.hisLevel} ${result.hisTitle}` : result.grade;
  let inline = result.comment;
  if (result.hisScore !== undefined && result.hisLevel && result.hisTitle) {
    inline = `${inline}｜HIS ${result.hisScore} / 10（Lv.${result.hisLevel} ${result.hisTitle}）`;
  }
  if (result.personalityProfile) {
    inline = `${inline}｜哈吉米TI：${result.personality}「${result.personalityProfile.name}」`;
  }
  commentText.textContent = inline;
  finalScore.textContent = `${result.similarity}%`;
<<<<<<< Updated upstream
  finalGrade.textContent = result.grade;
  finalComment.textContent = result.comment;
  renderReasons(result.reasons);
=======
  finalGrade.textContent = result.personalityProfile ? `${result.grade} / ${result.personality} ${result.personalityProfile.name}` : result.grade;
  if (result.hisScore !== undefined && result.hisLevel && result.hisTitle && result.hisDescription) {
    finalComment.textContent = result.personalityProfile
      ? `${result.hisDescription}\n\n${result.personalityProfile.coreDescription}\n\n${result.comment}`
      : `${result.hisDescription}\n\n${result.comment}`;
  } else {
    finalComment.textContent = result.personalityProfile ? `${result.personalityProfile.coreDescription}\n\n${result.comment}` : result.comment;
  }
>>>>>>> Stashed changes
  settlementBadge.textContent = getBadgeText(result.similarity);
  settlementLead.textContent = getLeadText(result.similarity);
  latestShareCopy = buildShareCopy(result);
  shareText.textContent = latestShareCopy;
  showSettlementPage();
}

function renderReasons(reasons) {
  reasonList.replaceChildren();
  for (const reason of reasons.slice(0, 4)) {
    const item = document.createElement("li");
    item.textContent = reason;
    reasonList.append(item);
  }
}

shareButton.addEventListener("click", async () => {
  if (!latestShareCopy) {
    return;
  }

  try {
    if (navigator.share) {
      await navigator.share({
        title: "我的哈基米结算单",
        text: latestShareCopy,
        url: window.location.href
      });
      shareButton.textContent = "分享完成";
      return;
    }

    await navigator.clipboard.writeText(latestShareCopy);
    shareButton.textContent = "文案已复制";
  } catch (error) {
    shareButton.textContent = "分享未完成";
  } finally {
    window.setTimeout(() => {
      shareButton.textContent = "分享结果";
    }, 1600);
  }
});

againButton.addEventListener("click", resetAudio);

resetAudio();
