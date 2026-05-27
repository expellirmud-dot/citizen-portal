---
name: citizen-portal-memory
description: Repository memory for the citizen_portal research prototype.
---

# Citizen Portal Repository Memory

## Project Identity

This project is a research prototype first.

It is not intended to be treated as a full production municipal enterprise system at this stage.

Primary goal:
Build a working prototype for an online citizen request management system for Dan Thap Tako Subdistrict Municipality.

Mindset:
Research prototype first, production optional later.

## Current Product Scope

Core flows that already work:

Citizen:
- open homepage
- submit request
- receive tracking number
- track request status

Staff:
- login
- view request list
- open request detail
- update request status
- status history is recorded

Admin:
- login
- view basic admin dashboard

## Tech Stack

Frontend:
- Next.js App Router
- React
- TypeScript
- Tailwind CSS

Backend:
- Next.js Route Handlers
- Prisma

Database:
- SQLite for local MVP development
- PostgreSQL may be considered later for deployment

Auth:
- NextAuth credentials provider
- Staff/admin login only
- No citizen account in MVP

## Important Constraints

Do not over-engineer.

Do not add:
- microservices
- Redis
- Kafka
- websocket realtime
- citizen login
- OTP
- SMS
- LINE integration
- AI image classification
- complex approval workflow
- predictive analytics

Unless explicitly requested.

## Protected Working Routes

These routes must remain working:

- /
- /login
- /admin/dashboard
- /request/new
- /request/success
- /request/track
- /staff/requests
- /staff/requests/[id]

## Protected Working Flows

Do not break:

1. Citizen submission
Citizen opens homepage
→ clicks submit request
→ fills form
→ submits
→ receives tracking number

2. Citizen tracking
Citizen enters tracking number
→ sees latest status and history

3. Staff workflow
Staff logs in
→ sees request list
→ opens request detail
→ updates status
→ citizen can see updated status

## Current Development Priority

Next task:
TASK 004 Full Visual Overhaul

Goal:
Improve visual quality only.

Allowed:
- layout polish
- typography
- spacing
- color system
- cards
- buttons
- responsive design
- visual consistency

Forbidden:
- backend changes
- Prisma changes
- auth changes
- route changes
- new features

## Design Direction

Target style:
- modern civic SaaS
- clean
- trustworthy
- Thai-friendly
- minimal
- premium but not flashy

References:
- Linear
- Stripe
- Vercel
- modern public service portal

Avoid:
- old government website style
- heavy bureaucratic tone
- marketing landing page exaggeration
- unnecessary animation