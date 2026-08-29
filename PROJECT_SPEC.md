# Nepal Flood Response — Vehicle E-Pass & Coordination Portal
## Master Project Specification & Architecture Reference

> **Important**: This document defines the canonical architecture, directory structure, data models, and API interfaces for the project. Every upcoming phase and module must adhere strictly to the structure specified here.

---

## 1. System Architecture Overview

```
[ Public Users / Relief Teams ]        [ Checkpoint Officers ]         [ Emergency Operations Admins ]
              │                                   │                                    │
              ▼                                   ▼                                    ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             Cloudflare Pages (Frontend SPA - Tailwind v4)                        │
│  - Application Form             - QR Scanner (Online/Offline)        - Admin Review Dashboard    │
│  - E-Pass Viewer & PDF          - Checkpoint Scan Logging            - Live Coordination Center  │
│  - Status Tracking Portal       - Road Condition Monitor             - Audit Log Explorer        │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │ HTTPS / JSON API
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                               Cloudflare Workers (Backend API - Hono + Bun)                      │
│  - Route Handlers & Middlewares                                                                  │
│  - Cryptographic QR Token Signing (HMAC-SHA256 / Ed25519)                                        │
│  - Priority Scoring Engine (Critical / High / Medium / Normal)                                   │
│  - Notification Dispatcher (SMS / Email Webhooks)                                                │
│  - Audit Logger                                                                                  │
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │ LibSQL over HTTP / WebSocket
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 Turso Database (LibSQL / SQLite)                                 │
│  - applications, passes, checkpoint_scans, road_conditions, audit_logs, users                    │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
relief-vehicle/
├── PROJECT_SPEC.md                 # Canonical blueprint & structural reference
├── package.json                    # Workspace root scripts & dev dependencies (Bun)
├── bunfig.toml                     # Bun workspace configuration
├── tsconfig.json                   # Root TypeScript config
├── scripts/
│   ├── deploy.sh                   # One-click deployment script
│   └── seed.ts                     # Initial database seeder for admin & roads (run with bun)
├── apps/
│   ├── api/                        # Cloudflare Worker Backend (Hono + Bun)
│   │   ├── wrangler.toml           # Worker deployment config
│   │   ├── tsconfig.json
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts            # Hono application entry point
│   │       ├── config.ts           # Env bindings & constants
│   │       ├── db/
│   │       │   ├── client.ts       # Turso LibSQL client instantiation
│   │       │   ├── schema.ts       # SQL DDL & LibSQL table definitions
│   │       │   └── migrations.ts   # Auto-migration runner
│   │       ├── routes/
│   │       │   ├── auth.ts         # Admin/officer login & token verification
│   │       │   ├── applications.ts # Public submission & tracking
│   │       │   ├── passes.ts       # Pass issuance, retrieval, revocation
│   │       │   ├── verify.ts       # QR verification & scan recording
│   │       │   ├── admin.ts        # Admin review, filtering, hold/info requests
│   │       │   ├── coordination.ts # Live stats, bottlenecks, duplication detection
│   │       │   ├── roads.ts        # Road condition reports & status
│   │       │   └── audit.ts        # Audit logging endpoint
│   │       ├── services/
│   │       │   ├── crypto.ts       # Cryptographic token signing & offline verification
│   │       │   ├── priority.ts     # Priority assessment engine
│   │       │   ├── notifier.ts     # Notification delivery service
│   │       │   └── audit.ts        # Central audit log recorder
│   │       └── middleware/
│   │           ├── auth.ts         # JWT authentication & RBAC
│   │           ├── cors.ts         # CORS configuration
│   │           └── error.ts        # Unified error handling
│   │
│   └── web/                        # Cloudflare Pages Frontend (Vite + React + Tailwind v4 + Bun)
│       ├── index.html
│       ├── vite.config.ts          # Uses @tailwindcss/vite plugin (no tailwind.config or postcss needed)
│       ├── tsconfig.json
│       ├── package.json
│       └── src/
│           ├── main.tsx
│           ├── App.tsx             # Route declarations
│           ├── index.css           # Contains `@import "tailwindcss";`
│           ├── components/
│           │   ├── common/         # Button, Input, Modal, Badge, Card, Spinner
│           │   ├── layout/         # Header, Footer, AdminSidebar, EmergencyBanner
│           │   ├── pass/           # EPassCard, PrintPass, QRTokenDisplay
│           │   └── scanner/        # QRCameraScanner, OfflineScanQueue
│           ├── pages/
│           │   ├── Home.tsx                # Emergency landing & service portal
│           │   ├── ApplyPass.tsx           # Multi-step pass application form
│           │   ├── ApplicationSuccess.tsx  # Confirmation screen with App ID
│           │   ├── TrackStatus.tsx         # Real-time status lookup
│           │   ├── ViewPass.tsx            # Digital pass viewer & download
│           │   ├── CheckpointScanner.tsx   # Mobile QR verification interface
│           │   ├── RoadConditions.tsx      # Road status & restriction monitor
│           │   ├── CoordinationCenter.tsx  # High-level movement coordination
│           │   ├── AdminLogin.tsx          # Staff authentication
│           │   ├── AdminDashboard.tsx      # Application review queue & actions
│           │   └── AdminAuditLogs.tsx      # Security & activity audit viewer
│           ├── lib/
│           │   ├── api.ts          # Type-safe API client
│           │   ├── crypto.ts       # Client-side offline QR validation
│           │   ├── storage.ts      # Offline scan sync & local persistence
│           │   └── types.ts        # Shared TypeScript data types
│           └── hooks/
│               ├── useAuth.ts      # Authentication state
│               └── useOffline.ts   # Connectivity & sync detector
```

