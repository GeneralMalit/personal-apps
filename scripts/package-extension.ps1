$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$distPath = Join-Path $repoRoot "apps\extension\dist"
$artifactDir = Join-Path $repoRoot "artifacts"
$zipPath = Join-Path $artifactDir "timestamp-copy-extension.zip"

if (!(Test-Path $distPath)) {
  throw "Extension build output not found at $distPath. Run the extension build first."
}

New-Item -ItemType Directory -Force -Path $artifactDir | Out-Null
if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path (Join-Path $distPath "*") -DestinationPath $zipPath
Write-Host "Created $zipPath"
