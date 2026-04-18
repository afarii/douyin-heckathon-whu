# 音频量化与评分（02）实现 Spec

## Why
当前仓库已有基础的录音/上传与“相似度”展示，但《02-音频量化与评分.md》定义的特征提取、量化等级、Audio_HIS 综合评分、六维雷达、内置模板、模板对比评分、PK评分、挑战码签名等尚未形成可回归验证的实现与交付物，导致玩法与文档不一致且缺乏 CI 级合规回归。

## What Changes
- 新增“音频量化与评分（02）”的 JS 实现模块，严格按文档的字段名/公式/阈值/文案落地。
- 显式声明全部配置项、枚举值、模板数据、评级文案、错误处理文案，并提供默认值。
- 新增单元测试：逐条覆盖量化/评分/对比/PK/挑战码规则（正常/异常/边界），并产出测试报告。
- 新增 Traceability Matrix（02 文档条目 → 代码/配置/测试）与 CI 流水线门禁（自动跑测试与上传报告工件）。

## Impact
- Affected specs: 音频特征提取 → 量化得分 → Audio_HIS → 雷达图 → 模板对比/PK/挑战码
- Affected code:
  - 新增 `hachimi_scoring/*`（或同等命名空间）实现 02 文档能力（不得与既有人格模块字段/接口冲突）
  - 可选：扩展 [app.js](file:///c:/Users/15812/Documents/GitHub/douyin-heckathon-whu/app.js) 展示 HIS、等级、雷达与模板/PK信息（最小侵入，不破坏现有流程）

## ADDED Requirements

### Requirement: FeatureVector（02）字段结构与默认值
系统 SHALL 定义《02-音频量化与评分.md》“9.1 完整数据结构”中的 FeatureVector（02）对象结构，字段集合固定，禁止新增或删减字段；所有字段在代码中显式声明并提供默认值。

#### Scenario: Default initialization
- **WHEN** 以默认构造创建 FeatureVector（02）
- **THEN** 字段均存在且有默认值（数值型为 0 / 文档指定默认；比例为 0.0），可用于后续计算且不会抛异常

#### Scenario: Reject unknown field
- **WHEN** 输入包含未在文档结构中的字段
- **THEN** 抛出可识别的校验错误，错误对象包含 `field` 与稳定错误信息

**字段集合（严格按文档 9.1）**：
- 基础频率特征：`dominantFreq` `peakFreq` `avgFreq` `freqRange` `spectralCentroid` `lowFreqRatio`
- 基础响度特征：`avgDB` `peakDB` `minDB` `dbRange` `rmsEnergy`
- 时间特征：`duration` `activeDuration` `silenceRatio` `attackTime` `decayTime` `sustainLevel`
- 变化特征：`volumeVariance` `pitchChangeRate` `freqVariance`
- 综合评分（计算得出）：`dbScore` `freqScore` `durationScore` `chaosScore` `hisScore` `hisLevel` `personality` `personalityMatch`
- 雷达图：`radarData.loudness` `radarData.pitch` `radarData.endurance` `radarData.chaos` `radarData.stability` `radarData.burst`

### Requirement: 特征提取技术参数（02）
系统 SHALL 按文档“1.2 技术实现参数”显式声明并使用以下默认配置（可通过配置文件覆盖）：
- 采样率：44100Hz
- FFT：4096
- 平滑系数：0.3
- `minDecibels=-90`，`maxDecibels=-10`
- 静音阈值：`RMS < 0.01 或 dB < 25dB`
- 录制时长限制：1–5 秒（但规则中仍需支持 `<0.3s` 的错误与隐藏人格触发）
- 频率分析范围：20–20000Hz

#### Scenario: Unsupported audio format
- **WHEN** 音频格式不满足实现支持范围（如非 PCM WAV）
- **THEN** 进入明确异常分支并返回稳定错误信息（不得抛出不可读异常）

### Requirement: 量化得分计算（02）
系统 SHALL 按文档公式计算以下得分（范围 0–10，均需 `clamp`）并显式实现：
- `freqScore = clamp((dominantFreq - 1000) / 9000 * 10, 0, 10)`
- `dbScore = clamp((avgDB - 20) / 80 * 10, 0, 10)`
- `durationScore = clamp((activeDuration - 0.3) / 2.7 * 10, 0, 10)`
- `chaosScore = clamp(freqVariance / 3000 * 10, 0, 10)`

### Requirement: Audio_HIS 综合评分与等级（02）
系统 SHALL 按文档“6.1 HIS 公式”计算：
`Audio_HIS = 0.40 * dbScore + 0.25 * freqScore + 0.20 * durationScore + 0.15 * chaosScore`
并生成：
- `hisScore`（0–10）
- `hisLevel`（1–9），等级区间、称号与描述文案严格与“6.3 HIS 等级对照表”一致（文案必须在代码中显式声明并提供默认值）

### Requirement: 六维雷达图数据（02）
系统 SHALL 按文档“6.4 六维雷达图数据”计算：
- `radarData.loudness = dbScore`
- `radarData.pitch = freqScore`
- `radarData.endurance = durationScore`
- `radarData.chaos = chaosScore`
- `radarData.stability = (1 - volumeVariance) * 10`
- `radarData.burst = clamp((peakDB - avgDB) / 30 * 10, 0, 10)`

### Requirement: 内置耄耋模板（02）
系统 SHALL 内置 6 个模板（T1–T6），字段与数值严格与文档“7.2 模板详细数据”一致，包含：
- `avgDB` `dominantFreq` `peakFreq` `activeDuration` `freqVariance` `volumeVariance` `estimatedHIS`
并显式声明每个模板的描述与挑战提示文案（逐字一致）。

### Requirement: AI 模板对比评分（02）
系统 SHALL 按文档“8.1 模板对比评分”实现：
- `diffDB/diffFreq/diffDur/diffChaos` 的归一化差异
- `totalDiff` 加权综合差异
- `similarity=(1-totalDiff)*100` 并裁剪 0–100
- 超越加分：`userDB > templateDB && userFreq > templateFreq` 时按公式加分且上限 20，再裁剪到 100
并返回评级（SSS/SS/S/A/B/C）与对应文案/表情（逐字一致），以及各维度对比展示文案模板。

### Requirement: 用户 PK 评分（02）
系统 SHALL 按文档“8.2 用户PK评分”实现：
- 5 个维度的胜负判定与得分（胜者 `10 + bonus`，败者 0）
- `bonus` 按各维度最大差值归一化后裁剪 0–5
- 综合得分按权重合成，总分范围 0–150
- 胜负文案与表情严格与表格一致（逐字一致）

### Requirement: 挑战码（02）
系统 SHALL 实现文档“8.3 挑战码规则”：
- 生成 Base64(JSON) 挑战码，字段集合固定：`v/id/ts/nick/db/freq/dur/chaos/type/his/lvl/sig`
- `id` 为 12 位随机 hex；`ts` 为 Unix 秒
- `sig` 为 `HMAC-SHA256(签名内容, 服务端密钥)` 的 hex（密钥不得暴露给前端，默认从环境变量读取并提供占位默认值仅用于本地开发）
- 校验挑战码：Base64 解码 → JSON 校验 → 签名验证 → 7 天有效期校验（>7 天视为过期）
并返回文档规定的展示文案（生成/接受/成功/失败/过期/无效）。

## MODIFIED Requirements

### Requirement: 前端结果对象扩展（02）
现有前端检测结果对象 SHALL 在保持既有字段（相似度、称号、评价文案等）不变的前提下，追加 02 文档产物字段（FeatureVector02 / hisScore / hisLevel / radarData / templateCompare / pkResult / challengeCode 等，具体由实现阶段在接口中固定）。

## REMOVED Requirements
无。

