param(
  [string]$SourcePath = "基米素材\圆头耄耋哈气5分钟 - 1.studio_video_1744227455077.mp4(Av114309698951437,P1).mp3",
  [string]$OutputPath = "backend\reference\hachimi.wav",
  [double]$StartSeconds = 12,
  [double]$DurationSeconds = 8,
  [switch]$CheckOnly
)

$ErrorActionPreference = "Stop"

$resolvedSource = Resolve-Path -LiteralPath $SourcePath
$outputFullPath = Join-Path (Resolve-Path -LiteralPath ".").Path $OutputPath
$outputDir = Split-Path -Parent $outputFullPath
$fadeOutStart = [Math]::Max([double]0, [double]($DurationSeconds - 0.08))
$culture = [Globalization.CultureInfo]::InvariantCulture
$startText = $StartSeconds.ToString($culture)
$durationText = $DurationSeconds.ToString($culture)
$fadeOutStartText = $fadeOutStart.ToString($culture)
$filter = "highpass=f=80,lowpass=f=10000,afade=t=in:st=0:d=0.05,afade=t=out:st=${fadeOutStartText}:d=0.08"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$args = @(
  "-y",
  "-ss", $startText,
  "-t", $durationText,
  "-i", $resolvedSource.Path,
  "-vn",
  "-ac", "1",
  "-ar", "16000",
  "-af", $filter,
  $outputFullPath
)

if ($CheckOnly) {
  Write-Host "ffmpeg $($args -join ' ')"
  exit 0
}

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue

if (-not $ffmpeg) {
  Write-Host "未找到 ffmpeg，无法直接裁剪 MP3。"
  Write-Host "安装 ffmpeg 后重新运行："
  Write-Host "powershell -ExecutionPolicy Bypass -File scripts\prepare_reference.ps1"
  exit 1
}

& $ffmpeg.Source @args

if (-not (Test-Path -LiteralPath $outputFullPath)) {
  throw "参考音频生成失败：$outputFullPath"
}

Write-Host "已生成参考音频：$outputFullPath"
