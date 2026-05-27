# API SPEC — Citizen Portal MVP

## Purpose
กำหนด API สำหรับระบบบริหารจัดการคำร้องออนไลน์
เทศบาลตำบลด่านทับตะโก

API นี้ออกแบบสำหรับ MVP เท่านั้น
เน้นเรียบง่าย ปลอดภัย และทำงานได้จริง

---

# 1. API Principles

## Base Path

/api

## Response Format

Success:

```json
{
  "success": true,
  "data": {}
}
````

Error:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Authentication

Public APIs:

* ไม่ต้อง login

Staff/Admin/Executive APIs:

* ต้อง login
* ใช้ session-based authentication

---

# 2. Public APIs

## 2.1 Get Active Categories

GET /api/public/categories

Purpose:
ดึงหมวดหมู่คำร้องที่เปิดใช้งานอยู่

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "แจ้งปัญหาสาธารณูปโภค",
      "description": "แจ้งไฟฟ้า ถนน น้ำประปา หรือปัญหาพื้นฐาน"
    }
  ]
}
```

---

## 2.2 Submit Request

POST /api/public/requests

Purpose:
ประชาชนส่งคำร้องใหม่

Content-Type:
multipart/form-data

Fields:

citizen_name
string
required

citizen_phone
string
required

citizen_email
string
optional

category_id
uuid
required

title
string
required

description
string
required

attachment
file
optional

Validation:

* citizen_name required
* citizen_phone required
* category_id must exist and active
* title required
* description required
* attachment must be image only
* attachment size limit enforced by app config

Response:

```json
{
  "success": true,
  "data": {
    "tracking_number": "REQ-2026-000001",
    "status": "NEW",
    "message": "ส่งคำร้องเรียบร้อยแล้ว"
  }
}
```

Errors:

INVALID_INPUT
CATEGORY_NOT_FOUND
FILE_TOO_LARGE
INVALID_FILE_TYPE
SERVER_ERROR

---

## 2.3 Track Request

GET /api/public/requests/track?tracking_number=REQ-2026-000001

Purpose:
ประชาชนตรวจสอบสถานะคำร้อง

Response:

```json
{
  "success": true,
  "data": {
    "tracking_number": "REQ-2026-000001",
    "title": "แจ้งไฟฟ้าสาธารณะเสีย",
    "category": "แจ้งปัญหาสาธารณูปโภค",
    "current_status": "RECEIVED",
    "created_at": "2026-05-27T10:00:00.000Z",
    "closed_at": null,
    "history": [
      {
        "status": "NEW",
        "note": "ระบบรับคำร้องแล้ว",
        "changed_at": "2026-05-27T10:00:00.000Z"
      },
      {
        "status": "RECEIVED",
        "note": "เจ้าหน้าที่รับเรื่องแล้ว",
        "changed_at": "2026-05-27T10:10:00.000Z"
      }
    ]
  }
}
```

Public privacy rule:
ไม่แสดงข้อมูลส่วนตัวเต็ม เช่น เบอร์โทรหรือข้อมูลเจ้าหน้าที่ภายใน

Errors:

REQUEST_NOT_FOUND
INVALID_TRACKING_NUMBER

---

# 3. Auth APIs

## 3.1 Login

POST /api/auth/login

Purpose:
เจ้าหน้าที่เข้าสู่ระบบ

Body:

```json
{
  "email": "staff@example.go.th",
  "password": "password"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "staff@example.go.th",
      "full_name": "เจ้าหน้าที่ธุรการ",
      "role": "STAFF"
    }
  }
}
```

Errors:
INVALID_CREDENTIALS
USER_INACTIVE

---

## 3.2 Logout

POST /api/auth/logout

Response:

```json
{
  "success": true,
  "data": {
    "message": "ออกจากระบบแล้ว"
  }
}
```

---

## 3.3 Current User

GET /api/auth/me

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "staff@example.go.th",
    "full_name": "เจ้าหน้าที่ธุรการ",
    "role": "STAFF",
    "department_id": "uuid"
  }
}
```

Errors:
UNAUTHENTICATED

---

# 4. Staff APIs

## 4.1 List Requests

GET /api/staff/requests

Purpose:
ดึงรายการคำร้องสำหรับเจ้าหน้าที่

Query Params:

status
optional

category_id
optional

department_id
optional

search
optional

page
optional
default 1

limit
optional
default 20

Response:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "tracking_number": "REQ-2026-000001",
        "title": "แจ้งไฟฟ้าสาธารณะเสีย",
        "category": "แจ้งปัญหาสาธารณูปโภค",
        "current_status": "RECEIVED",
        "assigned_department": "กองช่าง",
        "created_at": "2026-05-27T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100
    }
  }
}
```

---

## 4.2 Get Request Detail

GET /api/staff/requests/:id

