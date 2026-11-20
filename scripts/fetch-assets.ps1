$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$dest = 'D:\Projects\Gaming\DeepSeek V4.1 Model Develop Ability\pickcat-web\web'
$tree = (Invoke-WebRequest -Uri 'https://api.github.com/repos/CodeManTeam/Pickcat-Reborn/git/trees/main?recursive=1' -UseBasicParsing).Content | ConvertFrom-Json
$files = $tree.tree | Where-Object { $_.path -like 'public/assets/*' -and $_.type -eq 'blob' }
Write-Output ("downloading {0} assets" -f $files.Count)
$ok = 0
$fail = 0
foreach ($f in $files) {
    $target = Join-Path $dest ($f.path -replace '/', '\')
    $dir = Split-Path $target -Parent
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    if (Test-Path $target) { $ok++; continue }
    $url = 'https://raw.githubusercontent.com/CodeManTeam/Pickcat-Reborn/main/' + ($f.path -replace ' ', '%20')
    try {
        Invoke-WebRequest -Uri $url -OutFile $target -UseBasicParsing -TimeoutSec 60
        $ok++
    }
    catch {
        $fail++
        Write-Output ("FAIL " + $f.path)
    }
}
Write-Output ("done ok={0} fail={1}" -f $ok, $fail)
