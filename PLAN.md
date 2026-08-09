# Vikas Rana Personal Site — Implementation Plan
### Self-hosted on your Linux/Docker server now, cloud-portable later

This is the execution plan to hand to **Claude Code** on your server. It turns the
master prompt + HTML prototype into a phased build. Paste sections of this file into
Claude Code as you go (or point it at the whole file and say "start Phase 1").

---

## 0. Dev Access: Linux server + Windows laptop (LAN IP mode)

The app runs entirely on your Linux server (Docker Compose). You'll browse it from
your Windows laptop over your LAN using the **server's IP address**, not `localhost`
(that word literally means "this machine" — your laptop and server are different
machines). This is "Option 2" from planning: simplest to set up, no SSH tunnel to
keep open.

- Docker Compose already binds ports as `0.0.0.0:3000->3000`, so nothing changes
  there — the app is reachable from other devices on the LAN by default as long as
  the Linux firewall allows it.
- Find the server's LAN IP once: `ip addr show | grep inet` (look for something like
  `192.168.1.50`).
- Open the firewall for the app port if needed: `sudo ufw allow 3000/tcp` (and `9001`
  if you want to browse the MinIO console from your laptop too).
- On your Windows laptop, browse `http://<server-ip>:3000` instead of `localhost:3000`.
- **Important env implication:** `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` (Auth.js) must
  be set to `http://<server-ip>:3000`, not `http://localhost:3000` — otherwise auth
  redirect/callback URLs and any absolute links will be wrong when hit from the laptop.
  Put the actual IP in `.env.local` (gitignored) since it's environment-specific, and
  keep `.env.example` with a placeholder.
- This whole setup is a placeholder for a real domain later — Phase 12 (production
  Caddy + TLS) simply swaps this IP-based URL for `https://yourdomain.com`. No code
  changes required, only env values.

---

## 1. Architecture Decisions (and why they keep you cloud-portable)

| Concern | Self-hosted choice now | Cloud option later | Why it migrates cleanly |
|---|---|---|---|
| App | Next.js 15 (App Router) in a Docker container | Vercel / any container host (Fly, Render, ECS) | Stateless Node container, no code changes |
| Database | PostgreSQL 16 in Docker, named volume | Neon / Supabase / RDS / managed Postgres | Same schema via Prisma; migrate with `pg_dump` / `pg_restore` |
| Object storage (photos/videos/resume) | MinIO (S3-compatible) in Docker | Cloudflare R2 / AWS S3 / Backblaze B2 | Code talks to an S3-compatible API only — swap endpoint + keys in `.env` |
| Reverse proxy / TLS | Caddy (auto HTTPS via your domain) | Same Caddy container, or platform-managed TLS | Config is a 10-line Caddyfile, portable as-is |
| Auth | Auth.js (NextAuth) with credentials/email, Postgres adapter | Same — no vendor lock-in | Session data lives in your own DB |
| Background jobs (image resize, future scheduling) | Simple Node worker container or Next.js route handlers | Same, or a managed queue later | Keep logic provider-agnostic from day one |

**Golden rule enforced throughout:** nothing in application code ever hard-codes
"localhost", "minio", or a Docker service name directly — everything goes through
environment variables so `docker-compose.yml` (dev/self-host) and a future cloud
config are interchangeable.

---

## 2. Tech Stack (latest stable as of build time — verify versions with Claude Code)

