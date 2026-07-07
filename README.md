# 📍 Findora

**Lost Something? Findora Helps You Find It.**

Findora is a community-powered Lost & Found platform. People report lost or
found items with a location, photo, and description; an AI-assisted matching
engine cross-checks every new report against open ones and surfaces likely
matches in real time; matched users chat and arrange the return, earning
trust points and badges along the way.

This repo is a full-stack, dockerized, CI/CD-ready MVP — the kind of thing
you'd actually deploy at a hackathon or as a first startup MVP, not just a
UI mockup.

---

## ✨ Features

| Area | What's implemented |
|---|---|
| **Auth** | Register/login (JWT access + refresh), email verification, forgot/reset password — all emailed via **Brevo** |
| **Reports** | Lost & Found CRUD, photo uploads (up to 5/report), custom verification questions hidden from everyone but the owner |
| **AI Matching** | Deterministic category/location/description/date/photo scoring engine, plus a **Groq**-generated plain-English "why this is a match" explanation on every match |
| **Live maps** | Google Maps on the report form (tap to pin the exact spot), dashboards, item detail, and police portal — powered by `@react-google-maps/api` |
| **Real-time** | Socket.IO chat between matched users + live in-app toast notifications the instant a match is found |
| **Notifications** | In-app + email, for matches, messages, and returned items |
| **Dashboards** | User, Admin, and Police dashboards with **Recharts** donut/pie charts, trend lines, and bar charts (category breakdown, lost-vs-found, 6-month report volume) |
| **Trust & gamification** | Trust points and Bronze/Silver/Gold badges awarded on confirmed returns |
| **Admin & Police portals** | Analytics, user moderation, read-only citizen report review |
| **~20 pages** | See the full route list below — landing, auth, dashboard, report flow, item detail, chat, search, notifications, profile, settings, admin, police |

---

## 🧱 Tech stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Recharts, `@react-google-maps/api`, Socket.IO client
- **Backend:** Express 5 + TypeScript, Mongoose (MongoDB), Socket.IO, JWT auth, Multer (photo uploads)
- **AI matching:** In-house deterministic scoring engine + **Groq** (Llama 3.3 70B) for natural-language match explanations
- **Email:** **Brevo** transactional email API (verification, password reset, match alerts, return confirmations)
- **Infra:** Docker + Docker Compose (Mongo, Redis, backend, frontend), Jenkins pipeline

```
findora/
├── findora-frontend/     Next.js app — all user-facing & admin pages
├── findora-backend/      Express API — auth, reports, matching, chat, email, AI
├── docker/               docker-compose.yml (Mongo + Redis + backend + frontend)
├── Jenkinsfile            CI/CD pipeline (build, lint, docker build/push, deploy)
├── .env.example           Root env file consumed by docker-compose
└── documentation/         API reference, data model, roadmap
```

---

## 🔑 Getting API keys (all free tiers)

Findora runs with **zero API keys** — it just logs emails to the console and
shows a stylized map placeholder instead of a live one, and match
explanations fall back to a template. To unlock the full experience:

