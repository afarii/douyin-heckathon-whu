# Tasks
- [x] Task 1(JS): 建立 HajimiTI 人格判定模块骨架
  - [x] 新建 `hajimi_ti/*` 模块并导出公共接口
  - [x] 定义 FeatureVector（字段集合固定、默认值显式、校验严格）
  - [x] 显式声明枚举值与默认配置（匹配度、阈值）

- [x] Task 2(JS): 实现《01-人格体系.md》判定逻辑（隐藏人格优先 + 四维度 + 匹配度）
  - [x] 实现隐藏人格检测：MEOOOW / SILENT（优先级正确）
  - [x] 实现四维度判定：H/S、L/P、T/F、C/R（含边界分支）
  - [x] 输出匹配度：硬命中/边界命中默认值 + 综合平均
  - [x] 输出人格代号与人格类型查询（18 类型）

- [x] Task 3(JS): 从 WAV 音频生成 FeatureVector（满足人格判定字段）
  - [x] 解析 PCM WAV（8/16/32-bit，mono/stereo）
  - [x] 计算：avgDB/peakDB、dominantFreq/peakFreq、lowFreqRatio/lowFreqDuration、duration/activeDuration/silenceRatio、volumeVariance、pitchChangeRate/freqVariance
  - [x] 计算并写入 `his` 默认值（用于 H/S 边界判定）
  - [x] 异常路径明确：格式不支持、音频为空、过短、无有效片段

- [x] Task 4(JS): 前端接入人格输出（不破坏现有功能）
  - [x] 在检测流程中追加本地人格分析结果（API 成功与 Mock 回退均可获得人格字段）
  - [x] 在结果页文案中展示人格代号/名称（最小展示）

- [x] Task 5(JS): 人格类型静态数据落地（16+2）并保持文案逐字一致
  - [x] 将每个人格条目的字段以代码显式声明并提供默认值（不得缺失/改写）
  - [x] 为每个人格的“哈气画像”提供结构化 6 维数值（与文档一致）

- [x] Task 6(JS): 单元测试覆盖（逐条规则 + 异常 + 边界）
  - [x] 覆盖隐藏人格触发与优先级（含边界：1500Hz、0.5s、20dB、0.3s）
  - [x] 覆盖四维度每条分支（硬阈值命中 / 边界分支命中）
  - [x] 覆盖 18 种人格静态数据字段完整性与查询异常
  - [x] 覆盖 WAV 特征提取的基础正确性（合成音频 dominantFreq 近似）

- [x] Task 7: 交付物与合规回归
  - [x] 提供 Traceability Matrix（文档条目 → 代码/配置/测试）
  - [x] 产出单元测试报告（`reports/unit-test-report.txt`）
  - [x] 新增 CI 流水线：自动运行测试并上传报告工件

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1
- Task 4 depends on Task 2 and Task 3
- Task 5 depends on Task 1
- Task 6 depends on Task 2 and Task 5
- Task 7 depends on Task 6
