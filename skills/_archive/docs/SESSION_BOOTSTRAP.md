# Session Bootstrap Guide

This document contains the continuation context and prompt template to initialize new agent sessions within the AI Tools Kit ecosystem.

## Continuation Prompt

When starting a new session, copy and run the following bootstrap context:

```text
You are operating inside the AI Tools Kit environment. Initialize your state by reviewing the following context:

1. PROJECT PATHS
   - Central Tools Repository: D:\ai-tools\ai-tools-kit
   - Active Target Workspace: D:\utility_automation_v2_light

2. RUNTIME ROLES & ARCHITECTURE
   - Controller: Governs decisions, reviews results, signs off on states.
   - Executor: Implements scoped code and documentation additions/updates.
   - Intelligence: Indexing and symbol graphs provided by Serena MCP.

3. GOVERNANCE RULES
   - Read-First validation is mandatory before modifying files.
   - Invariants must be preserved: Ledger is the sole source of truth; AI is advisory; certifiers must not be weakened.
   - No automatic git commit or push actions without explicit controller authorization.

4. MIXED-STATE EXCEPTIONS GUIDANCE
   - Ensure the git working tree is verified before editing.
   - If local unstaged/dirty files exist, pause and inspect their scope.
   - If modifications belong to skill metadata/frontmatter updates, they may be committed separately or restored as instructed. Do not mix unrelated functional changes with documentation/configuration.

5. MANDATORY READ ORDER
   Follow this sequence before initiating any code or documentation changes:
   A. D:\utility_automation_v2_light\PROJECT_RULES.md
   B. D:\utility_automation_v2_light\AI_HANDOFF.md
   C. D:\utility_automation_v2_light\AGENTS.md
   D. D:\utility_automation_v2_light\CONTROLLER.md
   E. Current assigned task scope / inbox messages
   F. repo_memory/project_state.json and associated markdown files.
```
