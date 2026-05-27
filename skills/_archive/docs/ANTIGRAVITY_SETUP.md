# Antigravity Agent Setup

This guide details the setup, configuration, validation, and smoke-testing of the **Antigravity** agentic runtime in the AI Tools Kit.

## Skill Configuration
*   **Skill Path:** `C:\Users\Expellirmud\.gemini\antigravity\skills` (resolves to `$HOME\.gemini\antigravity\skills`)

Skills are synchronized to this folder from the central repository (`D:\ai-tools\ai-tools-kit\skills`) using the unified sync script.

## Workspace MCP Configuration
The agent utilizes the workspace-level Model Context Protocol (MCP) configuration to bind repository-aware intelligence:

*   **Config File Path:** `D:\utility_automation_v2_light\.agent\mcp.json`

### Configuration Schema
```json
{
  "mcpServers": {
    "serena": {
      "command": "serena",
      "args": [
        "start-mcp-server",
        "--context",
        "ide-assistant",
        "--project",
        "D:\\utility_automation_v2_light"
      ]
    }
  }
}
```

## Serena MCP Setup
The Serena MCP server provides semantic coding intelligence, file search, and symbol lookup capabilities.
1.  **Command Execution:** The server is launched via the `serena` executable with `start-mcp-server` arguments.
2.  **Context Integration:** Bound to the `ide-assistant` context.
3.  **Project Target:** Rooted at the `D:\utility_automation_v2_light` project workspace.

## Validation Commands

To verify that the Antigravity skill set is correctly installed and configured:

1.  **Run Skill Synchronization:**
    ```powershell
    powershell -File D:\ai-tools\ai-tools-kit\scripts\sync-skills.ps1
    ```

2.  **Verify Skill Counts:**
    Execute the following command in PowerShell:
    ```powershell
    Get-ChildItem $HOME\.gemini\antigravity\skills -Directory | Measure-Object
    ```
    *Expectation:* The count of directories should exactly match the number of active skills defined in `D:\ai-tools\ai-tools-kit\skills` (currently 14).

## Smoke Tests

To confirm that the Antigravity agent runtime is fully operational:

1.  **Activate Serena Project:**
    Ensure that the Serena server successfully registers and indexes the project:
    *   Call tool: `mcp_serena_activate_project` with `project="D:\utility_automation_v2_light"`.
    *   Verify output indicates successful project indexing.

2.  **Verify Onboarding/Memories Status:**
    *   Call tool: `mcp_serena_check_onboarding_performed`.
    *   Verify the response returns cleanly.

3.  **Semantic Symbol Search Test:**
    *   Call tool: `mcp_serena_find_symbol` with a simple pattern search like `MeshOrchestrator` to verify the codebase indexing is active.
