# reference_clips_raw

把你合法获得/自有授权的音频原文件放到这个目录，文件名用参考库的编号：

```text
R01.mp3
R02.wav
R12.m4a
...
```

然后在仓库根目录（douyin-heckathon-whu 子目录）运行：

```powershell
python scripts/build_reference_clips.py --duration 6
```

脚本会：

- 生成 3–10 秒的片段到 `data/reference_clips/Rxx.mp3`
- 自动把 `data/reference_audio.v1.json` 里的对应条目补上 `audioPath`

