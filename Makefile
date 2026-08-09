COMPOSE = docker compose -f docker/docker-compose.yml --env-file .env.local
PROD_COMPOSE = docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml --env-file .env.local

.PHONY: up down logs migrate seed backup test test-e2e deploy prod-down prod-logs

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

migrate:
	$(COMPOSE) --profile tools run --rm tools npx prisma migrate dev

seed:
	$(COMPOSE) --profile tools run --rm tools npx prisma db seed

backup:
	mkdir -p backups
	$(COMPOSE) exec -T db pg_dump -U $${POSTGRES_USER:-vikas} $${POSTGRES_DB:-vikas_site} > backups/backup-$$(date +%Y%m%d-%H%M%S).sql

test:
	$(COMPOSE) --profile tools run --rm tools npx vitest run

# Uses Playwright's official image (not the Alpine node ones) — Playwright's
# bundled Chromium doesn't run on musl libc. Joins the app's Docker network
# so it can reach `web` directly, avoiding the LAN-IP hairpin-NAT issue.
test-e2e:
	docker run --rm --network vikas-site_default \
		-v $$(pwd):/workspace -w /workspace \
		--env-file .env.local \
		-e PLAYWRIGHT_BASE_URL=http://web:3000 \
		mcr.microsoft.com/playwright:v1.62.1-jammy \
		npx playwright test --workers=1

# Requires DOMAIN set in .env.local (see README "Going to production") and
# port 80/443 forwarded to this server. Builds web, applies pending
# migrations non-interactively (migrate deploy, not migrate dev), then
# (re)starts everything including Caddy.
deploy:
	$(PROD_COMPOSE) build web
	$(PROD_COMPOSE) --profile tools run --rm tools npx prisma migrate deploy
	$(PROD_COMPOSE) up -d

prod-down:
	$(PROD_COMPOSE) down

prod-logs:
	$(PROD_COMPOSE) logs -f
