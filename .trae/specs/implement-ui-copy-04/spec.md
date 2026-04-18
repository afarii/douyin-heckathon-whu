# 04-界面文案落地 Spec

## Why
当前前端页面存在硬编码文案，且与《04-界面文案.md》不一致/不可追溯，导致 UI 文案无法被自动回归验证，后续改动易破坏文档合规性。

## What Changes
- 新增“文案字典”模块，将《04-界面文案.md》所有用户可见文案（标题、按钮、提示语、错误信息、加载步骤、结果文案、分享文案、PK/挑战码文案、引导文案、ARIA 标签、快捷键提示、SEO/OG 文案等）以 **代码显式声明** 的方式固化，并提供默认值。
- 前端按文档定义替换现有硬编码字符串：页面标题、按钮、提示语、错误提示、加载步骤、结果页各区块、分享文案、挑战码提示等。
- 文案模板渲染：支持 `{占位符}` 替换（如 `{剩余秒数}`、`{code}`、`{n}` 等），并对缺失占位符提供稳定降级策略（保持原模板或回退为空串）。
- 单元测试：逐条校验“文案字典”与文档条目一致（逐字一致），并验证模板替换与边界条件。
- 交付物：单元测试报告、Traceability Matrix（04 文档条目 → 代码/测试映射）、CI 回归门禁（自动运行测试并上传报告工件）。

## Impact
- Affected specs: UI 文案体系、分享文案、挑战码文案、无障碍 ARIA 文案、SEO/OG 元数据文案
- Affected code:
  - 前端： [index.html](file:///c:/Users/15812/Documents/GitHub/douyin-heckathon-whu/index.html)、[app.js](file:///c:/Users/15812/Documents/GitHub/douyin-heckathon-whu/app.js)
  - 新增：`ui_copy/*`（或同等命名空间）
  - 测试：`test/ui_copy.test.js` 等

## ADDED Requirements

### Requirement: 文案字典（04）
系统 SHALL 在代码中显式声明一个文案字典对象 `UI_COPY`（命名空间固定），覆盖《04-界面文案.md》全部用户可见文案条目，且键结构与文档章节结构一一对应（禁止新增或删减字段/键）。

#### Scenario: Default availability
- **WHEN** 前端加载 `UI_COPY`
- **THEN** 所有文案键均可用且有默认值，不依赖网络请求

#### Scenario: Exact match
- **WHEN** 读取任意文案条目
- **THEN** 返回字符串与《04-界面文案.md》逐字一致（包括标点、引号、emoji、换行）

### Requirement: 文案模板渲染
系统 SHALL 提供 `renderCopy(template, params)`，对模板中形如 `{key}` 的占位符做替换。

#### Scenario: Complete params
- **WHEN** `template="录制中... ⏱️ {剩余秒数}s"` 且 `params={剩余秒数: 3}`
- **THEN** 输出 `"录制中... ⏱️ 3s"`

#### Scenario: Missing params
- **WHEN** 模板存在占位符但 `params` 缺失
- **THEN** 输出保持模板原样（不抛异常）

### Requirement: 前端文案替换（关键路径）
系统 SHALL 将前端关键路径文案替换为 `UI_COPY` 中的定义：
- 浏览器标签标题、页面标题区、按钮文案、录制提示/错误文案、分析加载步骤、结果页标题/提示/分享文案、挑战码相关文案。

## MODIFIED Requirements

### Requirement: 分享文案生成
现有分享文本生成逻辑 SHALL 使用《04-界面文案.md》“9.2 分享文案（复制到剪贴板）”与“9.4 挑战码分享文案”模板，并通过 `renderCopy` 填充变量。

## REMOVED Requirements
无。

