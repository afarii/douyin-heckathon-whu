# Tasks
- [x] Task 1: 提取并固化《04-界面文案.md》为 UI_COPY 字典
  - [x] 按章节结构创建 `ui_copy/copy.js` 并逐条录入文案
  - [x] 显式包含：全局按钮/提示语、录制页文案、错误文案、加载步骤、结果页区块文案、PK/挑战码文案、排行榜/档案文案、分享文案模板、无障碍 ARIA、快捷键提示、SEO/OG/Twitter 文案

- [x] Task 2: 实现文案模板渲染与安全替换
  - [x] 实现 `renderCopy(template, params)`：替换 `{key}` 占位符；缺失参数不抛异常
  - [x] 实现 `getCopy(path)`：通过路径读取文案（用于测试与调用）

- [x] Task 3: 前端接入与替换关键路径硬编码文案
  - [x] 替换 index.html：title/meta/OG/Twitter 为文档定义
  - [x] 替换 app.js：按钮文案、状态提示、错误提示、加载步骤、分享文案与挑战码分享文案
  - [x] 保持功能不回归（录音、检测、结果展示均可用）

- [x] Task 4: 单元测试与逐条一致性校验
  - [x] 通过文档解析（表格/引号/代码块）对 UI_COPY 做一致性覆盖校验
  - [x] 覆盖模板渲染：正常/缺参/多参/特殊字符
  - [x] 覆盖“文案键结构固定”：禁止新增/删减键

- [x] Task 5: 交付物与回归门禁
  - [x] 生成单元测试报告（沿用 `reports/unit-test-report.txt` 输出）
  - [x] 生成 Traceability Matrix（04）：文档条目 → 代码/测试
  - [x] CI 流水线确保任何变更自动回归验证文档合规性

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1 and Task 2
- Task 4 depends on Task 1 and Task 2
- Task 5 depends on Task 4
