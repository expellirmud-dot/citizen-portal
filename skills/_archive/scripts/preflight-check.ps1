# preflight-check.ps1
param([string]$RepoPath = ".")
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition

Write-Host "Running preflight checks on $RepoPath..."

& "$scriptDir\check-git-clean.ps1" -Path $RepoPath
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& "$scriptDir\check-legacy-paths.ps1" -Path $RepoPath
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Environment Summary:"
$PSVersionTable.PSVersion
Write-Host "Repo Path: $(Get-Location)"

Write-Host "Preflight passed." -ForegroundColor Green
exit 0