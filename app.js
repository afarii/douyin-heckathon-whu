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
const personalityBox = document.querySelector("#personalityBox");
const personalityCodeText = document.querySelector("#personalityCode");
const personalityNameText = document.querySelector("#personalityName");
const personalityTitleText = document.querySelector("#personalityTitleText");
const personalityMatchText = document.querySelector("#personalityMatchText");
const personalityFunCopyText = document.querySelector("#personalityFunCopy");
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
const navStage = document.querySelector("#navStage");
const navSettlement = document.querySelector("#navSettlement");
const navRanking = document.querySelector("#navRanking");
const navAchievements = document.querySelector("#navAchievements");
const navProfile = document.querySelector("#navProfile");
const rankingPage = document.querySelector("#rankingPage");
const achievementsPage = document.querySelector("#achievementsPage");
const profilePage = document.querySelector("#profilePage");
const rankingMode = document.querySelector("#rankingMode");
const rankingList = document.querySelector("#rankingList");
const rankingHint = document.querySelector("#rankingHint");
const rankingClearButton = document.querySelector("#rankingClearButton");
const achievementsGrid = document.querySelector("#achievementsGrid");
const achievementsResetSeenButton = document.querySelector("#achievementsResetSeenButton");
const profileTotal = document.querySelector("#profileTotal");
const profileBestHis = document.querySelector("#profileBestHis");
const profileBestSimilarity = document.querySelector("#profileBestSimilarity");
const profileLatest = document.querySelector("#profileLatest");
const profileLatestSub = document.querySelector("#profileLatestSub");
const profilePersonaChips = document.querySelector("#profilePersonaChips");
const profileRecentList = document.querySelector("#profileRecentList");
const profileClearButton = document.querySelector("#profileClearButton");
const hisBox = document.querySelector("#hisBox");
const hisTag = document.querySelector("#hisTag");
const hisValue = document.querySelector("#hisValue");
const hisDesc = document.querySelector("#hisDesc");
const hisHint = document.querySelector("#hisHint");
const achievementModal = document.querySelector("#achievementModal");
const achievementModalClose = document.querySelector("#achievementModalClose");
const achievementModalOk = document.querySelector("#achievementModalOk");
const achievementModalList = document.querySelector("#achievementModalList");
const confirmModal = document.querySelector("#confirmModal");
const confirmModalClose = document.querySelector("#confirmModalClose");
const confirmModalCancel = document.querySelector("#confirmModalCancel");
const confirmModalConfirm = document.querySelector("#confirmModalConfirm");

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
let pageOpenedAt = Date.now();
let achievementsDefinition = [];
let pendingConfirmAction = null;
let currentView = "stage";

const ringLength = 326.73;
const legacyHistoryKey = "hachimi-history-v1";
const runsKey = "hachimi-runs-v1";
const achievementsKey = "hachimi-achievements-v1";
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
  personalityBox.hidden = true;
  personalityCodeText.textContent = "--";
  personalityNameText.textContent = "--";
  personalityTitleText.textContent = "--";
  personalityMatchText.textContent = "--";
  personalityFunCopyText.textContent = "";
  shareImage.hidden = true;
  shareImage.removeAttribute("src");
  saveShareButton.disabled = true;
  wechatShareButton.disabled = true;
  qqShareButton.disabled = true;
  weiboShareButton.disabled = true;
  hisBox.hidden = true;
  hisTag.textContent = "--";
  hisValue.textContent = "HIS --";
  hisDesc.textContent = "--";
  hisHint.textContent = "--";
  if (navSettlement) {
    navSettlement.disabled = true;
  }
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
    details: result.details || {},
    audioHis: Number.isFinite(Number(result.audioHis)) ? Number(result.audioHis) : null,
    hisLevelInfo: result.hisLevelInfo && typeof result.hisLevelInfo === "object" ? result.hisLevelInfo : null,
    hisLevel: Number.isFinite(Number(result.hisLevel)) ? Number(result.hisLevel) : null,
    peakFreq: Number.isFinite(Number(result.peakFreq)) ? Number(result.peakFreq) : null,
    activeDuration: Number.isFinite(Number(result.activeDuration)) ? Number(result.activeDuration) : null,
    freqVariance: Number.isFinite(Number(result.freqVariance)) ? Number(result.freqVariance) : null,
    volumeVariance: Number.isFinite(Number(result.volumeVariance)) ? Number(result.volumeVariance) : null,
    dominantFreq: Number.isFinite(Number(result.dominantFreq)) ? Number(result.dominantFreq) : null,
    avgDB: Number.isFinite(Number(result.avgDB)) ? Number(result.avgDB) : null,
    personalityCode: result.personalityCode ?? "",
    personalityMatch: result.personalityMatch ?? null,
    dimensionMatches: Array.isArray(result.dimensionMatches) ? result.dimensionMatches : [],
    personalityProfile: result.personalityProfile ?? null
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

