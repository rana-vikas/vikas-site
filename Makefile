COMPOSE = docker compose -f docker/docker-compose.yml --env-file .env.local

.PHONY: up down logs migrate seed backup

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
