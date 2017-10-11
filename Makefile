.PHONY: build

default: build

build:
	docker build -t skbkontur/contrails.web:latest .
