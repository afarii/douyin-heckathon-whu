# 哈气模拟器 v1 Spec

## Why
当前 Demo 仅提供“哈基米相似度”单页流程与少量文案，无法覆盖文档定义的 HIS 等级、人格体系、PK、排行榜、档案与成就等核心玩法与用户体验。

## What Changes
- 将现有单页“相似度测试”升级为“哈气模拟器”多页面流程：首页 → 录制 → 分析加载 → 结果 → PK/排行榜/我的档案。
- 按 [04-界面文案.md](file:///d:/hachimi-project/04-%E7%95%8C%E9%9D%A2%E6%96%87%E6%A1%88.md)、[03-排名称号与成就.md](file:///d:/hachimi-project/03-%E6%8E%92%E5%90%8D%E7%A7%B0%E5%8F%B7%E4%B8%8E%E6%88%90%E5%B0%B1.md)、[01-人格体系.md](file:///d:/hachimi-project/01-%E4%BA%BA%E6%A0%BC%E4%BD%93%E7%B3%BB.md)、[02-音频量化与评分.md](file:///d:/hachimi-project/02-%E9%9F%B3%E9%A2%91%E9%87%8F%E5%8C%96%E4%B8%8E%E8%AF%84%E5%88%86.md) 实现：
  - 音频特征提取、HIS 评分与等级称号、六维雷达数据
  - 哈基米TI 人格（16 常规 + 2 隐藏）判定与展示
  - 成就系统（23 个）、排行榜与个人档案（本地存储）
  - PK：模板对比 + 用户挑战码（含有效性校验）
- 新增参考音频：在录音/上传前提供 `基米素材/haqi.mp3` 播放入口供用户对照；并将其作为默认“参考模板音频”参与对比展示（至少包含：参考音频可播放、可与用户本次录音做特征/得分对比）。
- **BREAKING**：页面标题、文案、评分口径从“相似度(0-100)”变更为 HIS(0-10) + 等级称号 + 人格体系；旧 UI 结构将被替换。

## Impact
- Affected specs: 首页/录制/加载/结果/PK/排行榜/档案/分享/错误提示/新手引导
- Affected code:
  - 前端：index.html、styles.css、app.js
  - 后端：backend/server.py（用于挑战码签名/校验等必要能力；保留 /api/upload 兼容）
  - 资源：基米素材/haqi.mp3（静态资源供播放与对比）

## ADDED Requirements

### Requirement: 参考音频播放（haqi.mp3）
系统 SHALL 在用户录音/上传之前，提供参考音频 `基米素材/haqi.mp3` 的播放能力，用于用户模仿与对照。

#### Scenario: 用户在录制前听参考音频
- **WHEN** 用户进入录制页面
- **THEN** 页面提供“播放参考哈气”入口（不依赖自动播放）
- **AND** 参考音频可暂停/继续/重播

### Requirement: 音频输入与约束
系统 SHALL 支持麦克风录制与本地音频文件上传，并按文档约束时长与错误提示。

#### Scenario: 麦克风录制成功
- **WHEN** 用户开始录制并在 1–5 秒内停止（或达到上限自动停止）
- **THEN** 生成可播放的预览音频
- **AND** 进入“分析加载”流程

#### Scenario: 上传音频成功
- **WHEN** 用户选择 `audio/*` 文件
- **THEN** 生成可播放的预览音频
- **AND** 进入“分析加载”流程

#### Scenario: 录制/上传错误
- **WHEN** 麦克风权限被拒绝/无设备/浏览器不支持/录制过短/全程静音/需要 HTTPS
- **THEN** 展示 [04-界面文案.md](file:///d:/hachimi-project/04-%E7%95%8C%E9%9D%A2%E6%96%87%E6%A1%88.md) 中对应错误文案

### Requirement: 音频特征提取与 HIS 评分
系统 SHALL 对用户音频提取 FeatureVector（至少覆盖文档用于评分/人格/雷达的字段），并按 [02-音频量化与评分.md](file:///d:/hachimi-project/02-%E9%9F%B3%E9%A2%91%E9%87%8F%E5%8C%96%E4%B8%8E%E8%AF%84%E5%88%86.md) 计算：
- dbScore、freqScore、durationScore、chaosScore（0–10）
- Audio_HIS（0–10）
- 六维雷达数据：loudness/pitch/endurance/chaos/stability/burst（0–10）

#### Scenario: 生成 HIS 与六维展示数据
- **WHEN** 用户完成一次录制或上传
- **THEN** 系统计算并得到 hisScore、hisLevel、六维雷达数据
- **AND** 结果页展示 HIS 评分、等级称号与四维/六维指标

### Requirement: HIS 等级称号与文案
系统 SHALL 按 [03-排名称号与成就.md](file:///d:/hachimi-project/03-%E6%8E%92%E5%90%8D%E7%A7%B0%E5%8F%B7%E4%B8%8E%E6%88%90%E5%B0%B1.md)（及 02 中同表）将 HIS 映射到 Lv.1–Lv.9，并在结果页展示对应称号、颜色与描述/升级提示。

#### Scenario: HIS 分数映射等级
- **WHEN** hisScore 落在对应区间
- **THEN** 展示该等级称号、颜色与等级描述文案

### Requirement: 哈基米TI 人格判定与展示
系统 SHALL 按 [01-人格体系.md](file:///d:/hachimi-project/01-%E4%BA%BA%E6%A0%BC%E4%BD%93%E7%B3%BB.md) 的判定流程输出：
- personality（四字母代号或隐藏人格代号）
- personalityMatch（匹配度）
- 人格展示信息（emoji、名称、称号、稀有度、趣味文案、标签）

#### Scenario: 输出常规人格
- **WHEN** 音频未触发隐藏人格条件
- **THEN** 系统输出四维度组合人格代号（如 HPTC）与综合匹配度

#### Scenario: 触发隐藏人格
- **WHEN** 满足 MEOOOW 或 SILENT 的触发条件
- **THEN** 系统输出对应隐藏人格并跳过四维度组合

### Requirement: 分析加载页与动效文案
系统 SHALL 在计算过程中展示“分析加载页”，并按 [04-界面文案.md](file:///d:/hachimi-project/04-%E7%95%8C%E9%9D%A2%E6%96%87%E6%A1%88.md) 顺序轮播 Step 1–Step 8 文案与进度反馈。

### Requirement: 参考音频对比展示
系统 SHALL 以 `基米素材/haqi.mp3` 为默认参考，计算其 FeatureVector 与 HIS，并在结果页提供“你 vs 参考哈气”的可视化对比（至少包含：HIS、响度/音调/持久/混沌四维差异与一句对比文案）。

### Requirement: 成就系统（23 个）
系统 SHALL 按 [03-排名称号与成就.md](file:///d:/hachimi-project/03-%E6%8E%92%E5%90%8D%E7%A7%B0%E5%8F%B7%E4%B8%8E%E6%88%90%E5%B0%B1.md) 定义的成就解锁条件与文案，记录解锁状态并展示“成就解锁弹窗”文案（参照 04 第十章）。

### Requirement: 排行榜（本地）
系统 SHALL 提供本地排行榜（localStorage），支持总榜/响度榜/音调榜/持久榜/混沌榜/人气榜的视图与空状态文案（按 03/04）。

### Requirement: 我的档案（本地）
系统 SHALL 提供“我的哈气档案”页面，展示统计、历史最佳、人格收集、最近记录、设置与清除数据确认弹窗（按 03/04）。

### Requirement: PK（模板对比 + 用户挑战码）
系统 SHALL 提供 PK 模式：
- 模板对比：基于 [02-音频量化与评分.md](file:///d:/hachimi-project/02-%E9%9F%B3%E9%A2%91%E9%87%8F%E5%8C%96%E4%B8%8E%E8%AF%84%E5%88%86.md) 的模板数据与对比评分规则输出胜负与评级文案（并使用 04 的页面文案）。
- 用户挑战码：生成/输入挑战码并校验有效性（过期/无效/被篡改/是自己等文案按 04 6.4）。

## MODIFIED Requirements

### Requirement: 分享文案
系统 SHALL 将分享文案替换为 [04-界面文案.md](file:///d:/hachimi-project/04-%E7%95%8C%E9%9D%A2%E6%96%87%E6%A1%88.md) 第九章定义的模板（结果分享、PK分享、挑战码分享、成就分享）。

## REMOVED Requirements

### Requirement: 旧版“哈基米浓度/相似度”单页结算
**Reason**: 新文档体系以 HIS + 人格 + PK/排行榜/成就为核心，旧评分口径与页面结构不再匹配。
**Migration**: 保留 /api/upload 兼容能力作为后端音频处理入口，但前端 UI 与结果字段切换为 FeatureVector/HIS/人格结构。*** End Patch here? Wait file must end. We'll ensure no trailing marker.