---

## 3. Database Schema (Turso / LibSQL)

### 3.1 `applications`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | Application ID formatted as `EP-YYYYMMDD-XXXX` |
| `applicant_name` | TEXT NOT NULL | Full name of applicant |
| `applicant_phone` | TEXT NOT NULL | Contact phone number |
| `applicant_email` | TEXT NOT NULL | Contact email address |
| `org_name` | TEXT NOT NULL | Organization or group name |
| `org_type` | TEXT NOT NULL | Rescue Team, Government Agency, NGO/INGO, Medical Team, Relief Organization, Volunteer Group, Donation/Relief Transport, Media, Other |
| `org_id` | TEXT | Registration/license number if applicable |
| `vehicle_number` | TEXT NOT NULL | Vehicle registration (e.g. BA 2 PA 1234) |
| `vehicle_type` | TEXT NOT NULL | Ambulance, Bus, Truck, Pickup, Jeep/SUV, Van, Motorcycle, Other |
| `vehicle_owner` | TEXT NOT NULL | Owner or organization entity |
| `driver_name` | TEXT NOT NULL | Driver full name |
| `driver_phone` | TEXT NOT NULL | Driver contact number |
| `passenger_count` | INTEGER NOT NULL | Total persons aboard |
| `vehicle_capacity` | TEXT NOT NULL | Vehicle seating/payload capacity |
| `emergency_contact` | TEXT NOT NULL | 24/7 backup contact phone |
| `departure_location` | TEXT NOT NULL | District/Municipality of origin |
| `destination` | TEXT NOT NULL | Target district/relief point |
| `intermediate_checkpoints` | TEXT | Comma-separated intermediate points |
| `departure_time` | TEXT NOT NULL | ISO date/time of departure |
| `return_time` | TEXT NOT NULL | ISO date/time of expected return |
| `proposed_route` | TEXT NOT NULL | Highways / corridors planned |
| `travel_purpose` | TEXT NOT NULL | Summary purpose statement |
| `cargo_type` | TEXT NOT NULL | Rescue, Relief/Donation, Medical, Essential Services |
| `cargo_details` | TEXT NOT NULL | Breakdown of equipment, food, medical supplies |
| `supporting_documents` | TEXT | JSON string array of uploaded/referenced document URLs |
| `priority` | TEXT NOT NULL | `Critical`, `High`, `Medium`, `Normal` |
| `status` | TEXT NOT NULL | `submitted`, `under_review`, `info_requested`, `approved`, `issued`, `active`, `completed`, `rejected`, `held`, `revoked`, `expired` |
| `admin_notes` | TEXT | Internal review notes |
| `info_request_reason` | TEXT | Clarification message sent to applicant |
| `secret_token` | TEXT NOT NULL | Cryptographic token for applicant tracking |
| `created_at` | TEXT NOT NULL | ISO creation timestamp |
| `updated_at` | TEXT NOT NULL | ISO update timestamp |

### 3.2 `passes`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | Pass number formatted as `NP-PASS-YYYYMMDD-XXXX` |
| `application_id` | TEXT NOT NULL | Foreign key to `applications.id` |
| `qr_token` | TEXT NOT NULL | Cryptographic signature payload |
| `issued_by` | TEXT NOT NULL | Admin user ID/name |
| `issuing_authority` | TEXT NOT NULL | Department/Emergency Center name |
| `valid_from` | TEXT NOT NULL | ISO validity start timestamp |
| `valid_until` | TEXT NOT NULL | ISO validity end timestamp |
| `approved_route` | TEXT NOT NULL | Official authorized corridor |
| `status` | TEXT NOT NULL | `active`, `completed`, `revoked`, `expired` |
| `revocation_reason` | TEXT | Reason for sudden revocation |
| `revoked_at` | TEXT | ISO revocation timestamp |
| `revoked_by` | TEXT | Admin who revoked the pass |
| `created_at` | TEXT NOT NULL | ISO issuance timestamp |

### 3.3 `checkpoint_scans`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | UUID |
| `pass_id` | TEXT NOT NULL | Pass ID scanned |
| `checkpoint_name` | TEXT NOT NULL | Checkpoint name (e.g., Nagdhunga, Mugling) |
| `officer_name` | TEXT NOT NULL | Officer on duty |
| `officer_badge` | TEXT | Badge or ID reference |
| `direction` | TEXT NOT NULL | `outbound`, `inbound`, `transit` |
| `latitude` | REAL | Optional GPS coordinate |
| `longitude` | REAL | Optional GPS coordinate |
| `scan_result` | TEXT NOT NULL | `valid`, `invalid`, `expired`, `revoked` |
| `notes` | TEXT | Observations or cargo check notes |
| `scanned_at` | TEXT NOT NULL | ISO scan timestamp |

