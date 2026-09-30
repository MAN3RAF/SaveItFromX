# SaveItFromX

**SaveItFromX** (`www.saveitfromx.com`) is a high-performance, full-stack X (Twitter) video and MP3 audio downloader with programmatic SEO (pSEO), crawler-optimized chunked sitemaps, decoupled micro-architecture, and a protected administration console.

The project is structured as a cleanly decoupled monorepo:
- **`frontend/`**: Vite + React SPA (deployed to **Vercel**).
- **`backend/`**: Express + TypeScript + yt-dlp + FFmpeg (deployed to **Render** via Docker).
- **Database**: PostgreSQL hosted on **Supabase**.

---

## 📁 Repository Structure

```text
saveitfromx/
├── frontend/
│   ├── src/
│   │   ├── assets/            # Static brand assets & illustrations
│   │   ├── components/        # Downloader, SEO Landing, Admin UI & Ad slots
│   │   ├── services/          # API client, auth, downloader & analytics
│   │   ├── types/             # Shared frontend type definitions
│   │   ├── App.tsx            # Client router & page state
│   │   ├── index.css          # Tailwind CSS styles
│   │   └── main.tsx           # React entry point
│   ├── public/                # Public static assets
│   ├── index.html             # Web app entry point & metadata
│   ├── package.json           # Frontend dependencies & scripts
│   ├── tsconfig.json          # Frontend TypeScript configuration
│   ├── vercel.json            # Vercel SPA rewrite rules
│   ├── vite.config.ts         # Vite build configuration
│   └── .env.example           # Example frontend environment variables
│
├── backend/
│   ├── src/
│   │   ├── config/            # Strongly-typed environment configuration
│   │   ├── controllers/       # Route controllers (media, auth, settings, ads)
│   │   ├── middleware/        # Cookie auth, rate limiting, error handler
│   │   ├── routes/            # REST API & crawler sitemap endpoints
│   │   ├── services/          # yt-dlp/FFmpeg streamer, DB client, SEO sitemaps
│   │   ├── types/             # Backend request/response type schemas
│   │   ├── db/                # Database migration runner
│   │   └── index.ts           # Express server entry point & shutdown handlers
│   ├── migrations/            # SQL migration files
│   ├── Dockerfile             # Multi-stage Dockerfile with Node.js 22, yt-dlp & FFmpeg
│   ├── .dockerignore          # Docker build ignore patterns
│   ├── package.json           # Backend dependencies & scripts
│   ├── tsconfig.json          # Backend TypeScript configuration
│   └── .env.example           # Example backend environment variables
│
├── README.md                  # Project documentation & run guides
└── .gitignore                 # Monorepo ignore rules
```

---

## 🚀 Running Locally

You run the frontend and backend in two separate terminal windows.

### Terminal 1 — Frontend (Client)
```bash
cd frontend
npm install
npm run dev
```
The frontend will start at `http://localhost:3000` (or `http://localhost:5173`).

### Terminal 2 — Backend (API & Downloader)
```bash
cd backend
npm install
npm run dev
```
The backend API server will start on `http://localhost:3000` (or the configured `PORT`).

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env.local`)
| Variable | Description | Local Example | Production Example |
|---|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:3000` | `https://saveitfromx-api.onrender.com` |

> **Note**: Frontend source files never hardcode API endpoints. All requests route through `src/services/api.ts` which uses `VITE_API_URL`.

### Backend (`backend/.env`)
| Variable | Description | Example |
|---|---|---|
| `PORT` | Port to bind the HTTP server to | `3000` |
| `NODE_ENV` | Runtime mode (`development` / `production`) | `production` |
| `DATABASE_URL` | Supabase / PostgreSQL connection string | `postgresql://postgres.[ref]:[pass]@aws-0-[region].pooler.supabase.com:6543/postgres` |
| `SESSION_SECRET` | 32+ character random secret for cookie signing | `your-secure-random-32-char-secret-key` |
| `INITIAL_ADMIN_EMAIL` | Default admin email | `admin@saveitfromx.com` |
| `INITIAL_ADMIN_PASSWORD` | Default admin passkey for initial login | `admin2026x` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | `http://localhost:5173,https://saveitfromx.vercel.app` |
| `TEMP_DIR` | Ephemeral scratch directory for yt-dlp processing | `/tmp/saveitfromx` |

---

## 🚢 Deployment Architecture

```text
┌─────────────────────────────────┐
│        Vercel (Frontend)        │
│   https://saveitfromx.vercel.app│
│   (Vite static build from dist) │
└────────────────┬────────────────┘
                 │
                 │ HTTPS /api/*
                 ▼
┌─────────────────────────────────┐
│         Render (Backend)        │
│  https://saveitfromx.onrender.com│
│   (Docker container with:       │
│    Node 22 + yt-dlp + FFmpeg)   │
└────────────────┬────────────────┘
                 │
                 │ PostgreSQL connection pool (SSL)
                 ▼
┌─────────────────────────────────┐
│      Supabase (Database)        │
│  PostgreSQL instance (Tables:   │
│  admins, sessions, downloads,   │
│  site_settings, ad_slots)       │
└─────────────────────────────────┘
```

### 1. Database Setup (Supabase)
1. Create a project at [supabase.com](https://supabase.com).
2. Copy your PostgreSQL Connection String (`URI`) from **Project Settings → Database → Connection string**.
3. Run the migrations in `backend/migrations/001_initial_schema.sql` via Supabase SQL Editor, or run:
   ```bash
   cd backend
   npm run db:migrate
   ```

### 2. Backend Deployment (Render Web Service)
1. In Render, create a new **Web Service**.
2. Connect your Git repository.
3. Configure the service:
   - **Environment**: `Docker`
   - **Docker Context**: `backend` (or root with Dockerfile path `backend/Dockerfile`)
   - **Dockerfile Path**: `Dockerfile` (inside `backend/`)
4. Add the following **Environment Variables** in Render:
   - `PORT`: `3000` (or let Render set it dynamically)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `postgresql://postgres.[ref]:[pass]...`
   - `SESSION_SECRET`: `<secure-random-string>`
   - `ALLOWED_ORIGINS`: `https://your-frontend.vercel.app,https://www.saveitfromx.com`
5. Click **Deploy**. Render will build the Docker container with yt-dlp, FFmpeg, and start Express on `0.0.0.0:$PORT`.

### 3. Frontend Deployment (Vercel)
1. In Vercel, click **Add New Project** and import the repository.
2. In the project setup:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add the **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
4. Click **Deploy**. Vercel will build the frontend into `dist` and handle client-side routing via `vercel.json`.

---

## 🔒 Security & Best Practices

1. **Zero Secrets in Frontend**: The frontend contains no database passwords, service-role keys, or session secrets. Only public config uses the `VITE_` prefix.
2. **Server-Side Authentication**: Login and sessions are verified on the backend using signed, HTTP-only, SameSite cookies.
3. **SSRF Guard**: The media downloader strictly validates X/Twitter URLs against official hostnames and blocks private/local IP addresses (`127.0.0.1`, `10.*`, `192.168.*`, `169.254.*`).
4. **Stateless Ephemeral Downloads**: Media downloads stream via yt-dlp/FFmpeg to `/tmp/saveitfromx` and temporary files are immediately unlinked in a `finally` block upon stream completion or client abort.
5. **CORS & Helmet**: Helmet sets standard security headers while CORS restricts credentialed access to authorized frontend domains.