- **Framework:** Next.js (latest stable, App Router, TypeScript strict mode)
- **Styling:** Tailwind CSS + CSS variables for design tokens (matches the prototype's `:root` palette)
- **Animation:** Framer Motion (primary), GSAP only for scroll-timeline heavy sections
- **ORM:** Prisma + PostgreSQL
- **Auth:** Auth.js (NextAuth v5) — credentials provider for you as sole admin, Prisma adapter
- **Storage SDK:** `@aws-sdk/client-s3` (works identically against MinIO and real S3/R2)
- **Image handling:** `sharp` for server-side resizing/optimization before upload to storage; Next.js `<Image>` for delivery
- **Rich text:** Tiptap (block-based, extensible — matches your future block-type requirement)
- **Validation:** Zod (shared between forms and API route handlers)
- **Testing:** Vitest (unit/integration) + Playwright (E2E)
- **Containerization:** Docker + Docker Compose (already available on your server)

---

## 3. Repository Structure

```
vikas-site/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                # home
│   │   ├── career/page.tsx
│   │   ├── fitness/page.tsx
│   │   ├── fitness/challenges/page.tsx
│   │   ├── fitness/challenges/[challengeSlug]/page.tsx
│   │   ├── cricket/page.tsx
│   │   ├── photography/page.tsx
│   │   ├── travel/page.tsx
│   │   ├── travel/[slug]/page.tsx
│   │   ├── projects/[slug]/page.tsx
│   │   └── contact/page.tsx
│   ├── admin/
│   │   ├── page.tsx                 # dashboard
│   │   ├── login/page.tsx
│   │   ├── career/  fitness/  cricket/  photography/  travel/  media/  settings/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── media/upload/route.ts
│   │   ├── career/ fitness/ cricket/ photography/ travel/ (CRUD route handlers)
│   │   └── contact/route.ts
│   ├── layout.tsx
│   ├── globals.css
│   └── sitemap.ts
├── components/
│   ├── ui/ navigation/ hero/ cards/ gallery/ timeline/ animations/
│   ├── career/ fitness/ cricket/ photography/ travel/ admin/
├── lib/
│   ├── db/            # prisma client singleton
│   ├── auth/           # auth.js config
│   ├── storage/         # S3-compatible client + upload/signed-url helpers
│   ├── seo/
│   ├── validations/     # zod schemas
│   └── utils/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── types/
├── hooks/
├── config/
│   ├── site.ts
│   ├── navigation.ts
│   └── theme.ts
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   └── Caddyfile
├── .env.example
├── .env.local            (gitignored)
└── README.md
```

---

## 4. Docker Setup (self-hosted, migration-friendly)

**Services in `docker-compose.yml`:**

1. `web` — Next.js app (multi-stage Dockerfile: deps → build → runtime)
2. `db` — `postgres:16-alpine`, named volume `pgdata`
3. `minio` — `minio/minio`, named volume `miniodata`, console on an internal port only
4. `caddy` — reverse proxy, terminates TLS for your domain, routes `/` → `web`

Key practices to tell Claude Code to follow:
- All service hostnames (`db`, `minio`) only ever appear inside `.env` values like
  `DATABASE_URL` and `STORAGE_ENDPOINT` — never hard-coded in app code.
- `docker-compose.prod.yml` overrides with resource limits, restart policies
  (`unless-stopped`), and disables MinIO console exposure.
- A single `Makefile` or `package.json` scripts wrap common ops:
  `make up`, `make down`, `make migrate`, `make seed`, `make backup`.

**.env.example (fill in real values in `.env.local`, never commit real secrets):**
```
DATABASE_URL=postgresql://vikas:changeme@db:5432/vikas_site
AUTH_SECRET=
AUTH_URL=http://<server-lan-ip>:3000
STORAGE_ENDPOINT=http://minio:9000
STORAGE_PUBLIC_URL=http://<server-lan-ip>:9000
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_BUCKET=vikas-media
NEXT_PUBLIC_SITE_URL=http://<server-lan-ip>:3000
ADMIN_EMAIL=
```

`.env.example` keeps the `<server-lan-ip>` placeholder literally as shown (never a
real IP, since that's environment-specific) — your real `.env.local` gets the actual
LAN IP filled in. When you move to cloud storage later, only `STORAGE_ENDPOINT`,
`STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY`, and `STORAGE_PUBLIC_URL` change — the
upload/read code in `lib/storage/` stays identical since MinIO speaks the S3 API.
Later, once you have a domain, `AUTH_URL` and `NEXT_PUBLIC_SITE_URL` swap from the
LAN IP to `https://yourdomain.com` — same mechanism, no code changes.

---

## 5. Database Schema (Prisma models — high level)

Ask Claude Code to generate the full `schema.prisma` from this list, matching the
relationships in the master prompt:

```
User, Session, Account                          // Auth.js tables
Profile                                          // site owner bio/summary
Experience, Skill, Project, Achievement, Certification
FitnessJourney, FitnessChallenge, FitnessEntry, Competition
CricketTeam, CricketPlayer, CricketMatch, Tournament, CricketMemory
PhotoAlbum, Photo, Equipment
TravelTrip, TravelLocation, TravelMemory
Media                                            // central file registry (S3 key, type, dims, alt)
Tag, Category
SiteSetting, NavigationItem
ContactMessage
AuditLog
```

Every content model gets: `published Boolean`, `featured Boolean` (where relevant),
`slug String @unique`, `createdAt`, `updatedAt`. `TravelTrip` gets `latest Boolean`
with a DB constraint/trigger or app-level logic ensuring only one trip is `latest = true`
at a time (unset the previous one on publish — this powers the homepage rule).

`Media` is the join point: `Photo`, `TravelTrip`, `CricketMatch`, `FitnessEntry` etc.
reference `Media` records rather than storing raw URLs, so a file can be reused
across contexts without duplication (matches master prompt §35).

---

## 6. Build Phases (feed these to Claude Code one at a time)

### Phase 1 — Foundation
- Init Next.js + TypeScript + Tailwind, ESLint, Prettier
- Set up `docker-compose.yml` with `db` + `minio`, get Prisma connected and migrating
- Design tokens in `globals.css` as CSS variables (colors from the prototype:
  `#07090D` bg, `#F4F7FB` text, `#99A4B5` muted, `#69DDFF` cyan, `#9B83FF` purple)
- Base layout, nav, footer, fonts (Inter or Manrope)

### Phase 2 — Public Homepage
- Hero (cinematic, parallax, gradient text) matching `index.html`
- "Different Worlds. One Person." card grid (Career / Fitness / Indus Knights)
- Latest Travel section — pulls the `TravelTrip` where `latest = true` from DB
- Photography teaser (4 images via `PhotoAlbum` featured flag)
- Recruiter shortcut panel → `/career#recruiter`
- All content data-driven from Prisma queries, not hard-coded

### Phase 3 — Career
- Professional summary, timeline, recruiter view with stats grid, resume download
  (served from `Media`/storage), project cards pulling from `Project` model

### Phase 4 — Fitness
- Journey story, stats (2021 start, ICN Goa 2024 Bronze, 100-day + 365-day challenges)
- `/fitness/challenges` and `/fitness/challenges/[slug]` — each day is a `FitnessEntry`
  record, paginated/lazy-loaded so 365 entries don't blow up the page
- Friendly "reach out" CTA (non-medical framing)

### Phase 5 — Cricket
- Indus Knights story (2015, US origin, Gurgaon weekend cricket, "friends became family")
- Players, Matches, Tournaments, Memories — CRUD-backed grids/timelines

### Phase 6 — Photography
- Equipment list, albums, lightbox with keyboard nav + swipe + EXIF metadata panel

### Phase 7 — Travel
- Archive grid + trip detail page (`/travel/[slug]`) with itinerary, gallery, map
- Confirm "latest" trip toggle logic end-to-end

### Phase 8 — Admin/CMS
- Auth.js login (you as sole user initially — credentials or magic-link email)
- Dashboard with content counts
- CRUD screens per content type, Tiptap rich text editor, draft/publish toggle
- Media library: upload → MinIO via signed URLs → `sharp` resize → `Media` record

### Phase 9 — Security & Hardening
- Rate limiting on contact form + auth
- CSRF handled by Auth.js defaults; HTTP-only cookies
- Input validation via shared Zod schemas on every API route

### Phase 10 — SEO & Performance
- Dynamic metadata, OG tags, sitemap.ts, robots.txt
- Next/Image everywhere, lazy loading, Lighthouse pass

### Phase 11 — Testing
- Vitest for logic (latest-trip toggle, slug generation, validation)
- Playwright for: homepage loads, nav works, admin login, create/edit/publish a trip,
  contact form submission

### Phase 12 — Docker Production + Deployment on your server
- `docker-compose.prod.yml`, Caddy reverse proxy with your domain + auto TLS
- `make deploy` style script: build image, run migrations, restart containers
- Document the one-command local dev flow (`make up`)

### Phase 13 — Backup & Migration Runbook
- Nightly `pg_dump` cron job (in-container or host cron) → local backup dir
- MinIO bucket mirrored/rsynced to an external disk or off-site periodically
- **Cloud migration runbook** (write this into README now, even if unused today):
  1. Provision managed Postgres, `pg_restore` the latest dump
  2. Provision R2/S3 bucket, `mc mirror` MinIO data into it
  3. Update `.env` (`DATABASE_URL`, `STORAGE_*`) — no code changes
  4. Point `web` container (or Vercel deploy) at new env, redeploy
  5. Cut over DNS

---

## 7. Step-by-Step: Set Up the Folder and Start Claude Code

### 7.1 Where to create the project folder

Keep it separate from your existing `Scripts` folder — that's for utility scripts,
this is a full application with its own git history, containers, and data volumes.
Recommended layout on your Linux server:

```
/home/<your-user>/
├── Scripts/              # existing, untouched
└── projects/
    └── vikas-site/       # new — this whole plan lives here
```

If you don't already have a `projects` folder, create one now as a home for future
apps too, rather than mixing this into `Scripts`.

```bash
mkdir -p ~/projects
cd ~/projects
mkdir vikas-site
cd vikas-site
```

Put this plan file inside it immediately so Claude Code always has it in context:

```bash
# from inside ~/projects/vikas-site
# (copy PLAN.md here, e.g. via scp from wherever you downloaded it, or paste it in)
```

Then initialize git early (even before Claude Code writes a line of app code):

```bash
git init
echo "PLAN.md added, starting Phase 1" > .gitkeep
git add PLAN.md
git commit -m "docs: add implementation plan"
```

### 7.2 Launch Claude Code in this folder

```bash
cd ~/projects/vikas-site
claude
```

Claude Code will pick up whatever is in this directory as its working context —
that's why PLAN.md needs to already be sitting there.

### 7.3 The first prompt to give Claude Code

Paste this once you're in the Claude Code session:

> Read PLAN.md in full — it's in this directory. We're building this on my
> self-hosted Linux server, which already runs Docker. I'll access it from a
> separate Windows laptop over the LAN using the server's IP address (see §0 of
> PLAN.md), not localhost — so use `<server-lan-ip>` placeholders in `.env.example`
> exactly as described, and prompt me for my actual LAN IP to put in `.env.local`.
> No domain yet — that's deferred to Phase 12.
>
> Start with Phase 6, Phase 1 only (Foundation): scaffold the Next.js + TypeScript +
> Tailwind project, set up docker-compose.yml with Postgres and MinIO services per
> §4, wire up Prisma to the Postgres container, and get `docker compose up` working
> end to end with a placeholder homepage reachable from my LAN IP on port 3000.
> Use the color tokens and folder structure from §2 and §3 exactly.
>
> Don't proceed to Phase 2 until I've confirmed Phase 1 works from my laptop.

### 7.4 How phases work from here

Each phase in §6 is a checkpoint, not a single Claude Code turn — expect Claude
Code to ask clarifying questions, write files, and run commands (like
`docker compose up`, `npx prisma migrate dev`) autonomously within the phase.
Your job at each checkpoint:

1. Let Claude Code finish the phase.
2. Test it yourself — for Phase 1, that means opening `http://<server-lan-ip>:3000`
   from your Windows laptop and seeing the placeholder homepage render.
3. Commit the working state: `git add -A && git commit -m "phase 1: foundation"`.
4. Only then tell Claude Code to move to the next phase, e.g.:
   > "Phase 1 confirmed working from my laptop. Proceed to Phase 2: Public
   > Homepage, per §6 of PLAN.md."

This keeps each phase small enough to verify and revert if something breaks,
rather than letting Claude Code build all 13 phases unsupervised in one pass.

### 7.5 Quick sanity checklist before you start Phase 1

- [ ] Docker + Docker Compose installed and working on the Linux server
      (`docker --version`, `docker compose version`)
- [ ] You know the server's LAN IP (`ip addr show | grep inet`)
- [ ] Port 3000 (and 9001 if you want MinIO console access) allowed through the
      server's firewall for your laptop's IP or subnet
- [ ] `~/projects/vikas-site/PLAN.md` exists and is the file Claude Code will read

---

## 8. Open decisions (revisit later, not blockers)

1. Domain name you'll point Caddy at — deferred to Phase 12. Until then, use the
   server's LAN IP as described in §0.
2. Admin auth is confirmed: **single hard-coded user (you), credentials-based
   login**, no signup flow. Add a `role` column to `User` now (default `"admin"`)
   even though it's unused today — costs nothing and avoids a migration if you ever
   add a second editor account.
3. Approximate photo/video volume, to size the MinIO/disk volume on your server.

---

## 9. How Admin Access Actually Works (reference)

- One row in the `User` table, seeded once via `prisma/seed.ts` with your email and
  a bcrypt-hashed password. No public signup route exists anywhere in the app.
- Logging in at `/admin/login` creates a signed, HTTP-only session cookie
  (Auth.js). The cookie — not any "isAdmin" computation — is what proves you're
  authenticated on every request.
- `middleware.ts` intercepts every request to `/admin/*` and redirects to
  `/admin/login` if there's no valid session — this is the actual security
  boundary, enforced before any admin page code runs.
- The "Admin" nav link visibility is a separate, cosmetic-only check (a server
  component reads the session to decide whether to render the link) — it has no
  bearing on security since the middleware protects the routes regardless.
- This works identically over the LAN-IP setup in §0; cookies aren't tied to
  `localhost` specifically, just to whatever `AUTH_URL`/origin you configure.
