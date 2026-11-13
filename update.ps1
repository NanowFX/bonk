#Requires -Version 5.1
<#
    BONK — vérificateur de mise à jour (silencieux).

    Appelé par la tâche planifiée « BonkUpdate » installée par install.ps1.
    Compare l'empreinte de l'extension installée à celle publiée dans
    version.json, et remplace le fichier si besoin. Peut être lancé à la main.
#>
[CmdletBinding()]
param(
    [string]$Repo = "NanowFX/bonk",
    [switch]$Force
)

$ErrorActionPreference = 'SilentlyContinue'
$ProgressPreference = 'SilentlyContinue'

$raw = "https://raw.githubusercontent.com/$Repo/main"
$target = Join-Path $env:APPDATA 'spicetify\Extensions\bonk.js'
$logDir = Join-Path $env:LOCALAPPDATA 'bonk'
if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir -Force | Out-Null }
$log = Join-Path $logDir 'update.log'

function Write-Log([string]$message) {
    $line = "{0}  {1}" -f (Get-Date).ToString('yyyy-MM-dd HH:mm:ss'), $message
    Add-Content -Path $log -Value $line
}

function Get-Sha1([string]$path) {
    if (-not (Test-Path $path)) { return '' }
    return (Get-FileHash -Path $path -Algorithm SHA1).Hash.ToLower()
}

try {
    $meta = Invoke-RestMethod -Uri "$raw/version.json?t=$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds())" -UseBasicParsing
    if (-not $meta.sha1) {
        Write-Log "version.json sans empreinte, abandon."
        exit 0
    }

    $local = Get-Sha1 $target
    if ($local -eq $meta.sha1.ToLower() -and -not $Force) {
        Write-Log "à jour ($($meta.version))."
        exit 0
    }

    $temp = Join-Path $env:TEMP ("bonk-update-" + [guid]::NewGuid().ToString("N") + ".js")
    Invoke-WebRequest -Uri "$raw/dist/bonk.js" -OutFile $temp -UseBasicParsing
    $downloaded = Get-Sha1 $temp
    if ($meta.sha1.ToLower() -ne $downloaded) {
        Write-Log "empreinte téléchargée incohérente, mise à jour annulée."
        Remove-Item $temp -Force
        exit 1
    }

    Move-Item -Path $temp -Destination $target -Force
    & spicetify apply | Out-Null
    Write-Log "mis à jour vers $($meta.version) (spicetify apply : $LASTEXITCODE)."
    exit 0
} catch {
    Write-Log "échec : $($_.Exception.Message)"
    exit 1
}
