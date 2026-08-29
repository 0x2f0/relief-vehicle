# राहत सवारी ई-पास | Relief Vehicle E-Pass

A system to issue, manage, and verify emergency vehicle passes during crises in Nepal.
नेपालमा आपतकालीन अवस्थामा राहत सवारी पास जारी गर्न, व्यवस्थापन गर्न र जाँच गर्न बनाइएको प्रणाली।

## Tech Stack
- Frontend: React (Vite)
- Backend: Cloudflare Workers (Hono)
- Database: Turso (LibSQL)
- Package Manager: Bun
- Monorepo Tools: Turborepo

## Quick Start

1. Install dependencies:
```bash
bun install
```

2. Setup environment variables:
Copy `.env.example` to `.env` and fill in your Turso database credentials.

3. Setup Database:
```bash
bun run db:migrate
bun run db:seed
```

4. Start development server:
```bash
bun run dev
```

## Project Structure
- `apps/web`: React frontend
- `apps/api`: Hono Cloudflare Worker backend
- `packages/shared`: Shared types and utilities
- `scripts`: Utility scripts for migration, seeding, and deployment
