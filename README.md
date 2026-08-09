# vikas-site

Self-hosted personal site. Runs entirely in Docker Compose on this server; see
`PLAN.md` for the full build plan and architecture rationale.

## Dev access

This is accessed from a separate Windows laptop over the LAN using the
server's IP, not `localhost` — see PLAN.md §0. Real values live in
`.env.local` (gitignored); `.env.example` documents the required keys.

## Common commands

```bash
make up       # build + start db, minio, web
make down     # stop everything
make logs     # follow logs
make migrate  # run Prisma migrations (prompts for a name on schema changes)
make seed     # run prisma/seed.ts (added in Phase 8)
make backup   # pg_dump the db to backups/
make test     # Vitest unit tests
make test-e2e # Playwright E2E tests against the running site
```

`make test-e2e` runs against whatever's currently live (`make up` must be
running first). The Travel and Contact specs write and then clean up their
own real data; if a run is interrupted mid-test, check for stray rows
(`title LIKE '%E2E%'` in `TravelTrip`, `email = 'e2e-test@example.com'` in
`ContactMessage`) before re-running.

Once `make up` is running, the site is reachable at the URL in
`NEXT_PUBLIC_SITE_URL` in `.env.local`.

## Going to production

Everything above runs LAN-only, with no domain and no TLS — that's
intentional (see PLAN.md §0/§8). This section is for when you're actually
ready to put the site on the public internet. Nothing here has been
switched on; `docker/docker-compose.prod.yml` and `docker/Caddyfile` exist
and are validated, but `DOMAIN` is unset in `.env.local` until you're ready.

**Prerequisites (all outside what I can configure for you):**
1. A domain name, with a DNS **A record** pointing at this server's
   **public** IP (not the LAN IP `.env.local` currently uses).
2. Your router forwarding ports **80** and **443** to this server. Caddy
   needs both — port 80 for the Let's Encrypt HTTP-01 challenge (and to
   redirect HTTP→HTTPS), port 443 to actually serve.
3. If your ISP gives you a dynamic public IP, either get a static one or
   set up dynamic DNS so the A record stays correct.

**Cutting over**, once the above is done:
1. Set `DOMAIN=yourdomain.com` in `.env.local`.
2. Update these four values in `.env.local` from the LAN IP to the real
   domain (same mechanism PLAN.md describes for the eventual domain swap —
   no code changes, env only):
   ```
   AUTH_URL=https://yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   STORAGE_PUBLIC_URL=https://yourdomain.com/media
   ```
   (Media is proxied through Caddy at `/media` rather than exposing MinIO's
   raw port to the internet — see `docker/Caddyfile`. This gives photos and
   the resume TLS too, not just the app.)
3. `sudo ufw allow 80/tcp && sudo ufw allow 443/tcp` if using ufw.
4. `make deploy` — builds `web`, applies pending migrations
   (`prisma migrate deploy`, not `migrate dev`), and brings up the full
   production stack including Caddy. First boot takes a few extra seconds
   while Caddy obtains its certificate from Let's Encrypt.

**Production stack differences** (`docker/docker-compose.prod.yml`, an
override applied on top of the base compose file, not a replacement):
- `restart: always` (vs `unless-stopped`) on every service.
- `db`, `minio`, and `web` no longer publish ports to the host directly —
  Caddy is the sole public entrypoint (80/443). Internal
  container-to-container traffic (`web`→`db`, Caddy→`web`, Caddy→`minio`)
  is unaffected, since it never left the Docker network.
- MinIO's console is fully disabled (not just unexposed) by dropping
  `--console-address` from its startup command.
- Memory limits set on `db`/`minio`/`web` (512M/256M/1G) via
  `deploy.resources.limits` — Compose V2 applies these outside Swarm mode.

**Other commands:**
```bash
make prod-logs  # follow logs across the whole production stack
make prod-down  # stop the production stack
```

**Known limitation carried over from Phase 2/10**: images still render
`unoptimized` (bypassing next/image's WebP/AVIF conversion and responsive
`srcset`). Re-enabling the optimizer would mean the `web` container
fetching images via the public domain from inside the same Docker network
it's running on — the same hairpin-NAT problem as before, not something
Caddy or TLS resolves on its own. Left as-is.
