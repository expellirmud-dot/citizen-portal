# UI SITEMAP — Citizen Portal MVP

## Purpose
กำหนดแผนผังหน้าเว็บของระบบบริหารจัดการคำร้องออนไลน์
เทศบาลตำบลด่านทับตะโก

เอกสารนี้ใช้เป็น source of truth สำหรับการออกแบบ UI และการสร้าง route ใน Next.js

MVP เน้น:
- ประชาชนใช้งานง่าย
- เจ้าหน้าที่ทำงานเร็ว
- ผู้บริหารดูภาพรวมได้
- ไม่ออกแบบเกินขอบเขต MVP

---

# 1. Route Overview

## Public Routes

/
หน้าแรกระบบบริการประชาชน

/request/new
หน้ายื่นคำร้องออนไลน์

/request/success
หน้าส่งคำร้องสำเร็จ

/request/track
หน้าตรวจสอบสถานะคำร้อง

/request/track/result
หน้าแสดงผลสถานะคำร้อง

/login
หน้าเข้าสู่ระบบเจ้าหน้าที่

---

## Staff Routes

/staff/dashboard
แดชบอร์ดเจ้าหน้าที่

/staff/requests
รายการคำร้องทั้งหมด

/staff/requests/[id]
รายละเอียดคำร้อง

---

## Admin Routes

/admin/dashboard
แดชบอร์ดผู้ดูแลระบบ

/admin/categories
จัดการหมวดหมู่คำร้อง

/admin/users
จัดการบัญชีเจ้าหน้าที่

/admin/audit-logs
ตรวจสอบประวัติการใช้งานระบบ

---

## Executive Routes

/executive/dashboard
แดชบอร์ดผู้บริหาร

---

# 2. Public Pages

## 2.1 Home Page

Route:
/

Purpose:
เป็นหน้าแรกสำหรับประชาชนเข้าสู่บริการ

Primary actions:
- ยื่นคำร้องออนไลน์
- ตรวจสอบสถานะคำร้อง

Sections:
1. Header
2. Hero
3. Quick Action Cards
4. Service Categories
5. How It Works
6. Benefits
7. FAQ
8. Contact / Footer

Header:
- logo / ชื่อเทศบาล
- หน้าแรก
- ยื่นคำร้อง
- ติดตามสถานะ
- เข้าสู่ระบบเจ้าหน้าที่

Hero:
- ชื่อระบบ
- คำอธิบายสั้น
- CTA ยื่นคำร้องออนไลน์
- CTA ตรวจสอบสถานะ

Design notes:
- modern government service
- clean
- trustworthy
- mobile-first
- not marketing-heavy

---

## 2.2 New Request Page

Route:
/request/new

Purpose:
ประชาชนกรอกคำร้องใหม่

Components:
- page title
- category select
- citizen information form
- request detail form
- image upload
- consent / confirmation checkbox
- submit button

Fields:
- citizen_name
- citizen_phone
- citizen_email optional
- category_id
- title
- description
- attachment optional

Validation:
- required fields clearly marked
- show inline validation
- disable submit while loading

After success:
redirect to /request/success

---

## 2.3 Request Success Page

Route:
/request/success

Purpose:
แจ้งว่าระบบรับคำร้องเรียบร้อยแล้ว

Content:
- success message
- tracking number
- instruction to save tracking number
- button to track status
- button back to homepage

Must show:
- tracking_number

---

## 2.4 Track Request Page

Route:
/request/track

Purpose:
ประชาชนกรอกเลขคำร้องเพื่อตรวจสอบสถานะ

Components:
- tracking number input
- submit button
- help text showing example format

Example:
REQ-2026-000001

After submit:
display result or navigate to /request/track/result

---

## 2.5 Track Result Page

Route:
/request/track/result

Purpose:
แสดงสถานะคำร้อง

Components:
- request summary card
- current status badge
- status timeline
- submitted date
- closed date if exists

Privacy:
- do not show internal staff notes
- do not show full personal data
- do not show internal audit data

---

## 2.6 Login Page

Route:
/login

Purpose:
เจ้าหน้าที่เข้าสู่ระบบ

Components:
- email input
- password input
- login button
- error message