function setActiveNav(view) {
  const mapping = [
    [navStage, "stage"],
    [navSettlement, "settlement"],
    [navRanking, "ranking"],
    [navAchievements, "achievements"],
    [navProfile, "profile"]
  ];
  mapping.forEach(([button, key]) => {
    if (!button) {
      return;
    }
    button.classList.toggle("is-active", key === view);
  });
}

function showView(view) {
  let target = view;
  if (target === "settlement" && !latestResult) {
    target = "stage";
  }

  currentView = target;
  stagePage.hidden = target !== "stage";
  settlementPage.hidden = target !== "settlement";
  rankingPage.hidden = target !== "ranking";
  achievementsPage.hidden = target !== "achievements";
  profilePage.hidden = target !== "profile";
  setActiveNav(target);

  if (target !== "settlement") {
    settlementAudio.pause();
    settlementAudio.currentTime = 0;
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
    settlementAudio.currentTime = 0;
    settlementAudio.play().catch(() => {
      settlementAudio.controls = true;
    });
  }
}

function showEntryPage() {
  showView("stage");
}

function showSettlementPage() {
  showView("settlement");
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

function safeJsonParse(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function migrateLegacyHistory() {
  const existing = localStorage.getItem(runsKey);
  if (existing) {
    return;
  }

  const legacyRaw = localStorage.getItem(legacyHistoryKey);
  if (!legacyRaw) {
    return;
  }

  const legacy = safeJsonParse(legacyRaw, []);
  if (!Array.isArray(legacy) || !legacy.length) {
    return;
  }

  const migrated = legacy
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      createdAt: Number(item.createdAt) || Date.now(),
      similarity: Number(item.similarity) || 0,
      grade: String(item.grade || ""),
      comment: String(item.comment || ""),
      audioHis: null,
      hisLevelInfo: null,
      personalityCode: "",
      personalityProfile: null,
      peakFreq: null,
      activeDuration: null,
      freqVariance: null,
      volumeVariance: null,
      dominantFreq: null,
      avgDB: null,
      timeSinceOpenMs: null
    }));

  localStorage.setItem(runsKey, JSON.stringify(migrated.slice(0, 200)));
}

function getRuns() {
  migrateLegacyHistory();
  const raw = localStorage.getItem(runsKey);
  const parsed = safeJsonParse(raw, []);
  return Array.isArray(parsed) ? parsed : [];
}

function setRuns(runs) {
  localStorage.setItem(runsKey, JSON.stringify(runs));
}

function addRun(result) {
  const now = Date.now();
  const run = {
    createdAt: now,
    similarity: result.similarity,
    grade: result.grade,
    comment: result.comment,
    audioHis: Number.isFinite(result.audioHis) ? result.audioHis : null,
    hisLevelInfo: result.hisLevelInfo,
    personalityCode: String(result.personalityCode || ""),
    personalityProfile: result.personalityProfile,
    peakFreq: result.peakFreq,
    activeDuration: result.activeDuration,
    freqVariance: result.freqVariance,
    volumeVariance: result.volumeVariance,
    dominantFreq: result.dominantFreq,
    avgDB: result.avgDB,
    timeSinceOpenMs: Math.max(0, now - pageOpenedAt)
  };
  const next = [run, ...getRuns()].slice(0, 200);
  setRuns(next);
  renderSettlementHistory();
  renderRanking();
  renderProfile();
  return run;
}

