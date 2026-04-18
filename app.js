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
const dimensionBox = document.querySelector("#dimensionBox");
const dimensionTotal = document.querySelector("#dimensionTotal");
const dimensionChips = document.querySelector("#dimensionBars");
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
const topbarTablist = document.querySelector('[role="tablist"]');
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
const toastHost = document.querySelector("#toastHost");

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
let currentScoreValue = null;

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function clampNumber(value, min, max) {
  const safe = Number(value);
  if (!Number.isFinite(safe)) {
    return min;
  }
  return Math.max(min, Math.min(max, safe));
}

function animateValue({ from, to, durationMs, onUpdate, onComplete }) {
  if (prefersReducedMotion() || durationMs <= 0) {
    onUpdate(to);
    onComplete?.();
    return;
  }

  const start = performance.now();
  const delta = to - from;

  const tick = (now) => {
    const progress = clampNumber((now - start) / durationMs, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    onUpdate(from + delta * eased);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  requestAnimationFrame(tick);
}

function applyViewEnter(section) {
  if (!section) {
    return;
  }
  section.classList.remove("view-enter");
  requestAnimationFrame(() => {
    section.classList.add("view-enter");
    window.setTimeout(() => section.classList.remove("view-enter"), 420);
  });
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
  currentScoreValue = null;
  setScore(null);
  gradeText.textContent = "等待一声哈基米";
  commentText.textContent = "录音完成后点击检测，结果会在这里冒出来。";
  personalityBox.hidden = true;
  personalityCodeText.textContent = "--";
  personalityNameText.textContent = "--";
  personalityTitleText.textContent = "--";
  personalityMatchText.textContent = "--";
  personalityFunCopyText.textContent = "";
  dimensionBox.hidden = true;
  dimensionTotal.textContent = "--%";
  dimensionChips.replaceChildren();
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
  setTabDisabled(navSettlement, true);
  updateNavLocks();
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

function setTabDisabled(button, disabled) {
  if (!button) {
    return;
  }
  button.disabled = disabled;
  button.setAttribute("aria-disabled", disabled ? "true" : "false");
  if (disabled) {
    button.setAttribute("tabindex", "-1");
  }
}

function normalizeTargetView(view) {
  const raw = String(view || "").trim();
  const target = raw || "stage";
  const hasRuns = getRuns().length > 0;
  if (target === "settlement" && !latestResult) {
    return "stage";
  }
  if ((target === "achievements" || target === "profile") && !hasRuns) {
    return "stage";
  }
  if (target === "stage" || target === "settlement" || target === "ranking" || target === "achievements" || target === "profile") {
    return target;
  }
  return "stage";
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
    const selected = key === view;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", selected ? "true" : "false");
    if (!button.disabled) {
      button.setAttribute("tabindex", selected ? "0" : "-1");
    } else {
      button.setAttribute("tabindex", "-1");
    }
  });
}

function showView(view) {
  const target = normalizeTargetView(view);

  currentView = target;
  stagePage.hidden = target !== "stage";
  settlementPage.hidden = target !== "settlement";
  rankingPage.hidden = target !== "ranking";
  achievementsPage.hidden = target !== "achievements";
  profilePage.hidden = target !== "profile";
  applyViewEnter(
    target === "stage"
      ? stagePage
      : target === "settlement"
        ? settlementPage
        : target === "ranking"
          ? rankingPage
          : target === "achievements"
            ? achievementsPage
            : profilePage
  );
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

  const safeValue = clampNumber(value, 0, 100);
  const from = Number.isFinite(currentScoreValue) ? currentScoreValue : 0;
  currentScoreValue = safeValue;

  animateValue({
    from,
    to: safeValue,
    durationMs: 720,
    onUpdate: (next) => {
      const rounded = Math.round(clampNumber(next, 0, 100));
      const level = getScoreLevel(rounded);
      scoreText.textContent = `${rounded}%`;
      scoreRing.style.strokeDashoffset = ringLength - (ringLength * rounded) / 100;
      scoreRing.style.stroke = level.color;
      scoreRing.dataset.level = level.name;
      updateSettlementScore(rounded);
    }
  });
}

function updateSettlementScore(value) {
  if (value === null) {
    settlementCat.src = scoreAssets.idle;
    settlementScore.style.setProperty("--score-percent", "0%");
    settlementScore.style.setProperty("--score-color", "var(--teal)");
    settlementScore.dataset.level = "idle";
    return;
  }

  const safeValue = clampNumber(value, 0, 100);
  const level = getScoreLevel(safeValue);
  settlementCat.src = level.asset;
  settlementScore.style.setProperty("--score-color", level.color);
  settlementScore.dataset.level = level.name;

  const existing = String(settlementScore.style.getPropertyValue("--score-percent") || "").trim();
  const fromValue = Number(existing.replace("%", ""));
  animateValue({
    from: Number.isFinite(fromValue) ? fromValue : 0,
    to: safeValue,
    durationMs: 720,
    onUpdate: (next) => settlementScore.style.setProperty("--score-percent", `${Math.round(clampNumber(next, 0, 100))}%`)
  });
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

function parseColorToken(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  if (raw.startsWith("#")) {
    return raw;
  }
  if (raw.includes("var(--green)")) {
    return "#3a9f6f";
  }
  if (raw.includes("var(--yellow)")) {
    return "#f2c14e";
  }
  if (raw.includes("var(--red)")) {
    return "#d7263d";
  }
  if (raw.includes("var(--teal)")) {
    return "#118a8a";
  }
  return raw;
}

function getReadableTextColor(hex) {
  const raw = String(hex || "").trim();
  if (!raw.startsWith("#") || (raw.length !== 7 && raw.length !== 4)) {
    return "#171717";
  }
  const normalized =
    raw.length === 4
      ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
      : raw;
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;
  const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return l > 0.62 ? "#171717" : "#ffffff";
}

function hexToRgba(hex, alpha) {
  const raw = String(hex || "").trim();
  const normalized =
    raw.length === 4
      ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
      : raw;
  if (!normalized.startsWith("#") || normalized.length !== 7) {
    return `rgba(17, 17, 17, ${clampNumber(alpha, 0, 1)})`;
  }
  const r = parseInt(normalized.slice(1, 3), 16);
  const g = parseInt(normalized.slice(3, 5), 16);
  const b = parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${clampNumber(alpha, 0, 1)})`;
}

function roundRectPath(context, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(Math.min(w, h) / 2, Number(r) || 0));
  if (context.roundRect) {
    context.roundRect(x, y, w, h, radius);
    return;
  }
  context.moveTo(x + radius, y);
  context.arcTo(x + w, y, x + w, y + h, radius);
  context.arcTo(x + w, y + h, x, y + h, radius);
  context.arcTo(x, y + h, x, y, radius);
  context.arcTo(x, y, x + w, y, radius);
  context.closePath();
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
  const profile = result?.personalityProfile || {};
  const name = String(profile?.name || "").trim() || String(result?.grade || "—");
  const title = String(profile?.title || "").trim();
  const code = String(profile?.code || result?.personalityCode || "").trim();
  const emoji = String(profile?.emoji || "🐱").trim();
  const funCopy = String(profile?.funCopy || result?.comment || "").trim();
  const tags = Array.isArray(profile?.tags) ? profile.tags : [];
  const portrait = profile?.portrait6d && typeof profile.portrait6d === "object" ? profile.portrait6d : {};
  const hisTitle = String(result?.hisLevelInfo?.title || "").trim();
  const hisValue = Number.isFinite(Number(result?.audioHis)) ? Number(result.audioHis) : null;
  const personalityMatchValue = Number.isFinite(Number(result?.personalityMatch))
    ? clampNumber(Number(result.personalityMatch), 0, 100)
    : null;

  const level = getScoreLevel(result.similarity);
  const personaTheme = String(profile?.themeColor || "").trim();
  const accent = parseColorToken(personaTheme || level.color) || "#118a8a";
  const accentText = getReadableTextColor(accent);
  const accentSoft = hexToRgba(accent, 0.14);
  const accentSoft2 = hexToRgba(accent, 0.08);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fffaf2";
  context.fillRect(0, 0, width, height);

  const frame = 34;
  const cardX = frame;
  const cardY = frame;
  const cardW = width - frame * 2;
  const cardH = height - frame * 2;

  context.save();
  context.beginPath();
  roundRectPath(context, cardX, cardY, cardW, cardH, 36);
  context.clip();

  const bg = context.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
  bg.addColorStop(0, accentSoft);
  bg.addColorStop(0.62, "rgba(255, 250, 242, 0)");
  bg.addColorStop(1, accentSoft2);
  context.fillStyle = bg;
  context.fillRect(cardX, cardY, cardW, cardH);

  context.fillStyle = "#ffffff";
  context.globalAlpha = 0.88;
  context.fillRect(cardX + 18, cardY + 18, cardW - 36, cardH - 36);
  context.globalAlpha = 1;

  context.textAlign = "left";
  context.fillStyle = "#171717";
  context.font = "900 26px Microsoft YaHei, sans-serif";
  context.fillText("哈气模拟器", cardX + 56, cardY + 74);
  context.fillStyle = "#8b7355";
  context.font = "700 20px Microsoft YaHei, sans-serif";
  context.fillText("Hajimi Type · 人格与特性", cardX + 56, cardY + 108);

  context.textAlign = "center";
  context.fillStyle = "#171717";
  context.font = "900 90px Microsoft YaHei, sans-serif";
  context.fillText(emoji, width / 2, cardY + 240);

  context.fillStyle = "#171717";
  context.font = "900 54px Microsoft YaHei, sans-serif";
  context.fillText(`「${name}」`, width / 2, cardY + 330);

  context.fillStyle = "#8b7355";
  context.font = "800 26px Microsoft YaHei, sans-serif";
  context.fillText(title || "—", width / 2, cardY + 372);

  context.fillStyle = "#171717";
  context.font = "900 28px Microsoft YaHei, sans-serif";
  const codeLine = [code ? `代号 ${code}` : null, personalityMatchValue === null ? null : `匹配度 ${Math.round(personalityMatchValue)}%`, hisTitle ? `HIS ${hisTitle}` : null]
    .filter(Boolean)
    .join("  ·  ");
  context.fillText(codeLine || "—", width / 2, cardY + 422);

  if (hisValue !== null) {
    context.fillStyle = accent;
    context.font = "900 34px Microsoft YaHei, sans-serif";
    context.fillText(`HIS ${hisValue.toFixed(1)}`, width / 2, cardY + 472);
  }

  const textX = cardX + 74;
  const textW = cardW - 148;
  context.textAlign = "left";
  context.fillStyle = "#171717";
  context.font = "900 28px Microsoft YaHei, sans-serif";
  context.fillText("特性描述", textX, cardY + 540);

  context.fillStyle = "#646464";
  context.font = "700 26px Microsoft YaHei, sans-serif";
  drawWrappedText(context, funCopy || "—", textX, cardY + 586, textW, 38, 5);

  const traitOrder = ["响度", "音调", "持久", "混沌", "稳定", "爆发"];
  const traitY = cardY + 780;
  context.fillStyle = "#171717";
  context.font = "900 28px Microsoft YaHei, sans-serif";
  context.fillText("特性分布", textX, traitY);

  const barX = textX;
  const barW = textW;
  const barH = 16;
  const rowH = 54;
  const startY = traitY + 32;
  traitOrder.forEach((key, index) => {
    const raw = Number(portrait?.[key]);
    const value = Number.isFinite(raw) ? clampNumber(raw, 0, 10) : 0;
    const y = startY + index * rowH;

    context.fillStyle = "#8b7355";
    context.font = "900 22px Microsoft YaHei, sans-serif";
    context.fillText(key, barX, y);

    context.textAlign = "right";
    context.fillStyle = "#8b7355";
    context.font = "900 22px Microsoft YaHei, sans-serif";
    context.fillText(String(Math.round(value)), barX + barW, y);
    context.textAlign = "left";

    const trackY = y + 14;
    context.save();
    context.fillStyle = "#f8f0e8";
    context.beginPath();
    roundRectPath(context, barX, trackY, barW, barH, 999);
    context.fill();
    context.fillStyle = accent;
    context.beginPath();
    roundRectPath(context, barX, trackY, Math.max(0, (barW * value) / 10), barH, 999);
    context.fill();
    context.restore();
  });

  if (tags.length) {
    const tagLine = tags.slice(0, 5).join("  ");
    context.textAlign = "center";
    context.fillStyle = "#8b7355";
    context.font = "800 22px Microsoft YaHei, sans-serif";
    context.fillText(tagLine, width / 2, cardY + cardH - 116);
  }

  context.textAlign = "center";
  context.fillStyle = "#b8a48c";
  context.font = "800 20px Microsoft YaHei, sans-serif";
  context.fillText("长按保存 / 截图分享", width / 2, cardY + cardH - 72);

  context.restore();

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
  showToast({ title: "已复制分享文案", copy: "打开微信/朋友圈粘贴即可。" });
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
  renderDimensions(result);
  renderReasons(result.reasons);
  renderHisLevel(result);
  settlementBadge.textContent = getBadgeText(result.similarity);
  settlementLead.textContent = getLeadText(result.similarity);
  latestShareCopy = buildShareCopy(result);
  shareText.textContent = latestShareCopy;
  setTabDisabled(navSettlement, false);
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
  const themeColor = String(profile.themeColor || "").trim();

  personalityBox.hidden = false;
  personalityCodeText.textContent = code || "--";
  personalityNameText.textContent = name || "--";
  personalityTitleText.textContent = title || "--";
  personalityMatchText.textContent = match === null ? "--" : String(match);
  personalityFunCopyText.textContent = funCopy;
  personalityBox.style.borderColor = themeColor || "";
  personalityBox.style.background = themeColor ? `color-mix(in srgb, ${themeColor} 10%, transparent)` : "";
}

function renderDimensions(result) {
  const matches = Array.isArray(result?.dimensionMatches) ? result.dimensionMatches : [];
  const matchValue = Number.isFinite(result?.personalityMatch) ? result.personalityMatch : Number(result?.personalityMatch);
  const totalMatch = Number.isFinite(matchValue) ? clampNumber(matchValue, 0, 100) : null;

  dimensionChips.replaceChildren();
  if (!matches.length) {
    dimensionBox.hidden = true;
    dimensionTotal.textContent = "--%";
    return;
  }

  dimensionBox.hidden = false;
  dimensionTotal.textContent = totalMatch === null ? "--%" : `${Math.round(totalMatch)}%`;

  matches
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      dimension: String(item.dimension || "").trim(),
      letter: String(item.letter || "").trim(),
      match: clampNumber(item.match, 0, 100)
    }))
    .filter((item) => item.dimension || item.letter)
    .slice(0, 4)
    .forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "dimension-chip";

      const dim = document.createElement("strong");
      dim.className = "dimension-chip-dimension";
      dim.textContent = item.dimension || "维度";

      const letter = document.createElement("span");
      letter.className = "dimension-chip-letter";
      letter.textContent = item.letter || "--";

      const match = document.createElement("span");
      match.className = "dimension-chip-match";
      match.textContent = `${item.match}%`;

      chip.append(dim, " · ", letter, " · ", match);
      dimensionChips.append(chip);
    });
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
  setTabDisabled(navStage, false);
  setTabDisabled(navRanking, false);
  setTabDisabled(navAchievements, !hasRuns);
  setTabDisabled(navProfile, !hasRuns);
  setTabDisabled(navSettlement, !latestResult);
  const normalized = normalizeTargetView(currentView);
  if (normalized !== currentView) {
    showView(normalized);
  } else {
    setActiveNav(currentView);
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
        chip.className = "chip is-accent";
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
  showToast({ title: "已清除本地记录", copy: "排行榜与档案已同步更新。" });
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
  showToast({ title: "已清除本地数据", copy: "包含历史、成就与档案统计。" });
}

function showToast(options) {
  if (!toastHost) {
    return;
  }
  const title = String(options?.title || "").trim() || "提示";
  const copy = String(options?.copy || "").trim();
  const actionText = String(options?.actionText || "").trim();
  const onAction = typeof options?.onAction === "function" ? options.onAction : null;
  const duration = clampNumber(options?.durationMs ?? 2200, 600, 8000);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <div>
      <p class="toast-title">${title}</p>
      ${copy ? `<p class="toast-copy">${copy}</p>` : ""}
    </div>
    <div class="toast-actions"></div>
  `;

  const actions = toast.querySelector(".toast-actions");
  if (actionText && actions) {
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.textContent = actionText;
    actionBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      onAction?.();
      dismiss();
    });
    actions.append(actionBtn);
  }

  const dismiss = () => {
    if (!toast.isConnected) {
      return;
    }
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), prefersReducedMotion() ? 0 : 260);
  };

  toast.addEventListener("click", dismiss);
  toastHost.prepend(toast);
  window.setTimeout(dismiss, duration);
}

