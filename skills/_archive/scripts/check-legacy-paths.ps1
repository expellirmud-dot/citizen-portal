# check-legacy-paths.ps1
param([string]$Path = ".")

$legacy = "D:\utility_automation_v2"
Write-Host "Scanning $Path for legacy path: $legacy"

$matches = Get-ChildItem -Recurse $Path -File | Select-String -SimpleMatch -Pattern $legacy -Quiet
if ($matches) {
    Write-Host "Legacy paths found!" -ForegroundColor Red
    Get-ChildItem -Recurse $Path -File | Select-String -SimpleMatch -Pattern $legacy
    exit 1
} else {
    Write-Host "No legacy paths found." -ForegroundColor Green
    exit 0
}
