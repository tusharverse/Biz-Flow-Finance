# Biz-Flow-Finance Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     BROWSER / CLIENT                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │          React Frontend (Vite + TypeScript)              │  │
│   ├──────────────────────────────────────────────────────────┤  │
│   │                                                            │  │
│   │  Pages:                   Components:                     │  │
│   │  • Dashboard             • Sidebar                        │  │
│   │  • Clients (✅)          • StatCard                       │  │
│   │  • Invoices             • InvoiceForm                     │  │
│   │  • Login/Register       • UI (shadcn/ui)                │  │
│   │                                                            │  │
│   │  Libraries:                                               │  │
│   │  • React Router (Navigation)                             │  │
│   │  • React Hook Form (Forms)                               │  │
│   │  • Tailwind CSS (Styling)                                │  │
│   │                                                            │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ▲                                       │
│                    HTTP GET/POST/PUT/DELETE                     │
│                          ▼                                       │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  Supabase Client (supabase-js)                           │  │
│   │  • Auth: Sign up, Login                                  │  │
│   │  • Real-time subscriptions (future)                      │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          ▲                                       │
└──────────────────────────┼─────────────────────────────────────┘
                           │
                    Publishable Key
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
   ┌─────────────┐                      ┌──────────────────┐
   │  Supabase   │                      │  Express Backend │
   │  Auth       │                      │  (Node.js)       │
   │             │                      │                  │
   │ • Users     │                      │ Endpoints:       │
   │ • Sessions  │                      │ • /api/clients   │
   │ • Tokens    │                      │ • /api/invoices  │
   └─────────────┘                      │ • /api/stats     │
        ▲                               │ • /health        │
        │                               │                  │
        │ Auth                          │ Validation:      │
        │ Tokens                        │ • Zod schemas    │
        │                               │                  │
        └──────────────────┬────────────┘
                           │
                    Service Role Key
                           │
                           ▼
        ┌──────────────────────────────────┐
        │      Supabase Database           │
        │      PostgreSQL                  │
        ├──────────────────────────────────┤
        │                                  │
        │  Tables:                         │
        │  ┌──────────────────────────┐   │
        │  │ clients                  │   │
        │  │ id, name, email, etc     │   │
        │  └──────────────────────────┘   │
        │           ▲                      │
        │           │ FK                   │
        │           │                      │
        │  ┌──────────────────────────┐   │
        │  │ invoices                 │   │
        │  │ id, client_id, amount... │   │
        │  └──────────────────────────┘   │
        │           ▲                      │
        │           │ FK                   │
        │           │                      │
        │  ┌──────────────────────────┐   │
        │  │ transactions             │   │
        │  │ id, invoice_id, amount.. │   │
        │  └──────────────────────────┘   │
        │                                  │
        └──────────────────────────────────┘
```

## Data Flow - Example: Load Clients

```
1. User navigates to /clients
   └─> Clients.tsx component mounts

2. useEffect triggers
   └─> fetchClients() called

3. Frontend calls API
   └─> fetch('http://localhost:3001/api/clients')

4. Express server receives request
   ├─> Validates request (if POST/PUT)
   ├─> Queries Supabase database
   │   └─> SELECT * FROM clients
   └─> Returns JSON response

5. Frontend receives data
   ├─> Updates state: setClients(data)
   ├─> Sets loading: false
   └─> Re-renders with new data

6. UI displays clients in table
```

## Authentication Flow

```
┌─────────────────────────────────────────┐
│   User clicks Login                     │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Login Form Component                  │
│   • Enter email & password              │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Call supabase.auth.signInWithPassword │
│   (uses Supabase JS client)             │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Supabase Auth Server                  │
│   • Verifies credentials                │
│   • Creates session                     │
│   • Returns JWT token                   │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Frontend stores token                 │
│   • localStorage                        │
│   • sessionStorage                      │
│   • Supabase Session                    │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│   Redirect to Dashboard                 │
│   • Protected pages check auth          │
│   • useNavigate('/login') if no token   │
└─────────────────────────────────────────┘
```

## API Request/Response Flow

```
Frontend (React)          Backend (Express)         Database (Supabase)
    │                            │                         │
    │─── GET /api/clients ──────>│                         │
    │                            │─── SELECT * ───────────>│
    │                            │       FROM clients      │
    │                            │<─── [ {...}, {...} ] ──│
    │<────── 200 JSON ───────────│                         │
    │ [clients array]            │                         │
    │                            │                         │
    │─── POST /api/clients ─────>│                         │
    │  {name: "...", email: ...} │                         │
    │                            │─── INSERT INTO ───────>│
    │                            │       clients          │
    │                            │<─── { id, ... } ──────│
    │<────── 201 JSON ───────────│                         │
    │ {created client}           │                         │
    │                            │                         │
    │─── PUT /api/clients/:id ──>│                         │
    │  {name: "...", ...}        │                         │
    │                            │─── UPDATE ────────────>│
    │                            │       WHERE id = ...   │
    │                            │<─── { id, ... } ──────│
    │<────── 200 JSON ───────────│                         │
    │ {updated client}           │                         │
    │                            │                         │
    │─── DELETE /api/clients/:id─>│                         │
    │                            │─── DELETE ────────────>│
    │                            │       WHERE id = ...   │
    │                            │<─── true ─────────────│
    │<────── 200 JSON ───────────│                         │
    │ {message: "deleted"}       │                         │
