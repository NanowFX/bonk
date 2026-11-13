#Requires -Version 5.1
<#
    BONK — installation et mise à jour pour Spicetify.

    Usage :
        irm https://raw.githubusercontent.com/NanowFX/bonk/main/install.ps1 | iex

    Ce script : télécharge la dernière version de l'extension, l'active dans
    Spicetify, l'applique, puis installe le vérificateur de mise à jour
    automatique (tâche planifiée, repli sur le dossier Démarrage).
#>
[CmdletBinding()]
param(
    [string]$Repo = "NanowFX/bonk",
    [switch]$NoAutoUpdate
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$raw = "https://raw.githubusercontent.com/$Repo/main"
$extensionsDir = Join-Path $env:APPDATA 'spicetify\Extensions'
$installDir = Join-Path $env:LOCALAPPDATA 'bonk'

function Write-Step([string]$message) { Write-Host "  $message" }
function Write-Ok([string]$message) { Write-Host "  $message" -ForegroundColor Green }
function Write-Warn([string]$message) { Write-Host "  $message" -ForegroundColor Yellow }
function Fail([string]$message) { Write-Host "`n  $message`n" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "  BONK — écouter Spotify à deux" -ForegroundColor Magenta
Write-Host "  -----------------------------" -ForegroundColor DarkGray

# 1. Spicetify doit être présent (et fonctionnel) avant tout.
$spicetify = Get-Command spicetify -ErrorAction SilentlyContinue
if (-not $spicetify) {
    Fail @"
Spicetify n'est pas installé (ou pas dans le PATH).
Installe-le d'abord : https://spicetify.app/docs/getting-started
Puis relance cette commande.
"@
}

if (-not (Test-Path $extensionsDir)) {
    New-Item -ItemType Directory -Path $extensionsDir -Force | Out-Null
}

# 2. Téléchargement de l'extension.
Write-Step "Téléchargement de BONK…"
$target = Join-Path $extensionsDir 'bonk.js'
$temp = Join-Path $env:TEMP ("bonk-" + [guid]::NewGuid().ToString("N") + ".js")
try {
    Invoke-WebRequest -Uri "$raw/dist/bonk.js" -OutFile $temp -UseBasicParsing
} catch {
    Fail "Téléchargement impossible. Vérifie ta connexion, puis relance."
}

$version = "inconnue"
try {
    $meta = Invoke-RestMethod -Uri "$raw/version.json" -UseBasicParsing -ErrorAction Stop
    if ($meta.version) { $version = $meta.version }
} catch {
    Write-Warn "Version distante illisible, on installe la dernière build disponible."
}

Move-Item -Path $temp -Destination $target -Force
Write-Ok "Extension installée ($version) : $target"

# 3. Activation dans Spicetify, sans écraser les autres extensions.
Write-Step "Activation dans Spicetify…"
$current = (& spicetify config extensions) 2>$null
$list = @()
if ($current) { $list = ($current -split '\s+') | Where-Object { $_ } }
if ($list -notcontains 'bonk.js') {
    $list = @($list) + 'bonk.js'
    & spicetify config extensions ($list -join ' ') | Out-Null
}

Write-Step "Application du thème et des extensions…"
& spicetify apply | Out-Null
if ($LASTEXITCODE -ne 0) { Fail "spicetify apply a échoué. Ouvre un terminal et lance-le à la main pour voir l'erreur." }
Write-Ok "Spicetify appliqué."

# 4. Mise à jour automatique : petite tâche planifiée, sans droits admin.
if (-not $NoAutoUpdate) {
    Write-Step "Installation de la mise à jour automatique…"
    if (-not (Test-Path $installDir)) { New-Item -ItemType Directory -Path $installDir -Force | Out-Null }
    $updater = Join-Path $installDir 'update.ps1'
    try {
        Invoke-WebRequest -Uri "$raw/update.ps1" -OutFile $updater -UseBasicParsing
    } catch {
        Write-Warn "Vérificateur non téléchargé : la mise à jour automatique est désactivée."
        $updater = $null
    }

    if ($updater) {
        $registered = $false
        try {
            $action = New-ScheduledTaskAction -Execute 'powershell.exe' `
                -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$updater`""
            $atLogon = New-ScheduledTaskTrigger -AtLogOn
            $every6h = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(5) `
                -RepetitionInterval (New-TimeSpan -Hours 6)
            $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries `
                -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
            Register-ScheduledTask -TaskName 'BonkUpdate' -Action $action -Trigger @($atLogon, $every6h) `
                -Settings $settings -Description 'Met à jour l extension Spicetify BONK.' -Force | Out-Null
            $registered = $true
            Write-Ok "Mise à jour automatique activée (tâche planifiée BonkUpdate)."
        } catch {
            $registered = $false
        }

        if (-not $registered) {
            # Repli sans admin : un raccourci au démarrage.
            try {
                $startup = [Environment]::GetFolderPath('Startup')
                $cmd = Join-Path $startup 'BonkUpdate.cmd'
                "@echo off`r`npowershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$updater`"`r`n" |
                    Set-Content -Path $cmd -Encoding ASCII
                Write-Ok "Mise à jour automatique activée (au démarrage)."
            } catch {
                Write-Warn "Mise à jour automatique indisponible : relance ce script pour mettre à jour."
            }
        }
    }
}

Write-Host ""
Write-Ok "C'est prêt. Redémarre Spotify, puis clique sur le bouton BONK de la barre de lecture."
Write-Host ""
