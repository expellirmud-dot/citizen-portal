$source = "D:\ai-tools\ai-tools-kit\skills"

$targets = @(
  "D:\utility_automation_v2_light\ai_runtime\skills",
  "$HOME\.gemini\skills",
  "$HOME\.codex\skills",
  "$HOME\.gemini\antigravity\skills"
)

foreach ($target in $targets) {
  New-Item -ItemType Directory -Force $target | Out-Null
  Copy-Item "$source\*" "$target\" -Recurse -Force
  Write-Host "Synced skills to $target"
}
