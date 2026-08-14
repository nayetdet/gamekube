.PHONY: up build update migrate format check

GRADLE := ./gradlew

ifneq (,$(wildcard .env))
include .env
export \
	SPRING_DATASOURCE_URL \
	SPRING_DATASOURCE_USERNAME \
	SPRING_DATASOURCE_PASSWORD \
	KEYCLOAK_SERVER_URL \
	KEYCLOAK_REALM \
	KEYCLOAK_CLIENT_ID \
	KEYCLOAK_CLIENT_SECRET
endif

up:
	SPRING_OUTPUT_ANSI_ENABLED=always \
	$(GRADLE) --console=rich bootRun

build:
	$(GRADLE) build

update:
	$(GRADLE) build --refresh-dependencies

migrate:
	$(GRADLE) flywayMigrate

format:
	$(GRADLE) spotlessApply

check:
	$(GRADLE) spotlessCheck test
