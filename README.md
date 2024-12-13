# Welcome to AURA
This application allows users to post their daily life incident and an AI will mark them with +ve or -ve points called **Aura points**.

User can see others' posts as well and can **like** or **comment** on them. Currently only these features are being developed but keeping the future in mind we intend to bring messaging, stories and much more to this new era of social media.

### ER Diagram

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        string password_hash
        datetime created_at
        int total_aura_points
    }
    INCIDENT {
        int id PK
        int user_id FK
        string description
        int aura_points
        datetime created_at
    }
    COMMENT {
        int id PK
        int user_id FK
        int incident_id FK
        string content
        datetime created_at
    }
    LIKE {
        int id PK
        int user_id FK
        int incident_id FK
        datetime created_at
    }
    USER ||--o{ INCIDENT : "creates"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ LIKE : "gives"
    INCIDENT ||--o{ COMMENT : "has"
    INCIDENT ||--o{ LIKE : "receives"
```