Purpose:
ดูรายละเอียดคำร้อง

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tracking_number": "REQ-2026-000001",
    "citizen_name": "สมชาย ใจดี",
    "citizen_phone": "0812345678",
    "citizen_email": null,
    "category": {
      "id": "uuid",
      "name": "แจ้งปัญหาสาธารณูปโภค"
    },
    "title": "แจ้งไฟฟ้าสาธารณะเสีย",
    "description": "ไฟฟ้าหน้าบ้านดับมาหลายวัน",
    "current_status": "RECEIVED",
    "assigned_department": {
      "id": "uuid",
      "name": "กองช่าง"
    },
    "attachments": [
      {
        "id": "uuid",
        "file_name": "image.jpg",
        "file_url": "/uploads/image.jpg",
        "mime_type": "image/jpeg"
      }
    ],
    "history": [],
    "staff_notes": []
  }
}
```

---

## 4.3 Update Request Status

PATCH /api/staff/requests/:id/status

Purpose:
เปลี่ยนสถานะคำร้อง

Body:

```json
{
  "status": "IN_PROGRESS",
  "note": "ส่งต่อกองช่างดำเนินการ"
}
```

Allowed statuses:

* RECEIVED
* UNDER_REVIEW
* IN_PROGRESS
* COMPLETED
* CLOSED
* REJECTED

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tracking_number": "REQ-2026-000001",
    "current_status": "IN_PROGRESS"
  }
}
```

Errors:
REQUEST_NOT_FOUND
INVALID_STATUS_TRANSITION
UNAUTHORIZED

---

## 4.4 Add Staff Note

POST /api/staff/requests/:id/notes

Purpose:
เพิ่มบันทึกภายใน

Body:

```json
{
  "note": "ติดต่อประชาชนแล้ว รอเข้าตรวจสอบพื้นที่"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "note": "ติดต่อประชาชนแล้ว รอเข้าตรวจสอบพื้นที่",
    "created_at": "2026-05-27T10:30:00.000Z"
  }
}
```

Rules:

* staff note is internal only
* citizen cannot view

---

# 5. Admin APIs

## 5.1 List Categories

GET /api/admin/categories

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "แจ้งปัญหาสาธารณูปโภค",
      "description": "แจ้งไฟฟ้า ถนน น้ำประปา",
      "is_active": true
    }
  ]
}
```

---

## 5.2 Create Category

POST /api/admin/categories

Body:

```json
{
  "name": "คำร้องทั่วไป",
  "description": "คำร้องหรือข้อเสนอแนะทั่วไป"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "คำร้องทั่วไป",
    "description": "คำร้องหรือข้อเสนอแนะทั่วไป",
    "is_active": true
  }
}
```

---

## 5.3 Update Category

PATCH /api/admin/categories/:id

Body:

```json
{
  "name": "คำร้องทั่วไป",
  "description": "คำร้องทั่วไปและข้อเสนอแนะ",
  "is_active": true
}
```

---

## 5.4 List Users

GET /api/admin/users

Purpose:
ดูรายการเจ้าหน้าที่

---

## 5.5 Create User

POST /api/admin/users

Body:

```json
{
  "email": "staff@example.go.th",
  "password": "temporary-password",
  "full_name": "เจ้าหน้าที่ธุรการ",
  "role": "STAFF",
  "department_id": "uuid"
}
```

Rules:

* password must be hashed before save
* email must be unique

---

## 5.6 Disable User

PATCH /api/admin/users/:id/disable

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "is_active": false
  }
}
```

---

# 6. Dashboard APIs

## 6.1 Summary Stats

GET /api/dashboard/summary

Roles:
ADMIN
EXECUTIVE

Response:

```json
{
  "success": true,
  "data": {
    "total_requests": 120,
    "new_requests": 12,
    "in_progress": 34,
    "completed": 60,
    "closed": 50
  }
}
```

---

## 6.2 Requests By Category

GET /api/dashboard/requests-by-category

Response:

```json
{
  "success": true,
  "data": [
    {
      "category": "แจ้งปัญหาสาธารณูปโภค",
      "count": 45
    }
  ]
}
```

---

## 6.3 Requests By Status

GET /api/dashboard/requests-by-status

Response:

```json
{
  "success": true,
  "data": [
    {
      "status": "NEW",
      "count": 12
    },
    {
      "status": "IN_PROGRESS",
      "count": 34
    }
  ]
}
```

---

# 7. Authorization Rules

Citizen public:

* submit request
* track request
* view active categories

STAFF:

* view requests
* update request status
* add notes

ADMIN:

* all staff permissions
* manage users
* manage categories
* view audit logs

EXECUTIVE:

* dashboard read-only

---

# 8. Audit Log Requirements

Must write audit logs for:

* LOGIN_SUCCESS
* LOGIN_FAILED
* LOGOUT
* REQUEST_CREATED
* REQUEST_STATUS_UPDATED
* STAFF_NOTE_CREATED
* CATEGORY_CREATED
* CATEGORY_UPDATED
* USER_CREATED
* USER_DISABLED

---

# 9. Security Requirements

Public APIs:

* validate all input
* sanitize text
* rate limit submit endpoint
* validate file type
* validate file size
* do not expose internal notes
* do not expose full personal data in tracking endpoint

Staff APIs:

* require authentication
* require role authorization
* write audit log for sensitive action

Admin APIs:

* require ADMIN role

Dashboard APIs:

* require ADMIN or EXECUTIVE role

---

# 10. MVP Non-goals

Not included in this API spec:

* LINE notification API
* OTP API
* AI image classification API
* chatbot API
* realtime websocket API
* external government integration API
* citizen account API

