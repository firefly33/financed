# Finance Manager - Project Context

## Project Overview

This is a full-stack finance management application for tracking monthly expenses and spending limits. The project follows Test-Driven Development (TDD) and Behavior-Driven Development (BDD) practices.

## Architecture

### Backend (NestJS)
- **Architecture Pattern**: Hexagonal Architecture (Ports & Adapters)
- **Framework**: NestJS with TypeScript
- **Testing**: Jest (unit tests) + Cucumber (BDD)
- **Data Storage**: In-memory repositories (designed for easy database integration)

**Directory Structure:**
```
backend/src/
├── domain/              # Core business logic
│   ├── entities/        # Business entities
│   └── ports/          # Repository interfaces
├── application/         # Use cases
│   └── use-cases/      # Business logic orchestration
└── infrastructure/      # External concerns
    ├── adapters/       # HTTP controllers
    └── repositories/   # Data persistence implementations
```

**Key Principles:**
- Domain layer is pure business logic with no external dependencies
- Application layer orchestrates domain logic
- Infrastructure depends on domain (dependency inversion)
- All repositories implement interfaces from domain/ports

### Frontend (React + Vite)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: TanStack Query for server state
- **Testing**: Vitest + React Testing Library

**Directory Structure:**
```
frontend/src/
├── components/      # React components
├── services/        # API clients (all API calls go here)
├── hooks/          # Custom React hooks
├── types/          # TypeScript interfaces
└── test/           # Test utilities
```

**Frontend Rules:**
1. **Custom Hooks**: Extract reusable logic into custom hooks
2. **TanStack Query**: Use for all async server data (fetching, caching, mutations)
3. **Services**: All API calls must be in Service files (e.g., expense.service.ts)
4. **No Direct Fetch**: Components should never call fetch/axios directly
5. **Hook Naming**: Custom hooks must start with `use` (e.g., useExpenses)

**Design System:**
- Color scheme: Slate/Blue
- Responsive grid layout
- Color-coded budget indicators (green = healthy, red = over-budget)

## Development Practices

### TDD (Test-Driven Development)
1. Write failing test first
2. Write minimal code to pass test
3. Refactor while keeping tests green

### BDD (Behavior-Driven Development)
- Feature files in `backend/features/`
- Cucumber for acceptance tests
- Focus on user behavior and business value

## Docker Setup

### Development
```bash
make dev-build    # or docker-compose -f docker-compose.dev.yml up --build
```
- Hot reload enabled
- Volume mounts for instant updates
- Ports: Frontend 5173, Backend 3000

### Production
```bash
make prod-build   # or docker-compose up --build
```
- Multi-stage builds
- Optimized images (Backend ~150MB, Frontend ~25MB)
- Nginx serves frontend
- Ports: Frontend 8080, Backend 3000

## API Endpoints

### Expenses
- `POST /expenses` - Create new expense
- `GET /expenses?userId={id}&month={month}&year={year}` - Get monthly expenses
- `GET /expenses/summary?userId={id}&month={month}&year={year}` - Get spending summary

### Spending Limits
- `POST /spending-limits` - Set monthly spending limit

## Common Tasks

### Running Locally (without Docker)
```bash
# Backend
cd backend && npm install && npm run start:dev

# Frontend
cd frontend && npm install && npm run dev
```

### Running with Docker
```bash
make dev          # Start development
make down         # Stop containers
make logs         # View logs
make clean        # Clean everything
```

### Testing
```bash
# Backend
cd backend
npm test              # Unit tests
npm run test:bdd      # BDD tests
npm run test:watch    # Watch mode

# Frontend
cd frontend
npm test              # Unit tests
npm run test:ui       # Interactive UI
```

### Adding New Features

**Backend (Hexagonal Architecture):**
1. Create entity in `domain/entities/`
2. Define repository interface in `domain/ports/`
3. Create use case in `application/use-cases/`
4. Implement repository in `infrastructure/repositories/`
5. Create controller in `infrastructure/adapters/http/`
6. Register in `app.module.ts`

**Frontend:**
1. Define TypeScript types in `types/`
2. Create service in `services/`
3. Build component in `components/`
4. Style with Tailwind CSS classes
5. Write tests in `.test.tsx` files

## Technology Versions

- Node.js: 20 (Alpine in Docker)
- React: 19
- NestJS: 11
- Vite: 7
- Tailwind CSS: 4
- TypeScript: 5.9

## Code Style

### Backend
- Use dependency injection
- Follow hexagonal architecture
- Keep domain logic pure
- Use `type` imports for interfaces
- Conventional commits format

### Frontend
- Functional components with hooks
- TypeScript for type safety
- Tailwind for all styling
- Component composition
- Props typing with interfaces

## Git Workflow

- **Main branch**: Production-ready code
- **Commit format**: Conventional commits (feat:, fix:, chore:, etc.)
- **Co-authored by**: Claude included in commits

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Category management
- [ ] Data visualization (charts)
- [ ] Export to CSV/PDF
- [ ] Recurring expenses
- [ ] Budget alerts
- [ ] Mobile responsive improvements

## Important Files

- `README.md` - Complete documentation
- `QUICKSTART.md` - 5-minute setup guide
- `DOCKER.md` - Docker comprehensive guide
- `Makefile` - Convenient commands
- `docker-compose.yml` - Production config
- `docker-compose.dev.yml` - Development config

## Notes for Claude

- Always follow TDD/BDD practices
- Maintain hexagonal architecture in backend
- Use Tailwind CSS for all styling
- Keep domain layer pure (no external dependencies)
- Write tests before implementation
- Use conventional commit format
- Include Co-Authored-By: Claude in commits
- Prefer editing existing files over creating new ones
