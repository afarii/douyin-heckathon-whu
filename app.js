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
const settlementCat = document.querySelector(".settlement-cat");
const settlementScore = document.querySelector(".settlement-score");
const settlementAudio = document.querySelector("#settlementAudio");
const finalScore = document.querySelector("#finalScore");
const finalGrade = document.querySelector("#finalGrade");
const finalComment = document.querySelector("#finalComment");
const shareText = document.querySelector("#shareText");
const reasonList = document.querySelector("#reasonList");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const shareImage = document.querySelector("#shareImage");
const shareCanvas = document.querySelector("#shareCanvas");
const shareButton = document.querySelector("#shareButton");
const saveShareButton = document.querySelector("#saveShareButton");
const wechatShareButton = document.querySelector("#wechatShareButton");
const qqShareButton = document.querySelector("#qqShareButton");
const weiboShareButton = document.querySelector("#weiboShareButton");
const againButton = document.querySelector("#againButton");

let mediaRecorder;
let stream;
let chunks = [];
let audioBlob;
let audioFileName = "hachimi-recording.webm";
let startedAt = 0;
let timerId;
let latestResult = null;
let latestShareBlob = null;
let latestShareUrl = "";

const ringLength = 326.73;
const historyKey = "hachimi-history-v1";
const sampleAudioPath = "./基米素材/haqi.mp3";
const scoreAssets = {
  high: "./%E5%9F%BA%E7%B1%B3%E7%B4%A0%E6%9D%90/%E5%9F%BA%E7%B1%B3%E5%8A%A8%E5%9B%BE1%E7%BB%93%E7%AE%97%E7%94%BB%E9%9D%A2.gif",
  middle: "./%E5%9F%BA%E7%B1%B3%E7%B4%A0%E6%9D%90/%E5%93%88%E5%9F%BA%E7%B1%B34%E4%BD%8E%E5%88%86%E7%BB%93%E7%AE%97%E7%94%BB%E9%9D%A2.gif",
  low: "./%E5%9F%BA%E7%B1%B3%E7%B4%A0%E6%9D%90/%E5%93%88%E5%90%89%E7%B1%B3%E7%B4%A0%E6%9D%906%E5%8F%AB%E7%9A%84%E5%A4%AA%E7%83%82%E7%BB%93%E7%AE%97%E7%94%BB%E9%9D%A2.gif",
  idle: "./%E5%9F%BA%E7%B1%B3%E7%B4%A0%E6%9D%90/%E9%AB%98%E6%B8%85%E5%9F%BA%E7%B1%B3.png"
};

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
  latestResult = null;
  latestShareBlob = null;
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
  shareImage.hidden = true;
  shareImage.removeAttribute("src");
  saveShareButton.disabled = true;
  wechatShareButton.disabled = true;
  qqShareButton.disabled = true;
  weiboShareButton.disabled = true;
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
  let comment = "这是哈基米...吗？感觉还差点什么。";

  if (similarity >= 85) {
    grade = "神级哈基米";
    comment = "哈基米浓度爆表，猫猫频道已经收到你的信号。";
  } else if (similarity >= 60) {
    grade = "小哈基米";
    comment = "听起来有点哈基米节奏，可能还需要喝点蜂蜜水。";
  } else if (similarity >= 30) {
    grade = "半哈基米";
    comment = "有点味道，但还不是我想要的。";
  }

  return {
    similarity,
    grade: result.grade || grade,
    comment: result.comment || localComments[similarity % localComments.length] || comment,
    reasons: result.reasons || getLocalReasons(similarity),
    details: result.details || {}
  };
}

function getLocalReasons(similarity) {
  if (similarity >= 85) {
    return ["节奏起伏与示例保持一致，短促感和停顿位置都比较稳定。", "声音亮度接近参考素材，主体哈气清楚，没有被环境声盖住。", "有效片段集中，录音长度和示例的表达方式匹配度较高。"];
  }

  if (similarity >= 60) {
    return ["整体已经呈现出哈基米式的短促节奏，但部分起伏还不够贴近示例。", "音色方向基本相近，亮度和颗粒感仍有提升空间。", "录音主体足够清楚，系统可以较稳定地完成判断。"];
  }

  if (similarity >= 30) {
    return ["可以识别出哈气动作，但节奏轮廓与示例的差距较明显。", "声音的亮度、音高或颗粒感没有形成稳定的哈基米特征。", "建议缩短录制片段，重点模仿示例里的短促起落。"];
  }

  return ["录音与示例在节奏和音色上都缺少稳定关联。", "有效哈气片段偏少，或主体声音被静音、说话声、背景声分散。", "建议靠近麦克风，只保留一段短促清晰的哈气后再检测。"];
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
  settlementAudio.pause();
  settlementAudio.currentTime = 0;
}

