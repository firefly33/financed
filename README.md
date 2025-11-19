# Finance Manager

A full-stack web application for tracking monthly expenses and spending limits, built with modern technologies and best practices including Test-Driven Development (TDD) and Behavior-Driven Development (BDD).

## 📚 Documentation

- **[Quick Start Guide](./QUICKSTART.md)** - Get up and running in under 5 minutes
- **[Docker Guide](./DOCKER.md)** - Comprehensive Docker documentation
- **[This README](#)** - Complete project documentation

## Project Structure

```
financed/
├── backend/           # NestJS backend with Hexagonal Architecture
└── frontend/          # React + Vite frontend with Tailwind CSS
```

## Technology Stack

### Backend
- **Framework**: NestJS
- **Architecture**: Hexagonal (Ports & Adapters)
- **Language**: TypeScript
- **Testing**: Jest (unit tests), Cucumber (BDD/E2E tests)
- **Data Storage**: In-memory repositories (easily replaceable with real databases)

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Testing**: Vitest, React Testing Library, Cucumber

## Features

- Track monthly expenses with categories
- Set monthly spending limits
- View spending summary with:
  - Total spent
  - Monthly limit
  - Remaining budget
  - Percentage used
- Real-time budget status with visual indicators
- Responsive design with Tailwind CSS

## Getting Started

You can run this application either with Docker (recommended) or locally with Node.js.

### Option 1: Docker (Recommended)

#### Prerequisites

- Docker
- Docker Compose

#### Quick Start with Docker

**Development Mode** (with hot reload):
```bash
# Using docker-compose
docker-compose -f docker-compose.dev.yml up --build

# Or using make
make dev-build
```

**Production Mode**:
```bash
# Using docker-compose
docker-compose up --build

# Or using make
make prod-build
```

The application will be available at:
- **Frontend**: http://localhost:5173 (dev) or http://localhost:8080 (prod)
- **Backend**: http://localhost:3000

#### Docker Commands

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
make clean            # Clean up everything
```

### Option 2: Local Setup

#### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Development Practices

### Test-Driven Development (TDD)

This project follows TDD principles. Write tests before implementing features.

**Backend TDD workflow:**
```bash
cd backend
npm run test:watch    # Run tests in watch mode
```

**Frontend TDD workflow:**
```bash
cd frontend
npm run test          # Run tests
npm run test:ui       # Run tests with UI
```

### Behavior-Driven Development (BDD)

BDD scenarios are written using Cucumber for both backend and frontend.

**Backend BDD:**
```bash
cd backend
npm run test:bdd      # Run Cucumber tests
```

Feature files are located in `backend/features/`

## Backend Architecture

The backend follows **Hexagonal Architecture** (also known as Ports & Adapters):

```
backend/src/
├── domain/                    # Core business logic
│   ├── entities/              # Domain entities
│   │   ├── expense.entity.ts
│   │   └── spending-limit.entity.ts
│   └── ports/                 # Interface definitions
│       ├── expense.repository.interface.ts
│       └── spending-limit.repository.interface.ts
├── application/               # Use cases (application logic)
│   └── use-cases/
│       ├── create-expense.use-case.ts
│       ├── get-monthly-expenses.use-case.ts
│       └── get-spending-summary.use-case.ts
└── infrastructure/            # External concerns
    ├── adapters/
    │   └── http/              # REST API controllers
    │       ├── expense.controller.ts
    │       └── spending-limit.controller.ts
    └── repositories/          # Data persistence
        ├── in-memory-expense.repository.ts
        └── in-memory-spending-limit.repository.ts
```

### Key Principles

- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Orchestrates domain logic via use cases
- **Infrastructure Layer**: Implements technical details (HTTP, database, etc.)
- **Dependency Inversion**: Infrastructure depends on domain, not vice versa

## Docker Architecture

The project includes both production and development Docker configurations:

### Production Setup
- **Backend**: Multi-stage build with Node.js Alpine, optimized production image
- **Frontend**: Multi-stage build with Nginx for serving static files
- **Networking**: Bridge network for container communication
- **Ports**:
  - Frontend: 8080 → 80 (Nginx)
  - Backend: 3000 → 3000

### Development Setup
- **Hot Reload**: Volume mounts for live code updates
- **Ports**:
  - Frontend: 5173 (Vite dev server)
  - Backend: 3000 (NestJS dev server)
- **Dependencies**: Cached in volumes for faster rebuilds

### Docker Files Structure
```
financed/
├── docker-compose.yml           # Production configuration
├── docker-compose.dev.yml       # Development configuration
├── Makefile                     # Convenience commands
├── backend/
│   ├── Dockerfile              # Production build
│   ├── Dockerfile.dev          # Development build
│   └── .dockerignore
└── frontend/
    ├── Dockerfile              # Production build with Nginx
    ├── Dockerfile.dev          # Development build with Vite
    ├── nginx.conf              # Nginx configuration
    └── .dockerignore
```

## API Endpoints

### Expenses

- `POST /expenses` - Create a new expense
  ```json
  {
    "amount": 50.00,
    "description": "Groceries",
    "category": "Food",
    "date": "2025-01-15",
    "userId": "user-123"
  }
  ```

- `GET /expenses?userId={id}&month={month}&year={year}` - Get monthly expenses

- `GET /expenses/summary?userId={id}&month={month}&year={year}` - Get spending summary

### Spending Limits

- `POST /spending-limits` - Create/update monthly spending limit
  ```json
  {
    "userId": "user-123",
    "monthlyLimit": 1000.00,
    "month": 1,
    "year": 2025
  }
  ```

## Testing

### Backend Tests

**Unit Tests:**
```bash
cd backend
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:cov          # With coverage
```

**E2E Tests:**
```bash
npm run test:e2e
```

**BDD Tests:**
```bash
npm run test:bdd
```

### Frontend Tests

**Unit/Component Tests:**
```bash
cd frontend
npm run test              # Run tests
npm run test:ui           # Interactive UI
npm run test:coverage     # With coverage
```

## Scripts Reference

### Backend

- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:bdd` - Run BDD tests with Cucumber
- `npm run lint` - Lint the code

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Lint the code

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Multiple users support
- [ ] Category management
- [ ] Budget alerts and notifications
- [ ] Data visualization (charts and graphs)
- [ ] Export data to CSV/PDF
- [ ] Recurring expenses
- [ ] Mobile app

## Contributing

1. Follow TDD/BDD practices
2. Write tests before implementing features
3. Maintain the hexagonal architecture in the backend
4. Use Tailwind CSS for styling
5. Ensure all tests pass before committing

## License

This project is for educational purposes.