shareButton.addEventListener("click", async () => {
  if (!latestShareCopy) {
    return;
  }

  try {
    if (await shareGeneratedImage()) {
      showToast({ title: "已唤起系统分享", copy: "选择渠道发送即可。" });
      return;
    }

    if (navigator.share) {
      await navigator.share({
        title: "我的哈基米结算单",
        text: latestShareCopy,
        url: window.location.href
      });
      showToast({ title: "分享完成", copy: "哈基米宇宙已收到你的广播。" });
      return;
    }

    await navigator.clipboard.writeText(latestShareCopy);
    showToast({ title: "已复制分享文案", copy: "可直接粘贴到聊天或动态。" });
  } catch (error) {
    showToast({ title: "分享未完成", copy: "浏览器未授权或渠道不可用。" });
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
  showToast({ title: "已开始下载", copy: "如果被拦截，请检查浏览器下载设置。" });
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
  const activate = () => {
    const view = String(button.dataset.view || "stage");
    if (button.disabled) {
      return;
    }
    const target = normalizeTargetView(view);
    showView(target);
    if (target === "ranking") {
      renderRanking();
    }
    if (target === "achievements") {
      renderAchievements();
    }
    if (target === "profile") {
      renderProfile();
    }
  };

  button.addEventListener("click", activate);
  button.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

if (topbarTablist) {
  const tabs = [navStage, navSettlement, navRanking, navAchievements, navProfile].filter(Boolean);
  const getEnabledTabs = () => tabs.filter((tab) => !tab.disabled);
  topbarTablist.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "Home" && event.key !== "End") {
      return;
    }
    const enabled = getEnabledTabs();
    if (!enabled.length) {
      return;
    }
    const active = document.activeElement;
    const currentIndex = enabled.indexOf(active);
    const selectedIndex = enabled.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
    const baseIndex = currentIndex >= 0 ? currentIndex : selectedIndex >= 0 ? selectedIndex : 0;
    let next = enabled[0];

    if (event.key === "Home") {
      next = enabled[0];
    } else if (event.key === "End") {
      next = enabled[enabled.length - 1];
    } else if (event.key === "ArrowRight") {
      next = enabled[(baseIndex + 1) % enabled.length] || enabled[0];
    } else if (event.key === "ArrowLeft") {
      next = enabled[(baseIndex - 1 + enabled.length) % enabled.length] || enabled[enabled.length - 1];
    }

    event.preventDefault();
    next?.focus();
  });
}

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