function showSettlementPage() {
  stagePage.hidden = true;
  settlementPage.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
  settlementAudio.currentTime = 0;
  settlementAudio.play().catch(() => {
    settlementAudio.controls = true;
  });
}

function getScoreLevel(value) {
  const safeValue = Math.max(0, Math.min(100, value));
  if (safeValue >= 85) {
    return { name: "high", color: "var(--green)", asset: scoreAssets.high };
  }

  if (safeValue >= 30) {
    return { name: "middle", color: "var(--yellow)", asset: scoreAssets.middle };
  }

  return { name: "low", color: "var(--red)", asset: scoreAssets.low };
}

function setScore(value) {
  if (value === null) {
    scoreText.textContent = "--";
    scoreRing.style.strokeDashoffset = ringLength;
    scoreRing.style.stroke = "var(--teal)";
    updateSettlementScore(null);
    return;
  }

  const safeValue = Math.max(0, Math.min(100, value));
  const level = getScoreLevel(safeValue);
  scoreText.textContent = `${safeValue}%`;
  scoreRing.style.strokeDashoffset = ringLength - (ringLength * safeValue) / 100;
  scoreRing.style.stroke = level.color;
  scoreRing.dataset.level = level.name;
  updateSettlementScore(safeValue);
}

function updateSettlementScore(value) {
  if (value === null) {
    settlementCat.src = scoreAssets.idle;
    settlementScore.style.setProperty("--score-percent", "0%");
    settlementScore.style.setProperty("--score-color", "var(--teal)");
    settlementScore.dataset.level = "idle";
    return;
  }

  const safeValue = Math.max(0, Math.min(100, value));
  const level = getScoreLevel(safeValue);
  settlementCat.src = level.asset;
  settlementScore.style.setProperty("--score-percent", `${safeValue}%`);
  settlementScore.style.setProperty("--score-color", level.color);
  settlementScore.dataset.level = level.name;
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(historyKey)) || [];
  } catch (error) {
    return [];
  }
}

function saveHistory(result) {
  const next = [
    {
      similarity: result.similarity,
      grade: result.grade,
      comment: result.comment,
      createdAt: Date.now()
    },
    ...getHistory()
  ]
    .sort((a, b) => b.similarity - a.similarity || b.createdAt - a.createdAt)
    .slice(0, 10);
  localStorage.setItem(historyKey, JSON.stringify(next));
  renderHistory();
}

