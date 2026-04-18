# Tasks
- [x] Task 1: 建立 02 模块骨架与配置
  - [x] 新建 `hachimi_scoring/*`（或等价目录）并固定导出入口（FeatureVector02、提取器、量化器、HIS、模板、对比、PK、挑战码）
  - [x] 显式声明并提供默认值：技术参数（采样率/FFT/平滑/min&max dB/静音阈值等）
  - [x] 定义枚举：频率等级 F1-F5、响度等级 D1-D5、时长等级 T1-T5、混沌等级 C1-C5、HIS 等级 Lv.1-Lv.9、模板编号 T1-T6、对比评级 SSS/SS/S/A/B/C

- [x] Task 2: 实现 FeatureVector（02）结构、默认值与严格校验
  - [x] FeatureVector（02）字段集合严格按 9.1（禁止增删字段）
  - [x] 计算字段（dbScore/freqScore/…/hisScore/hisLevel/radarData）与默认值策略
  - [x] 异常类型与错误信息稳定输出（含字段名）

- [x] Task 3: 实现音频特征提取（02）
  - [x] 实现浏览器路径（Web Audio API）：采样率/FFT/smoothing/min&max dB/静音阈值
  - [x] 实现测试路径（Node/纯 JS）：支持从 PCM WAV 提取同等字段（用于单测/CI）
  - [x] 计算并填充 9.1 中的全部基础特征字段（含 attack/decay/sustain、spectralCentroid、avgFreq、freqRange 等）
  - [x] 明确异常路径：音频为空、过短、无有效片段、格式不支持

- [x] Task 4: 实现量化与综合评分（02）
  - [x] 实现四类量化等级与对应文案/颜色（2.1/3.1/4.1/5.1 + 描述段落）
  - [x] 实现四个得分公式（2.3/3.3/4.3/5.2）与 clamp
  - [x] 实现 Audio_HIS 公式（6.1）与权重（6.2）
  - [x] 实现 HIS 等级映射（6.3）：称号/描述/颜色逐字一致
  - [x] 实现六维雷达图数据（6.4）

- [x] Task 5: 实现内置模板（02）
  - [x] 固化 T1–T6 的模板参数（7.2 表格数值逐项一致）
  - [x] 固化模板描述与挑战提示文案（逐字一致）

- [x] Task 6: 实现模板对比评分、PK 评分与挑战码（02）
  - [x] 模板对比评分（8.1）：差异、加权、加分、评级文案与对比文案模板
  - [x] 用户 PK 评分（8.2）：维度胜负、bonus、综合得分、胜负判定文案
  - [x] 挑战码（8.3）：生成/解析/签名/验签/过期判定与文案

- [x] Task 7: 前端对接与最小展示（可选但默认执行）
  - [x] 在现有检测流程中追加：HIS 分数、等级称号、雷达数据、人格字段/模板对比/PK（按 UI 现状最小展示）
  - [x] 保持原有“相似度检测”流程不破坏，失败回退仍可展示 02 结果

- [x] Task 8: 单元测试、报告、追溯矩阵与 CI
  - [x] 为每条规则编写测试：正常/异常/边界（阈值边界值必须覆盖）
  - [x] 断言与文档示例输入输出一致（若文档提供示例数值/文案）
  - [x] 生成单元测试报告（文本/JSON 至少一种）并纳入 CI 工件
  - [x] Traceability Matrix：02 文档条目 → 代码/配置/测试映射
  - [x] CI：自动跑测试 + 上传报告工件；任何变更自动回归验证文档合规性

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1 and Task 2
- Task 4 depends on Task 2 and Task 3
- Task 5 depends on Task 4
- Task 6 depends on Task 4 and Task 5
- Task 7 depends on Task 4
- Task 8 depends on Task 6
