# 哈基米相似度测试

一个浏览器端哈基米音频检测小工具。用户可以先播放示例音频 `基米素材/haqi.mp3`，再录制或上传自己的音频；前端会把用户音频和示例音频一并转换为 WAV 并提交到后端，由后端计算相似度。页面不会生成前端 Mock 分数，只有后端返回结果后才展示评分。

## 当前功能

* 示例播放：提交前可播放 `haqi.mp3`，作为模仿参考。
* 录音与上传：支持浏览器录音，也支持上传本地音频文件。
* 后端校验：检测必须经过 `POST /api/upload`，接口失败时只显示失败原因，不使用本地假分数兜底。
* 相似度评分：后端对用户音频与参考音频进行频带、节奏、气声、时长、音高等特征比对。
* 误判限制：对无关音频、普通说话、英语听力、朗读类连续人声设置分数上限，避免因为单项特征碰巧相似而拿高分。
* 结算页面：展示分数、称号、评分理由、结算动图、结算 BGM 和再测入口。
* 分数视觉：总分圆形进度会随分数改变长度和颜色。
* 分享图：结算后生成 PNG 分享图，包含分数、称号和评分理由；支持保存图片、系统分享、QQ/微博分享入口，微信以保存图和复制文案为主。
* 本机排行榜：使用 `localStorage` 保存最近最高的 10 条本机记录，可清空。

## 分数档位

| 分数区间 | 称号 |
| --- | --- |
| `85 - 100` | 神级哈基米 |
| `60 - 84` | 真哈基米 |
| `30 - 59` | 半哈基米 |
| `0 - 29` | 不像哈基米 |

视觉素材目前按 3 档切换：

| 分数区间 | 展示 |
| --- | --- |
| `85 - 100` | 绿色，高分结算动图 |
| `30 - 84` | 黄色，低分结算动图 |
| `0 - 29` | 红色，非常低结算动图 |

## 项目结构

```text
.
├── backend/
│   ├── audio_similarity.py      # 音频特征提取与相似度评分
│   ├── server.py                # 静态页面与 /api/upload 接口
│   ├── test_audio_similarity.py # 算法回归测试
│   ├── test_server_api.py       # 接口测试
│   └── reference/
├── docs/
│   ├── prompt.md
│   └── ranking.md
├── scripts/
│   └── prepare_reference.ps1
├── 基米素材/
│   ├── haqi.mp3
│   ├── 高清基米.png
│   └── 结算页图片/音频素材
├── app.js
├── index.html
├── styles.css
├── TODO.md
└── README.md
```

## 本地运行

当前项目不依赖第三方 Python 包，直接启动内置后端即可。它会同时提供静态页面和 `/api/upload` 接口。

```bash
python backend/server.py
```

默认访问：

```text
http://127.0.0.1:4173/
```

如需指定端口：

```powershell
$env:PORT=4180; python backend/server.py
```

录音功能依赖浏览器麦克风权限，建议通过 `localhost` 或 `127.0.0.1` 访问。

## 后端接口

前端通过 `FormData` 上传音频：

```http
POST /api/upload
```

字段：

```text
audio      用户录音或上传音频，前端尽量转为 WAV
reference 参考示例音频，前端由 基米素材/haqi.mp3 转为 WAV 后一并提交
```

返回示例：

```json
{
  "similarity": 88,
  "grade": "神级哈基米",
  "comment": "你登上哈基米宇宙排行榜了！",
  "mode": "reference",
  "confidence": 0.91,
  "reasons": [
    "音色表现较好：声音频带与示例接近，哈气质感较容易被识别。",
    "节奏速度与示例接近，短促起落比较自然。"
  ],
  "details": {
    "bandSimilarity": 0.86,
    "contourSimilarity": 0.81,
    "voicedRatio": 0.12
  }
}
```

如果后端不可用、接口返回非 `2xx`、音频无法解析，前端会显示“后端校验失败”，不会生成本地 Mock 结果。

## 相似度方案

后端会读取 WAV PCM 数据并做以下处理：

* 重采样到 16kHz 单声道。
* 去除直流偏移，统一峰值音量。
* 用能量阈值估计噪声底，只保留有效声音帧。
* 提取音高、过零率、频带能量、能量轮廓、节奏包络、稳定人声音高占比等特征。
* 有参考音频时，使用频带余弦相似度、能量轮廓 DTW、气声接近度、有效时长、音高和节奏比例综合评分。
* 对明显无关音频设置硬上限：多个关键特征不达标时会限制最高分。
* 对英语听力、朗读、普通连续说话增加 `voicedRatio` 识别：稳定人声音高占比高、气声颗粒弱、有效片段足够长时，会限制最高分。

这套方案仍然是轻量级启发式音频算法，适合 Demo 和 Hackathon 展示。它不等同于专业声纹识别或深度音频嵌入模型。

## 测试

```bash
python -m py_compile backend/audio_similarity.py backend/server.py backend/test_audio_similarity.py backend/test_server_api.py
python backend/test_audio_similarity.py
python backend/test_server_api.py
```

当前测试覆盖：

* 相似音频应高于不相关音频。
* 不相关音频会被分数上限限制。
* 连续语音/英语听力式音频不会获得高分。
* `/api/upload` 能返回合法评分结构。

## 相关文档

* [后续 TODO](./TODO.md)
* [后续更新建议](./docs/roadmap-suggestions.md)
* [评分文档](./docs/ranking.md)
* [项目提示词记录](./docs/prompt.md)
