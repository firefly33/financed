# Makefile for Finance Manager

.PHONY: help dev prod build up down logs clean install test

# Default target
help:
	@echo "Finance Manager - Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment with Docker"
	@echo "  make dev-build    - Build and start development environment"
	@echo "  make dev-logs     - Show development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment with Docker"
	@echo "  make prod-build   - Build and start production environment"
	@echo "  make prod-logs    - Show production logs"
	@echo ""
	@echo "General:"
	@echo "  make down         - Stop all containers"
	@echo "  make clean        - Stop and remove all containers, networks, and volumes"
	@echo "  make logs         - Show all logs"
	@echo "  make install      - Install dependencies locally"
	@echo "  make test         - Run tests"
	@echo ""

# Development commands
dev:
	docker-compose -f docker-compose.dev.yml up

dev-build:
	docker-compose -f docker-compose.dev.yml up --build

dev-logs:
	docker-compose -f docker-compose.dev.yml logs -f

# Production commands
prod:
	docker-compose up

prod-build:
	docker-compose up --build

prod-logs:
	docker-compose logs -f

# General commands
down:
	docker-compose -f docker-compose.dev.yml down
	docker-compose down

clean:
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
	docker-compose down -v --remove-orphans
	docker system prune -f

logs:
	docker-compose logs -f

# Local development without Docker
install:
	cd backend && npm install
	cd frontend && npm install

test:
	cd backend && npm run test
	cd frontend && npm run test

# Build individual services
build-backend:
	docker build -t finance-manager-backend ./backend

build-frontend:
	docker build -t finance-manager-frontend ./frontend

# Run individual services
run-backend:
	cd backend && npm run start:dev

run-frontend:
	cd frontend && npm run dev