| Key | Where to get it | What it unlocks |
|---|---|---|
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) — free, no card | AI-written match explanations |
| `BREVO_API_KEY` | [app.brevo.com](https://app.brevo.com) → Settings → SMTP & API → API Keys — free, 300 emails/day | Verification, password reset, and match-alert emails |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | [console.cloud.google.com/google/maps-apis](https://console.cloud.google.com/google/maps-apis) — enable **Maps JavaScript API**, free tier covers dev use | Live interactive maps + pin-the-spot picker |

---

## 🚀 Quick start — Docker Compose (recommended)

This is the "one command" path: MongoDB, Redis, backend, and frontend all in
containers.

```bash
# 1. Clone / unzip this repo, then from the project root:
cp .env.example .env
# edit .env — at minimum, change JWT_SECRET / JWT_REFRESH_SECRET.
# Add GROQ_API_KEY / BREVO_API_KEY / NEXT_PUBLIC_GOOGLE_MAPS_API_KEY if you have them.

# 2. Build and start everything
cd docker
docker compose up --build

# 3. In a second terminal, seed demo data (users, sample reports, matches)
docker compose exec backend npm run seed
```

Then open:
- **App:** http://localhost:3000
- **API health check:** http://localhost:5000/api/health

To stop: `docker compose down` (add `-v` to also wipe the Mongo/Redis volumes).

### Demo accounts (created by `npm run seed`)

| Role | Email | Password |
|---|---|---|
| User | `arjun@example.com` | `password123` |
| User | `priya@example.com` | `password123` |
| User | `ramesh@example.com` | `password123` |
| Admin | `admin@findora.app` | `admin12345` |
| Police | `police@findora.app` | `police12345` |

---

## 🛠️ Quick start — without Docker

You'll need Node.js 20+ and either a local MongoDB or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster.

```bash
# Don't have Mongo locally? Fastest option:
docker run -d -p 27017:27017 --name findora-mongo mongo:7

# 1. Backend
cd findora-backend
npm install
cp .env.example .env        # fill in GROQ_API_KEY / BREVO_API_KEY if you have them
npm run dev                  # http://localhost:5000

# 2. Seed demo data (in a second terminal, once the backend is running)
npm run seed

# 3. Frontend
cd ../findora-frontend
npm install
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY if you have one
npm run dev                  # http://localhost:3000
```

Open **http://localhost:3000** and log in with a demo account above, or
register a new one (you'll get a real verification email if `BREVO_API_KEY`
is set — otherwise check the backend console log for the verification link).

---

## 🗺️ How the AI matching actually works

1. **Deterministic scoring** (`findora-backend/src/utils/matching.ts`) runs
   the instant a report is submitted, comparing it against every open report
   in the opposite collection (lost ↔ found) on category, location, free-text
   description, date proximity, and photo/color presence. This is fast,
   free, works with zero API keys, and is fully explainable — every match
   stores its exact score breakdown.
2. Any pair scoring **45+** becomes a `Match` document.
3. **Groq** (`findora-backend/src/services/ai.service.ts`) then turns that
   structured score into one human sentence — *"Matched on category 'Wallet'
   and nearby locations (DB Mall / MP Nagar) with 82% confidence"* — shown in
   the dashboard and emailed to both parties.
4. Both matched users get an **in-app real-time toast** (Socket.IO), a
   persisted **notification**, and an **email** (Brevo) — whichever they see
   first.

Swap in real vector embeddings or an image-similarity model later without
touching the rest of the app — `computeMatch()` and `explainMatch()` are
drop-in replaceable.

---

## 🔌 Real-time & notifications

- The frontend connects to Socket.IO once logged in (`lib/socket.ts`) and
  joins a private room named after the user's ID.
- The backend targets that room directly — `io.to(userId).emit(...)` — for
  new matches, chat messages, and "item returned" events, so updates appear
  instantly without polling.
- Every push notification is also written to Mongo (`Notification` model) so
  the `/notifications` page always shows full history, read/unread state,
  and works even if the user was offline when it happened.

---

## 📊 Dashboards

- **User dashboard:** stat cards, recent matches, recent reports, nearby
  reports on a live map, and a category-breakdown donut chart.
- **Admin dashboard:** total users / reports / recovery rate, a 6-month
  report-volume trend line, category donut chart, and a paginated recent
  reports table.
- **Police dashboard:** lost-vs-found donut chart, a live map of all
  reported locations, and a read-only citizen reports table (verification
  answers stay private to the reporter).

All charts are built with **Recharts** (`findora-frontend/components/charts.tsx`)
and read live data from `/api/admin/analytics`.

---

## 🐳 Docker Compose reference

`docker/docker-compose.yml` brings up 4 services:

| Service | Image / build | Port | Notes |
|---|---|---|---|
| `mongo` | `mongo:7` | 27017 | Persistent volume `mongo-data` |
| `redis` | `redis:7-alpine` | 6379 | Reserved for future background jobs / caching |
| `backend` | built from `findora-backend/Dockerfile` | 5000 | Reads all secrets from the root `.env` |
| `frontend` | built from `findora-frontend/Dockerfile` | 3000 | `NEXT_PUBLIC_*` vars passed as **build args** since Next.js bakes them in at build time |

Common commands:

```bash
docker compose up --build          # build + start everything
docker compose up -d               # start in the background
docker compose logs -f backend     # tail backend logs
docker compose exec backend npm run seed   # seed demo data
docker compose down                # stop
docker compose down -v             # stop + wipe volumes (fresh Mongo)
```

---

## 🔁 CI/CD — Jenkins

The included `Jenkinsfile` runs a full pipeline:

1. Checkout
2. Backend: `npm ci` + `tsc --noEmit` (type-check) + build
3. Frontend: `npm ci` + `npm run lint` + build (with `NEXT_PUBLIC_*` baked in
   from a Jenkins secret file)
4. Build Docker images for both services
5. *(optional, parameterized)* Push images to your registry
6. *(optional, parameterized)* Deploy — either locally (`docker compose up
   -d --build`) or to a remote host over SSH

**One-time Jenkins setup:**

1. Install plugins: *Pipeline*, *Docker Pipeline*, *Credentials Binding*, *SSH Agent*
2. Add credentials:
   - `dockerhub-creds` — Username/Password — your registry login
   - `findora-env` — Secret file — upload your filled-in `.env` (see `.env.example`)
3. Create a new **Pipeline** job → *Pipeline script from SCM* → point it at
   this repo → script path `Jenkinsfile`
4. Build with parameters: set `DOCKER_REGISTRY`, and tick `PUSH_IMAGES` /
   `DEPLOY` when you're ready to actually ship (both default to `false` so a
   first run is a safe dry build).

