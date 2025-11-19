# Troubleshooting Guide

Common issues and their solutions for the Finance Manager project.

## Backend Issues

### Backend Won't Start

**Symptom:** NestJS fails to start or crashes
**Check:**
1. TypeScript compilation errors
   ```bash
   cd backend && npm run build
   ```
2. Missing dependencies
   ```bash
   cd backend && npm install
   ```
3. Port 3000 already in use
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```
4. Module wiring issues (check app.module.ts)

**Solution:**
- Fix TypeScript errors
- Ensure all providers are registered in app.module.ts
- Use `type` imports for interfaces with @Inject decorators

### Tests Failing

**Symptom:** Jest tests fail
**Check:**
1. Mock implementations correct
2. Async/await handled properly
3. Test isolation (each test independent)
4. Module dependencies properly injected

**Solution:**
```typescript
// Ensure mocks are properly typed
const mockRepository: jest.Mocked<IRepository> = {
  method: jest.fn(),
};

// Use proper async handling
await expect(useCase.execute()).rejects.toThrow();
```

### API Returns 404

**Symptom:** Endpoint not found
**Check:**
1. Controller registered in app.module.ts
2. Route path correct
3. HTTP method matches (@Get, @Post, etc.)
4. CORS enabled in main.ts

## Frontend Issues

### Frontend Won't Build

**Symptom:** Vite build fails
**Check:**
1. TypeScript errors
   ```bash
   cd frontend && npm run build
   ```
2. Missing dependencies
3. Import paths correct
4. Environment variables set

**Solution:**
- Fix TypeScript errors
- Ensure all imports use correct paths
- Check tsconfig.json configuration

### API Calls Fail

**Symptom:** Network errors or CORS issues
**Check:**
1. Backend is running
2. API URL correct (VITE_API_URL)
3. CORS enabled in backend
4. Network connectivity

**Solution:**
```typescript
// Check .env file
VITE_API_URL=http://localhost:3000

// Verify CORS in backend/src/main.ts
app.enableCors();
```

### Styling Not Working

**Symptom:** Tailwind classes not applied
**Check:**
1. Tailwind imported in index.css
2. tailwind.config.js configured
3. Content paths correct
4. PostCSS configured

**Solution:**
```css
/* Ensure in index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Docker Issues

### Containers Won't Start

**Symptom:** Docker compose fails
**Check:**
1. Docker daemon running
2. Port conflicts
3. Image build errors
4. Volume mount permissions

**Solution:**
```bash
# Check Docker status
docker ps

# Remove old containers
make clean

# Rebuild from scratch
docker-compose build --no-cache
```

### Hot Reload Not Working

**Symptom:** Code changes not reflecting
**Check:**
1. Volume mounts correct in docker-compose.dev.yml
2. node_modules not overridden
3. Container restarted after package.json changes

**Solution:**
```bash
# Restart containers
docker-compose restart

# Rebuild if package.json changed
docker-compose up --build
```

### Container Crashes

**Symptom:** Container exits immediately
**Check:**
1. Logs for errors
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```
2. Entry point/command correct
3. Dependencies installed
4. Port conflicts

## Database Issues (Future)

### Connection Fails

**Check:**
1. Database container running
2. Connection string correct
3. Network connectivity
4. Credentials valid

**Solution:**
```typescript
// Use environment variables
const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  // ...
};
```

## Testing Issues

### BDD Tests Fail

**Symptom:** Cucumber scenarios fail
**Check:**
1. Step definitions implemented
2. Feature files syntax correct
3. Application running for E2E tests
4. Test data setup/teardown

**Solution:**
- Implement missing step definitions
- Check feature file syntax
- Ensure proper test isolation

### Test Coverage Low

**Check:**
1. All use cases tested
2. Edge cases covered
3. Error scenarios tested
4. Integration tests present

## Performance Issues

### Slow Build Times

**Solution:**
```bash
# Use Docker build cache
docker-compose build

# Clean node_modules if corrupted
rm -rf node_modules package-lock.json
npm install
```

### Slow Runtime

**Check:**
1. Development mode (not production build)
2. Too many re-renders (React)
3. Memory leaks
4. Unnecessary computations

## Git Issues

### Push Rejected

**Check:**
1. Branch up to date
2. Authentication configured
3. Remote URL correct

**Solution:**
```bash
git pull --rebase origin main
git push origin main
```

## Quick Diagnostic Commands

```bash
# Backend health
curl http://localhost:3000/expenses/summary?userId=test&month=1&year=2025

# Frontend health
curl http://localhost:5173

# Docker status
docker ps
docker-compose logs --tail=50

# Test status
cd backend && npm test
cd frontend && npm test

# Port usage
lsof -i :3000
lsof -i :5173

# Clean slate
make clean
rm -rf backend/node_modules frontend/node_modules
make dev-build
```

## Getting Help

1. Check error messages carefully
2. Review relevant documentation (README, DOCKER.md)
3. Check Docker logs
4. Verify all environment variables
5. Try clean rebuild
6. Check Git commit history for recent changes
