# System Architecture & Diagrams

## 1. Overall System Architecture
The research prototype follows a modern monolithic architecture using the Next.js App Router, which consolidates both the frontend user interface and the backend API logic into a single deployment unit.

```mermaid
graph TD
    subgraph "Client Layer"
        Citizen["Citizen User (Browser)"]
        Staff["Staff/Admin User (Browser)"]
    end

    subgraph "Application Layer (Next.js)"
        UI["React Components (App Router)"]
        API["Route Handlers (Serverless APIs)"]
        Auth["Next-Auth (Authentication)"]
    end

    subgraph "Data Access Layer"
        Prisma["Prisma ORM"]
    end

    subgraph "Storage Layer"
        DB[("SQLite Database")]
        Files["Public Storage (Uploads)"]
    end

    Citizen --> UI
    Staff --> UI
    UI --> API
    API --> Auth
    API --> Prisma
    Prisma --> DB
    API --> Files
```

## 2. User Flow Diagram
This diagram illustrates the primary workflows for the three distinct user roles in the system.

```mermaid
flowchart LR
    subgraph "Citizen Flow"
        C1[Open Homepage] --> C2[Submit Request Form]
        C2 --> C3[Receive Tracking Number]
        C3 --> C4[Track Request Status]
    end

    subgraph "Administrative Flow"
        A1[Login] --> A2{Role Check}
        A2 -- "Staff" --> S1[View Assigned Requests]
        S1 --> S2[Update Request Status]
        A2 -- "Admin" --> AD1[View Dashboard Metrics]
        AD1 --> AD2[Manage Categories]
        AD1 --> AD3[Manage Users]
    end
```

## 3. Request Lifecycle Diagram
The request lifecycle follows a linear progression for service delivery, with an optional terminal state for rejected cases.

```mermaid
stateDiagram-v2
    [*] --> NEW: Submitted by Citizen
    NEW --> RECEIVED: Acknowledged by Staff
    RECEIVED --> UNDER_REVIEW: Technical Assessment
    UNDER_REVIEW --> IN_PROGRESS: Implementation/Action
    IN_PROGRESS --> COMPLETED: Action Finished
    COMPLETED --> CLOSED: Final Verification
    
    NEW --> REJECTED: Invalid/Out of Scope
    RECEIVED --> REJECTED
    UNDER_REVIEW --> REJECTED
    
    CLOSED --> [*]
    REJECTED --> [*]
```

## 4. Database ER Overview (Simplified)
The data model is designed to maintain relational integrity while preserving a clear history of all status changes.

```mermaid
erDiagram
    DEPARTMENT ||--o{ USER : "has many"
    DEPARTMENT ||--o{ REQUEST : "is assigned to"
    REQUEST_CATEGORY ||--o{ REQUEST : "classifies"
    USER ||--o{ REQUEST_STATUS_HISTORY : "changed by"
    REQUEST ||--o{ REQUEST_STATUS_HISTORY : "has"
    REQUEST ||--o{ REQUEST_ATTACHMENT : "contains"

    USER {
        string id PK
        string email
        string fullName
        string role
    }

    DEPARTMENT {
        string id PK
        string name
    }

    REQUEST_CATEGORY {
        string id PK
        string name
    }

    REQUEST {
        string id PK
        string trackingNumber
        string currentStatus
        datetime createdAt
    }

    REQUEST_STATUS_HISTORY {
        string id PK
        string requestId FK
        string previousStatus
        string newStatus
    }
```

## 5. Technology Stack Summary

| Layer | Technology | Description |
|-------|------------|-------------|
| **Frontend** | Next.js (React) | High-performance React framework for UI development. |
| **Backend** | Next.js Route Handlers | Server-side logic and API implementation. |
| **ORM** | Prisma | Type-safe data access and schema management. |
| **Database** | SQLite | Lightweight, file-based relational database. |
| **Styling** | Tailwind CSS | Utility-first CSS framework for polished aesthetics. |
| **Icons** | Lucide React | Modern, clean iconography. |
| **Testing** | Playwright | End-to-end browser automation and validation. |
| **Language** | TypeScript | Strong typing for system reliability and maintainability. |

## 6. Implementation Notes
- **Determinism**: All diagrams reflect the actual implemented logic found in the `src/app` and `prisma/schema.prisma` files.
- **Scalability**: While using SQLite for the research prototype, the architecture is designed to easily migrate to PostgreSQL for enterprise production.
- **Validation**: Statuses in the Lifecycle Diagram match the `RequestStatus` enum defined in the system core.
