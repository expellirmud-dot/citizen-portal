# workspace-bootstrap.ps1
$dirs = @(".gemini", ".codex", "ai_runtime")

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -Path $dir -ItemType Directory
        Write-Host "Created $dir"
    }
}
Write-Host "Workspace bootstrap complete."
