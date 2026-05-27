# AI Tools Kit Status

## Executive Summary
The AI Tools Kit is a living, decentralized tool configuration and skill orchestration framework designed to enable multi-agent software engineering and deterministic governance workflows. By decoupling model capabilities, skill specifications, and runtime integrations, the kit ensures platform-agnostic, provider-independent execution of autonomous agents.

## Current State
The kit has established a unified skill framework and validated multiple independent runtimes and tools. All active skills are managed centrally and synchronized dynamically to distinct target directories depending on the active execution context.

## Validated Runtimes
The following execution environments have been successfully integrated and validated:
- **Gemini CLI:** Lightweight, standard CLI-based model invocation runtime.
- **Antigravity:** Premium agentic desktop runtime featuring advanced browser control and local MCP integration.
- **Codex:** Coding-centric execution runtime optimized for localized codebase modifications.
- **OpenCode:** Bounded governance-oriented execution environment with rigid permission policies.
- **Project-Local Runtime:** Workspace-rooted execution engine directly bound to target projects and testing certifiers.

## Validated Tools
- **Serena MCP:** Advanced repository intelligence server exposing 29 tools for file search, symbol analysis, and modification tracking.
- **Unified Sync Script:** PowerShell utility to copy code/skill files from central source control to active runtime locations.

## Runtime Paths
- **Central Skill Source:** `D:\ai-tools\ai-tools-kit\skills`
- **Gemini CLI Skills:** `$HOME\.gemini\skills`
- **Antigravity Skills:** `$HOME\.gemini\antigravity\skills`
- **Codex Skills:** `$HOME\.codex\skills`
- **OpenCode Skills:** `D:\ai-tools\ai-tools-kit\opencode\skills`
- **Project-Local Skills:** `D:\utility_automation_v2_light\ai_runtime\skills`

## Governance Model
The AI Tools Kit operates under a fail-closed, advisory-first governance paradigm. All execution layers respect the boundaries of target systems:
1.  **AI Advisory Only:** Models propose state changes and actions but lack direct commit, push, or ledger-mutation authority unless explicitly granted.
2.  **Read-First Verification:** Agents must review workspace constraints and project invariants before modifying files.
3.  **Strict Certification Gates:** Changes are subjected to local deterministic validation and certification pipelines prior to integration.

## Role Architecture
Tasks are divided among specialized runtimes to isolate concerns and optimize execution:
- **Controller:** Orchestrates and governs workflows (e.g. GPT-5.5, OpenCode).
- **Executor:** Implements scoped edits, additions, and test fixes (e.g. Gemini, Codex, Antigravity).
- **Reviewer:** Assesses implementation correctness, diffs, and verification outputs against specifications.
- **Repo Intelligence:** Crawls directories and constructs symbol graphs (e.g. Serena MCP).

## Known Constraints
- **Provider Lock-In Prevention:** Avoid API structures and prompt schemas that tightly couple the tooling to specific backend model vendors.
- **Ops Surface Read-Only Limits:** Operator consoles and visual workspaces remain GET-only; mutations are restricted to approved controllers.
- **Workspace State Tracking:** Synchronization script destinations must remain dynamic and respect user home profile directory structures.

## Current Success Status
- **Unified Skill Sync:** Live and verified. Target path counts equal 14 active skills.
- **Documentation Hardening:** Baseline matrices, setup manuals, and architecture mappings completed.
- **Smoke Tests:** Fully validated.

## Immediate Priorities
1.  Implement automated verification scripts to validate skill state matching on startup.
2.  Incorporate multi-project workspace support mapping for the Serena MCP server.
3.  Standardize prompt templates for continuation and handoff triggers across runtimes.
