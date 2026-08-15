# Architecture & Data Flow

Two diagrams, both traced directly from `docker/docker-compose.yml`,
`docker/docker-compose.prod.yml`, `docker/Caddyfile`, `proxy.ts`, and the
`lib/auth` / `lib/storage` / `app/api` code — not aspirational.

Scope note: this is a single-server, single-Docker-Compose-stack personal
site (one app instance, one Postgres, one MinIO), not a distributed
multi-service system. There's deliberately no HA topology, service mesh, or
multi-region diagram here — those would describe an architecture this site
doesn't have. What's below is calibrated to what actually runs.

## 1. System architecture (production topology)

```mermaid
flowchart TB
    Browser((Browser))

    subgraph Host["Linux host — Docker Compose, vikas-site_default network"]
        Caddy["Caddy 2<br/>reverse proxy, TLS, security headers<br/>ports 80/443 → public"]

        subgraph WebSvc["web — Node 22-alpine, Next.js 16 standalone build"]
            NextApp["Next.js app<br/>port 3000, internal only in prod"]
        end

        subgraph DbSvc["db — Postgres 16-alpine"]
            Postgres[("Postgres<br/>port 5432, internal only in prod<br/>volume: pgdata")]
        end

        subgraph StorageSvc["minio — S3-compatible object store"]
            MinIO[("MinIO bucket<br/>port 9000, internal only in prod<br/>volume: miniodata")]
        end

        Tools["tools — one-off container<br/>profile: tools, not started by `up`<br/>prisma migrate deploy / seed.ts"]
    end

    Browser -- HTTPS --> Caddy
    Caddy -- "everything except /media/*" --> NextApp
    Caddy -- "/media/* → strip_prefix" --> MinIO
    NextApp -- "Prisma, pg driver adapter" --> Postgres
    NextApp -- "PutObject, aws-sdk S3 client" --> MinIO
    Tools -. "migrate deploy" .-> Postgres
    Tools -. "seed.ts writes" .-> Postgres
    Tools -. "seed placeholder media" .-> MinIO

    classDef store fill:#1b2735,stroke:#69DDFF,color:#F4F7FB
    classDef proc fill:#12161d,stroke:#9B83FF,color:#F4F7FB
    class Postgres,MinIO store
    class Caddy,NextApp,Tools proc
```

**Dev vs. prod, the actual difference (not two architectures):**
`docker-compose.yml` (dev, used by `make up`) publishes `db`, `minio`, and
`web` directly on host ports (5432, 9000–9001, 3000) and has no `caddy`
service at all — the Next.js dev/standalone server is hit directly. The
`docker-compose.prod.yml` override (used by `make deploy`) is additive: it
adds the `caddy` service as the sole public entrypoint and overrides
`ports: []` on `db`/`minio`/`web` so nothing but Caddy is reachable from
outside the Docker network. Same containers, same images — production just
removes direct access and puts one TLS-terminating proxy in front.

## 2. Data flow

Seven request paths, each traced to the actual code that handles it. Split
into two charts (request/auth paths, then storage paths) so each stays
readable instead of one diagram wide enough to need horizontal scrolling.

```mermaid
flowchart TB
    Browser((Browser))
    Caddy["Caddy"]
    Browser --> Caddy

    subgraph F1["1 — Public page render"]
        RSC["Server Component<br/>app/(public)/*"]
        RSC --> PrismaR[("Prisma read")]
        PrismaR --> PG1[("Postgres")]
    end

    subgraph F2["2 — Admin navigation guard"]
        ProxyChk["proxy.ts<br/>getToken() — cookie-only JWT decode<br/>matcher: /admin/*"]
        ProxyChk -- "no/invalid token" --> LoginRedirect["redirect to /admin/login"]
        ProxyChk -- "valid token" --> AdminRSC["Admin Server Component"]
    end

    subgraph F3["3 — Admin login"]
        AuthRoute["/api/auth/[...nextauth]<br/>Credentials provider"]
        AuthRoute --> RL1[["rateLimit()<br/>keyed by email, 5 / 15 min"]]
        AuthRoute --> UserLookup[("Prisma: User.findUnique")]
        AuthRoute --> BcryptChk["bcrypt.compare()"]
        AuthRoute -- success --> SetCookie["Set-Cookie: JWT session"]
    end

    subgraph F4["4 — Admin content write"]
        ServerAction["Server Action<br/>lib/actions/*.ts"]
        ServerAction --> SessionChk["requireAdminSession()<br/>getServerSession() — cookie decode, no DB hit"]
        SessionChk -- ok --> ZodV["Zod validate"]
        ZodV --> PrismaW[("Prisma write")]
        PrismaW --> PG2[("Postgres")]
        PrismaW --> Revalidate["revalidatePath()"]
    end

    Caddy --> F1
    Caddy --> F2
    Caddy --> F3
    Caddy --> F4
```

```mermaid
flowchart TB
    Browser2((Browser))
    Caddy2["Caddy"]
    Browser2 --> Caddy2

    subgraph F5["5 — Media upload"]
        UploadRoute["/api/media/upload"]
        UploadRoute --> SessionChk2["requireAdminSession()"]
        SessionChk2 --> Sharp["sharp: rotate / resize / re-encode<br/>images only — PDFs pass through"]
        Sharp --> S3Put["S3 PutObject, aws-sdk"]
        S3Put --> MinioStore[("MinIO bucket")]
        UploadRoute --> MediaRow[("Prisma: Media.create")]
    end

    subgraph F6["6 — Public contact form"]
        ContactRoute["/api/contact"]
        ContactRoute --> RL2[["rateLimit()<br/>keyed by IP, 5 / hour"]]
        ContactRoute --> Honeypot{"honeypot field<br/>filled in?"}
        Honeypot -- "yes → fake success" --> Done1["200 OK, no write"]
        Honeypot -- no --> MsgRow[("Prisma: ContactMessage.create")]
    end

    subgraph F7["7 — Media delivery"]
        CaddyMedia["Caddy: /media/* strip_prefix"]
        CaddyMedia --> MinioServe[("MinIO — direct object GET<br/>bypasses Next.js entirely")]
    end

    Caddy2 --> F5
    Caddy2 --> F6
    Caddy2 --> F7
```

**Notes that don't fit in the diagram:**
- Both auth checks (`proxy.ts`'s `getToken()` and `requireAdminSession()`'s
  `getServerSession()`) decode the JWT cookie only — neither hits the
  database, matching next-auth v4's JWT session strategy (required for the
  Credentials provider). The Prisma adapter wired into `authOptions` is
  unused for session persistence; it's there for a possible future provider.
- `proxy.ts` only guards page navigation to `/admin/*` (Next's own guidance:
  an "optimistic," DB-free check that runs on every request including
  prefetches). It does **not** cover `/api/*` — every Server Action and API
  route re-checks `requireAdminSession()` itself, which is the authoritative
  check.
- Rate limiting (`lib/rateLimit.ts`) is in-memory and per-process — it resets
  on container restart and won't hold across multiple `web` replicas (there's
  only one today).