function formatHistoryTime(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function renderHistory() {
  const history = getHistory();
  historyList.replaceChildren();

  if (!history.length) {
    const item = document.createElement("li");
    item.textContent = "还没有记录，先来一声哈基米。";
    historyList.append(item);
    return;
  }

  history.forEach((record, index) => {
    const item = document.createElement("li");
    const level = getScoreLevel(record.similarity);
    item.style.setProperty("--history-color", level.color);
    item.innerHTML = `
      <span>${index + 1}</span>
      <strong>${record.similarity}%</strong>
      <em>${record.grade}</em>
      <small>${formatHistoryTime(record.createdAt)}</small>
    `;
    historyList.append(item);
  });
}

function loadCanvasImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function drawWrappedText(context, text, x, y, maxWidth, lineHeight, maxLines = 3) {
  const chars = String(text).split("");
  const lines = [];
  let line = "";

  for (const char of chars) {
    const testLine = line + char;
    if (context.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = char;
      if (lines.length === maxLines - 1) {
        break;
      }
    } else {
      line = testLine;
    }
  }

  lines.push(line);
  lines.slice(0, maxLines).forEach((item, index) => {
    context.fillText(item, x, y + index * lineHeight);
  });
}

async function generateShareImage(result) {
  const context = shareCanvas.getContext("2d");
  const width = shareCanvas.width;
  const height = shareCanvas.height;
  const level = getScoreLevel(result.similarity);
  const image = await loadCanvasImage(level.asset);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fffaf2";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#eefbfa";
  context.fillRect(42, 42, width - 84, height - 84);
  context.fillStyle = "#ffffff";
  context.fillRect(78, 78, width - 156, height - 156);

  if (image) {
    const size = 320;
    context.save();
    context.beginPath();
    context.roundRect(290, 120, size, size, 24);
    context.clip();
    context.drawImage(image, 290, 120, size, size);
    context.restore();
  }

  context.fillStyle = "#171717";
  context.font = "900 54px Microsoft YaHei, sans-serif";
  context.textAlign = "center";
  context.fillText("我的哈基米结算单", width / 2, 520);

  context.fillStyle = level.color.replace("var(--green)", "#3a9f6f").replace("var(--yellow)", "#f2c14e").replace("var(--red)", "#d7263d");
  context.font = "900 132px Microsoft YaHei, sans-serif";
  context.fillText(`${result.similarity}%`, width / 2, 665);

  context.fillStyle = "#171717";
  context.font = "900 46px Microsoft YaHei, sans-serif";
  context.fillText(result.grade, width / 2, 735);

  context.fillStyle = "#646464";
  context.font = "700 30px Microsoft YaHei, sans-serif";
  drawWrappedText(context, result.comment, width / 2, 800, 620, 44, 3);

  context.textAlign = "left";
  context.fillStyle = "#118a8a";
  context.font = "900 30px Microsoft YaHei, sans-serif";
  context.fillText("评分理由", 150, 940);

  context.fillStyle = "#646464";
  context.font = "700 26px Microsoft YaHei, sans-serif";
  result.reasons.slice(0, 3).forEach((reason, index) => {
    const y = 995 + index * 72;
    context.fillStyle = "#118a8a";
    context.fillText(`${index + 1}.`, 150, y);
    context.fillStyle = "#646464";
    drawWrappedText(context, reason, 190, y, 560, 34, 2);
  });

  latestShareBlob = await new Promise((resolve) => shareCanvas.toBlob(resolve, "image/png"));
  if (!latestShareBlob) {
    return;
  }

  if (latestShareUrl) {
    URL.revokeObjectURL(latestShareUrl);
  }
  latestShareUrl = URL.createObjectURL(latestShareBlob);
  shareImage.src = latestShareUrl;
  shareImage.hidden = false;
  saveShareButton.disabled = false;
  wechatShareButton.disabled = false;
  qqShareButton.disabled = false;
  weiboShareButton.disabled = false;
}

async function shareGeneratedImage() {
  if (!latestResult || !latestShareBlob) {
    return false;
  }

  const file = new File([latestShareBlob], "hachimi-result.png", { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      title: "我的哈基米结算单",
      text: latestShareCopy,
      files: [file]
    });
    return true;
  }

  return false;
}

function openPlatformShare(platform) {
  const encodedUrl = encodeURIComponent(window.location.href);
  const encodedText = encodeURIComponent(latestShareCopy);

  if (platform === "qq") {
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedText}`, "_blank", "noopener");
    return;
  }

  if (platform === "weibo") {
    window.open(`https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`, "_blank", "noopener");
    return;
  }

  navigator.clipboard?.writeText(latestShareCopy);
  wechatShareButton.textContent = "已复制文案";
  window.setTimeout(() => {
    wechatShareButton.textContent = "微信";
  }, 1600);
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
  latestResult = result;
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
  saveHistory(result);
  generateShareImage(result);
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
    if (await shareGeneratedImage()) {
      shareButton.textContent = "分享图已唤起";
      return;
    }

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

saveShareButton.addEventListener("click", () => {
  if (!latestShareUrl) {
    return;
  }

  const link = document.createElement("a");
  link.href = latestShareUrl;
  link.download = "hachimi-result.png";
  link.click();
});

wechatShareButton.addEventListener("click", () => openPlatformShare("wechat"));
qqShareButton.addEventListener("click", () => openPlatformShare("qq"));
weiboShareButton.addEventListener("click", () => openPlatformShare("weibo"));

clearHistoryButton.addEventListener("click", () => {
  localStorage.removeItem(historyKey);
  renderHistory();
});

againButton.addEventListener("click", resetAudio);

renderHistory();
resetAudio();
