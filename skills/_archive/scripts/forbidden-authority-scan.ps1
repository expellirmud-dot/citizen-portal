# forbidden-authority-scan.ps1
param([string]$Path = ".")

$forbidden = @("approve", "git push", "commit", "recovery trigger", "generic dispatch")
Write-Host "Scanning for forbidden authority patterns..."

$found = $false
foreach ($pattern in $forbidden) {
    $matches = Get-ChildItem -Recurse $Path -File | Select-String -Pattern $pattern
    if ($matches) {
        Write-Host "WARNING: Risky pattern detected: $pattern" -ForegroundColor Yellow
        $matches
        $found = $true
    }
}

if ($found) {
    Write-Host "Scan completed with warnings (advisory only)." -ForegroundColor Yellow
} else {
    Write-Host "No forbidden patterns found." -ForegroundColor Green
}
exit 0
