COMPOSE = docker compose -f docker/docker-compose.yml --env-file .env.local
PROD_COMPOSE = docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.yml --env-file .env.local

.PHONY: up down logs migrate seed backup backup-media backup-all test test-e2e deploy prod-down prod-logs

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
	$(COMPOSE) exec -T db pg_dump -U $${POSTGRES_USER:-vikas} $${POSTGRES_DB:-vikas_site} | gzip > backups/db-$$(date +%Y%m%d-%H%M%S).sql.gz
	find backups -maxdepth 1 -name 'db-*.sql.gz' -mtime +14 -delete

# Accumulating backup, not a live sync — deliberately does NOT pass --remove
# to `mc mirror`, so a file deleted from the live bucket stays recoverable
# here instead of the backup silently losing it too. Defaults to a local
# directory; point BACKUP_MEDIA_DIR at an external disk or off-site mount
# once you have one (a same-disk backup doesn't protect against disk failure).
BACKUP_MEDIA_DIR ?= $(CURDIR)/backups/minio-mirror
backup-media:
	mkdir -p $(BACKUP_MEDIA_DIR)
	docker run --rm --network vikas-site_default \
		--user "$$(id -u)":"$$(id -g)" -e HOME=/tmp \
		-v $(BACKUP_MEDIA_DIR):/mirror \
		--env-file .env.local \
		--entrypoint /bin/sh \
		minio/mc -c 'mc alias set local http://minio:9000 "$$STORAGE_ACCESS_KEY" "$$STORAGE_SECRET_KEY" && mc mirror --overwrite local/"$$STORAGE_BUCKET" /mirror'

backup-all: backup backup-media

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
