# DATA MODEL — Citizen Portal MVP

## Purpose
กำหนดโครงสร้างฐานข้อมูลสำหรับระบบบริหารจัดการคำร้องออนไลน์
เทศบาลตำบลด่านทับตะโก

MVP เน้น:
- simplicity
- relational integrity
- auditability
- maintainability

Database target:
PostgreSQL

ORM:
Prisma

---

# 1. Entity Overview

Core entities:

- users
- departments
- request_categories
- requests
- request_attachments
- request_status_history
- staff_notes
- audit_logs

---

# 2. Tables

## users

Purpose:
เก็บบัญชีผู้ใช้งานระบบภายใน

Fields:

id
UUID
Primary Key

email
String
Unique
Required

password_hash
String
Required

full_name
String
Required

role
Enum
Required

department_id
UUID
Nullable

is_active
Boolean
Default true

created_at
Timestamp

updated_at
Timestamp

Role enum:
- STAFF
- ADMIN
- EXECUTIVE

Rules:
- citizen ไม่ต้องมี account ใน MVP
- staff ทุกคนต้องมี role
- inactive users login ไม่ได้

---

## departments

Purpose:
เก็บหน่วยงานภายในเทศบาล

Fields:

id
UUID
Primary Key

name
String
Unique

description
String
Nullable

created_at
Timestamp

Example:
- งานธุรการ
- กองช่าง
- กองสาธารณสุข

---

## request_categories

Purpose:
หมวดหมู่คำร้อง

Fields:

id
UUID
Primary Key

name
String
Unique

description
String
Nullable

is_active
Boolean

created_at
Timestamp

Example:
- ร้องเรียนทั่วไป
- แจ้งปัญหาสาธารณูปโภค
- ขอรับบริการ

Rules:
inactive categories cannot be selected

---

## requests

Purpose:
ตารางหลักของคำร้อง

Fields:

id
UUID
Primary Key

tracking_number
String
Unique
Required

citizen_name
String
Required

citizen_phone
String
Required

citizen_email
String
Nullable

category_id
UUID
FK → request_categories.id

title
String
Required

description
Text
Required

current_status
Enum
Required

assigned_department_id
UUID
FK → departments.id
Nullable

created_at
Timestamp

updated_at
Timestamp

closed_at
Timestamp
Nullable

Status enum:
- NEW
- RECEIVED
- UNDER_REVIEW
- IN_PROGRESS
- COMPLETED
- CLOSED
- REJECTED

Rules:
- every request must have tracking number
- current_status required
- cannot delete historical request

---

## request_attachments

Purpose:
เก็บไฟล์แนบของคำร้อง

Fields:

id
UUID
Primary Key

request_id
UUID
FK → requests.id

file_name
String

file_path
String

mime_type
String

file_size
Integer

uploaded_at
Timestamp

Rules:
- attachment belongs to one request
- image only in MVP
- file size limit enforced at app layer

---

## request_status_history

Purpose:
เก็บประวัติการเปลี่ยนสถานะ

Fields:

id
UUID
Primary Key

request_id
UUID
FK → requests.id

previous_status
Enum
Nullable

new_status
Enum
Required

changed_by_user_id
UUID
FK → users.id

note
Text
Nullable

changed_at
Timestamp

Rules:
- every status change must be logged
- immutable history

---

## staff_notes

Purpose:
บันทึกภายในสำหรับเจ้าหน้าที่

Fields:

id
UUID
Primary Key

request_id
UUID
FK → requests.id

user_id
UUID
FK → users.id

note
Text

created_at
Timestamp

Rules:
- internal only
- citizen cannot see

---

## audit_logs

Purpose:
security + compliance audit

Fields:

id
UUID
Primary Key

user_id
UUID
Nullable

action
String
Required

entity_type
String
Required

entity_id
UUID
Nullable

metadata_json
JSONB
Nullable

ip_address
String
Nullable

created_at
Timestamp

Examples:
LOGIN_SUCCESS
LOGIN_FAILED
REQUEST_STATUS_UPDATED
NOTE_CREATED
CATEGORY_UPDATED
USER_DISABLED

Rules:
append-only

---

# 3. Relationships

departments
1 → many users

departments
1 → many requests

request_categories
1 → many requests

requests
1 → many request_attachments

requests
1 → many request_status_history

requests
1 → many staff_notes

users
1 → many request_status_history

users
1 → many staff_notes

users
1 → many audit_logs

---

# 4. Business Constraints

Tracking number unique

Requests immutable except:
- status
- assignment
- closure

Status history append-only

Audit log append-only

Inactive users cannot authenticate

Inactive categories hidden from citizen form

---

# 5. Index Recommendations

Unique:
- users.email
- requests.tracking_number
- request_categories.name
- departments.name

Indexes:
- requests.current_status
- requests.created_at
- requests.category_id
- requests.assigned_department_id
- request_status_history.request_id
- audit_logs.created_at
- audit_logs.user_id

---

# 6. Explicit Non-goals

Not in MVP:

NO citizen accounts
NO OTP tables
NO notification tables
NO AI classification tables
NO ML prediction tables
NO chat history
NO realtime event bus
NO microservice event store

---

# 7. Future Expansion

Possible later:

citizen_accounts
notifications
otp_verifications
line_integrations
ai_classification_results
sla_rules
department_routing_rules
document_approvals