```

## File Organization

```
Biz-Flow-Finance/
│
├── Frontend (React)
│   └── src/
│       ├── pages/              # Page components
│       │   ├── Dashboard.tsx
│       │   ├── Clients.tsx     (✅ Connected to API)
│       │   ├── Invoices.tsx
│       │   ├── Login.tsx
│       │   └── ...
│       │
│       ├── components/         # Reusable components
│       │   ├── dashboard/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── StatCard.tsx
│       │   │   └── ...
│       │   ├── auth/
│       │   ├── invoices/
│       │   └── ui/            # shadcn/ui components
│       │
│       ├── lib/
│       │   ├── api.ts         (✅ API client utilities)
│       │   └── utils.ts
│       │
│       ├── integrations/
│       │   └── supabase/
│       │       ├── client.ts  # Supabase connection
│       │       └── types.ts   # Generated types
│       │
│       ├── hooks/
│       └── ...
│
├── Backend (Express)
│   └── server/
│       ├── src/
│       │   └── index.ts       (✅ Full API server)
│       │       ├── Health check
│       │       ├── /api/clients (CRUD)
│       │       ├── /api/invoices (CRUD)
│       │       └── /api/stats
│       │
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       └── .env (not in git)
│
├── Database
│   └── Supabase Project
│       ├── clients table
│       ├── invoices table
│       ├── transactions table
│       └── auth (Supabase Auth)
│
└── Documentation
    ├── PROJECT_SUMMARY.md           # This overview
    ├── FULLSTACK_SETUP.md           # Setup instructions
    ├── DATABASE_SETUP.md            # Database schema
    ├── IMPLEMENTATION_CHECKLIST.md  # Tasks to complete
    └── ARCHITECTURE.md              # This file
```

## Deployment Architecture

```
Production Setup:

┌─────────────────────────────────────────────────────────────┐
│                    Internet / Users                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
        ┌──────────────┐        ┌──────────────────┐
        │   Vercel     │        │    Render/Fly    │
        │  (Frontend)  │        │ (Backend API)    │
        │   Dist/      │        │ Node.js Server   │
        │  React app   │        │ Port 3001        │
        └──────────────┘        └──────────────────┘
                │                         │
                │                         │
                └────────────┬────────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
                    ▼                  ▼
            ┌──────────────┐  ┌──────────────────┐
            │  Supabase    │  │  Supabase Auth   │
            │  Database    │  │  Service         │
            │  (PostgreSQL)│  │                  │
            └──────────────┘  └──────────────────┘
                    │                  │
                    └────────┬─────────┘
                             │
                    Supabase Cloud Hosting
```

## Technology Stack Summary

```
FRONTEND:
├── React 18.3
├── TypeScript 5.5
├── Vite 5.4
├── Tailwind CSS 3.4
├── shadcn/ui (Radix UI)
├── React Router 6.26
├── React Hook Form 7.53
├── Supabase JS 2.49
└── Lucide Icons

BACKEND:
├── Node.js 18+
├── Express 4.22
├── TypeScript 5.5
├── Zod 3.25
├── Supabase JS 2.93
├── CORS 2.8
└── Dotenv 16.4

DATABASE:
├── Supabase (PostgreSQL)
├── Row Level Security (RLS)
├── Authentication
└── Real-time subscriptions (optional)

HOSTING (RECOMMENDED):
├── Frontend: Vercel, Netlify, Cloudflare
├── Backend: Render, Fly.io, Railway, Heroku
└── Database: Supabase Cloud
```

This architecture provides:
- ✅ Separation of concerns
- ✅ Type safety (TypeScript everywhere)
- ✅ Scalability
- ✅ Security (service role on backend only)
- ✅ Easy deployment
- ✅ Real-time capabilities (Supabase)
