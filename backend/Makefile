.PHONY: init up build update migrate format check

SHELL := /bin/bash

GRADLE := ./gradlew
TRUSTSTORE := $(CURDIR)/build/gamekube-truststore.p12
TRUSTSTORE_PASSWORD := changeit
TRUSTSTORE_ALIAS := gamekube-ca
CA_NAMESPACE := cert-manager
CA_SECRET := gamekube-ca

ifneq (,$(wildcard .env))
include .env
export \
	SPRING_DATASOURCE_URL \
	SPRING_DATASOURCE_USERNAME \
	SPRING_DATASOURCE_PASSWORD \
	REDIS_HOST \
	REDIS_PORT \
	REDIS_PASSWORD \
	KEYCLOAK_SERVER_URL \
	KEYCLOAK_REALM \
	KEYCLOAK_CLIENT_ID \
	KEYCLOAK_CLIENT_SECRET \
	GAME_KEYCLOAK_SERVER_URL \
	GAME_KEYCLOAK_COOKIE_SECRET \
	GAME_KEYCLOAK_CLIENT_ID \
	GAME_KEYCLOAK_CLIENT_SECRET
endif

init:
	@mkdir -p "$(dir $(TRUSTSTORE))"
	@keytool -delete \
		-alias "$(TRUSTSTORE_ALIAS)" \
		-keystore "$(TRUSTSTORE)" \
		-storetype PKCS12 \
		-storepass "$(TRUSTSTORE_PASSWORD)" \
		>/dev/null 2>&1 || true

	@keytool -importcert -noprompt -trustcacerts \
		-alias "$(TRUSTSTORE_ALIAS)" \
		-file <(kubectl -n "$(CA_NAMESPACE)" get secret "$(CA_SECRET)" \
			-o 'jsonpath={.data.ca\.crt}' | base64 --decode) \
		-keystore "$(TRUSTSTORE)" \
		-storetype PKCS12 \
		-storepass "$(TRUSTSTORE_PASSWORD)" \
		>/dev/null

up: init
	SPRING_OUTPUT_ANSI_ENABLED=always \
	JAVA_TOOL_OPTIONS="-Djavax.net.ssl.trustStore=$(TRUSTSTORE) -Djavax.net.ssl.trustStorePassword=$(TRUSTSTORE_PASSWORD) -Djavax.net.ssl.trustStoreType=PKCS12" \
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
