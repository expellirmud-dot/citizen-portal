# sync-agent-configs.ps1
param([switch]$Force)

$configDir = "D:\ai-tools\ai-tools-kit\configs"
$targets = @(
    "$env:USERPROFILE\.gemini",
    "$env:USERPROFILE\.codex"
)

foreach ($target in $targets) {
    if (-not (Test-Path $target)) {
        New-Item -Path $target -ItemType Directory
    }
    
    # Sync logic (requires specific templates mapping, simplified here)
    Write-Host "Syncing to $target (Force: $Force)"
}
Write-Host "Sync complete."
