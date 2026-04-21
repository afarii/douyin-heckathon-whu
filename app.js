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
const templateCompareBox = document.querySelector("#templateCompareBox");
const templateCompareTotal = document.querySelector("#templateCompareTotal");
const templateCompareMeta = document.querySelector("#templateCompareMeta");
const templateCompareBars = document.querySelector("#templateCompareBars");
const templateCompareShareButton = document.querySelector("#templateCompareShareButton");
const challengeCompareBox = document.querySelector("#challengeCompareBox");
const challengeCompareTotal = document.querySelector("#challengeCompareTotal");
const challengeCompareMeta = document.querySelector("#challengeCompareMeta");
const challengeCompareBars = document.querySelector("#challengeCompareBars");
const challengeCompareShareButton = document.querySelector("#challengeCompareShareButton");
const shareText = document.querySelector("#shareText");
const reasonList = document.querySelector("#reasonList");
const historyList = document.querySelector("#historyList");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const shareImage = document.querySelector("#shareImage");
const shareCanvas = document.querySelector("#shareCanvas");
const shareButton = document.querySelector("#shareButton");
const challengeCreateButton = document.querySelector("#challengeCreateButton");
const saveShareButton = document.querySelector("#saveShareButton");
const wechatShareButton = document.querySelector("#wechatShareButton");
const qqShareButton = document.querySelector("#qqShareButton");
const douyinShareButton = document.querySelector("#douyinShareButton");
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
const rankingShareButton = document.querySelector("#rankingShareButton");
const rankingSubtabBoard = document.querySelector("#rankingSubtabBoard");
const rankingSubtabRanked = document.querySelector("#rankingSubtabRanked");
const rankingSubtabPk = document.querySelector("#rankingSubtabPk");
const rankingBoardView = document.querySelector("#rankingBoardView");
const rankingRankedView = document.querySelector("#rankingRankedView");
const rankingPkView = document.querySelector("#rankingPkView");
const rankedSeasonMeta = document.querySelector("#rankedSeasonMeta");
const rankedSeasonTitle = document.querySelector("#rankedSeasonTitle");
const rankedTier = document.querySelector("#rankedTier");
const rankedPoints = document.querySelector("#rankedPoints");
const rankedShield = document.querySelector("#rankedShield");
const rankedStreak = document.querySelector("#rankedStreak");
const rankedFirstWin = document.querySelector("#rankedFirstWin");
const rankedTierList = document.querySelector("#rankedTierList");
const rankedMatchList = document.querySelector("#rankedMatchList");
const rankedShareButton = document.querySelector("#rankedShareButton");
const pkShareButton = document.querySelector("#pkShareButton");
const pkHint = document.querySelector("#pkHint");
const pkList = document.querySelector("#pkList");
const achievementsGrid = document.querySelector("#achievementsGrid");
const achievementsResetSeenButton = document.querySelector("#achievementsResetSeenButton");
const achievementsShareButton = document.querySelector("#achievementsShareButton");
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
const shareModal = document.querySelector("#shareModal");
const shareModalClose = document.querySelector("#shareModalClose");
const shareModalTitle = document.querySelector("#shareModalTitle");
const shareModalCopy = document.querySelector("#shareModalCopy");
const shareModalImage = document.querySelector("#shareModalImage");
const shareModalCanvas = document.querySelector("#shareModalCanvas");
const shareModalQr = document.querySelector("#shareModalQr");
const shareModalQrHint = document.querySelector("#shareModalQrHint");
const shareModalCopyButton = document.querySelector("#shareModalCopyButton");
const shareModalCopyLinkButton = document.querySelector("#shareModalCopyLinkButton");
const shareModalSavePosterButton = document.querySelector("#shareModalSavePosterButton");
const shareModalUniversalButton = document.querySelector("#shareModalUniversalButton");
const shareModalWechatButton = document.querySelector("#shareModalWechatButton");
const shareModalQqButton = document.querySelector("#shareModalQqButton");
const shareModalDouyinButton = document.querySelector("#shareModalDouyinButton");
const shareTypePersonality = document.querySelector("#shareTypePersonality");
const shareTypeTemplate = document.querySelector("#shareTypeTemplate");
const shareTypeChallenge = document.querySelector("#shareTypeChallenge");
const shareTypePk = document.querySelector("#shareTypePk");
const shareTypeRanked = document.querySelector("#shareTypeRanked");
const shareTypeAchievements = document.querySelector("#shareTypeAchievements");
const toastHost = document.querySelector("#toastHost");
const referenceStatus = document.querySelector("#referenceStatus");
const referencePanel = document.querySelector("#referencePanel");
const referenceBody = document.querySelector("#referenceBody");
const referenceCollapseButton = document.querySelector("#referenceCollapseButton");
const referencePersonalitySelect = document.querySelector("#referencePersonality");
const referenceDifficultySelect = document.querySelector("#referenceDifficulty");
const referenceRecommendedButton = document.querySelector("#referenceRecommendedButton");
const referenceList = document.querySelector("#referenceList");

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
let referenceAudioDefinition = null;
let selectedTemplateId = "";

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
let currentUserId = "";
let incomingChallengeCode = "";
let incomingChallenge = null;
let currentRankingSubtab = "board";
let latestChallengeLink = "";
let latestChallengeCode = "";
let latestShareModalBlob = null;
let latestShareModalUrl = "";
let currentShareType = "personality";

const pkMatchesKey = "hachimi-pk-matches-v1";
const rankedLegacyKey = "hachimi-ranked-v1";
const rankedKey = "hachimi-ranked-v2";
const referenceCollapsedKey = "hachimi-reference-collapsed-v1";

function setReferenceCollapsed(collapsed, persist = true) {
  if (!referencePanel || !referenceBody || !referenceCollapseButton) {
    return;
  }
  const next = Boolean(collapsed);
  referencePanel.classList.toggle("is-collapsed", next);
  referenceBody.hidden = next;
  referenceCollapseButton.setAttribute("aria-expanded", next ? "false" : "true");
  referenceCollapseButton.textContent = next ? "展开" : "收起";
  if (persist) {
    localStorage.setItem(referenceCollapsedKey, next ? "1" : "0");
  }
}

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

function normalizeReferenceId(value) {
  return String(value || "").trim().toUpperCase();
}

function getOrCreateUserId() {
  const key = "hachimi-user-id-v1";
  const existing = String(localStorage.getItem(key) || "").trim();
  if (existing) {
    return existing;
  }
  const next =
    (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `u_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`) || "";
  localStorage.setItem(key, next);
  return next;
}

function getChallengeCodeFromPathname(pathname) {
  const path = String(pathname || "");
  const match = path.match(/^\/(?:challenge|c)\/([0-9A-Za-z]{12})\/?$/);
  return match ? String(match[1] || "").trim() : "";
}

function scoreLinear({ actual, target, tolerance }) {
  const a = Number(actual);
  const t = Number(target);
  const tol = Math.max(0.000001, Number(tolerance));
  if (!Number.isFinite(a) || !Number.isFinite(t) || !Number.isFinite(tol)) {
    return 0;
  }
  return clampNumber(1 - Math.abs(a - t) / tol, 0, 1);
}

function scoreRatio({ actual, target, tolerance }) {
  const a = Number(actual);
  const t = Number(target);
  const tol = Math.max(0.000001, Number(tolerance));
  if (!Number.isFinite(a) || !Number.isFinite(t) || a <= 0 || t <= 0 || !Number.isFinite(tol)) {
    return 0;
  }
  const ratio = Math.abs(Math.log(a / t));
  return clampNumber(1 - ratio / tol, 0, 1);
}

function templateGradeInfo(score) {
  const safe = clampNumber(score, 0, 140);
  if (safe >= 130) {
    return { grade: "SS+", copy: "你……就是耄耋转世吧？", color: "#FFD700", sparkle: true };
  }
  if (safe >= 115) {
    return { grade: "SS", copy: "耄耋看了都要竖大拇指！", color: "#FFD700", sparkle: false };
  }
  if (safe >= 100) {
    return { grade: "S", copy: "相当不错！耄耋认可你的哈气！", color: "#8A2BE2", sparkle: false };
  }
  if (safe >= 80) {
    return { grade: "A", copy: "有点意思，继续练练！", color: "#4169E1", sparkle: false };
  }
  if (safe >= 60) {
    return { grade: "B", copy: "还行吧，至少是哈气了。", color: "#00CED1", sparkle: false };
  }
  if (safe >= 40) {
    return { grade: "C", copy: "这……是哈气吗？再练练。", color: "#32CD32", sparkle: false };
  }
  if (safe >= 20) {
    return { grade: "D", copy: "你确定你在哈气？感觉在吹气。", color: "#FFD166", sparkle: false };
  }
  return { grade: "F", copy: "……这不是哈气，这是呼吸。", color: "#FFB6C1", sparkle: false };
}

function computeTemplateDimScore({ userValue, templateValue, base, step, bonusPerStep, bonusCap }) {
  const user = Number(userValue);
  const tpl = Number(templateValue);
  const stepSize = Number(step);
  if (!Number.isFinite(user) || !Number.isFinite(tpl) || !Number.isFinite(stepSize) || stepSize <= 0) {
    return { win: null, points: 0, bonus: 0 };
  }
  if (user < tpl) {
    return { win: false, points: 0, bonus: 0 };
  }
  const diff = user - tpl;
  const steps = Math.max(0, Math.floor((diff + 1e-9) / stepSize));
  const bonus = clampNumber(steps * Number(bonusPerStep), 0, Number(bonusCap));
  const points = Number(base) + bonus;
  return { win: true, points, bonus };
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
  if (templateCompareBox) {
    templateCompareBox.hidden = true;
  }
  if (templateCompareTotal) {
    templateCompareTotal.textContent = "--/140";
  }
  if (templateCompareMeta) {
    templateCompareMeta.textContent = "";
  }
  templateCompareBars?.replaceChildren();
  if (challengeCompareBox) {
    challengeCompareBox.hidden = true;
  }
  if (challengeCompareTotal) {
    challengeCompareTotal.textContent = "--/100";
  }
  if (challengeCompareMeta) {
    challengeCompareMeta.textContent = "";
  }
  challengeCompareBars?.replaceChildren();
  shareImage.hidden = true;
  shareImage.removeAttribute("src");
  saveShareButton.disabled = true;
  wechatShareButton.disabled = true;
  qqShareButton.disabled = true;
  douyinShareButton.disabled = true;
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
  renderRankedSeason();
  renderPkMatches();
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
  douyinShareButton.disabled = false;
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
  const mapped = platform === "weibo" ? "douyin" : String(platform || "");
  openShareModal({ type: "personality", preferPlatform: mapped });
}