function formatHistoryTime(timestamp) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

function getRankingColor(run) {
  const hisColor = String(run?.hisLevelInfo?.color || "").trim();
  if (hisColor) {
    return hisColor;
  }
  const similarityValue = Number(run?.similarity);
  return getScoreLevel(Number.isFinite(similarityValue) ? similarityValue : 0).color;
}

function formatHisValue(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return Number(value).toFixed(1);
}

function renderSettlementHistory() {
  const runs = getRuns();
  const ranking = runs
    .slice()
    .sort((a, b) => (Number(b.audioHis) || -1) - (Number(a.audioHis) || -1) || (Number(b.similarity) || 0) - (Number(a.similarity) || 0) || (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))
    .slice(0, 10);

  historyList.replaceChildren();

  if (!ranking.length) {
    const item = document.createElement("li");
    item.textContent = "还没有记录，先来一声哈基米。";
    historyList.append(item);
    return;
  }

  ranking.forEach((record, index) => {
    const item = document.createElement("li");
    item.style.setProperty("--history-color", getRankingColor(record));
    const title = String(record?.hisLevelInfo?.title || record?.grade || "--").trim() || "--";
    const score = Number.isFinite(Number(record.audioHis)) ? `HIS ${formatHisValue(record.audioHis)}` : `${Math.max(0, Math.min(100, Math.round(Number(record.similarity) || 0)))}%`;
    item.innerHTML = `
      <span>${index + 1}</span>
      <strong>${score}</strong>
      <em>${title}</em>
      <small>${formatHistoryTime(record.createdAt || Date.now())}</small>
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
    let message = `后端校验失败：${response.status}`;
    try {
      const payload = await response.json();
      if (payload?.error) {
        message = payload.error;
      }
    } catch (error) {
    }
    throw new Error(message);
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
    modeText.textContent = "后端校验";
    renderResult(result);
  } catch (error) {
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    latestResult = null;
    latestShareCopy = "";
    modeText.textContent = "后端校验失败";
    gradeText.textContent = "未完成校验";
    commentText.textContent = error instanceof Error ? error.message : "当前无法连接后端，未返回有效的相似度结果。";
    renderReasons(["当前分数必须由后端返回；本次未使用前端本地 Mock 结果。"]);
    showEntryPage();
  } finally {
    checkButton.disabled = false;
    setStatus(latestResult ? "检测完成" : "等待后端");
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
  renderPersonality(result);
  renderReasons(result.reasons);
  renderHisLevel(result);
  settlementBadge.textContent = getBadgeText(result.similarity);
  settlementLead.textContent = getLeadText(result.similarity);
  latestShareCopy = buildShareCopy(result);
  shareText.textContent = latestShareCopy;
  if (navSettlement) {
    navSettlement.disabled = false;
  }
  const run = addRun(result);
  generateShareImage(result);
  updateNavLocks();
  const unlocked = evaluateAchievements(run);
  if (unlocked.length) {
    openAchievementModal(unlocked);
  }
  renderAchievements();
  showSettlementPage();
}

function renderPersonality(result) {
  const profile = result?.personalityProfile;
  if (!profile) {
    personalityBox.hidden = true;
    return;
  }

  const code = String(result?.personalityCode || profile.code || "").trim();
  const name = String(profile.name || "").trim();
  const title = String(profile.title || "").trim();
  const matchValue = Number.isFinite(result?.personalityMatch) ? result.personalityMatch : Number(result?.personalityMatch);
  const match = Number.isFinite(matchValue) ? Math.max(0, Math.min(100, Math.round(matchValue))) : null;
  const funCopy = String(profile.funCopy || "").trim();

  personalityBox.hidden = false;
  personalityCodeText.textContent = code || "--";
  personalityNameText.textContent = name || "--";
  personalityTitleText.textContent = title || "--";
  personalityMatchText.textContent = match === null ? "--" : String(match);
  personalityFunCopyText.textContent = funCopy;
}

function renderReasons(reasons) {
  reasonList.replaceChildren();
  for (const reason of reasons.slice(0, 4)) {
    const item = document.createElement("li");
    item.textContent = reason;
    reasonList.append(item);
  }
}

function renderHisLevel(result) {
  const info = result?.hisLevelInfo;
  const title = String(info?.title || "").trim();
  const color = String(info?.color || "").trim();
  const desc = String(info?.desc || "").trim();
  const hint = String(info?.hint || "").trim();
  const his = Number(result?.audioHis);

  if (!info || (!title && !desc && !hint && !Number.isFinite(his))) {
    hisBox.hidden = true;
    return;
  }

  hisBox.hidden = false;
  hisTag.textContent = title || "未知等级";
  hisTag.style.background = color || "var(--teal)";
  hisValue.textContent = Number.isFinite(his) ? `HIS ${formatHisValue(his)}` : "HIS --";
  hisDesc.textContent = desc || "—";
  hisHint.textContent = hint || "—";
}

function updateNavLocks() {
  const hasRuns = getRuns().length > 0;
  if (navAchievements) {
    navAchievements.disabled = !hasRuns;
  }
  if (navProfile) {
    navProfile.disabled = !hasRuns;
  }
  if (navSettlement) {
    navSettlement.disabled = !latestResult;
  }
}

function getAchievementState() {
  const parsed = safeJsonParse(localStorage.getItem(achievementsKey), {});
  const unlocked = parsed && typeof parsed === "object" && parsed.unlocked && typeof parsed.unlocked === "object" ? parsed.unlocked : {};
  const seen = parsed && typeof parsed === "object" && parsed.seen && typeof parsed.seen === "object" ? parsed.seen : {};
  return { unlocked: { ...unlocked }, seen: { ...seen } };
}

function setAchievementState(state) {
  localStorage.setItem(achievementsKey, JSON.stringify(state));
}

function getNonHiddenPersonalityCodes(runs) {
  const hidden = new Set(["SILENT", "MEOOOW"]);
  const output = new Set();
  runs.forEach((run) => {
    const code = String(run?.personalityCode || "").trim();
    if (!code || hidden.has(code)) {
      return;
    }
    output.add(code);
  });
  return Array.from(output);
}

function buildStats(runs) {
  const totalRecordings = runs.length;
  const bestSimilarity = runs.reduce((max, run) => Math.max(max, Number(run?.similarity) || 0), 0);
  const bestHisRun = runs
    .filter((run) => Number.isFinite(Number(run?.audioHis)))
    .reduce((best, run) => {
      const value = Number(run.audioHis);
      if (!best) {
        return run;
      }
      return value > Number(best.audioHis) ? run : best;
    }, null);

  const bestAudioHis = bestHisRun && Number.isFinite(Number(bestHisRun.audioHis)) ? Number(bestHisRun.audioHis) : null;
  const personalityHistory = getNonHiddenPersonalityCodes(runs);
  return { totalRecordings, bestSimilarity, bestAudioHis, bestHisRun, personalityHistory };
}

function meetsAchievementCondition(id, run, stats) {
  const his = Number(run?.audioHis);
  const peakFreq = Number(run?.peakFreq);
  const activeDuration = Number(run?.activeDuration);
  const freqVariance = Number(run?.freqVariance);
  const volumeVariance = Number(run?.volumeVariance);
  const dominantFreq = Number(run?.dominantFreq);
  const avgDB = Number(run?.avgDB);
  const hour = new Date(Number(run?.createdAt) || Date.now()).getHours();

  if (id === "first_hiss") return stats.totalRecordings >= 1;
  if (id === "hiss_3") return stats.totalRecordings >= 3;
  if (id === "hiss_10") return stats.totalRecordings >= 10;
  if (id === "hiss_100") return stats.totalRecordings >= 100;
  if (id === "breaker") return Number.isFinite(his) && his >= 3.0;
  if (id === "defender") return Number.isFinite(his) && his >= 5.0;
  if (id === "rage_cat") return Number.isFinite(his) && his >= 7.0;
  if (id === "maodie_certified") return Number.isFinite(his) && his >= 9.0;
  if (id === "beyond_maodie") return Number.isFinite(his) && his >= 10.0;
  if (id === "high_pitch") return Number.isFinite(peakFreq) && peakFreq > 7000;
  if (id === "endurance_king") return Number.isFinite(activeDuration) && activeDuration > 2.5;
  if (id === "chaos_master") return Number.isFinite(freqVariance) && freqVariance > 2500;
  if (id === "stable_output") return Number.isFinite(volumeVariance) && volumeVariance < 0.05 && Number.isFinite(activeDuration) && activeDuration > 1.0;
  if (id === "bass_cannon") return Number.isFinite(dominantFreq) && dominantFreq < 2000 && Number.isFinite(avgDB) && avgDB > 50;
  if (id === "type_collector") return stats.personalityHistory.length >= 8;
  if (id === "air_master") return String(run?.personalityCode || "").trim() === "SILENT";
  if (id === "midnight_hiss") return hour >= 0 && hour < 5;
  if (id === "speed_star") return Number(run?.timeSinceOpenMs) > 0 && Number(run?.timeSinceOpenMs) <= 10_000;

  return false;
}

function evaluateAchievements(run) {
  if (!achievementsDefinition.length) {
    return [];
  }

  const runs = getRuns();
  const stats = buildStats(runs);
  const state = getAchievementState();
  const now = Date.now();
  const unlockedNow = [];

  achievementsDefinition.forEach((achievement) => {
    const id = String(achievement?.id || "").trim();
    if (!id || state.unlocked[id]) {
      return;
    }
    if (meetsAchievementCondition(id, run, stats)) {
      state.unlocked[id] = now;
      unlockedNow.push(achievement);
    }
  });

  if (unlockedNow.length) {
    setAchievementState(state);
  }

  return unlockedNow;
}

function getAchievementBadgeStyle(achievement) {
  const raw = String(achievement?.iconColor || "").trim();
  if (!raw) {
    return { background: "var(--teal)" };
  }
  if (raw.includes("彩虹")) {
    return { background: "linear-gradient(90deg, #ff5f6d, #ffc371, #3a9f6f, #118a8a, #8a2be2)" };
  }
  if (raw.startsWith("#")) {
    return { background: raw };
  }
  return { background: "var(--teal)" };
}

function renderAchievements() {
  achievementsGrid.replaceChildren();
  if (!achievementsDefinition.length) {
    const empty = document.createElement("p");
    empty.className = "lead";
    empty.textContent = "成就数据加载失败，稍后再试。";
    achievementsGrid.append(empty);
    return;
  }

  const runs = getRuns();
  const stats = buildStats(runs);
  const state = getAchievementState();

  achievementsDefinition.forEach((achievement) => {
    const id = String(achievement?.id || "").trim();
    const unlockedAt = state.unlocked[id] ? Number(state.unlocked[id]) : null;
    const unlocked = Number.isFinite(unlockedAt);
    const showBeforeUnlock = Boolean(achievement?.showBeforeUnlock);
    if (!unlocked && !showBeforeUnlock) {
      return;
    }

    const card = document.createElement("div");
    card.className = `achievement-card${unlocked ? "" : " is-locked"}`;

    const name = unlocked ? String(achievement?.name || "—") : String(achievement?.lockedName || "???");
    const category = String(achievement?.category || "成就");
    const description = String(achievement?.description || "");
    const unlockedCopy = String(achievement?.relatedCopy?.unlocked || "").trim();
    const detail = unlocked ? unlockedCopy || description : description || "未解锁";

    let progressText = "";
    const progress = achievement?.progress;
    if (!unlocked && progress && typeof progress === "object") {
      const currentKey = String(progress.currentKey || "").trim();
      const target = Number(progress.target);
      let current = 0;
      if (currentKey === "totalRecordings") current = stats.totalRecordings;
      if (currentKey === "personalityHistory") current = stats.personalityHistory.length;
      if (Number.isFinite(target) && target > 0) {
        progressText = String(progress.template || "{current}").replace("{current}", String(Math.min(current, target)));
      } else {
        progressText = String(progress.template || "").replace("{current}", String(current));
      }
    }

    const badgeStyle = getAchievementBadgeStyle(achievement);
    const badgeText = unlocked ? "已解锁" : progressText || "未解锁";
    const timeText = unlocked ? formatHistoryTime(unlockedAt) : category;

    card.innerHTML = `
      <div class="achievement-top">
        <p class="achievement-name">${name}</p>
        <span class="achievement-badge">${badgeText}</span>
      </div>
      <p class="achievement-desc">${detail}</p>
      <div class="achievement-meta">
        <span>${timeText}</span>
        <span>${unlocked ? "✅" : "🔒"}</span>
      </div>
    `;
    const badge = card.querySelector(".achievement-badge");
    if (badge) {
      Object.assign(badge.style, badgeStyle);
    }

    achievementsGrid.append(card);
  });
}

function openAchievementModal(items) {
  const state = getAchievementState();
  achievementModalList.replaceChildren();
  const ids = [];
  items.forEach((achievement) => {
    const id = String(achievement?.id || "").trim();
    if (!id) {
      return;
    }
    ids.push(id);
    const li = document.createElement("li");
    const name = String(achievement?.name || "成就");
    const copy = String(achievement?.relatedCopy?.unlocked || achievement?.description || "").trim();
    li.innerHTML = `<strong>${name}</strong>：${copy || "已解锁"}`;
    achievementModalList.append(li);
  });

  if (!ids.length) {
    return;
  }

  achievementModal.hidden = false;
  achievementModal.setAttribute("aria-hidden", "false");
  const close = () => {
    const next = getAchievementState();
    ids.forEach((id) => {
      next.seen[id] = Date.now();
    });
    setAchievementState(next);
    achievementModal.hidden = true;
    achievementModal.setAttribute("aria-hidden", "true");
    renderAchievements();
    updateNavLocks();
  };

  achievementModalClose.onclick = close;
  achievementModalOk.onclick = close;
  achievementModal.onclick = (event) => {
    if (event.target === achievementModal) {
      close();
    }
  };
}

function renderRanking() {
  const mode = String(rankingMode?.value || "total");
  const runs = getRuns();
  const hasData = runs.length > 0;
  rankingList.replaceChildren();

  if (!hasData) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "还没有记录，先测一次再来看看。";
    rankingList.append(item);
    rankingHint.textContent = "总榜按 HIS 排序；分榜为最小可用展示，不足时会回退到总榜。";
    return;
  }

  const totalSorted = runs
    .slice()
    .sort((a, b) => (Number(b.audioHis) || -1) - (Number(a.audioHis) || -1) || (Number(b.similarity) || 0) - (Number(a.similarity) || 0) || (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0));

  const renderList = (list, hint) => {
    rankingHint.textContent = hint;
    list.slice(0, 30).forEach((run, index) => {
      const li = document.createElement("li");
      li.style.setProperty("--history-color", getRankingColor(run));
      const hisText = Number.isFinite(Number(run.audioHis)) ? `HIS ${formatHisValue(Number(run.audioHis))}` : "HIS --";
      const title = String(run?.hisLevelInfo?.title || run?.grade || "--").trim() || "--";
      const extra = `${Math.max(0, Math.min(100, Math.round(Number(run?.similarity) || 0)))}%`;
      li.innerHTML = `
        <span class="rank">#${index + 1}</span>
        <span class="score">${hisText}</span>
        <span class="title">${title}</span>
        <span class="meta">${extra} · ${formatHistoryTime(Number(run?.createdAt) || Date.now())}</span>
      `;
      rankingList.append(li);
    });
  };

  if (mode === "total") {
    renderList(totalSorted, "总榜按 HIS 排序（同 HIS 时按相似度/时间）。");
    return;
  }

  if (mode === "level") {
    const bestByLevel = new Map();
    totalSorted.forEach((run) => {
      const level = Number(run?.hisLevelInfo?.hisLevel ?? run?.hisLevel);
      if (!Number.isFinite(level)) {
        return;
      }
      const existing = bestByLevel.get(level);
      if (!existing || (Number(run.audioHis) || -1) > (Number(existing.audioHis) || -1)) {
        bestByLevel.set(level, run);
      }
    });
    const list = Array.from(bestByLevel.entries())
      .sort((a, b) => b[0] - a[0])
      .map((entry) => entry[1]);
    if (list.length < 2) {
      renderList(totalSorted, "分榜数据不足，已回退到总榜（按 HIS）。");
      return;
    }
    renderList(list, "分榜（按等级）：每个等级取本机最高 HIS 的一条记录。");
    return;
  }

  if (mode === "personality") {
    const bestByCode = new Map();
    totalSorted.forEach((run) => {
      const code = String(run?.personalityCode || "").trim();
      if (!code) {
        return;
      }
      const existing = bestByCode.get(code);
      if (!existing || (Number(run.audioHis) || -1) > (Number(existing.audioHis) || -1)) {
        bestByCode.set(code, run);
      }
    });
    const list = Array.from(bestByCode.values()).sort((a, b) => (Number(b.audioHis) || -1) - (Number(a.audioHis) || -1));
    if (list.length < 2) {
      renderList(totalSorted, "分榜数据不足，已回退到总榜（按 HIS）。");
      return;
    }
    renderList(list, "分榜（按人格）：每个人格取本机最高 HIS 的一条记录。");
  }
}

function renderProfile() {
  const runs = getRuns();
  const stats = buildStats(runs);

  profileTotal.textContent = String(stats.totalRecordings);
  profileBestSimilarity.textContent = stats.bestSimilarity ? `${Math.round(stats.bestSimilarity)}%` : "--";

  if (Number.isFinite(stats.bestAudioHis)) {
    const title = String(stats.bestHisRun?.hisLevelInfo?.title || "").trim();
    profileBestHis.textContent = title ? `${formatHisValue(stats.bestAudioHis)} · ${title}` : formatHisValue(stats.bestAudioHis);
  } else {
    profileBestHis.textContent = "--";
  }

  const latest = runs[0];
  if (!latest) {
    profileLatest.textContent = "还没有记录。";
    profileLatestSub.textContent = "";
  } else {
    const hisText = Number.isFinite(Number(latest.audioHis)) ? `HIS ${formatHisValue(Number(latest.audioHis))}` : "HIS --";
    const title = String(latest?.hisLevelInfo?.title || latest?.grade || "--").trim() || "--";
    profileLatest.textContent = `${hisText} · ${title}`;
    profileLatestSub.textContent = `${Math.max(0, Math.min(100, Math.round(Number(latest?.similarity) || 0)))}% · ${formatHistoryTime(Number(latest.createdAt) || Date.now())}`;
  }

  const personas = new Map();
  runs.forEach((run) => {
    const code = String(run?.personalityCode || "").trim();
    if (!code) {
      return;
    }
    const name = String(run?.personalityProfile?.name || "").trim();
    const label = name ? `${code} ${name}` : code;
    if (!personas.has(code)) {
      personas.set(code, label);
    }
  });

  profilePersonaChips.replaceChildren();
  if (!personas.size) {
    const empty = document.createElement("p");
    empty.className = "info-sub";
    empty.textContent = "还没有人格记录。";
    profilePersonaChips.append(empty);
  } else {
    Array.from(personas.values())
      .sort((a, b) => a.localeCompare(b, "zh-CN"))
      .forEach((label) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = label;
        profilePersonaChips.append(chip);
      });
  }

  profileRecentList.replaceChildren();
  runs.slice(0, 6).forEach((run) => {
    const li = document.createElement("li");
    const hisText = Number.isFinite(Number(run.audioHis)) ? `HIS ${formatHisValue(Number(run.audioHis))}` : "HIS --";
    const title = String(run?.hisLevelInfo?.title || run?.grade || "--").trim() || "--";
    const extra = `${Math.max(0, Math.min(100, Math.round(Number(run?.similarity) || 0)))}% · ${formatHistoryTime(Number(run?.createdAt) || Date.now())}`;
    li.innerHTML = `<strong>${hisText} · ${title}</strong><span>${extra}</span>`;
    profileRecentList.append(li);
  });
}

async function loadAchievementsDefinition() {
  if (achievementsDefinition.length) {
    return achievementsDefinition;
  }
  try {
    const response = await fetch("./data/achievements.v1.json");
    if (!response.ok) {
      return [];
    }
    const payload = await response.json();
    achievementsDefinition = Array.isArray(payload?.achievements) ? payload.achievements : [];
  } catch (error) {
    achievementsDefinition = [];
  }
  return achievementsDefinition;
}

function openConfirmModal(options) {
  if (!options || typeof options !== "object") {
    return;
  }

  const titleEl = document.querySelector("#confirmModalTitle");
  const copyEl = document.querySelector("#confirmModalCopy");
  if (titleEl) {
    titleEl.textContent = String(options.title || "确认操作");
  }
  if (copyEl) {
    copyEl.textContent = String(options.copy || "");
  }

  pendingConfirmAction = typeof options.onConfirm === "function" ? options.onConfirm : null;
  confirmModal.hidden = false;
  confirmModal.setAttribute("aria-hidden", "false");

  const close = () => {
    confirmModal.hidden = true;
    confirmModal.setAttribute("aria-hidden", "true");
    pendingConfirmAction = null;
  };

  confirmModalClose.onclick = close;
  confirmModalCancel.onclick = close;
  confirmModalConfirm.onclick = () => {
    const action = pendingConfirmAction;
    close();
    action?.();
  };
  confirmModal.onclick = (event) => {
    if (event.target === confirmModal) {
      close();
    }
  };
}

function clearRunsOnly() {
  localStorage.removeItem(runsKey);
  localStorage.removeItem(legacyHistoryKey);
  latestResult = null;
  updateNavLocks();
  renderSettlementHistory();
  renderRanking();
  renderProfile();
  renderAchievements();
  if (currentView === "settlement") {
    showEntryPage();
  }
}

function clearAllLocalData() {
  localStorage.removeItem(runsKey);
  localStorage.removeItem(legacyHistoryKey);
  localStorage.removeItem(achievementsKey);
  latestResult = null;
  updateNavLocks();
  renderSettlementHistory();
  renderRanking();
  renderProfile();
  renderAchievements();
  resetAudio();
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
  openConfirmModal({
    title: "确认清除本地数据",
    copy: "这会清除本机历史、成就解锁与档案统计，且不可恢复。",
    onConfirm: clearAllLocalData
  });
});

againButton.addEventListener("click", resetAudio);

document.querySelectorAll(".nav-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const view = String(button.dataset.view || "stage");
    if (button.disabled) {
      return;
    }
    showView(view);
    if (view === "ranking") {
      renderRanking();
    }
    if (view === "achievements") {
      renderAchievements();
    }
    if (view === "profile") {
      renderProfile();
    }
  });
});

if (rankingMode) {
  rankingMode.addEventListener("change", renderRanking);
}

if (rankingClearButton) {
  rankingClearButton.addEventListener("click", () => {
    openConfirmModal({
      title: "确认清除本地数据",
      copy: "这会清除本机历史、成就解锁与档案统计，且不可恢复。",
      onConfirm: clearAllLocalData
    });
  });
}

if (profileClearButton) {
  profileClearButton.addEventListener("click", () => {
    openConfirmModal({
      title: "确认清除本地数据",
      copy: "这会清除本机历史、成就解锁与档案统计，且不可恢复。",
      onConfirm: clearAllLocalData
    });
  });
}

if (achievementsResetSeenButton) {
  achievementsResetSeenButton.addEventListener("click", () => {
    const state = getAchievementState();
    state.seen = {};
    setAchievementState(state);
    renderAchievements();
    const unseen = getUnseenUnlockedAchievements();
    if (unseen.length) {
      openAchievementModal(unseen);
    }
  });
}

function getUnseenUnlockedAchievements() {
  if (!achievementsDefinition.length) {
    return [];
  }
  const state = getAchievementState();
  const ids = Object.keys(state.unlocked || {}).filter((id) => !state.seen?.[id]);
  return ids
    .map((id) => achievementsDefinition.find((item) => String(item?.id || "").trim() === id))
    .filter(Boolean);
}

async function init() {
  await loadAchievementsDefinition();
  renderSettlementHistory();
  renderRanking();
  renderProfile();
  renderAchievements();
  updateNavLocks();
  const unseen = getUnseenUnlockedAchievements();
  if (unseen.length) {
    openAchievementModal(unseen);
  }
  resetAudio();
}

init();
