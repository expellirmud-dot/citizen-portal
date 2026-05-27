---
name: code-review-lite
description: Lightweight review workflow for citizen_portal changes.
---

# Code Review Lite

Use this skill after a scoped implementation.

## Required Discipline

Review:
- changed files
- build output
- route behavior
- scope adherence
- unnecessary complexity

## Rules

Allowed:
- approve scoped changes
- request exact fixes
- identify regressions
- identify over-engineering

Forbidden:
- proposing new architecture
- expanding scope
- adding speculative future work

## Review Output

Return:
- approve or needs fixes
- exact issues
- exact files to fix
- whether npm run build passed
