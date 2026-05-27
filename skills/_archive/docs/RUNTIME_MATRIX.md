# Runtime Matrix

This matrix provides an overview of the supported AI runtimes in the AI Tools Kit, outlining where skills are loaded, how MCP integrations are configured, and where user settings reside.

## Comparison Matrix

| Runtime | Skill Path | MCP Support | Config Location | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Gemini CLI** | `$HOME\.gemini\skills` | None | `$HOME\.gemini\settings.json` | Standard Gemini execution CLI environment. |
| **Antigravity** | `$HOME\.gemini\antigravity\skills` | Yes (workspace / Serena) | Not fully confirmed | Modern agentic desktop environment with browser support. |
| **Codex** | `$HOME\.codex\skills` | None | `~/.codex/config.toml` | Coding and execution worker runtime. |
| **OpenCode** | `D:\ai-tools\ai-tools-kit\opencode\skills` | Yes (via config) | `D:\ai-tools\ai-tools-kit\opencode\opencode.json` | Bounded governance environment with explicit permission schema. |
| **Project-local** | `D:\utility_automation_v2_light\ai_runtime\skills` | Yes (workspace / Serena) | `D:\utility_automation_v2_light\.mcp.json` | Workspace-specific runtime directly integrated with the target project repository. |

## Runtime Details

### 1. Gemini CLI
*   **Skill Path:** `$HOME\.gemini\skills`
*   **MCP Support:** None
*   **Config Location:** `$HOME\.gemini\settings.json` (template in `configs/gemini-settings.template.json`)
*   **Notes:** A lightweight CLI client for executing standard automated operations.

### 2. Antigravity
*   **Skill Path:** `$HOME\.gemini\antigravity\skills`
*   **MCP Support:** Full support. Uses workspace-level MCP definition: `D:\utility_automation_v2_light\.agent\mcp.json` pointing to Serena.
*   **Config Location:** Not fully confirmed (Antigravity application settings / custom skill path configuration)
*   **Notes:** Premium agentic desktop runtime featuring advanced browser control tools and structured workflows.

### 3. Codex
*   **Skill Path:** `$HOME\.codex\skills`
*   **MCP Support:** None
*   **Config Location:** `~/.codex/config.toml` (template in `configs/codex-config.template.toml`)
*   **Notes:** Dedicated coding worker optimized for file modifications and execution tasks.

### 4. OpenCode
*   **Skill Path:** `D:\ai-tools\ai-tools-kit\opencode\skills`
*   **MCP Support:** Configuration-driven custom MCP servers.
*   **Config Location:** `D:\ai-tools\ai-tools-kit\opencode\opencode.json` (template in `configs/opencode-config.template.json`)
*   **Notes:** Highly governed controller-support environment with explicit permissions for shell commands and file edits.

### 5. Project-local Runtime
*   **Skill Path:** `D:\utility_automation_v2_light\ai_runtime\skills`
*   **MCP Support:** Integrated Serena MCP server.
*   **Config Location:** `D:\utility_automation_v2_light\.mcp.json` or `.agent/mcp.json`
*   **Notes:** Bounded runtime operating inside the target project workspace, directly coupled with local test suites and verification certifiers.
