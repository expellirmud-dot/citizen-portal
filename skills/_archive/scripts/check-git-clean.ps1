# check-git-clean.ps1

param([string]$Path = ".")
Push-Location -Path $Path

git rev-parse --is-inside-work-tree > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "NOT A GIT REPOSITORY" -ForegroundColor Red
    Pop-Location
    exit 1
}

Write-Host "Checking git status..."
$status = git status --porcelain
if ($status) {
    Write-Host "Dirty tree detected:" -ForegroundColor Red
    $status
    Pop-Location
    exit 1
} else {
    Write-Host "Working tree is clean." -ForegroundColor Green
    Pop-Location
    exit 0
}
