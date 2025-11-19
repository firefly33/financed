# Finance Manager - Project Summary

## What This Project Does

A full-stack web application for tracking personal finances:
- Track monthly expenses with categories
- Set monthly spending limits
- View spending summaries with budget status
- Monitor budget health with visual indicators

## Technology Stack

**Backend:**
- NestJS (Node.js framework)
- TypeScript
- Hexagonal Architecture
- In-memory data storage
- Jest + Cucumber for testing

**Frontend:**
- React 19
- Vite (build tool)
- Tailwind CSS
- TypeScript
- Vitest for testing

**DevOps:**
- Docker (development + production)
- Docker Compose
- GitHub repository

## Project Structure

```
financed/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── domain/            # Business entities & interfaces
│   │   ├── application/       # Use cases
│   │   └── infrastructure/    # Controllers & repositories
│   ├── features/              # BDD test scenarios
│   └── test/                  # E2E tests
│
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── services/          # API clients
│   │   ├── types/             # TypeScript types
│   │   └── test/              # Test utilities
│   └── public/                # Static assets
│
├── .claude/                    # Claude AI context
│   ├── README.md              # Project overview
│   └── prompts/               # Development guides
│
├── docker-compose.yml          # Production setup
├── docker-compose.dev.yml      # Development setup
├── Makefile                    # Convenience commands
├── README.md                   # Full documentation
├── QUICKSTART.md              # Setup guide
└── DOCKER.md                  # Docker guide
```

## Key Concepts

### Hexagonal Architecture (Backend)

**Domain Layer** - Pure business logic:
- Entities: Core business objects (Expense, SpendingLimit)
- Ports: Interfaces for external systems (repositories)

**Application Layer** - Business workflows:
- Use Cases: Specific business operations
- DTOs: Data transfer objects

**Infrastructure Layer** - Technical implementation:
- Adapters: HTTP controllers, database implementations
- Repositories: Data persistence

**Benefits:**
- Testable: Domain logic has no external dependencies
- Flexible: Easy to swap implementations
- Maintainable: Clear separation of concerns

### Test-Driven Development (TDD)

1. Write failing test
2. Write minimum code to pass
3. Refactor
4. Repeat

### Behavior-Driven Development (BDD)

- Write features in plain English (Gherkin)
- Executable specifications
- Tests as documentation

## Current Features

✅ Expense tracking
✅ Monthly spending limits
✅ Spending summaries
✅ Budget monitoring
✅ RESTful API
✅ Responsive UI
✅ Docker support
✅ Testing infrastructure

## API Endpoints

```
POST   /expenses                 Create expense
GET    /expenses                 Get monthly expenses
GET    /expenses/summary         Get spending summary
POST   /spending-limits          Set monthly limit
```

## Running the Project

**Quick Start (Docker):**
```bash
make dev-build    # Start development environment
```

**Manual Start:**
```bash
# Terminal 1 - Backend
cd backend && npm install && npm run start:dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Development Workflow

1. **Plan** - Define feature with BDD scenario
2. **Test** - Write failing tests (TDD)
3. **Implement** - Write minimal code to pass
4. **Refactor** - Improve while keeping tests green
5. **Review** - Check architecture compliance
6. **Commit** - Use conventional commits
7. **Push** - To GitHub

## Testing

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

## Code Quality Standards

- **TypeScript**: Strict typing, no `any`
- **Testing**: TDD/BDD practices
- **Architecture**: Hexagonal in backend
- **Styling**: Tailwind CSS only
- **Commits**: Conventional format
- **Security**: No secrets, input validation

## Future Roadmap

- [ ] PostgreSQL/MongoDB integration
- [ ] User authentication
- [ ] Category management
- [ ] Data visualization (charts)
- [ ] Export (CSV/PDF)
- [ ] Recurring expenses
- [ ] Budget alerts
- [ ] Mobile app

## Performance

**Backend:**
- ~150MB Docker image (production)
- In-memory storage (millisecond queries)
- Designed for easy database integration

**Frontend:**
- ~25MB Docker image (production)
- Vite for fast dev server
- Code splitting ready

## Repository

**GitHub:** git@github.com:firefly33/financed.git
**Branch:** main
**Commits:** Conventional format with Co-authored-by Claude

## Quick Reference

**Start dev:** `make dev-build`
**Stop:** `make down`
**Clean:** `make clean`
**Logs:** `make logs`
**Test backend:** `cd backend && npm test`
**Test frontend:** `cd frontend && npm test`

## Help Resources

- `README.md` - Complete documentation
- `QUICKSTART.md` - 5-minute setup
- `DOCKER.md` - Docker guide
- `.claude/README.md` - This file
- `.claude/prompts/` - Development guides
