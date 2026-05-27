# WORKFLOW — Citizen Portal MVP

## Purpose
กำหนดกระบวนการทำงานหลักของระบบบริหารจัดการคำร้องออนไลน์
สำหรับเทศบาลตำบลด่านทับตะโก

ระบบต้องรองรับ:
- ประชาชน
- เจ้าหน้าที่
- ผู้ดูแลระบบ
- ผู้บริหาร

MVP นี้เน้น workflow ที่เรียบง่าย ใช้งานจริงได้
ไม่ออกแบบซับซ้อนเกินจำเป็น

---

# 1. Roles

## Citizen
ประชาชนผู้ยื่นคำร้อง

สิทธิ์:
- ส่งคำร้องใหม่
- แนบรูปภาพ
- รับเลขคำร้อง
- ตรวจสอบสถานะ

---

## Staff
เจ้าหน้าที่ผู้ปฏิบัติงาน

สิทธิ์:
- login
- ดูรายการคำร้อง
- ดูรายละเอียดคำร้อง
- เปลี่ยนสถานะ
- เพิ่มบันทึกผล
- ปิดคำร้อง

---

## Admin
ผู้ดูแลระบบ

สิทธิ์:
- จัดการหมวดหมู่คำร้อง
- จัดการบัญชีเจ้าหน้าที่
- ดู dashboard
- ดู audit log

---

## Executive
ผู้บริหาร

สิทธิ์:
- ดู dashboard
- ดูรายงานสรุป

---

# 2. Primary Workflow

## Citizen Submission Flow

Citizen opens homepage
→ clicks "ยื่นคำร้องออนไลน์"
→ selects complaint category
→ fills request form
→ enters contact information
→ uploads optional image
→ submits request
→ system validates data
→ system generates request number
→ system stores request
→ citizen sees success confirmation
→ citizen receives tracking number

---

# 3. Tracking Flow

Citizen opens tracking page
→ enters request number
→ system validates input
→ system fetches request
→ system displays current status
→ system displays history timeline

Possible statuses:
- รับเรื่องแล้ว
- อยู่ระหว่างตรวจสอบ
- อยู่ระหว่างดำเนินการ
- ดำเนินการเสร็จสิ้น
- ปิดคำร้อง

---

# 4. Staff Processing Flow

Staff opens login page
→ enters credentials
→ system authenticates
→ dashboard displayed

Staff selects request
→ opens detail page
→ reviews citizen information
→ reviews attachments

Decision:
IF request valid
    continue processing
ELSE
    mark rejected / request clarification

Staff updates status:
รับเรื่องแล้ว
→ อยู่ระหว่างตรวจสอบ
→ อยู่ระหว่างดำเนินการ
→ ดำเนินการเสร็จสิ้น
→ ปิดคำร้อง

Staff adds internal note
→ system stores note
→ system writes audit log

---

# 5. Admin Flow

Admin login
→ open admin dashboard

Admin can:
- manage categories
- manage staff accounts
- review logs
- review statistics

---

# 6. Executive Flow

Executive login
→ dashboard

Can view:
- total requests
- requests by category
- requests by status
- completed requests
- pending requests

Read-only access

---

# 7. Business Rules

## Request Number
Every request must have unique tracking number

Format example:
REQ-2026-000001

---

## Required Fields
Citizen submission requires:
- name
- phone number
- category
- request description

Optional:
- image attachment

---

## Status Transition Rules

Allowed:

NEW
→ รับเรื่องแล้ว

รับเรื่องแล้ว
→ อยู่ระหว่างตรวจสอบ

อยู่ระหว่างตรวจสอบ
→ อยู่ระหว่างดำเนินการ

อยู่ระหว่างดำเนินการ
→ ดำเนินการเสร็จสิ้น

ดำเนินการเสร็จสิ้น
→ ปิดคำร้อง

Disallowed:
- skipping backwards unless admin

---

## Audit Logging
System must log:
- login
- status changes
- notes added
- admin actions

---

# 8. Error Handling

Invalid submission
→ show validation errors

Request not found
→ show user-friendly message

Unauthorized access
→ redirect to login

Server error
→ show safe error message

---

# 9. MVP Exclusions

Not included:
- AI complaint classification
- chatbot
- LINE notifications
- OTP verification
- multi-step approval workflow
- department auto-routing
- external integrations

---

# 10. Delivery Definition

MVP complete when:

Citizen:
- can submit request
- can track request

Staff:
- can process request
- can update status

Admin:
- can manage system basics

Executive:
- can view reports

Database:
- persists all workflow data