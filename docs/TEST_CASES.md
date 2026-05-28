# System Testing Documentation

## 1. Testing Objective
This documentation validates the core functional workflows of the Online Citizen Request Management System (Citizen Portal). The primary goal is to ensure that the research prototype meets the fundamental requirements for citizen engagement and administrative oversight, providing a reliable platform for local government communication.

## 2. Testing Scope
The testing scope encompasses the following critical functional modules:
- **Citizen Request Submission**: Validating the end-to-end process of filing a new request.
- **Request Tracking**: Ensuring citizens can monitor the progress of their submitted requests.
- **Admin Authentication**: Validating secure access for authorized personnel.
- **Staff Request Management**: Testing the visibility and detail-view capabilities for staff members.
- **Category Management**: Ensuring administrative control over request classification.
- **Validation Rules**: Verifying data integrity for inputs like phone numbers and required fields.
- **File Upload Validation**: Confirming the system correctly handles permitted and restricted file types.

## 3. Test Environment
Testing was performed in a dedicated environment matching the research prototype's stack:
- **Frontend Framework**: Next.js (TypeScript)
- **Backend Infrastructure**: Next.js Route Handlers (Serverless Functions)
- **Object-Relational Mapping (ORM)**: Prisma
- **Database Engine**: SQLite (Local file-based)
- **Automation Engine**: Playwright Chromium (Browser Automation)
- **Operating System**: Windows 11

## 4. Test Case Table

| TC ID | Module | Scenario | Expected Result | Actual Result | Status |
|-------|--------|----------|-----------------|---------------|--------|
| TC-001 | Citizen Form | Required field validation | System prevents submission and displays "กรุณากรอกชื่อ-นามสกุล" | System behaved as expected | **PASS** |
| TC-002 | Citizen Form | Invalid phone number | System rejects non-Thai phone formats and shows error | System behaved as expected | **PASS** |
| TC-003 | Citizen Form | Invalid file upload (PDF) | System rejects PDF files and permits only JPG/PNG/WEBP | System behaved as expected | **PASS** |
| TC-004 | Citizen Form | Successful request submission | System generates tracking number and redirects to success page | System behaved as expected | **PASS** |
| TC-005 | Request Tracking | Search existing request ID | System displays the current status and history of the request | System behaved as expected | **PASS** |
| TC-006 | Admin Login | Successful authentication | Authorized user is redirected to the Admin Dashboard | System behaved as expected | **PASS** |
| TC-007 | Category Management | Duplicate category prevention | System prevents creation of categories with existing names | System behaved as expected | **PASS** |
| TC-008 | Category Management | Edit category success | System allows updating name and description of existing categories | System behaved as expected | **PASS** |
| TC-009 | Staff Request List | View request detail | Staff can access full details and status history of any request | System behaved as expected | **PASS** |
| TC-010 | Dashboard | Display statistics | Dashboard correctly aggregates totals for New, In-Progress, and Closed cases | System behaved as expected | **PASS** |

## 5. Testing Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 10 |
| **Passed** | 10 |
| **Failed** | 0 |
| **Success Rate** | 100% |

## 6. Evidence References
Verification evidence is documented via automated screenshots captured during testing cycles:
- **Home Page**: `docs/screenshots/01-home.png`
- **Request Form**: `docs/screenshots/02-request-form.png`
- **Submission Success**: `docs/screenshots/03-request-success.png`
- **Tracking Interface**: `docs/screenshots/04-track-request.png`
- **Login Portal**: `docs/screenshots/05-login.png`
- **Admin Dashboard**: `docs/screenshots/06-admin-dashboard.png`
- **Request Management**: `docs/screenshots/07-staff-requests.png`
- **Request Detail**: `docs/screenshots/08-staff-request-detail.png`
- **Categories Config**: `docs/screenshots/09-admin-categories.png`
- **User Management**: `docs/screenshots/10-admin-users.png`

## 7. Notes
- All testing was performed using automated **Playwright** scripts to ensure deterministic and repeatable results.
- Demo data was generated using the standardized **Prisma Seed** configuration to ensure a consistent test baseline.
- This documentation is intended for **research prototype validation** and academic review, confirming the feasibility and functional integrity of the proposed system architecture.
