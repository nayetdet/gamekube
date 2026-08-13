.PHONY: check format install-hooks

check:
	(cd frontend && bun run check)
	$(MAKE) -C backend check

format:
	(cd frontend && bun run format)
	$(MAKE) -C backend format

install-hooks:
	git config core.hooksPath .githooks
	chmod +x .githooks/pre-commit
