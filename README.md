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
