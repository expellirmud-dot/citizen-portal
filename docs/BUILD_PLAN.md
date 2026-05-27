# BUILD PLAN — Citizen Portal MVP

## Purpose
กำหนดแผนการพัฒนาระบบบริหารจัดการคำร้องออนไลน์
สำหรับเทศบาลตำบลด่านทับตะโก

เอกสารนี้ใช้ควบคุม AI coding workflow
เพื่อป้องกัน scope creep และ over-engineering

Source of truth:
- PROJECT_RULES.md
- MVP_SCOPE.md
- WORKFLOW.md
- DATA_MODEL.md
- API_SPEC.md
- UI_SITEMAP.md

AI implementation must follow these docs.
No redesign unless explicitly approved.

---

# 1. Architecture Decision

Approved stack:

Frontend:
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend:
- Next.js Route Handlers
- Server Actions (only where appropriate)

Database:
- PostgreSQL

ORM:
- Prisma

Authentication:
- Auth.js

Validation:
- Zod

Forms:
- React Hook Form

Data fetching:
- TanStack Query (only if needed)

File upload:
- local storage in MVP
- abstracted for future migration

Deployment:
- Docker-ready
- production hardening later

---

# 2. Explicit Non-goals

AI must NOT introduce:

- microservices
- Redis
- Kafka
- RabbitMQ
- event bus
- websocket realtime
- GraphQL
- CQRS
- DDD over-engineering
- AI image classification
- chatbot
- LINE integration
- OTP
- citizen authentication
- external government integrations

MVP first.

---

# 3. Build Sequence

Strict order:

Phase 1
Project scaffolding

Phase 2
Database implementation

Phase 3
Authentication

Phase 4
Public citizen flows

Phase 5
Staff operations

Phase 6
Admin features

Phase 7
Executive dashboard

Phase 8
Hardening

Phase 9
Testing

No skipping.

---

# 4. Phase Tasks

# Phase 1 — Project Scaffold

Goal:
Create clean project foundation

Tasks:
- initialize Next.js project
- configure TypeScript
- install Tailwind
- install shadcn/ui
- install Prisma
- install Auth.js
- install Zod
- install React Hook Form
- configure environment variables
- create folder structure

Deliverables:
- app boots successfully
- lint passes
- build passes

Definition of done:
clean startup with no business logic yet

---

# Phase 2 — Database

Goal:
Implement approved schema

Tasks:
- create Prisma schema
- implement:
  - users
  - departments
  - request_categories
  - requests
  - request_attachments
  - request_status_history
  - staff_notes
  - audit_logs

- create migrations
- seed base data

Seed:
- default departments
- default categories
- admin user

Deliverables:
database operational

Definition of done:
migration succeeds
seed succeeds
Prisma client operational

---

# Phase 3 — Authentication

Goal:
Staff authentication only

Tasks:
- Auth.js setup
- credential provider
- login page
- session middleware
- role authorization
- logout flow

Roles:
- STAFF
- ADMIN
- EXECUTIVE

Definition of done:
protected routes working

---

# Phase 4 — Public Citizen Flows

Goal:
Citizen MVP functionality

Tasks:

Homepage:
/
- hero
- quick actions
- categories
- FAQ

Request submission:
- citizen form
- validation
- image upload
- tracking number generation

Success page:
- confirmation
- tracking display

Tracking:
- tracking form
- status timeline

Public APIs:
- categories
- submit request
- track request

Definition of done:
citizen can submit and track

---

# Phase 5 — Staff Operations

Goal:
Internal processing workflow

Tasks:
- staff dashboard
- requests list
- request detail
- update status
- add internal notes

Staff APIs:
- list requests
- get request detail
- update status
- create note

Definition of done:
staff can process requests end-to-end

---

# Phase 6 — Admin Features

Goal:
Basic administration

Tasks:
- admin dashboard
- category management
- user management
- audit log viewer

Admin APIs:
- categories CRUD
- users CRUD basic
- audit retrieval

Definition of done:
admin operational

---

# Phase 7 — Executive Dashboard

Goal:
Read-only management reporting

Tasks:
- summary dashboard
- status charts
- category charts

Definition of done:
executive visibility working

---

# Phase 8 — Hardening

Goal:
MVP security baseline

Tasks:
- input validation
- file validation
- upload restrictions
- auth guards
- RBAC enforcement
- audit logging
- safe error handling
- request sanitization
- basic rate limiting

Definition of done:
minimum production safety baseline

---

# Phase 9 — Testing

Goal:
basic confidence

Tasks:
manual testing:
- citizen submission
- citizen tracking
- login
- status transitions
- note creation
- admin actions

validation:
- invalid input
- unauthorized access
- invalid file upload

Definition of done:
core flows verified

---

# 5. Folder Structure

/app
  /(public)
  /(staff)
  /(admin)
  /(executive)
  /api

/components
  /ui
  /shared
  /public
  /staff
  /admin

/lib
  /auth
  /db
  /utils
  /validators

/prisma

/docs

/middleware.ts

---

# 6. AI Coding Rules

AI must:

- implement one phase at a time
- do not redesign architecture
- do not add infrastructure
- keep code readable
- follow TypeScript strict mode
- use server-side validation
- prefer deterministic behavior

AI must NOT:
- invent features
- expand scope
- replace stack
- introduce complex patterns without approval

---

# 7. Review Gates

Before moving to next phase:

Phase 1:
project builds

Phase 2:
DB migration works

Phase 3:
auth works

Phase 4:
citizen flow works

Phase 5:
staff workflow works

Phase 6:
admin works

Phase 7:
dashboard works

Phase 8:
security checks pass

Phase 9:
manual acceptance complete

---

# 8. Delivery Definition

MVP complete when:

Citizen:
✓ submit request
✓ receive tracking number
✓ track status

Staff:
✓ login
✓ process request
✓ update status
✓ add notes

Admin:
✓ manage categories
✓ manage users
✓ audit logs

Executive:
✓ dashboard visibility

System:
✓ persistent DB
✓ authentication
✓ validation
✓ file upload
✓ audit trail