After login:
- STAFF → /staff/dashboard
- ADMIN → /admin/dashboard
- EXECUTIVE → /executive/dashboard

---

# 3. Staff Pages

## 3.1 Staff Dashboard

Route:
/staff/dashboard

Purpose:
หน้าเริ่มต้นของเจ้าหน้าที่

Widgets:
- จำนวนคำร้องใหม่
- จำนวนคำร้องกำลังดำเนินการ
- จำนวนคำร้องเสร็จสิ้น
- รายการคำร้องล่าสุด

Actions:
- ไปหน้ารายการคำร้อง
- เปิดรายละเอียดคำร้อง

---

## 3.2 Staff Requests List

Route:
/staff/requests

Purpose:
แสดงรายการคำร้องทั้งหมดที่เจ้าหน้าที่จัดการได้

Components:
- table
- status filter
- category filter
- search box
- pagination

Table columns:
- tracking number
- title
- category
- status
- assigned department
- created date
- action

Actions:
- view detail

---

## 3.3 Staff Request Detail

Route:
/staff/requests/[id]

Purpose:
ดูรายละเอียดและดำเนินการกับคำร้อง

Sections:
1. Request summary
2. Citizen information
3. Request description
4. Attachments
5. Status control
6. Status history
7. Internal staff notes

Actions:
- update status
- add internal note
- close request

Rules:
- status update must require note when closing
- internal notes visible only to staff/admin

---

# 4. Admin Pages

## 4.1 Admin Dashboard

Route:
/admin/dashboard

Purpose:
ภาพรวมระบบสำหรับผู้ดูแล

Widgets:
- total requests
- requests by status
- requests by category
- active staff users
- latest audit logs

---

## 4.2 Category Management

Route:
/admin/categories

Purpose:
จัดการหมวดหมู่คำร้อง

Components:
- category table
- create category form/dialog
- edit category form/dialog
- active/inactive toggle

Fields:
- name
- description
- is_active

---

## 4.3 User Management

Route:
/admin/users

Purpose:
จัดการบัญชีเจ้าหน้าที่

Components:
- user table
- create user form/dialog
- disable user action

Fields:
- email
- password
- full_name
- role
- department_id

Roles:
- STAFF
- ADMIN
- EXECUTIVE

---

## 4.4 Audit Logs

Route:
/admin/audit-logs

Purpose:
ตรวจสอบประวัติการกระทำในระบบ

Components:
- audit log table
- filter by action
- filter by user
- filter by date

Columns:
- action
- user
- entity_type
- entity_id
- ip_address
- created_at

Read-only

---

# 5. Executive Pages

## 5.1 Executive Dashboard

Route:
/executive/dashboard

Purpose:
ผู้บริหารดูรายงานสรุป

Widgets:
- total requests
- pending requests
- completed requests
- requests by category
- requests by status

Access:
read-only

No editing actions

---

# 6. Navigation Rules

Public navigation:
- Home
- ยื่นคำร้อง
- ติดตามสถานะ
- เข้าสู่ระบบเจ้าหน้าที่

Staff navigation:
- Dashboard
- Requests
- Logout

Admin navigation:
- Dashboard
- Requests
- Categories
- Users
- Audit Logs
- Logout

Executive navigation:
- Dashboard
- Logout

---

# 7. Layout Rules

Public layout:
- top navigation
- responsive mobile menu
- footer

Authenticated layout:
- sidebar navigation on desktop
- top bar
- mobile drawer navigation
- content area

---

# 8. UI Design Principles

Use:
- clean layout
- large readable Thai text
- clear buttons
- high contrast
- simple icons
- consistent spacing
- accessible color contrast
- mobile-first layout

Avoid:
- complex animation
- unnecessary charts
- overcrowded dashboard
- marketing-style exaggerated CTA
- hidden navigation

---

# 9. Component Candidates

Shared components:
- AppHeader
- AppFooter
- PageHeader
- StatusBadge
- RequestTimeline
- RequestCard
- RequestTable
- EmptyState
- LoadingState
- ErrorState
- ConfirmDialog
- FormField
- FileUpload
- DashboardStatCard

---

# 10. MVP Non-goals

Not included:
- citizen account dashboard
- chat interface
- LINE OA screen
- AI image classification screen
- realtime map
- notification center
- advanced analytics dashboard