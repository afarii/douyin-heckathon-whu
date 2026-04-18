# 参考音频

用于比对的哈基米参考音频放在这里，并命名为：

```text
hachimi.wav
```

当前推荐参考素材：

```text
基米素材/圆头耄耋哈气5分钟 - 1.studio_video_1744227455077.mp4(Av114309698951437,P1).mp3
```

该文件是 5 分钟循环音频，不建议整段作为参考。请裁剪一段代表性哈气片段，默认建议从第 12 秒开始裁 8 秒：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\prepare_reference.ps1
```

要求：

* WAV PCM 格式
* 建议 5 到 8 秒
* 单声道或双声道均可
* 内容尽量干净，避免伴奏、人声和环境噪声混在一起

如果没有这个文件，后端会进入 `heuristic` 模式，只根据“短促、明亮、有重复节奏”的哈基米式声音特征给出启发式评分。