async function uploadAudio() {
  const uploadBlob = await toWavBlob(audioBlob);
  const referenceBlob = await getReferenceWavBlob();
  const formData = new FormData();
  formData.append("audio", uploadBlob, audioFileName.replace(/\.[^.]+$/, "") + ".wav");
  if (referenceBlob) {
    formData.append("reference", referenceBlob, "haqi-reference.wav");
  }
  if (incomingChallengeCode) {
    formData.append("challengeCode", incomingChallengeCode);
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

async function loadIncomingChallenge(code) {
  const challengeCode = String(code || "").trim();
  if (!challengeCode) {
    incomingChallenge = null;
    return null;
  }
  try {
    const response = await fetch(`/api/challenge/${encodeURIComponent(challengeCode)}`);
    if (!response.ok) {
      let message = `挑战加载失败：${response.status}`;
      try {
        const payload = await response.json();
        if (payload?.error) {
          message = payload.error;
        }
      } catch (error) {
      }
      incomingChallenge = null;
      showToast({ title: "挑战无效", copy: message });
      return null;
    }
    const payload = await response.json();
    const challenge = payload?.challenge && typeof payload.challenge === "object" ? payload.challenge : null;
    incomingChallenge = challenge;
    if (challenge) {
      const masked = String(challenge?.creator?.userIdMasked || "").trim();
      showToast({
        title: "收到好友PK挑战",
        copy: masked ? `对手：${masked}。完成检测后自动结算。` : "完成检测后自动结算。"
      });
    }
    return challenge;
  } catch (error) {
    incomingChallenge = null;
    showToast({ title: "挑战加载失败", copy: "网络异常或后端不可用。" });
    return null;
  }
}

async function createChallenge() {
  if (!audioBlob || !latestResult) {
    showToast({ title: "还不能发起PK", copy: "先完成一次检测，再生成好友挑战码。" });
    return null;
  }
  if (!currentUserId) {
    currentUserId = getOrCreateUserId();
  }

  try {
    const uploadBlob = await toWavBlob(audioBlob);
    const formData = new FormData();
    formData.append("audio", uploadBlob, audioFileName.replace(/\.[^.]+$/, "") + ".wav");
    formData.append("userId", currentUserId);
    formData.append("result", JSON.stringify(latestResult));

    const response = await fetch("/api/challenge/create", { method: "POST", body: formData });
    if (!response.ok) {
      let message = `创建挑战失败：${response.status}`;
      try {
        const payload = await response.json();
        if (payload?.error) {
          message = payload.error;
        }
      } catch (error) {
      }
      showToast({ title: "创建失败", copy: message });
      return null;
    }

    const payload = await response.json();
    const code = String(payload?.code || "").trim();
    const urlPath = String(payload?.url || "").trim();
    const fullUrl = urlPath ? new URL(urlPath, window.location.origin).toString() : code ? `${window.location.origin}/challenge/${code}` : "";
    if (!code || !fullUrl) {
      showToast({ title: "创建失败", copy: "后端未返回有效挑战码。" });
      return null;
    }

    const appended = `${buildShareCopy(latestResult)}\n\n来PK：${fullUrl}`;
    latestShareCopy = appended;
    shareText.textContent = latestShareCopy;
    latestChallengeLink = fullUrl;
    latestChallengeCode = code;
    try {
      await navigator.clipboard?.writeText?.(fullUrl);
      showToast({ title: "挑战链接已复制", copy: "发给好友，让Ta来一声哈基米。" });
    } catch (error) {
      showToast({ title: "挑战已生成", copy: fullUrl, durationMs: 5200 });
    }
    openShareModal({ type: "challenge" });
    return { code, url: fullUrl };
  } catch (error) {
    showToast({ title: "创建失败", copy: "网络异常或浏览器不支持。" });
    return null;
  }
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
  const templateComparison = computeTemplateComparison(result, getSelectedTemplate());
  renderTemplateComparison(templateComparison);
  const pkPayload = result?.pk && typeof result.pk === "object" ? result.pk : null;
  const pkComparison = pkPayload?.result && typeof pkPayload.result === "object" ? pkPayload.result : null;
  const pkChallenge = pkPayload?.challenge && typeof pkPayload.challenge === "object" ? pkPayload.challenge : null;
  renderChallengeComparison(pkComparison, pkChallenge);
  settlementBadge.textContent = getBadgeText(result.similarity);
  settlementLead.textContent = getLeadText(result.similarity);
  latestShareCopy = buildShareCopy(result);
  shareText.textContent = latestShareCopy;
  setTabDisabled(navSettlement, false);
  const run = addRun(result);
  applyRankedMatchFromRun(run);
  if (pkComparison && pkChallenge) {
    recordPkMatch({ comparison: pkComparison, challenge: pkChallenge, run });
  }
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

  const getRunDescription = (run) => {
    const profile = run?.personalityProfile && typeof run.personalityProfile === "object" ? run.personalityProfile : null;
    const core = String(profile?.coreDescription || "").trim();
    const fun = String(profile?.funCopy || "").trim();
    const raw = (core || fun).replace(/\s+/g, " ").trim();
    if (!raw) {
      return "";
    }
    return raw.length > 48 ? `${raw.slice(0, 48)}…` : raw;
  };

  const getRunTitle = (run) => {
    const profile = run?.personalityProfile && typeof run.personalityProfile === "object" ? run.personalityProfile : null;
    const emoji = String(profile?.emoji || "").trim();
    const name = String(profile?.name || "").trim();
    const code = String(run?.personalityCode || profile?.code || "").trim();
    const title = name || (code ? `人格 ${code}` : "人格未识别");
    return emoji ? `${emoji} ${title}` : title;
  };

  const renderList = (list, hint) => {
    rankingHint.textContent = hint;
    list.slice(0, 30).forEach((run, index) => {
      const li = document.createElement("li");
      li.style.setProperty("--history-color", getRankingColor(run));
      const hisText = Number.isFinite(Number(run.audioHis)) ? `HIS ${formatHisValue(Number(run.audioHis))}` : "HIS --";
      const personalityTitle = getRunTitle(run);
      const description = getRunDescription(run);
      const hisTitle = String(run?.hisLevelInfo?.title || "").trim();
      const code = String(run?.personalityCode || run?.personalityProfile?.code || "").trim();
      const similarityText = `${Math.max(0, Math.min(100, Math.round(Number(run?.similarity) || 0)))}%`;
      const metaParts = [code || null, hisTitle || null, similarityText, formatHistoryTime(Number(run?.createdAt) || Date.now())].filter(Boolean);
      li.innerHTML = `
        <span class="rank">#${index + 1}</span>
        <span class="score">${hisText}</span>
        <span class="title">${personalityTitle}</span>
        <span class="meta">${metaParts.join(" · ")}</span>
        ${description ? `<span class="desc">${description}</span>` : ""}
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
  localStorage.removeItem(rankedLegacyKey);
  localStorage.removeItem(rankedKey);
  localStorage.removeItem(pkMatchesKey);
  latestResult = null;
  updateNavLocks();
  renderSettlementHistory();
  renderRanking();
  renderRankedSeason();
  renderPkMatches();
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
  localStorage.removeItem(rankedLegacyKey);
  localStorage.removeItem(rankedKey);
  localStorage.removeItem(pkMatchesKey);
  latestResult = null;
  updateNavLocks();
  renderSettlementHistory();
  renderRanking();
  renderRankedSeason();
  renderPkMatches();
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

shareButton.addEventListener("click", () => {
  openShareModal({ type: "personality" });
});

if (challengeCreateButton) {
  challengeCreateButton.addEventListener("click", createChallenge);
}

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
douyinShareButton.addEventListener("click", () => openPlatformShare("douyin"));

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
      setRankingSubtab(currentRankingSubtab);
      renderRanking();
      renderRankedSeason();
      renderPkMatches();
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

function buildDifficultyStars(level) {
  const safe = clampNumber(level, 0, 6);
  return "⭐".repeat(Math.max(0, Math.min(6, Math.round(safe))));
}

function getReferenceById(referenceId) {
  const id = normalizeReferenceId(referenceId);
  if (!id) {
    return null;
  }
  const references = Array.isArray(referenceAudioDefinition?.references) ? referenceAudioDefinition.references : [];
  return (
    references.find((entry) => entry && typeof entry === "object" && normalizeReferenceId(entry.id) === id) ?? null
  );
}

function getSelectedTemplate() {
  return getReferenceById(selectedTemplateId);
}

function personalityMatchPercent(userCode, templateCode) {
  const user = String(userCode || "").trim().toUpperCase();
  const template = String(templateCode || "").trim().toUpperCase();
  if (!user || !template || user.length !== 4 || template.length !== 4) {
    return null;
  }
  let matched = 0;
  for (let index = 0; index < 4; index += 1) {
    if (user[index] === template[index]) {
      matched += 1;
    }
  }
  return Math.round((matched / 4) * 100);
}

function computeTemplateComparison(result, template) {
  if (!result || !template || typeof template !== "object") {
    return null;
  }

  const defs = [
    {
      key: "volume",
      label: "🔊 响度",
      unit: "dB",
      userValue: result.avgDB,
      templateValue: template.estimatedFeatures?.avgDB,
      base: 15,
      step: 1,
      bonusPerStep: 2,
      bonusCap: 10,
      format: (value) => (Number.isFinite(Number(value)) ? String(Math.round(Number(value))) : "--")
    },
    {
      key: "pitch",
      label: "🎵 音调",
      unit: "Hz",
      userValue: result.dominantFreq,
      templateValue: template.estimatedFeatures?.dominantFreq,
      base: 15,
      step: 200,
      bonusPerStep: 1,
      bonusCap: 10,
      format: (value) => (Number.isFinite(Number(value)) ? String(Math.round(Number(value))) : "--")
    },
    {
      key: "endurance",
      label: "⏱️ 持久",
      unit: "s",
      userValue: result.activeDuration,
      templateValue: template.estimatedFeatures?.activeDuration,
      base: 15,
      step: 0.2,
      bonusPerStep: 2,
      bonusCap: 10,
      format: (value) => (Number.isFinite(Number(value)) ? Number(value).toFixed(2) : "--")
    },
    {
      key: "chaos",
      label: "🌀 混沌",
      unit: "Hz²",
      userValue: result.freqVariance,
      templateValue: template.estimatedFeatures?.freqVariance,
      base: 15,
      step: 100,
      bonusPerStep: 1,
      bonusCap: 10,
      format: (value) => (Number.isFinite(Number(value)) ? String(Math.round(Number(value))) : "--")
    },
    {
      key: "his",
      label: "🎯 综合",
      unit: "",
      userValue: result.audioHis,
      templateValue: template.his,
      base: 20,
      step: 0.5,
      bonusPerStep: 3,
      bonusCap: 15,
      format: (value) => (Number.isFinite(Number(value)) ? formatHisValue(Number(value)) : "--")
    }
  ];

  const rows = defs.map((def) => {
    const { win, points } = computeTemplateDimScore({
      userValue: def.userValue,
      templateValue: def.templateValue,
      base: def.base,
      step: def.step,
      bonusPerStep: def.bonusPerStep,
      bonusCap: def.bonusCap
    });
    const max = Number(def.base) + Number(def.bonusCap);
    const safePoints = clampNumber(points, 0, max);

    const userShown =
      def.key === "his"
        ? `你 HIS ${def.format(def.userValue)}`
        : `你 ${def.format(def.userValue)}${def.unit ? ` ${def.unit}` : ""}`;
    const tplShown =
      def.key === "his"
        ? `猫 HIS ${def.format(def.templateValue)}`
        : `猫 ${def.format(def.templateValue)}${def.unit ? ` ${def.unit}` : ""}`;

    let outcome = "—";
    if (win === true) {
      outcome = `✅ 胜！+${Math.round(safePoints)}分`;
    } else if (win === false) {
      outcome = "❌ 负！";
    }

    return {
      key: def.key,
      label: def.label,
      points: Math.round(safePoints),
      max,
      win,
      outcome,
      user: userShown,
      template: tplShown
    };
  });

  const total = rows.reduce((sum, row) => sum + Number(row.points || 0), 0);
  const gradeInfo = templateGradeInfo(total);
  const maxTotal = 140;

  const templateId = normalizeReferenceId(template.id);
  const templateName = String(template.name || "").trim();
  const personalityType = String(template.personalityType || "").trim();
  const personalityName = String(template.personalityName || "").trim();
  const userPersonality = String(result.personalityCode || "").trim();
  const personaMatch = personalityMatchPercent(userPersonality, personalityType);
  const personalityText = [personalityType || null, personalityName || null].filter(Boolean).join(" ");
  const personalityMeta =
    personalityType && userPersonality
      ? `人格：你 ${userPersonality} / 模板 ${personalityType}${personaMatch === null ? "" : `（${personaMatch}%）`}`
      : personalityText
        ? `人格：${personalityText}`
        : "";

  const difficulty = Number(template.difficulty);
  const diffLabel = String(template.difficultyLabel || "").trim();
  const diffText = Number.isFinite(difficulty) ? `${buildDifficultyStars(difficulty)} ${diffLabel || ""}`.trim() : diffLabel;

  return {
    templateId,
    templateName,
    total,
    max: maxTotal,
    grade: gradeInfo.grade,
    gradeCopy: gradeInfo.copy,
    gradeColor: gradeInfo.color,
    gradeSparkle: gradeInfo.sparkle,
    rows,
    meta: [templateId ? `模板：${templateId} ${templateName}`.trim() : null, diffText || null, personalityMeta || null].filter(Boolean).join(" · ")
  };
}

function renderTemplateComparison(comparison) {
  if (!templateCompareBox || !templateCompareTotal || !templateCompareMeta || !templateCompareBars) {
    return;
  }
  if (!comparison) {
    templateCompareBox.hidden = true;
    templateCompareTotal.textContent = "--/140";
    templateCompareTotal.style.color = "";
    templateCompareTotal.classList.remove("template-grade-sparkle");
    templateCompareMeta.textContent = "";
    templateCompareBars.replaceChildren();
    return;
  }

  templateCompareBox.hidden = false;
  templateCompareTotal.textContent = `${comparison.total}/${comparison.max} · ${comparison.grade}`;
  templateCompareTotal.style.color = comparison.gradeColor || "";
  templateCompareTotal.classList.toggle("template-grade-sparkle", Boolean(comparison.gradeSparkle));
  templateCompareMeta.textContent = [comparison.meta || null, comparison.gradeCopy || null].filter(Boolean).join("\n");
  templateCompareBars.replaceChildren();

  comparison.rows.forEach((row) => {
    const wrap = document.createElement("div");
    wrap.className = "dimension-row";

    const label = document.createElement("div");
    label.className = "dimension-label";

    const left = document.createElement("span");
    const code = document.createElement("span");
    code.className = "dimension-code";
    code.textContent = row.label;
    left.append(code);

    const right = document.createElement("span");
    right.textContent = row.win === true ? `✅ ${row.points}/${row.max}` : row.win === false ? `❌ 0/${row.max}` : `— 0/${row.max}`;

    label.append(left, right);

    const bar = document.createElement("div");
    bar.className = "rating-bar";
    const fill = document.createElement("div");
    fill.className = "rating-fill";
    fill.style.setProperty("--bar-value", `${Math.round((row.points / row.max) * 100)}%`);
    bar.append(fill);

    const meta = document.createElement("div");
    meta.className = "rating-meta";
    const user = document.createElement("span");
    user.textContent = row.user;
    const tpl = document.createElement("span");
    tpl.textContent = row.template;
    meta.append(user, tpl);

    const outcome = document.createElement("div");
    outcome.className = "rating-meta";
    const outcomeText = document.createElement("span");
    outcomeText.textContent = row.outcome || "";
    const filler = document.createElement("span");
    filler.textContent = "";
    outcome.append(outcomeText, filler);

    wrap.append(label, bar, meta, outcome);
    templateCompareBars.append(wrap);
  });
}

function formatPkDimValue(key, value) {
  if (!Number.isFinite(Number(value))) {
    return "--";
  }
  const safe = Number(value);
  if (key === "audioHis") {
    return formatHisValue(safe);
  }
  if (key === "activeDuration") {
    return safe.toFixed(2);
  }
  return String(Math.round(safe));
}

function renderChallengeComparison(comparison, challenge) {
  if (!challengeCompareBox || !challengeCompareTotal || !challengeCompareMeta || !challengeCompareBars) {
    return;
  }
  if (!comparison) {
    challengeCompareBox.hidden = true;
    challengeCompareTotal.textContent = "--/100";
    challengeCompareTotal.style.color = "";
    challengeCompareMeta.textContent = "";
    challengeCompareBars.replaceChildren();
    return;
  }

  challengeCompareBox.hidden = false;
  const total = Math.round(Number(comparison.total) || 0);
  const dimensionScore = String(comparison.dimensionScore || "").trim();
  const resultKey = String(comparison.resultKey || "").trim();
  challengeCompareTotal.textContent = `${total}/100 · ${dimensionScore || "--"} · ${resultKey || "--"}`;
  challengeCompareTotal.style.color = "";
  const title = String(comparison.title || "").trim();
  const copy = String(comparison.copy || "").trim();
  const challengeCode = challenge && typeof challenge === "object" ? String(challenge.code || "").trim() : "";
  const creator = challenge && typeof challenge === "object" && challenge.creator && typeof challenge.creator === "object" ? String(challenge.creator.userIdMasked || "").trim() : "";
  const metaParts = [title ? title : null, copy ? `“${copy}”` : null, creator ? `对手：${creator}` : null, challengeCode ? `挑战码：${challengeCode}` : null].filter(Boolean);
  challengeCompareMeta.textContent = metaParts.join(" · ");
  challengeCompareBars.replaceChildren();

  (Array.isArray(comparison.rows) ? comparison.rows : []).forEach((row) => {
    const wrap = document.createElement("div");
    wrap.className = "dimension-row";

    const label = document.createElement("div");
    label.className = "dimension-label";

    const left = document.createElement("span");
    const code = document.createElement("span");
    code.className = "dimension-code";
    code.textContent = row.label;
    left.append(code);

    const right = document.createElement("span");
    const win = row && typeof row === "object" ? row.win : null;
    const points = Math.round(Number(row?.points) || 0);
    right.textContent = win === true ? `✅ +${points}` : win === false ? `❌ +${points}` : `— +${points}`;
    label.append(left, right);

    const bar = document.createElement("div");
    bar.className = "rating-bar";
    const fill = document.createElement("div");
    fill.className = "rating-fill";
    const ratio = win === true ? 100 : win === false ? 0 : 50;
    fill.style.setProperty("--bar-value", `${ratio}%`);
    bar.append(fill);

    const meta = document.createElement("div");
    meta.className = "rating-meta";
    const user = document.createElement("span");
    const key = String(row?.key || "").trim();
    const unit = String(row?.unit || "").trim();
    const myValue = row && typeof row === "object" ? row.my : null;
    const opValue = row && typeof row === "object" ? row.opponent : null;
    user.textContent = `你 ${formatPkDimValue(key, myValue)}${unit ? ` ${unit}` : ""}`;
    const opponent = document.createElement("span");
    opponent.textContent = `对手 ${formatPkDimValue(key, opValue)}${unit ? ` ${unit}` : ""}`;
    meta.append(user, opponent);

    wrap.append(label, bar, meta);
    challengeCompareBars.append(wrap);
  });
}

function setSelectedTemplate(referenceId) {
  selectedTemplateId = normalizeReferenceId(referenceId);
  renderReferenceAudioList();
  if (latestResult) {
    renderTemplateComparison(computeTemplateComparison(latestResult, getSelectedTemplate()));
  }
}

function getReferenceFilters() {
  const personality = String(referencePersonalitySelect?.value || "");
  const difficultyRaw = String(referenceDifficultySelect?.value || "");
  const difficulty = difficultyRaw ? Number(difficultyRaw) : null;
  const recommended = String(referenceRecommendedButton?.getAttribute("aria-pressed") || "false") === "true";
  return { personality, difficulty: Number.isFinite(difficulty) ? difficulty : null, recommended };
}

function renderReferenceAudioList() {
  if (!referenceList || !referenceStatus) {
    return;
  }
  const references = Array.isArray(referenceAudioDefinition?.references) ? referenceAudioDefinition.references : [];
  const total = references.length;
  const { personality, difficulty, recommended } = getReferenceFilters();
  const filtered = references
    .filter((item) => item && typeof item === "object")
    .filter((item) => (personality ? String(item.personalityType || "") === personality : true))
    .filter((item) => (difficulty ? Number(item.difficulty) === difficulty : true))
    .filter((item) => (recommended ? Boolean(item.isRecommended) : true))
    .slice()
    .sort((a, b) => String(a.id || "").localeCompare(String(b.id || ""), "en"));

  referenceStatus.textContent = total ? `${filtered.length}/${total}` : "无数据";
  referenceList.replaceChildren();

  if (!filtered.length) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "没有匹配的参考音频。";
    referenceList.append(empty);
    return;
  }

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.dataset.referenceId = String(item.id || "");
    if (selectedTemplateId && normalizeReferenceId(item.id) === selectedTemplateId) {
      li.classList.add("is-selected");
    }
    const his = Number(item.his);
    const hisText = Number.isFinite(his) ? `HIS ${his.toFixed(1)}` : "HIS --";
    const name = String(item.name || "").trim() || "未命名";
    const personalityType = String(item.personalityType || "").trim();
    const personalityName = String(item.personalityName || "").trim();
    const diff = Number(item.difficulty);
    const diffLabel = String(item.difficultyLabel || "").trim();
    const diffText = Number.isFinite(diff) ? `${buildDifficultyStars(diff)} ${diffLabel || ""}`.trim() : diffLabel || "难度未知";
    const metaParts = [personalityType || null, personalityName || null, diffText || null].filter(Boolean);
    const quote = String(item.funQuote || "").replace(/\s+/g, " ").trim();
    const desc = quote.length > 52 ? `${quote.slice(0, 52)}…` : quote;

    li.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="score">${hisText}</span>
      <span class="title">${String(item.id || "")} ${name}</span>
      <span class="meta">${metaParts.join(" · ")}</span>
      ${desc ? `<span class="desc">${desc}</span>` : ""}
    `;
    referenceList.append(li);
  });
}

function fillReferenceSelectOptions() {
  if (!referencePersonalitySelect || !referenceDifficultySelect) {
    return;
  }
  const references = Array.isArray(referenceAudioDefinition?.references) ? referenceAudioDefinition.references : [];
  const personalities = Array.from(
    new Set(references.map((item) => (item && typeof item === "object" ? String(item.personalityType || "").trim() : "")).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b, "en"));

  referencePersonalitySelect.replaceChildren();
  const allPersona = document.createElement("option");
  allPersona.value = "";
  allPersona.textContent = "全部人格";
  referencePersonalitySelect.append(allPersona);
  personalities.forEach((code) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code;
    referencePersonalitySelect.append(option);
  });

  const difficultyItems = new Map();
  references.forEach((item) => {
    if (!item || typeof item !== "object") {
      return;
    }
    const level = Number(item.difficulty);
    if (!Number.isFinite(level)) {
      return;
    }
    const key = String(level);
    if (!difficultyItems.has(key)) {
      difficultyItems.set(key, String(item.difficultyLabel || "").trim());
    }
  });

  referenceDifficultySelect.replaceChildren();
  const allDiff = document.createElement("option");
  allDiff.value = "";
  allDiff.textContent = "全部难度";
  referenceDifficultySelect.append(allDiff);
  Array.from(difficultyItems.entries())
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .forEach(([level, label]) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = `${buildDifficultyStars(Number(level))} ${label || ""}`.trim();
      referenceDifficultySelect.append(option);
    });
}

async function loadReferenceAudioDefinition() {
  try {
    let response = await fetch("/api/reference/list");
    if (!response.ok) {
      response = await fetch("./data/reference_audio.v1.json");
    }
    if (!response.ok) {
      referenceAudioDefinition = null;
      if (referenceStatus) {
        referenceStatus.textContent = "加载失败";
      }
      if (referenceList) {
        referenceList.replaceChildren();
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "参考音频库加载失败。";
        referenceList.append(empty);
      }
      return null;
    }
    const payload = await response.json();
    referenceAudioDefinition = payload && typeof payload === "object" ? payload : null;
    fillReferenceSelectOptions();
    renderReferenceAudioList();
    return referenceAudioDefinition;
  } catch (error) {
    referenceAudioDefinition = null;
    if (referenceStatus) {
      referenceStatus.textContent = "加载失败";
    }
    if (referenceList) {
      referenceList.replaceChildren();
      const empty = document.createElement("li");
      empty.className = "empty";
      empty.textContent = "参考音频库加载失败。";
      referenceList.append(empty);
    }
    return null;
  }
}

async function showReferenceToast(referenceId) {
  const id = String(referenceId || "").trim();
  if (!id) {
    return;
  }
  try {
    const response = await fetch(`/api/reference/${encodeURIComponent(id)}`);
    if (!response.ok) {
      throw new Error(String(response.status));
    }
    const payload = await response.json();
    const item = payload?.reference && typeof payload.reference === "object" ? payload.reference : null;
    const title = item ? `${String(item.id || id)} ${String(item.name || "").trim()}`.trim() : id;
    const extra = item
      ? [String(item.personalityType || "").trim() || null, String(item.difficultyLabel || "").trim() || null]
          .filter(Boolean)
          .join(" · ")
      : "";
    showToast({
      title: `已选择模板 ${id}`,
      copy: extra ? `${title} · ${extra}` : title,
      actionText: latestResult ? "查看对比" : "",
      onAction: latestResult ? () => showSettlementPage() : null
    });
  } catch (error) {
    showToast({
      title: `已选择模板 ${id}`,
      copy: latestResult ? "已更新结算页模板对比。" : "完成检测后会自动展示模板对比。"
    });
  }
}

if (referencePersonalitySelect) {
  referencePersonalitySelect.addEventListener("change", renderReferenceAudioList);
}
if (referenceDifficultySelect) {
  referenceDifficultySelect.addEventListener("change", renderReferenceAudioList);
}
if (referenceRecommendedButton) {
  referenceRecommendedButton.addEventListener("click", () => {
    const pressed = String(referenceRecommendedButton.getAttribute("aria-pressed") || "false") === "true";
    referenceRecommendedButton.setAttribute("aria-pressed", pressed ? "false" : "true");
    renderReferenceAudioList();
  });
}
if (referenceList) {
  referenceList.addEventListener("click", async (event) => {
    const li = event.target?.closest?.("li");
    const id = li?.dataset?.referenceId;
    if (!id) {
      return;
    }
    try {
      await navigator.clipboard?.writeText?.(id);
    } catch (error) {
    }
    setSelectedTemplate(id);
    showReferenceToast(id);
    if (latestResult) {
      showSettlementPage();
    }
  });
}

if (referenceCollapseButton) {
  const initialCollapsed = String(localStorage.getItem(referenceCollapsedKey) || "") === "1";
  setReferenceCollapsed(initialCollapsed, false);
  referenceCollapseButton.addEventListener("click", () => {
    const collapsedNow = Boolean(referencePanel?.classList?.contains("is-collapsed"));
    setReferenceCollapsed(!collapsedNow, true);
  });
}

function formatYmd(timestamp) {
  const date = new Date(Number(timestamp) || Date.now());
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getPkMatches() {
  const parsed = safeJsonParse(localStorage.getItem(pkMatchesKey), []);
  return Array.isArray(parsed) ? parsed : [];
}

function setPkMatches(matches) {
  localStorage.setItem(pkMatchesKey, JSON.stringify(Array.isArray(matches) ? matches.slice(0, 50) : []));
}

function recordPkMatch({ comparison, challenge, run }) {
  if (!comparison || !challenge || typeof comparison !== "object") {
    return;
  }
  const creator = challenge?.creator && typeof challenge.creator === "object" ? String(challenge.creator.userIdMasked || "").trim() : "";
  const entry = {
    createdAt: Date.now(),
    runCreatedAt: Number(run?.createdAt) || Date.now(),
    code: String(challenge.code || "").trim(),
    opponent: creator,
    resultKey: String(comparison.resultKey || "").trim(),
    dimensionScore: String(comparison.dimensionScore || "").trim(),
    outcome: String(comparison.outcome || "").trim(),
    total: Number(comparison.total) || 0,
    title: String(comparison.title || "").trim(),
    copy: String(comparison.copy || "").trim()
  };
  const next = [entry, ...getPkMatches()].slice(0, 50);
  setPkMatches(next);
  renderPkMatches();
}

function renderPkMatches() {
  if (!pkList || !pkHint) {
    return;
  }
  const matches = getPkMatches();
  pkList.replaceChildren();
  if (!matches.length) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "还没有 PK 记录。";
    pkList.append(item);
    pkHint.textContent = "收到挑战并完成检测后，会自动记录一条 PK 结果（本机）。";
    return;
  }
  pkHint.textContent = "按时间倒序展示；点击“分享战绩”可生成二维码与海报。";
  matches.slice(0, 30).forEach((match, index) => {
    const li = document.createElement("li");
    const resultKey = String(match?.resultKey || "").trim();
    const dimensionScore = String(match?.dimensionScore || "").trim();
    const score = `${Math.round(Number(match?.total) || 0)}/100`;
    const opponent = String(match?.opponent || "").trim();
    const code = String(match?.code || "").trim();
    const metaParts = [
      opponent ? `对手：${opponent}` : null,
      code ? `挑战码：${code}` : null,
      dimensionScore ? `维度比：${dimensionScore}` : null,
      formatHistoryTime(Number(match?.runCreatedAt) || Date.now())
    ].filter(Boolean);
    const desc = String(match?.copy || "").replace(/\s+/g, " ").trim();
    const descText = desc.length > 48 ? `${desc.slice(0, 48)}…` : desc;
    li.innerHTML = `
      <span class="rank">#${index + 1}</span>
      <span class="score">${score}${resultKey ? ` · ${resultKey}` : ""}</span>
      <span class="title">${opponent ? `与 ${opponent} PK` : "好友PK"}</span>
      <span class="meta">${metaParts.join(" · ")}</span>
      ${descText ? `<span class="desc">${descText}</span>` : ""}
    `;
    pkList.append(li);
  });
}

const rankedLogic = window.RankedLogic || null;

function getSeasonInfo(nowMs = Date.now()) {
  if (rankedLogic?.getSeasonInfo) {
    const info = rankedLogic.getSeasonInfo(nowMs);
    return { seasonId: info.seasonId, themeName: info.themeName, start: info.start, end: info.end };
  }
  const now = Number(nowMs) || Date.now();
  const rankedSeasonMs = 30 * 24 * 60 * 60 * 1000;
  const rankedEpochMs = Date.UTC(2026, 0, 1);
  const index = Math.max(0, Math.floor((now - rankedEpochMs) / rankedSeasonMs));
  const start = rankedEpochMs + index * rankedSeasonMs;
  const end = start + rankedSeasonMs;
  return { seasonId: `S${index + 1}`, themeName: `S${((index % 12) + 1)}`, start, end };
}

function getTierInfoByHis(his) {
  if (rankedLogic?.getTierInfo) {
    return rankedLogic.getTierInfo(his);
  }
  return { id: "bronze", name: "青铜", icon: "🥉", color: "#CD7F32", minHis: 0, minPoints: 0, accentColor: "" };
}

function getTierInfoByPoints(points) {
  if (rankedLogic?.getTierInfoByPoints) {
    return rankedLogic.getTierInfoByPoints(points);
  }
  return { id: "bronze", name: "青铜", icon: "🥉", color: "#CD7F32", minHis: 0, minPoints: 0, accentColor: "" };
}

function getRankedHisStats(matches) {
  const list = Array.isArray(matches) ? matches : [];
  let peakHis = 0;
  let latestHis = 0;
  let latestAt = -Infinity;
  list.forEach((match) => {
    const his = Number(match?.his);
    if (Number.isFinite(his)) {
      peakHis = Math.max(peakHis, his);
    }
    const at = Number(match?.runCreatedAt ?? match?.createdAt);
    if (Number.isFinite(at) && at >= latestAt && Number.isFinite(his)) {
      latestAt = at;
      latestHis = his;
    }
  });
  return { peakHis, latestHis };
}

function getRankedState() {
  const { seasonId, themeName, start, end } = getSeasonInfo();
  const parsed = safeJsonParse(localStorage.getItem(rankedKey), null);
  const state = parsed && typeof parsed === "object" ? parsed : null;

  if (state && String(state.seasonId || "") === seasonId) {
    const legacyShields = clampNumber(state.shields ?? state.protectionsLeft ?? 2, 0, 2);
    const matches = Array.isArray(state.matches) ? state.matches.slice(0, 200) : [];
    const stats = getRankedHisStats(matches);
    const peakHis = Number.isFinite(Number(state.peakHis)) ? clampNumber(state.peakHis, 0, 14) : stats.peakHis;
    const latestHis = Number.isFinite(Number(state.latestHis)) ? clampNumber(state.latestHis, 0, 14) : stats.latestHis;
    const tierByHis = getTierInfoByHis(peakHis || latestHis || 0);
    const points = Math.max(0, Math.round(Number(state.points) || 0), Math.round(Number(tierByHis.minPoints) || 0));
    return {
      version: 3,
      seasonId,
      themeName: String(state.themeName || themeName || seasonId || "").trim() || seasonId,
      seasonStart: Number(state.seasonStart) || start,
      seasonEnd: Number(state.seasonEnd) || end,
      points,
      protectionsLeft: legacyShields,
      streak: Math.max(0, Math.round(Number(state.streak) || 0)),
      firstWinDays: state.firstWinDays && typeof state.firstWinDays === "object" ? { ...state.firstWinDays } : {},
      peakHis,
      latestHis,
      matches
    };
  }

  const legacyParsed = safeJsonParse(localStorage.getItem(rankedLegacyKey), null);
  const legacy = legacyParsed && typeof legacyParsed === "object" ? legacyParsed : null;
  if (legacy && String(legacy.seasonId || "") === seasonId) {
    const matches = Array.isArray(legacy.matches) ? legacy.matches.slice(0, 200) : [];
    const stats = getRankedHisStats(matches);
    const tierByHis = getTierInfoByHis(stats.peakHis || stats.latestHis || 0);
    const points = Math.max(0, Math.round(Number(legacy.points) || 0), Math.round(Number(tierByHis.minPoints) || 0));
    return {
      version: 3,
      seasonId,
      themeName: themeName || seasonId,
      seasonStart: Number(legacy.seasonStart) || start,
      seasonEnd: Number(legacy.seasonEnd) || end,
      points,
      protectionsLeft: clampNumber(legacy.shields ?? 2, 0, 2),
      streak: Math.max(0, Math.round(Number(legacy.streak) || 0)),
      firstWinDays: legacy.firstWinDays && typeof legacy.firstWinDays === "object" ? { ...legacy.firstWinDays } : {},
      peakHis: stats.peakHis,
      latestHis: stats.latestHis,
      matches
    };
  }

  return {
    version: 3,
    seasonId,
    themeName: themeName || seasonId,
    seasonStart: start,
    seasonEnd: end,
    points: 0,
    protectionsLeft: 2,
    streak: 0,
    firstWinDays: {},
    peakHis: 0,
    latestHis: 0,
    matches: []
  };
}

function setRankedState(state) {
  localStorage.setItem(rankedKey, JSON.stringify(state));
}

function getRankedPowerFromRun(run) {
  const his = Number(run?.audioHis);
  if (Number.isFinite(his) && his > 0) {
    return his;
  }
  const similarity = Number(run?.similarity);
  if (Number.isFinite(similarity)) {
    return similarity / 10;
  }
  return null;
}

function applyRankedMatchFromRun(run) {
  const createdAt = Number(run?.createdAt);
  if (!Number.isFinite(createdAt)) {
    return;
  }
  const { seasonId, themeName, start, end } = getSeasonInfo(createdAt);
  if (!seasonId || createdAt < start || createdAt >= end) {
    return;
  }
  const state = getRankedState();
  if (state.seasonId !== seasonId) {
    return;
  }
  const exists = state.matches.some((match) => Number(match?.runCreatedAt) === createdAt);
  if (exists) {
    return;
  }
  state.themeName = themeName || state.themeName || seasonId;

  const power = getRankedPowerFromRun(run);
  const his = Number.isFinite(power) ? clampNumber(power, 0, 14) : 0;
  const tierByHisBefore = getTierInfoByHis(Number(state.peakHis ?? state.latestHis ?? 0) || 0);
  state.points = Math.max(0, Math.round(Number(state.points) || 0), Math.round(Number(tierByHisBefore.minPoints) || 0));
  const template = getReferenceById("R09") || getSelectedTemplate() || getReferenceById("R01");
  const opponentPayload = template
    ? {
        avgDB: template.estimatedFeatures?.avgDB,
        dominantFreq: template.estimatedFeatures?.dominantFreq,
        activeDuration: template.estimatedFeatures?.activeDuration,
        freqVariance: template.estimatedFeatures?.freqVariance,
        audioHis: template.his
      }
    : null;
  const myPayload = {
    avgDB: run.avgDB,
    dominantFreq: run.dominantFreq,
    activeDuration: run.activeDuration,
    freqVariance: run.freqVariance,
    audioHis: his
  };

  const comparison = rankedLogic?.computeComparison
    ? rankedLogic.computeComparison(myPayload, opponentPayload)
    : { outcome: his >= 6.5 ? "胜" : "负", title: his >= 6.5 ? "优势获胜" : "惜败", copy: "", dimensionScore: his >= 6.5 ? "3:2" : "2:3" };

  const outcome = String(comparison?.outcome || "").trim() || "平";
  const dayKey = formatYmd(createdAt);
  const isFirstWin = outcome === "胜" && !state.firstWinDays?.[dayKey];
  const streak = outcome === "胜" ? state.streak + 1 : 0;
  if (isFirstWin) {
    state.firstWinDays[dayKey] = true;
  }

  const deltaInfo = rankedLogic?.computeDelta
    ? rankedLogic.computeDelta({
        his,
        outcome,
        dimensionScore: comparison.dimensionScore,
        isFirstWin,
        streakAfter: streak
      })
    : { baseDelta: 0, outcomeBonus: 0, firstWinBonus: 0, streakBonus: 0, delta: 0 };

  const tierBefore = tierByHisBefore;
  const protectionInfo = rankedLogic?.applyProtection
    ? rankedLogic.applyProtection({
        pointsBefore: state.points,
        delta: deltaInfo.delta,
        tierBefore,
        protectionsLeft: state.protectionsLeft
      })
    : { pointsAfter: state.points, deltaApplied: 0, protectionsLeftAfter: state.protectionsLeft, protectionUsed: false, clampedAtFloor: false };

  state.points = Math.max(0, Math.round(Number(protectionInfo.pointsAfter) || 0));
  state.streak = streak;
  state.protectionsLeft = clampNumber(protectionInfo.protectionsLeftAfter ?? state.protectionsLeft ?? 2, 0, 2);

  state.latestHis = Number(his.toFixed(2));
  state.peakHis = Math.max(Number(state.peakHis) || 0, Number(state.latestHis) || 0);
  const tier = getTierInfoByHis(Number(state.peakHis) || Number(state.latestHis) || 0);
  state.points = Math.max(state.points, Math.round(Number(tier.minPoints) || 0));
  state.matches.unshift({
    createdAt: Date.now(),
    runCreatedAt: createdAt,
    his: Number(his.toFixed(2)),
    outcome,
    title: String(comparison.title || "").trim(),
    dimensionScore: String(comparison.dimensionScore || "").trim(),
    baseDelta: deltaInfo.baseDelta,
    outcomeBonus: deltaInfo.outcomeBonus,
    firstWinBonus: deltaInfo.firstWinBonus,
    streak,
    streakBonus: deltaInfo.streakBonus,
    protectionUsed: Boolean(protectionInfo.protectionUsed),
    clampedAtFloor: Boolean(protectionInfo.clampedAtFloor),
    delta: deltaInfo.delta,
    deltaApplied: protectionInfo.deltaApplied,
    pointsAfter: state.points,
    tierId: tier.id,
    opponentTemplateId: template ? normalizeReferenceId(template.id) : "",
    opponentTemplateName: template ? String(template.name || "").trim() : ""
  });
  state.matches = state.matches.slice(0, 200);
  setRankedState(state);
}

function ensureRankedState() {
  const state = getRankedState();
  if (state.matches.length) {
    return state;
  }
  const runs = getRuns()
    .slice()
    .sort((a, b) => (Number(a?.createdAt) || 0) - (Number(b?.createdAt) || 0));
  runs.forEach((run) => applyRankedMatchFromRun(run));
  return getRankedState();
}

function renderRankedSeason() {
  if (!rankingRankedView || !rankedTier || !rankedPoints || !rankedShield || !rankedStreak || !rankedFirstWin || !rankedTierList || !rankedMatchList) {
    return;
  }
  const state = ensureRankedState();
  const tier = getTierInfoByHis(Number(state.peakHis ?? state.latestHis ?? 0) || 0);
  const now = Date.now();
  const remainDays = Math.max(0, Math.ceil((Number(state.seasonEnd) - now) / (24 * 60 * 60 * 1000)));
  if (rankedSeasonMeta) {
    const startText = new Date(Number(state.seasonStart)).toLocaleDateString("zh-CN");
    const endText = new Date(Number(state.seasonEnd) - 1).toLocaleDateString("zh-CN");
    const themeText = String(state.themeName || state.seasonId || "").trim();
    rankedSeasonMeta.textContent = `30天赛季 ${state.seasonId} · 主题 ${themeText} · ${startText} - ${endText} · 剩余 ${remainDays} 天`;
  }
  if (rankedSeasonTitle) {
    rankedSeasonTitle.textContent = "排位赛";
  }
  rankedTier.textContent = `${tier.icon} ${tier.name}`;
  rankedTier.style.color = tier.color || "";
  rankedTier.style.textShadow = tier.accentColor ? `0 0 12px ${tier.accentColor}` : "";
  rankedPoints.textContent = `积分 ${Math.max(0, Math.round(Number(state.points) || 0))}`;
  rankedShield.textContent = tier.id === "bronze" || tier.id === "silver" ? "不降段" : `🛡️ ${Number(state.protectionsLeft) || 0}/2`;
  rankedStreak.textContent = `${Number(state.streak) || 0} 连胜`;
  const todayKey = formatYmd(Date.now());
  rankedFirstWin.textContent = `今日首胜：${state.firstWinDays?.[todayKey] ? "+10 已加" : "未触发"}`;

  rankedTierList.replaceChildren();
  const tierList = Array.isArray(rankedLogic?.tiers) ? rankedLogic.tiers : [tier];
  tierList.forEach((item) => {
    const card = document.createElement("div");
    const active = item.id === tier.id;
    card.className = `ranked-tier${active ? " is-active" : ""}`;
    card.style.setProperty("--tier-color", String(item.color || "").trim() || "var(--line)");
    if (item.accentColor) {
      card.style.background = `linear-gradient(135deg, color-mix(in srgb, ${item.color} 10%, transparent) 0%, color-mix(in srgb, ${item.accentColor} 12%, transparent) 100%)`;
    }
    const hisGate = Number.isFinite(Number(item.minHis)) ? Number(item.minHis).toFixed(1) : "--";
    const rangeText = `HIS ≥ ${hisGate}`;
    card.innerHTML = `
      <div class="ranked-tier-name">${item.icon} ${item.name}</div>
      <div class="ranked-tier-range">${rangeText}</div>
    `;
    rankedTierList.append(card);
  });

  rankedMatchList.replaceChildren();
  const list = Array.isArray(state.matches) ? state.matches.slice(0, 10) : [];
  if (!list.length) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>暂无排位记录</strong><span>完成一次检测后会自动结算。</span>`;
    rankedMatchList.append(li);
    return;
  }
  list.forEach((match) => {
    const li = document.createElement("li");
    const outcomeText = String(match.outcome || "--");
    const delta = Number(match.deltaApplied ?? match.delta) || 0;
    const sign = delta > 0 ? "+" : delta < 0 ? "" : "";
    const noteParts = [
      match.dimensionScore ? `比分 ${match.dimensionScore}` : null,
      match.firstWinBonus ? `首胜+${match.firstWinBonus}` : null,
      match.streakBonus ? `连胜+${match.streakBonus}` : null,
      match.protectionUsed ? "保护盾抵扣" : null,
      match.clampedAtFloor ? "不降段" : null
    ].filter(Boolean);
    const hisText = Number.isFinite(Number(match.his)) ? `HIS ${formatHisValue(Number(match.his))}` : "HIS --";
    const titleText = String(match.title || "").trim();
    const topParts = [outcomeText, titleText || null, hisText, `${sign}${delta}分`, `积分 ${Number(match.pointsAfter) || 0}`].filter(Boolean);
    li.innerHTML = `<strong>${topParts.join(" · ")}</strong><span>${formatHistoryTime(Number(match.runCreatedAt) || Date.now())}${noteParts.length ? ` · ${noteParts.join(" · ")}` : ""}</span>`;
    rankedMatchList.append(li);
  });
}

function setRankingSubtab(subtab) {
  const next = String(subtab || "board");
  currentRankingSubtab = next === "ranked" || next === "pk" ? next : "board";
  const mapping = [
    [rankingSubtabBoard, "board"],
    [rankingSubtabRanked, "ranked"],
    [rankingSubtabPk, "pk"]
  ];
  mapping.forEach(([button, key]) => {
    if (!button) {
      return;
    }
    const active = key === currentRankingSubtab;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
  if (rankingBoardView) rankingBoardView.hidden = currentRankingSubtab !== "board";
  if (rankingRankedView) rankingRankedView.hidden = currentRankingSubtab !== "ranked";
  if (rankingPkView) rankingPkView.hidden = currentRankingSubtab !== "pk";
  if (currentRankingSubtab === "board") {
    renderRanking();
  }
  if (currentRankingSubtab === "ranked") {
    renderRankedSeason();
  }
  if (currentRankingSubtab === "pk") {
    renderPkMatches();
  }
}

function toUtf8Bytes(text) {
  const value = String(text ?? "");
  if (typeof TextEncoder !== "undefined") {
    return Array.from(new TextEncoder().encode(value));
  }
  const encoded = unescape(encodeURIComponent(value));
  const out = [];
  for (let i = 0; i < encoded.length; i += 1) {
    out.push(encoded.charCodeAt(i) & 0xff);
  }
  return out;
}

function makeGfTables() {
  const exp = new Array(512).fill(0);
  const log = new Array(256).fill(0);
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    exp[i] = x;
    log[x] = i;
    x <<= 1;
    if (x & 0x100) {
      x ^= 0x11d;
    }
  }
  for (let i = 255; i < 512; i += 1) {
    exp[i] = exp[i - 255];
  }
  return { exp, log };
}

const gf = makeGfTables();

function gfMul(a, b) {
  const x = Number(a) & 0xff;
  const y = Number(b) & 0xff;
  if (x === 0 || y === 0) {
    return 0;
  }
  return gf.exp[gf.log[x] + gf.log[y]] & 0xff;
}

function polyMultiply(p, q) {
  const out = new Array(p.length + q.length - 1).fill(0);
  for (let i = 0; i < p.length; i += 1) {
    for (let j = 0; j < q.length; j += 1) {
      out[i + j] ^= gfMul(p[i], q[j]);
    }
  }
  return out;
}

function rsGeneratorPoly(degree) {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    poly = polyMultiply(poly, [1, gf.exp[i]]);
  }
  return poly;
}

function rsComputeEcc(data, degree) {
  const gen = rsGeneratorPoly(degree);
  const ecc = new Array(degree).fill(0);
  for (const byte of data) {
    const factor = (Number(byte) & 0xff) ^ ecc[0];
    for (let i = 0; i < degree - 1; i += 1) {
      ecc[i] = ecc[i + 1] ^ gfMul(gen[i + 1], factor);
    }
    ecc[degree - 1] = gfMul(gen[degree], factor);
  }
  return ecc.map((v) => v & 0xff);
}

function appendBits(buffer, value, length) {
  for (let i = length - 1; i >= 0; i -= 1) {
    buffer.push(((value >>> i) & 1) === 1);
  }
}

const qrVersions = {
  1: { dataCodewords: 16, ecCodewords: 10, align: [] },
  2: { dataCodewords: 28, ecCodewords: 16, align: [6, 18] },
  3: { dataCodewords: 44, ecCodewords: 26, align: [6, 22] }
};

function chooseQrVersion(byteLength) {
  const minBits = 4 + 8 + byteLength * 8 + 4;
  const minBytes = Math.ceil(minBits / 8);
  const versions = Object.keys(qrVersions).map(Number).sort((a, b) => a - b);
  for (const v of versions) {
    if (minBytes <= qrVersions[v].dataCodewords) {
      return v;
    }
  }
  return 3;
}

function makeQrDataCodewords(bytes, version) {
  const info = qrVersions[version];
  const bits = [];
  appendBits(bits, 0b0100, 4);
  appendBits(bits, bytes.length, 8);
  bytes.forEach((b) => appendBits(bits, b & 0xff, 8));
  appendBits(bits, 0, Math.min(4, info.dataCodewords * 8 - bits.length));
  while (bits.length % 8 !== 0) {
    bits.push(false);
  }
  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) {
      value = (value << 1) | (bits[i + j] ? 1 : 0);
    }
    codewords.push(value & 0xff);
  }
  const pads = [0xec, 0x11];
  let padIndex = 0;
  while (codewords.length < info.dataCodewords) {
    codewords.push(pads[padIndex % pads.length]);
    padIndex += 1;
  }
  return codewords;
}

function makeFormatBits(mask) {
  const ecLevelBits = 0b00;
  const data = (ecLevelBits << 3) | (mask & 0b111);
  let value = data << 10;
  const generator = 0x537;
  const bitLength = (n) => {
    let x = n >>> 0;
    let len = 0;
    while (x) {
      x >>>= 1;
      len += 1;
    }
    return len;
  };
  for (let i = bitLength(value) - 1; i >= 10; i -= 1) {
    if (((value >>> i) & 1) === 1) {
      value ^= generator << (i - 10);
    }
  }
  return ((data << 10) | (value & 0x3ff)) ^ 0x5412;
}

function createMatrix(size) {
  return Array.from({ length: size }, () => new Array(size).fill(null));
}

function placeFinder(mod, res, row, col) {
  for (let r = -1; r <= 7; r += 1) {
    for (let c = -1; c <= 7; c += 1) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || rr >= mod.length || cc < 0 || cc >= mod.length) {
        continue;
      }
      const isBorder = r === -1 || r === 7 || c === -1 || c === 7;
      const isFrame = r === 0 || r === 6 || c === 0 || c === 6;
      const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      const dark = !isBorder && (isFrame || isCore);
      mod[rr][cc] = isBorder ? false : dark;
      res[rr][cc] = true;
    }
  }
}

function placeAlignment(mod, res, centerRow, centerCol) {
  for (let r = -2; r <= 2; r += 1) {
    for (let c = -2; c <= 2; c += 1) {
      const rr = centerRow + r;
      const cc = centerCol + c;
      if (rr < 0 || rr >= mod.length || cc < 0 || cc >= mod.length) {
        continue;
      }
      const dist = Math.max(Math.abs(r), Math.abs(c));
      const dark = dist === 2 || dist === 0;
      mod[rr][cc] = dark;
      res[rr][cc] = true;
    }
  }
}

function reserveFormatAreas(res) {
  const size = res.length;
  for (let i = 0; i < 9; i += 1) {
    if (i !== 6) {
      res[8][i] = true;
      res[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i += 1) {
    res[size - 1 - i][8] = true;
    res[8][size - 1 - i] = true;
  }
  res[8][8] = true;
}

function placeTiming(mod, res) {
  const size = mod.length;
  for (let i = 8; i < size - 8; i += 1) {
    const dark = i % 2 === 0;
    mod[6][i] = dark;
    res[6][i] = true;
    mod[i][6] = dark;
    res[i][6] = true;
  }
}

function placeDarkModule(mod, res, version) {
  const row = 4 * version + 9;
  mod[row][8] = true;
  res[row][8] = true;
}

function placeData(mod, res, dataBits) {
  const size = mod.length;
  let bitIndex = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) {
      col -= 1;
    }
    for (let i = 0; i < size; i += 1) {
      const row = upward ? size - 1 - i : i;
      for (let j = 0; j < 2; j += 1) {
        const c = col - j;
        if (res[row][c]) {
          continue;
        }
        const bit = dataBits[bitIndex] === true;
        mod[row][c] = bit;
        bitIndex += 1;
      }
    }
    upward = !upward;
  }
}

function maskFn(mask, r, c) {
  if (mask === 0) return (r + c) % 2 === 0;
  if (mask === 1) return r % 2 === 0;
  if (mask === 2) return c % 3 === 0;
  if (mask === 3) return (r + c) % 3 === 0;
  if (mask === 4) return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
  if (mask === 5) return ((r * c) % 2) + ((r * c) % 3) === 0;
  if (mask === 6) return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
  return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
}

function applyMask(mod, res, mask) {
  const size = mod.length;
  const out = createMatrix(size);
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      const bit = mod[r][c] === true;
      if (!res[r][c] && maskFn(mask, r, c)) {
        out[r][c] = !bit;
      } else {
        out[r][c] = bit;
      }
    }
  }
  return out;
}

function penaltyScore(mod) {
  const size = mod.length;
  let total = 0;

  const addRunPenalty = (line) => {
    let runColor = line[0];
    let runLen = 1;
    for (let i = 1; i < line.length; i += 1) {
      if (line[i] === runColor) {
        runLen += 1;
      } else {
        if (runLen >= 5) total += 3 + (runLen - 5);
        runColor = line[i];
        runLen = 1;
      }
    }
    if (runLen >= 5) total += 3 + (runLen - 5);
  };

  for (let r = 0; r < size; r += 1) {
    addRunPenalty(mod[r]);
  }
  for (let c = 0; c < size; c += 1) {
    const col = [];
    for (let r = 0; r < size; r += 1) col.push(mod[r][c]);
    addRunPenalty(col);
  }

  for (let r = 0; r < size - 1; r += 1) {
    for (let c = 0; c < size - 1; c += 1) {
      const v = mod[r][c];
      if (v === mod[r][c + 1] && v === mod[r + 1][c] && v === mod[r + 1][c + 1]) {
        total += 3;
      }
    }
  }

  const pattern1 = [true, false, true, true, true, false, true, false, false, false, false];
  const pattern2 = [false, false, false, false, true, false, true, true, true, false, true];
  const hasPattern = (line, idx, pattern) => {
    for (let i = 0; i < pattern.length; i += 1) {
      if (line[idx + i] !== pattern[i]) return false;
    }
    return true;
  };

  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c <= size - 11; c += 1) {
      const row = mod[r];
      if (hasPattern(row, c, pattern1) || hasPattern(row, c, pattern2)) total += 40;
    }
  }
  for (let c = 0; c < size; c += 1) {
    const col = [];
    for (let r = 0; r < size; r += 1) col.push(mod[r][c]);
    for (let r = 0; r <= size - 11; r += 1) {
      if (hasPattern(col, r, pattern1) || hasPattern(col, r, pattern2)) total += 40;
    }
  }

  let darkCount = 0;
  for (let r = 0; r < size; r += 1) {
    for (let c = 0; c < size; c += 1) {
      if (mod[r][c]) darkCount += 1;
    }
  }
  const percent = (darkCount * 100) / (size * size);
  const k = Math.floor(Math.abs(percent - 50) / 5);
  total += k * 10;

  return total;
}

function drawFormatBits(mod, res, mask) {
  const size = mod.length;
  const bits = makeFormatBits(mask);
  const positionsA = [
    [8, 0],
    [8, 1],
    [8, 2],
    [8, 3],
    [8, 4],
    [8, 5],
    [8, 7],
    [8, 8],
    [7, 8],
    [5, 8],
    [4, 8],
    [3, 8],
    [2, 8],
    [1, 8],
    [0, 8]
  ];
  const positionsB = [
    [size - 1, 8],
    [size - 2, 8],
    [size - 3, 8],
    [size - 4, 8],
    [size - 5, 8],
    [size - 6, 8],
    [size - 7, 8],
    [8, size - 8],
    [8, size - 7],
    [8, size - 6],
    [8, size - 5],
    [8, size - 4],
    [8, size - 3],
    [8, size - 2],
    [8, size - 1]
  ];
  for (let i = 0; i < 15; i += 1) {
    const bit = ((bits >>> i) & 1) === 1;
    const [r1, c1] = positionsA[i];
    const [r2, c2] = positionsB[i];
    mod[r1][c1] = bit;
    mod[r2][c2] = bit;
    res[r1][c1] = true;
    res[r2][c2] = true;
  }
}

function makeQrMatrix(text) {
  let bytes = toUtf8Bytes(text);
  const version = chooseQrVersion(bytes.length);
  const info = qrVersions[version];
  const maxBytes = Math.max(0, Number(info.dataCodewords) - 2);
  if (bytes.length > maxBytes) {
    bytes = bytes.slice(0, maxBytes);
  }
  const size = 17 + 4 * version;
  const mod = createMatrix(size);
  const res = Array.from({ length: size }, () => new Array(size).fill(false));

  placeFinder(mod, res, 0, 0);
  placeFinder(mod, res, 0, size - 7);
  placeFinder(mod, res, size - 7, 0);
  placeTiming(mod, res);
  reserveFormatAreas(res);
  placeDarkModule(mod, res, version);

  const align = info.align;
  if (align && align.length) {
    align.forEach((r) => {
      align.forEach((c) => {
        const nearFinder = (r === 6 && c === 6) || (r === 6 && c === size - 7) || (r === size - 7 && c === 6);
        if (nearFinder) {
          return;
        }
        placeAlignment(mod, res, r, c);
      });
    });
  }

  const data = makeQrDataCodewords(bytes, version);
  const ecc = rsComputeEcc(data, info.ecCodewords);
  const codewords = [...data, ...ecc];
  const dataBits = [];
  codewords.forEach((b) => appendBits(dataBits, b & 0xff, 8));
  placeData(mod, res, dataBits);

  let bestMask = 0;
  let bestScore = Infinity;
  let best = null;
  for (let mask = 0; mask < 8; mask += 1) {
    const masked = applyMask(mod, res, mask);
    const reservedCopy = res.map((row) => row.slice());
    drawFormatBits(masked, reservedCopy, mask);
    const score = penaltyScore(masked);
    if (score < bestScore) {
      bestScore = score;
      bestMask = mask;
      best = masked;
    }
  }
  const reservedFinal = res.map((row) => row.slice());
  drawFormatBits(best, reservedFinal, bestMask);
  return best;
}

function getQrMatrix(text) {
  const value = String(text || "").trim();
  if (!value) {
    return null;
  }
  return makeQrMatrix(value.length > 120 ? value.slice(0, 120) : value);
}

function paintQrMatrix(context, matrix, x, y, size) {
  if (!context || !matrix?.length || !Number.isFinite(Number(size))) {
    return;
  }
  const boxSize = Math.max(1, Math.floor(Number(size)));
  const moduleCount = matrix.length;
  const quiet = 4;
  const totalModules = moduleCount + quiet * 2;
  const scale = Math.max(1, Math.floor(boxSize / totalModules));
  const actual = scale * totalModules;
  const offsetX = Math.floor(Number(x) + (boxSize - actual) / 2);
  const offsetY = Math.floor(Number(y) + (boxSize - actual) / 2);
  context.fillStyle = "#ffffff";
  context.fillRect(offsetX, offsetY, actual, actual);
  context.fillStyle = "#111111";
  for (let r = 0; r < moduleCount; r += 1) {
    for (let c = 0; c < moduleCount; c += 1) {
      if (!matrix[r][c]) {
        continue;
      }
      context.fillRect(offsetX + (c + quiet) * scale, offsetY + (r + quiet) * scale, scale, scale);
    }
  }
}

function drawQr(canvas, text) {
  if (!canvas) {
    return;
  }
  const context = canvas.getContext("2d");
  const size = canvas.width;
  context.clearRect(0, 0, size, size);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, size, size);
  const matrix = getQrMatrix(text);
  if (!matrix) {
    return;
  }
  paintQrMatrix(context, matrix, 0, 0, size);
}

function setActiveShareType(type) {
  currentShareType = String(type || "personality");
  const mapping = [
    [shareTypePersonality, "personality"],
    [shareTypeTemplate, "template"],
    [shareTypeChallenge, "challenge"],
    [shareTypePk, "pk"],
    [shareTypeRanked, "ranked"],
    [shareTypeAchievements, "achievements"]
  ];
  mapping.forEach(([button, key]) => {
    if (!button) {
      return;
    }
    const active = key === currentShareType;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
  });
}

function getBestRun() {
  const runs = getRuns();
  if (!runs.length) {
    return null;
  }
  return runs
    .slice()
    .sort((a, b) => (Number(b.audioHis) || -1) - (Number(a.audioHis) || -1) || (Number(b.similarity) || 0) - (Number(a.similarity) || 0) || (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0))[0];
}

function buildSharePayload(type) {
  const shareType = String(type || "personality");
  if (shareType === "template") {
    const tpl = getSelectedTemplate();
    const comparison = latestResult ? computeTemplateComparison(latestResult, tpl) : null;
    if (!comparison) {
      return {
        title: "模板对比",
        text: "还没有可分享的模板对比：先完成一次检测，并选择一个模板。",
        url: window.location.href,
        qr: `HACHIMI|TEMPLATE`
      };
    }
    return {
      title: "模板对比",
      text: `我刚和模板对比：${comparison.total}/${comparison.max} · ${comparison.grade}\n${comparison.meta}\n${comparison.gradeCopy}`,
      url: window.location.href,
      qr: `HACHIMI|TEMPLATE|${comparison.templateId || ""}|${comparison.total}`
    };
  }
  if (shareType === "challenge") {
    const url = latestChallengeLink || (incomingChallengeCode ? `${window.location.origin}/challenge/${incomingChallengeCode}` : window.location.href);
    const code = latestChallengeCode || incomingChallengeCode || "";
    const qrUrl = code ? `${window.location.origin}/c/${code}` : url;
    return {
      title: "PK挑战",
      text: code ? `我发起了哈基米PK挑战：${code}\n打开页面输入/打开链接来应战！` : "我发起了哈基米PK挑战，快来应战！",
      url,
      qr: qrUrl
    };
  }
  if (shareType === "pk") {
    const latest = getPkMatches()[0] || null;
    if (!latest) {
      return { title: "PK战绩", text: "还没有 PK 战绩：收到挑战并完成检测后会自动记录。", url: window.location.href, qr: "HACHIMI|PK" };
    }
    const meta = [latest.opponent ? `对手：${latest.opponent}` : null, latest.code ? `挑战码：${latest.code}` : null].filter(Boolean).join(" · ");
    const dimensionScore = String(latest.dimensionScore || "").trim();
    const resultKey = String(latest.resultKey || "").trim();
    return {
      title: "PK战绩",
      text: `本机最新 PK：${Math.round(Number(latest.total) || 0)}/100${resultKey ? ` · ${resultKey}` : ""}${dimensionScore ? ` · ${dimensionScore}` : ""}\n${meta}${latest.copy ? `\n${latest.copy}` : ""}\n${formatHistoryTime(Number(latest.runCreatedAt) || Date.now())}`,
      url: window.location.href,
      qr: latest.code ? `HACHIMI|PK|${latest.code}|${resultKey || latest.outcome || ""}` : "HACHIMI|PK"
    };
  }
  if (shareType === "ranked") {
    const state = ensureRankedState();
    const tier = getTierInfoByHis(Number(state.peakHis ?? state.latestHis ?? 0) || 0);
    const startText = new Date(Number(state.seasonStart)).toLocaleDateString("zh-CN");
    const endText = new Date(Number(state.seasonEnd) - 1).toLocaleDateString("zh-CN");
    const shieldText = tier.id === "bronze" || tier.id === "silver" ? "不降段" : `${Number(state.protectionsLeft) || 0}/2`;
    return {
      title: "排位赛",
      text: `30天赛季 ${state.seasonId} · 主题 ${String(state.themeName || state.seasonId || "").trim()}\n段位：${tier.icon} ${tier.name}\n积分：${Math.max(0, Math.round(Number(state.points) || 0))} · 保护盾：${shieldText} · 连胜：${Number(state.streak) || 0}\n${startText} - ${endText}`,
      url: window.location.href,
      qr: `HACHIMI|RANKED|${state.seasonId}|${tier.id}|${Math.max(0, Math.round(Number(state.points) || 0))}`
    };
  }
  if (shareType === "achievements") {
    const runs = getRuns();
    const state = getAchievementState();
    const unlockedCount = Object.keys(state.unlocked || {}).length;
    const total = achievementsDefinition.length;
    const lastUnlockedId = Object.entries(state.unlocked || {}).sort((a, b) => Number(b[1]) - Number(a[1]))[0]?.[0] || "";
    const lastUnlocked = lastUnlockedId ? achievementsDefinition.find((item) => String(item?.id || "").trim() === lastUnlockedId) : null;
    const lastName = lastUnlocked ? String(lastUnlocked.name || "").trim() : "";
    return {
      title: "成就",
      text: `我在哈基米模拟器解锁了 ${unlockedCount}/${total || "--"} 个成就\n总检测：${runs.length} 次${lastName ? `\n最近解锁：${lastName}` : ""}`,
      url: window.location.href,
      qr: `HACHIMI|ACH|${unlockedCount}|${runs.length}`
    };
  }

  const result = latestResult || null;
  const run = result ? null : getBestRun();
  const persona = (result?.personalityProfile || run?.personalityProfile || null) && typeof (result?.personalityProfile || run?.personalityProfile) === "object" ? (result?.personalityProfile || run?.personalityProfile) : null;
  const name = String(persona?.name || "").trim();
  const emoji = String(persona?.emoji || "🐱").trim();
  const code = String(result?.personalityCode || run?.personalityCode || persona?.code || "").trim();
  const similarity = Math.max(0, Math.min(100, Math.round(Number(result?.similarity ?? run?.similarity ?? 0))));
  const his = Number(result?.audioHis ?? run?.audioHis);
  const hisText = Number.isFinite(his) ? `HIS ${formatHisValue(his)}` : "";
  const title = name ? `${emoji} ${name}` : "人格测评";
  const lines = [
    `我刚测了哈基米浓度：${similarity}%`,
    hisText ? `综合：${hisText}` : null,
    code ? `人格：${code}` : null,
    persona?.title ? `称号：${String(persona.title || "").trim()}` : null
  ].filter(Boolean);
  const text = result ? buildShareCopy(result) : lines.join("\n");
  return { title, text, url: window.location.href, qr: code ? `HACHIMI|PERSONA|${code}|${similarity}` : `HACHIMI|PERSONA|${similarity}` };
}

function clearShareModalPoster() {
  if (latestShareModalUrl) {
    URL.revokeObjectURL(latestShareModalUrl);
    latestShareModalUrl = "";
  }
  latestShareModalBlob = null;
  if (shareModalImage) {
    shareModalImage.hidden = true;
    shareModalImage.removeAttribute("src");
  }
  if (shareModalCanvas) {
    shareModalCanvas.hidden = true;
  }
}

function drawPosterText(context, text, x, y, width) {
  const content = String(text || "").trim();
  if (!content) {
    return;
  }
  context.fillStyle = "#3a3230";
  context.font = "800 30px Microsoft YaHei, sans-serif";
  drawWrappedText(context, content, x, y, width, 44, 8);
}

async function generateShareModalPoster(payload) {
  if (!shareModalCanvas || !shareModalImage) {
    return null;
  }
  const context = shareModalCanvas.getContext("2d");
  const width = shareModalCanvas.width;
  const height = shareModalCanvas.height;
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

  const bg = context.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
  bg.addColorStop(0, "rgba(255, 107, 53, 0.16)");
  bg.addColorStop(1, "rgba(17, 138, 138, 0.12)");
  context.fillStyle = bg;
  context.fillRect(cardX, cardY, cardW, cardH);

  context.fillStyle = "rgba(255, 255, 255, 0.88)";
  context.fillRect(cardX + 18, cardY + 18, cardW - 36, cardH - 36);

  context.textAlign = "left";
  context.fillStyle = "#171717";
  context.font = "900 28px Microsoft YaHei, sans-serif";
  context.fillText("哈气模拟器 · 分享卡", cardX + 56, cardY + 78);
  context.fillStyle = "#8b7355";
  context.font = "800 22px Microsoft YaHei, sans-serif";
  context.fillText(String(payload?.title || "分享").trim(), cardX + 56, cardY + 114);

  const textX = cardX + 56;
  const textY = cardY + 176;
  const textW = cardW - 112;
  drawPosterText(context, payload?.text || "", textX, textY, textW);

  const qrContent = String(payload?.qr || payload?.url || payload?.text || "").trim();
  const qrMatrix = getQrMatrix(qrContent);
  if (qrMatrix) {
    const qrSize = 296;
    const qrX = cardX + cardW - qrSize - 44;
    const qrY = cardY + cardH - qrSize - 96;
    context.save();
    context.fillStyle = "#ffffff";
    context.beginPath();
    roundRectPath(context, qrX - 12, qrY - 12, qrSize + 24, qrSize + 24, 28);
    context.fill();
    paintQrMatrix(context, qrMatrix, qrX, qrY, qrSize);
    context.restore();
  }

  context.fillStyle = "#b8a48c";
  context.font = "800 20px Microsoft YaHei, sans-serif";
  context.textAlign = "left";
  context.fillText("扫码/复制文案分享（二维码本地生成）", cardX + 56, cardY + cardH - 56);

  context.restore();

  clearShareModalPoster();
  latestShareModalBlob = await new Promise((resolve) => shareModalCanvas.toBlob(resolve, "image/png"));
  if (!latestShareModalBlob) {
    return null;
  }
  latestShareModalUrl = URL.createObjectURL(latestShareModalBlob);
  if (shareModalImage) {
    shareModalImage.src = latestShareModalUrl;
    shareModalImage.hidden = true;
  }
  if (shareModalCanvas) {
    shareModalCanvas.hidden = false;
  }
  return latestShareModalBlob;
}

async function writeClipboardText(value) {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }
  try {
    await navigator.clipboard?.writeText?.(text);
    return true;
  } catch (error) {
    return false;
  }
}

async function runPlatformShare(platform, payload) {
  const name = platform === "wechat" ? "微信" : platform === "qq" ? "QQ" : platform === "douyin" ? "抖音" : "通用";
  const text = String(payload?.text || "").trim();
  const url = String(payload?.url || "").trim();
  const copy = [text || null, url || null].filter(Boolean).join("\n");
  const copied = await writeClipboardText(copy);
  if (copied) {
    showToast({ title: `${name}分享准备就绪`, copy: url ? "已复制文案与链接，可在对应 App 粘贴发送。" : "已复制文案，可在对应 App 粘贴发送。" });
  } else {
    showToast({ title: `${name}分享提示`, copy: "浏览器未允许剪贴板权限；可手动长按选择文案再复制。" });
  }
}

async function runUniversalShare(payload) {
  const title = String(payload?.title || "分享").trim();
  const text = String(payload?.text || "").trim();
  const url = String(payload?.url || "").trim();
  if (latestShareModalBlob) {
    try {
      const file = new File([latestShareModalBlob], "hachimi-share.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text, files: [file] });
        showToast({ title: "已唤起系统分享", copy: "选择渠道发送即可。" });
        return;
      }
    } catch (error) {
    }
  }
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      showToast({ title: "已唤起系统分享", copy: "选择渠道发送即可。" });
      return;
    }
  } catch (error) {
  }
  const copied = await writeClipboardText([text || null, url || null].filter(Boolean).join("\n"));
  showToast({ title: copied ? "已复制分享内容" : "分享未完成", copy: copied ? "可直接粘贴到聊天或动态。" : "浏览器未授权或渠道不可用。" });
}

async function updateShareModal(options = {}) {
  if (!shareModal || !shareModalTitle || !shareModalCopy || !shareModalQr) {
    return;
  }
  const payload = buildSharePayload(currentShareType);
  shareModalTitle.textContent = String(payload.title || "分享");
  shareModalCopy.textContent = String(payload.text || "");
  const qrContent = String(payload.qr || payload.url || payload.text || "").trim();
  drawQr(shareModalQr, qrContent);
  if (shareModalQrHint) {
    if (!qrContent) {
      shareModalQrHint.textContent = "暂无可生成二维码的内容。";
    } else if (currentShareType === "challenge") {
      shareModalQrHint.textContent = "扫码打开挑战页（二维码仅在本地生成，不请求外网）。";
    } else {
      shareModalQrHint.textContent = "二维码仅在本地生成，不请求外网。";
    }
  }
  await generateShareModalPoster(payload);

  if (shareModalCopyButton) {
    shareModalCopyButton.onclick = async () => {
      const ok = await writeClipboardText(payload.text);
      showToast({ title: ok ? "已复制文案" : "复制失败", copy: ok ? "可直接粘贴到聊天或动态。" : "浏览器未允许剪贴板权限。" });
    };
  }
  if (shareModalCopyLinkButton) {
    shareModalCopyLinkButton.onclick = async () => {
      const ok = await writeClipboardText(payload.url);
      showToast({ title: ok ? "已复制链接" : "复制失败", copy: ok ? "可直接粘贴发送。" : "浏览器未允许剪贴板权限。" });
    };
  }
  if (shareModalSavePosterButton) {
    shareModalSavePosterButton.onclick = () => {
      if (!latestShareModalUrl) {
        return;
      }
      const link = document.createElement("a");
      link.href = latestShareModalUrl;
      link.download = "hachimi-share.png";
      link.click();
      showToast({ title: "已开始下载", copy: "如果被拦截，请检查浏览器下载设置。" });
    };
  }
  if (shareModalUniversalButton) {
    shareModalUniversalButton.onclick = () => runUniversalShare(payload);
  }
  if (shareModalWechatButton) {
    shareModalWechatButton.onclick = () => runPlatformShare("wechat", payload);
  }
  if (shareModalQqButton) {
    shareModalQqButton.onclick = () => runPlatformShare("qq", payload);
  }
  if (shareModalDouyinButton) {
    shareModalDouyinButton.onclick = () => runPlatformShare("douyin", payload);
  }

  const prefer = String(options?.preferPlatform || "").trim();
  if (prefer === "wechat" || prefer === "qq" || prefer === "douyin") {
    await runPlatformShare(prefer, payload);
  }
}

function openShareModal(options = {}) {
  if (!shareModal) {
    return;
  }
  const targetType = String(options?.type || "personality").trim() || "personality";
  setActiveShareType(targetType);
  shareModal.hidden = false;
  shareModal.setAttribute("aria-hidden", "false");

  const close = () => {
    shareModal.hidden = true;
    shareModal.setAttribute("aria-hidden", "true");
    clearShareModalPoster();
  };

  if (shareModalClose) {
    shareModalClose.onclick = close;
  }
  shareModal.onclick = (event) => {
    if (event.target === shareModal) {
      close();
    }
  };

  shareModal.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape") {
        close();
      }
    },
    { once: true }
  );

  updateShareModal(options);
}

function bindButtonShareTypes() {
  const nodes = [shareTypePersonality, shareTypeTemplate, shareTypeChallenge, shareTypePk, shareTypeRanked, shareTypeAchievements].filter(Boolean);
  nodes.forEach((button) => {
    button.addEventListener("click", () => {
      const type = String(button.dataset.shareType || "personality");
      setActiveShareType(type);
      updateShareModal();
    });
  });
}

bindButtonShareTypes();

if (rankingSubtabBoard) rankingSubtabBoard.addEventListener("click", () => setRankingSubtab("board"));
if (rankingSubtabRanked) rankingSubtabRanked.addEventListener("click", () => setRankingSubtab("ranked"));
if (rankingSubtabPk) rankingSubtabPk.addEventListener("click", () => setRankingSubtab("pk"));

if (rankingShareButton) {
  rankingShareButton.addEventListener("click", () => {
    openShareModal({ type: currentRankingSubtab === "ranked" ? "ranked" : currentRankingSubtab === "pk" ? "pk" : "personality" });
  });
}
if (rankedShareButton) rankedShareButton.addEventListener("click", () => openShareModal({ type: "ranked" }));
if (pkShareButton) pkShareButton.addEventListener("click", () => openShareModal({ type: "pk" }));
if (achievementsShareButton) achievementsShareButton.addEventListener("click", () => openShareModal({ type: "achievements" }));
if (templateCompareShareButton) templateCompareShareButton.addEventListener("click", () => openShareModal({ type: "template" }));
if (challengeCompareShareButton) challengeCompareShareButton.addEventListener("click", () => openShareModal({ type: "pk" }));

async function init() {
  currentUserId = getOrCreateUserId();
  incomingChallengeCode = getChallengeCodeFromPathname(window.location.pathname);
  if (incomingChallengeCode) {
    await loadIncomingChallenge(incomingChallengeCode);
  }
  await loadAchievementsDefinition();
  await loadReferenceAudioDefinition();
  renderSettlementHistory();
  renderRanking();
  renderRankedSeason();
  renderPkMatches();
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
