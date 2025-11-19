# Docker Guide - Finance Manager

This guide provides comprehensive information about running the Finance Manager application with Docker.

## Overview

The Finance Manager application is fully containerized with support for both development and production environments.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) Make utility for simplified commands

## Architecture

### Production Configuration

**Backend Container:**
- Base image: `node:20-alpine`
- Multi-stage build for optimized image size
- Only production dependencies included
- Runs compiled JavaScript

**Frontend Container:**
- Base image: `nginx:alpine`
- Multi-stage build
- Nginx serves static files
- Optimized for production delivery

### Development Configuration

**Backend Container:**
- Base image: `node:20-alpine`
- All dependencies (including dev)
- Hot reload with volume mounts
- Source code changes reflect immediately

**Frontend Container:**
- Base image: `node:20-alpine`
- Vite dev server with HMR
- Volume mounts for instant updates
- Development optimizations enabled

## Quick Start

### Production Mode

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3000

3. **Stop the services:**
   ```bash
   docker-compose down
   ```

### Development Mode

1. **Build and start development services:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

3. **Stop the services:**
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Using Make Commands

If you have Make installed, you can use these convenient shortcuts:

```bash
# Show all available commands
make help

# Development
make dev              # Start development environment
make dev-build        # Build and start development environment
make dev-logs         # Show development logs

# Production
make prod             # Start production environment
make prod-build       # Build and start production environment
make prod-logs        # Show production logs

# General
make down             # Stop all containers
make clean            # Stop containers and clean up volumes
make logs             # Show logs from all services
```

## Detailed Commands

### Building Images

**Build production images:**
```bash
# All services
docker-compose build

# Individual services
docker-compose build backend
docker-compose build frontend
```

**Build development images:**
```bash
# All services
docker-compose -f docker-compose.dev.yml build

# Individual services
docker-compose -f docker-compose.dev.yml build backend
docker-compose -f docker-compose.dev.yml build frontend
```

### Running Containers

**Run in foreground (see logs):**
```bash
# Production
docker-compose up

# Development
docker-compose -f docker-compose.dev.yml up
```

**Run in background (detached mode):**
```bash
# Production
docker-compose up -d

# Development
docker-compose -f docker-compose.dev.yml up -d
```

**Run specific service:**
```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend
```

### Viewing Logs

**Follow logs from all services:**
```bash
docker-compose logs -f
```

**Follow logs from specific service:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**View last N lines:**
```bash
docker-compose logs --tail=100 backend
```

### Stopping and Cleaning Up

**Stop services (preserve containers):**
```bash
docker-compose stop
```

**Stop and remove containers:**
```bash
docker-compose down
```

**Stop, remove containers, and volumes:**
```bash
docker-compose down -v
```

**Remove all Docker resources (containers, networks, volumes, images):**
```bash
docker-compose down -v --rmi all
```

### Executing Commands in Containers

**Run commands in running containers:**
```bash
# Backend shell
docker-compose exec backend sh

# Frontend shell
docker-compose exec frontend sh

# Run tests in backend
docker-compose exec backend npm test

# Run tests in frontend
docker-compose exec frontend npm test
```

**Run one-off commands:**
```bash
# Install new package in backend
docker-compose run --rm backend npm install package-name

# Run specific test file
docker-compose run --rm backend npm test -- specific-file.spec.ts
```

## Environment Variables

Create a `.env` file in the root directory to customize configuration:

```env
# Backend
BACKEND_PORT=3000
NODE_ENV=production

# Frontend
FRONTEND_PORT=8080
VITE_API_URL=http://localhost:3000
```

## Volume Mounts (Development)

In development mode, the following directories are mounted:

**Backend:**
- `./backend:/app` - Source code
- `/app/node_modules` - Node modules (cached)

**Frontend:**
- `./frontend:/app` - Source code
- `/app/node_modules` - Node modules (cached)

This allows for hot reloading without rebuilding the container.

## Networking

Both configurations use a bridge network (`finance-network`) that allows containers to communicate:

- Backend is accessible at `http://backend:3000` from within the network
- Frontend is accessible at `http://frontend` from within the network

## Troubleshooting

### Port Already in Use

If you get a port conflict error:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process or change the port in docker-compose.yml
```

### Container Won't Start

Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Changes Not Reflecting (Development)

1. Ensure volumes are mounted correctly
2. Restart the container:
   ```bash
   docker-compose -f docker-compose.dev.yml restart
   ```

### Clean Build

Remove everything and rebuild:
```bash
# Stop and remove containers
docker-compose down -v

# Remove images
docker rmi finance-manager-backend finance-manager-frontend

# Rebuild
docker-compose up --build
```

### Node Modules Issues

If you encounter issues with node_modules:

```bash
# Remove volumes
docker-compose down -v

# Rebuild with no cache
docker-compose build --no-cache

# Start fresh
docker-compose up
```

## Performance Optimization

### Production

1. **Multi-stage builds** reduce final image size
2. **Alpine Linux** base images are minimal
3. **Only production dependencies** are installed
4. **Nginx** serves static files efficiently

### Development

1. **Volume mounts** for instant code updates
2. **Node modules cached** in volumes for faster rebuilds
3. **Hot Module Replacement** enabled for Vite

## Security Considerations

1. **No secrets in images** - Use environment variables
2. **Non-root user** should be configured for production
3. **Security headers** configured in Nginx
4. **Network isolation** via Docker networks
5. **Read-only file systems** where possible

## CI/CD Integration

Example GitHub Actions workflow:

```yaml
name: Docker Build and Test

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build images
        run: docker-compose build

      - name: Run tests
        run: |
          docker-compose run backend npm test
          docker-compose run frontend npm test

      - name: Push to registry
        run: |
          docker-compose push
```

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker Guide](https://docs.nestjs.com/recipes/docker)
- [Vite Docker Guide](https://vitejs.dev/guide/build.html)
