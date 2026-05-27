---
name: safe-implementation
description: Scope-controlled implementation workflow for citizen_portal research prototype tasks.
---

# Safe Implementation

Use this skill when implementing a scoped task.

## Required Discipline

Before editing:
- identify exact task
- identify exact files to change
- verify task is within MVP/research prototype scope

## Rules

Allowed:
- minimal diffs
- route/page changes within requested task
- frontend and API changes only when scoped
- build fixes caused by current task

Forbidden:
- scope creep
- Prisma schema changes unless explicitly requested
- auth logic changes unless explicitly requested
- new infrastructure
- new integrations
- hidden feature additions
- over-engineered abstractions

## Completion Checklist

Check:
- npm run build passes
- existing working flows still work
- no unrelated files changed
- no local secrets or database files committed
