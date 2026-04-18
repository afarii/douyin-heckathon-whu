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

const ringLength = 326.73;
const sampleAudioPath = "./基米素材/haqi.mp3";

const localComments = [
  "这不是普通音频，这是正在向猫猫频道发射的哈基米电波。",
  "味儿对了，节奏也在路上，建议立刻奖励自己一口蜂蜜水。",
  "听感已经开始摇摆，哈基米指数正在悄悄上桌。",
  "有点抽象，有点可爱，还有一点不讲道理的上头。"
];

let latestShareCopy = "";

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
    timerText.textContent = formatTime(Date.now() - startedAt);
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
  timerText.textContent = "00:00";
  meter.classList.remove("recording");
  setStatus("准备就绪");
  setScore(null);
  gradeText.textContent = "等待一声哈基米";
  commentText.textContent = "录音完成后点击检测，结果会在这里冒出来。";
  showEntryPage();
}

async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
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
      setStatus("录音完成");
    });

    mediaRecorder.start();
    recordButton.textContent = "停止录音";
    setStatus("正在录音");
    meter.classList.add("recording");
    startTimer();
  } catch (error) {
    setStatus("麦克风不可用");
    commentText.textContent = "浏览器没有拿到麦克风权限。可以改用上传音频文件。";
  }
}

function stopRecording() {
  if (!mediaRecorder || mediaRecorder.state !== "recording") {
    return;
  }

  mediaRecorder.stop();
  stopTimer();
  recordButton.textContent = "开始录音";
}

recordButton.addEventListener("click", () => {
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
    setStatus("文件不支持");
    commentText.textContent = "请上传音频文件，哈基米耳朵暂时不听别的。";
    return;
  }

  stopRecording();
  setAudio(file, file.name);
  setStatus("已上传");
  timerText.textContent = "已选择";
});

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
  return `我刚测了哈基米浓度：${result.similarity}%｜${result.grade}。${result.comment}`;
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
  const referenceBlob = await getReferenceWavBlob();
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

  return decorateResult(await response.json());
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

checkButton.addEventListener("click", async () => {
  if (!audioBlob) {
    return;
  }

  checkButton.disabled = true;
  setStatus("检测中");
  gradeText.textContent = "正在听...";
  commentText.textContent = "哈基米评委团正在认真摇头。";

  try {
    const result = await uploadAudio();
    modeText.textContent = "API 模式";
    renderResult(result);
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    modeText.textContent = "Mock 模式";
    renderResult(getLocalResult());
  } finally {
    checkButton.disabled = false;
    setStatus("检测完成");
  }
});

function renderResult(result) {
  setScore(result.similarity);
  gradeText.textContent = result.grade;
  commentText.textContent = result.comment;
  finalScore.textContent = `${result.similarity}%`;
  finalGrade.textContent = result.grade;
  finalComment.textContent = result.comment;
  renderReasons(result.reasons);
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
