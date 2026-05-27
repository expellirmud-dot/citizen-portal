# Next Actions

This document maps out immediate priorities, long-term roadmap items, and integration targets across the codebase.

## 1. AI Tools Kit Roadmap
- [ ] **Startup Verification:** Create a script (`scripts/verify-sync.ps1`) to automatically cross-reference active runtime skill directory counts against the central `skills/` folder.
- [ ] **Configuration Template Synchronizer:** Automate setup of custom settings templates (`settings.json`, `config.toml`) into user home directories.
- [ ] **Decentralized Diagnostic Command:** Build a lightweight CLI utility inside the kit to run basic smoke tests on all validated runtimes at once.

## 2. utility_automation_v2_light Roadmap
- [ ] **Operator Console UX Improvements:** Refine dashboard rendering for artifact inspection and multi-page task histories.
- [ ] **Evidence Bundle Consolidation:** Harden the deterministic verification package projection to output structured JSON artifacts for governance reviews.
- [ ] **Promotion Gatekeeper Core Expansion:** Establish strict validation thresholds for policy rollback actions.

## 3. Future Runtime Integrations
- [ ] **Claude Code Integration:** Establish local skill mappings and configure MCP capabilities for Claude Code runtimes.
- [ ] **Aider Integration:** Map config structures, validation pipelines, and command overrides for refactoring agents.