### 3.4 `road_conditions`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | UUID |
| `road_name` | TEXT NOT NULL | Highway or local road name |
| `district` | TEXT NOT NULL | District name |
| `segment` | TEXT NOT NULL | Specific stretch (e.g. Malekhu - Mugling) |
| `status` | TEXT NOT NULL | `open`, `restricted`, `emergency_only`, `closed` |
| `reason` | TEXT NOT NULL | Landslide, flood overflow, bridge inspection |
| `reported_at` | TEXT NOT NULL | Timestamp |
| `updated_at` | TEXT NOT NULL | Timestamp |

### 3.5 `audit_logs`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | UUID |
| `entity_type` | TEXT NOT NULL | `application`, `pass`, `road`, `auth`, `checkpoint` |
| `entity_id` | TEXT NOT NULL | Relevant record identifier |
| `action` | TEXT NOT NULL | Action performed |
| `actor_name` | TEXT NOT NULL | Responsible user |
| `actor_role` | TEXT NOT NULL | Role level |
| `details` | TEXT | JSON structured payload |
| `ip_address` | TEXT | Request IP |
| `timestamp` | TEXT NOT NULL | ISO timestamp |

### 3.6 `users`
| Column | Type | Description |
|---|---|---|
| `id` | TEXT PK | UUID |
| `username` | TEXT UNIQUE NOT NULL | Login username |
| `password_hash` | TEXT NOT NULL | Password hash |
| `name` | TEXT NOT NULL | Full name |
| `role` | TEXT NOT NULL | `superadmin`, `district_admin`, `checkpoint_officer` |
| `district` | TEXT | Assigned district |
| `created_at` | TEXT NOT NULL | ISO timestamp |

---

## 4. API Route Matrix (Cloudflare Workers)

### 4.1 Public Endpoints
- `POST /api/applications` — Submit new vehicle movement request
- `GET /api/applications/:id/track` — Status check (requires `token` query param for full details)
- `GET /api/passes/:id/public` — Public verified pass view
- `GET /api/roads` — Public road status & route advisory
- `GET /api/public/stats` — High-level counts for public visibility

### 4.2 Checkpoint & Verification Endpoints
- `POST /api/verify/scan` — Verify QR payload online & return verified pass data
- `POST /api/verify/record` — Log a checkpoint entry/transit record

### 4.3 Staff Authentication
- `POST /api/auth/login` — Sign in and receive session JWT
- `GET /api/auth/me` — Verify session and fetch profile

### 4.4 Admin & Operations Endpoints (Protected by RBAC)
- `GET /api/admin/applications` — Filterable, searchable queue of applications
- `GET /api/admin/applications/:id` — Full application profile with history
- `PATCH /api/admin/applications/:id/status` — Approve, Reject, Hold, Request Info
- `POST /api/admin/passes/issue` — Issue e-pass and create signed QR token
- `POST /api/admin/passes/:id/revoke` — Revoke pass with mandatory reason
- `GET /api/admin/coordination` — Live coordination stats, bottleneck detection, duplicates
- `GET /api/admin/audit-logs` — Audit log trail
- `POST /api/admin/roads` — Update or add road condition report
- `DELETE /api/admin/roads/:id` — Remove road condition report

---

## 5. Frontend Pages & Routes (Cloudflare Pages)

| Route | Page | Purpose |
|---|---|---|
| `/` | `Home.tsx` | Emergency portal landing, live counters, quick links |
| `/apply` | `ApplyPass.tsx` | Multi-step vehicle e-pass application form |
| `/applied/:id` | `ApplicationSuccess.tsx` | Instant submission confirmation with Application ID |
| `/track` | `TrackStatus.tsx` | Public application status tracker |
| `/pass/:id` | `ViewPass.tsx` | Official digital e-pass with live QR, offline print/save |
| `/scanner` | `CheckpointScanner.tsx` | Mobile QR scanner with camera & instant verification |
| `/roads` | `RoadConditions.tsx` | District road closure & emergency route warnings |
| `/coordination` | `CoordinationCenter.tsx` | Real-time vehicle flow, rescue priorities, bottlenecks |
| `/admin/login` | `AdminLogin.tsx` | Secure login for admins and checkpoint officers |
| `/admin/dashboard` | `AdminDashboard.tsx` | Full review queue with filters, priority sorting, actions |
| `/admin/audit` | `AdminAuditLogs.tsx` | Audit logs for approvals, rejections, scans |

---

## 6. One-Command Deployment Strategy with Bun

- **Install**: `bun install`
- **Build command**: `bun run build` (builds `apps/api` and `apps/web`)
- **Deploy command**: `bun run deploy` (deploys Worker via `wrangler deploy` and Pages via `wrangler pages deploy apps/web/dist`)
- **Database Init**: `bun run db:migrate && bun run db:seed`
