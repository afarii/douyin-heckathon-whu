# 哈基米相似度测试

一个面向浏览器的哈基米音频小游戏 Demo。用户可以录制或上传一段音频，前端会将音频提交到后端接口进行相似度检测；只有后端返回结果后，页面才会展示分数。

## 当前功能

* 浏览器内录音：基于 `getUserMedia` 和 `MediaRecorder` 采集音频
* 音频上传：支持用户选择本地音频文件
* 音频预览：录制或上传后可直接播放
* 哈基米检测：优先请求 `POST /api/upload`
* 后端强校验：音频必须经过 `/api/upload` 分析后才会展示分数
* 结算页面：检测后展示哈基米图片素材、相似度分数、称号和评价文案
* 分享结果：支持系统分享，浏览器不支持时复制分享文案
* 响应式界面：适配手机和桌面浏览器

## 项目结构

```text
.
├── assets/
│   └── hachimi-cat.svg
├── backend/
│   ├── audio_similarity.py
│   ├── server.py
│   ├── test_audio_similarity.py
│   ├── test_server_api.py
│   └── reference/
│       └── README.md
├── docs/
│   └── prompt.md
├── app.js
├── index.html
├── styles.css
├── TODO.md
└── README.md
```

## 本地运行

项目当前不需要安装第三方依赖。推荐用内置后端启动，它会同时提供静态页面和 `/api/upload` 接口。

```bash
python backend/server.py
```

然后访问：

```text
http://127.0.0.1:4173/
```

如需换端口：

```bash
$env:PORT=4180; python backend/server.py
```

> 录音能力依赖浏览器麦克风权限。建议通过 `localhost` 或 `127.0.0.1` 访问。

## 后端接口

前端会将音频通过 `FormData` 上传到：

```http
POST /api/upload
```

字段名：

```text
audio
```

期望返回：

```json
{
  "similarity": 88,
  "grade": "神级哈基米",
  "comment": "你登上哈基宇宙排行榜了！"
}
```

如果接口不存在、请求失败或返回非 `2xx`，前端会直接提示校验失败，不会生成本地假分数。

后端会优先读取 `backend/reference/hachimi.wav` 作为参考音频。没有参考音频时，会进入启发式模式，根据短促、明亮、重复节奏等哈基米式声音特征评分。

参考素材使用 `基米素材/haqi.mp3`。页面会在提交前提供播放，用户可以先听示例再模仿。提交时前端会把示例音频转换为 WAV 一起发送给后端，后端优先以这段示例作为相似度参考。

如果需要离线生成固定参考 WAV，可以运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\prepare_reference.ps1
```

### 相似度方案

后端会先把前端录音转换成 WAV，再读取 PCM 数据并进行预处理：

* 重采样到 16kHz 单声道
* 去除直流偏移和统一峰值音量
* 使用能量阈值估计噪声底，只保留有效声音帧
* 提取音高、过零率、频带能量、能量轮廓和节奏包络
* 有参考音频时，使用频带余弦相似度、能量轮廓 DTW、嘶嘶感、有效时长、音高和节奏比例相似度综合打分
* 对明显不相关音频启用硬门槛：音色、节奏、嘶嘶感、时长、音高任意多个关键项不达标时会限制最高分

这样可以降低录音音量差异、静音片段、低频环境噪声和轻微节奏快慢差异对结果的影响，也能避免普通说话、音乐或其他不相关音频因为单项特征碰巧相似而拿到高分。接口会返回 `details` 和 `reasons`，用于说明每次评分的依据和扣分点。

## 测试

```bash
python backend/test_audio_similarity.py
python backend/test_server_api.py
```

## 相关文档

* [原始项目提示词](./docs/prompt.md)
* [后续 TODO](./TODO.md)
