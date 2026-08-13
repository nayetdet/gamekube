.PHONY: up build update format check

GRADLE := ./gradlew

up:
	$(GRADLE) bootRun

build:
	$(GRADLE) build

update:
	$(GRADLE) build --refresh-dependencies

format:
	$(GRADLE) spotlessApply

check:
	$(GRADLE) spotlessCheck test
