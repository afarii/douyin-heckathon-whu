# 参考音频

用于比对的哈基米参考音频放在这里，并命名为：

```text
hachimi.wav
```

当前推荐参考素材：

```text
基米素材/haqi.mp3
```

页面会在用户提交时把这段示例音频转换为 WAV，并随用户录音一起传给后端。也可以离线生成固定参考 WAV：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\prepare_reference.ps1
```

要求：

* WAV PCM 格式
* 建议 1 到 3 秒
* 单声道或双声道均可
* 内容尽量干净，避免伴奏、人声和环境噪声混在一起

如果没有这个文件，后端会进入 `heuristic` 模式，只根据“短促、明亮、有重复节奏”的哈基米式声音特征给出启发式评分。