---

## 📖 Route map (frontend)

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/register`, `/login`, `/forgot-password`, `/verify-email` | Auth |
| `/dashboard` | User dashboard (stats, matches, category chart, map) |
| `/report`, `/report/lost`, `/report/found` | Report an item (with map picker) |
| `/my-reports` | Your lost & found reports |
| `/matches` | AI-suggested matches, confirm/reject/mark returned |
| `/items/[type]/[id]` | Full report detail + map + owner card |
| `/chat/[matchId]` | Real-time chat with the matched user |
| `/search` | Browse/filter all open reports |
| `/notifications` | Notification history |
| `/profile`, `/settings` | Account management |
| `/admin`, `/admin/users` | Admin analytics + user moderation |
| `/police` | Police read-only portal |
| `/not-found` (404) | Fallback |

---

## 🧩 Environment variables reference

**`findora-backend/.env`** (see `findora-backend/.env.example`):

```
PORT, NODE_ENV, MONGODB_URI
JWT_SECRET, JWT_REFRESH_SECRET
CORS_ORIGIN, FRONTEND_URL
GROQ_API_KEY, GROQ_MODEL
BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME
CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET   (optional)
```

**`findora-frontend/.env.local`** (see `findora-frontend/.env.local.example`):

```
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```

Every one of these is optional except the two that make auth/DB work
(`MONGODB_URI`, `JWT_SECRET`) — the app degrades gracefully (console-logged
emails, template match explanations, placeholder maps) without the rest.

---

## 🧭 What's next (see `documentation/ROADMAP.md`)

- Real image-embedding similarity (currently a heuristic photo/color signal)
- Background jobs (BullMQ + the included Redis) for nearby-item digest emails
- Cloudinary/S3 photo storage in production (currently local disk `/uploads`)
- Push notifications (web push / FCM) alongside in-app + email

---

## 📄 License

MIT — build on it, ship it, make it yours.
