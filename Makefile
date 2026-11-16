.PHONY: install-hooks up down backend-up frontend-up format check

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/pre-commit

up:
	docker compose up -d --wait
	@$(MAKE) -j2 --no-print-directory backend-up frontend-up

down:
	docker compose down

backend-up:
	$(MAKE) -C backend up

frontend-up:
	cd frontend && bun run dev

format:
	(cd frontend && bun run format)
	$(MAKE) -C backend format

check:
	(cd frontend && bun run check)
	$(MAKE) -C backend check
