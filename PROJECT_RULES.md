# citizen-portal project rules

## Goal
สร้างระบบบริหารจัดการคำร้องออนไลน์สำหรับเทศบาลตำบลด่านทับตะโก

## MVP scope
Citizen:
- submit request
- attach image
- track status

Staff:
- login
- view queue
- update status
- add resolution note

Admin:
- dashboard basic stats

## Explicit non-goals
NOT in MVP:
- AI image classification
- chatbot
- mobile app
- microservices
- realtime socket
- predictive analytics

## Architecture constraints
- Next.js App Router
- TypeScript
- Tailwind
- shadcn/ui
- PostgreSQL
- Prisma
- Auth.js

## Engineering rules
- no over-engineering
- no new infra without justification
- prefer simple deterministic workflow
- database first
- UI follows workflow, not vice versa