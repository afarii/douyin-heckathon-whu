# 哈吉米TI人格体系实现 Spec

## Why
当前仓库仅实现“哈基米相似度”评分与展示，尚未实现《01-人格体系.md》定义的“哈吉米TI（Hajimi Type Indicator）”人格分类与输出内容，导致核心玩法缺失且无法自动验证文档合规性。

## What Changes
- 新增哈吉米TI人格判定能力：按《01-人格体系.md》实现隐藏人格优先判定、四维度判定、人格代号组合、匹配度计算与综合匹配度输出。
- 新增人格类型静态数据：将 16 种常规人格 + 2 种隐藏人格的全部字段（代号/名称/称号/主题色/Emoji/稀有度/文案/画像/标签等）以“代码显式声明 + 默认值”的方式固化，禁止遗漏与改写。
- 新增 FeatureVector 数据结构与校验：显式声明《01-人格体系.md》判定流程中出现的全部特征字段，并提供默认值与异常处理流程。
- 扩展后端接口返回：在现有 `POST /api/upload` 成功响应中追加人格分析结果字段（不移除既有字段；前端可忽略新增字段）。
- 新增单元测试：为每条人格规则与边界条件编写测试用例，覆盖正常/异常/边界；并对所有人格类型静态数据做一致性校验。
- 新增交付物：
  - 配置文件（人格规则阈值、默认匹配度区间、枚举值、模板文本等）
  - 单元测试报告产出（本地脚本与 CI 工件）
  - Traceability Matrix（文档条目 → 代码/配置/测试映射）
  - 可验证 CI 流水线（自动运行测试 + 输出报告，作为文档合规性回归门禁）

## Impact
- Affected specs: 音频特征向量（FeatureVector）→ 人格判定 → 结果输出（人格卡片所需字段）
- Affected code:
  - 前端/通用：新增 `hajimi_ti/*` JS 模块（可在浏览器与 Node 测试复用）
  - 前端：扩展 [app.js](file:///c:/Users/15812/Documents/GitHub/douyin-heckathon-whu/app.js) 在检测结果中追加人格输出

## ADDED Requirements

### Requirement: HajimiTI FeatureVector
系统 SHALL 定义一个 FeatureVector 数据结构，用于承载人格判定所需的音频物理特征，且字段名与《01-人格体系.md》判定流程中出现的标识完全一致，禁止新增或删减字段。

#### Scenario: Default initialization
- **WHEN** 以默认构造创建 FeatureVector
- **THEN** 每个字段都有显式默认值（数值字段为 0 或文档指定默认；比例字段为 0.0），并可用于安全判定（不会抛异常）

#### Scenario: Validation failure
- **WHEN** 传入 FeatureVector 含非法值（如 `silenceRatio` 不在 [0,1] 或 `duration` 为负）
- **THEN** 系统返回明确的错误类型与错误信息，且错误信息字段在 API 中稳定可消费

**FeatureVector 字段（仅此集合）**：
- `avgDB: float`（dB）
- `peakDB: float`（dB）
- `dominantFreq: float`（Hz）
- `peakFreq: float`（Hz）
- `lowFreqRatio: float`（0-1）
- `lowFreqDuration: float`（s）
- `duration: float`（s）
- `activeDuration: float`（s）
- `silenceRatio: float`（0-1）
- `volumeVariance: float`（0-1）
- `pitchChangeRate: float`（Hz/s）
- `freqVariance: float`（Hz²）
- `his: float`（0-10，HIS 强度/评分；用于《01-人格体系.md》边界判定）

### Requirement: Hidden personality detection (priority)
系统 SHALL 在进入四维度判定前，先执行隐藏人格检测；如命中则直接返回隐藏人格结果，不再进行四维度判定。

#### Scenario: MEOOOW trigger
- **WHEN** `dominantFreq < 1500` **且** `lowFreqDuration > 0.5`
- **THEN** 返回人格代号 `MEOOOW`，并给出匹配度

#### Scenario: SILENT trigger
- **WHEN** `avgDB < 20` **或** `duration < 0.3`
- **THEN** 返回人格代号 `SILENT`，并给出匹配度

#### Scenario: No hidden match
- **WHEN** 不满足任何隐藏人格触发条件
- **THEN** 进入四维度判定流程

### Requirement: Dimension 1 H/S determination
系统 SHALL 依据《01-人格体系.md》“维度一：H/S”规则判定 H 或 S：
- `avgDB > 65` **且** `peakFreq > 4000` → H
- `avgDB < 45` **或** `silenceRatio > 0.6` → S
- 否则：`his > 5` → H；`his <= 5` → S

#### Scenario: Boundary branch (his)
- **WHEN** 既不满足 H 的硬阈值，也不满足 S 的硬阈值
- **THEN** 仅以 `his > 5` 决策 H/S

### Requirement: Dimension 2 L/P determination
系统 SHALL 依据《01-人格体系.md》“维度二：L/P”规则判定 L 或 P：
- `activeDuration > 1.5` **且** `volumeVariance < 0.15` → L
- `activeDuration < 0.8` **或** `volumeVariance > 0.3` → P
- 否则：`activeDuration > 1.0` → L；否则 → P

### Requirement: Dimension 3 T/F determination
系统 SHALL 依据《01-人格体系.md》“维度三：T/F”规则判定 T 或 F：
- `dominantFreq > 5000` **或** `peakFreq > 7000` → T
- `dominantFreq < 3000` **且** `lowFreqRatio > 0.4` → F
- 否则：`dominantFreq > 4000` → T；否则 → F

### Requirement: Dimension 4 C/R determination
系统 SHALL 依据《01-人格体系.md》“维度四：C/R”规则判定 C 或 R：
- `pitchChangeRate > 500` **或** `freqVariance > 1500` → C
- `pitchChangeRate < 200` **且** `freqVariance < 500` → R
- 否则：`pitchChangeRate > 350` → C；否则 → R

### Requirement: Personality code composition
系统 SHALL 将四维判定结果按顺序拼接为四字母人格代号（如 `HLTC`），并输出每个维度的匹配度百分比以及综合匹配度（四维匹配度平均值）。

#### Scenario: Match confidence ranges
- **WHEN** 维度由明确硬条件命中得出
- **THEN** 该维度匹配度在 85%–95% 之间（默认值在配置中显式声明）
- **WHEN** 维度由边界分支得出（HIS 或中值判定）
- **THEN** 该维度匹配度在 55%–75% 之间（默认值在配置中显式声明）

### Requirement: Personality catalog (18 types)
系统 SHALL 内置 18 个类型定义（16 常规 + 2 隐藏），且每个类型在代码/配置中显式声明并提供默认值；不得缺失字段、不得改写文案、不得调整枚举值。

#### Scenario: Lookup by code
- **WHEN** 以人格代号查询类型定义
- **THEN** 返回包含下列字段的结构体/JSON（字段集合固定，不得增删）：
  - `code` / `name` / `title` / `dimensionCombo`（隐藏人格可为空）/ `themeColor` / `emoji` / `rarityText` / `rarityRateText`
  - `coreDescription` / `fullCopy` / `hissPortrait`（结构化 6 维数值）/ `knownCat` / `socialTags`

## MODIFIED Requirements

### Requirement: Upload API response schema
前端检测结果对象 SHALL 保持既有字段不变，并在其基础上追加人格分析字段：
- `personality`：人格代号（`HLTC` / `MEOOOW` / `SILENT` 等）
- `personalityMatch`：综合匹配度（0-1）
- `dimensionMatches`：四维判定字母与匹配度
- `personalityProfile`：人格类型静态数据（用于前端展示）

## REMOVED Requirements
无。
