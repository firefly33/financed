# Quick Start Guide - Finance Manager

Get up and running in under 5 minutes!

## Prerequisites

Choose one of the following:

**Option 1: Docker (Recommended)**
- Docker Desktop installed
- No other prerequisites needed

**Option 2: Local Development**
- Node.js 18+ installed
- npm or yarn installed

## 🚀 Quick Start with Docker

### 1. Clone or navigate to the project
```bash
cd /path/to/financed
```

### 2. Start the application

**Development Mode (with hot reload):**
```bash
make dev-build
# OR
docker-compose -f docker-compose.dev.yml up --build
```

**Production Mode:**
```bash
make prod-build
# OR
docker-compose up --build
```

### 3. Access the application

**Development:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

**Production:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### 4. Stop the application
```bash
make down
# OR
docker-compose down
```

That's it! 🎉

## 🔧 Quick Start without Docker

### 1. Install dependencies

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### 2. Start both servers

**Terminal 1 - Backend:**
```bash
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 3. Access the application
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📝 First Steps

Once the application is running:

1. **Set a monthly spending limit:**
   - Use the API or create one via the UI (coming soon)
   - Example: POST to http://localhost:3000/spending-limits
   ```json
   {
     "userId": "user-123",
     "monthlyLimit": 1000,
     "month": 11,
     "year": 2025
   }
   ```

2. **Add your first expense:**
   - Fill out the "Add New Expense" form
   - Enter amount, description, category, and date
   - Click "Add Expense"

3. **View your spending:**
   - See your expenses in the table
   - Check your monthly summary
   - Monitor your remaining budget

## 🧪 Running Tests

**Backend:**
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:bdd         # BDD tests
```

**Frontend:**
```bash
cd frontend
npm test                 # Run all tests
npm run test:ui          # Interactive UI
```

**With Docker:**
```bash
docker-compose exec backend npm test
docker-compose exec frontend npm test
```

## 🎯 Useful Commands

### Docker (Make)
```bash
make help          # Show all commands
make dev           # Start development
make prod          # Start production
make down          # Stop containers
make clean         # Clean everything
make logs          # View logs
```

### Backend
```bash
npm run start:dev  # Development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Lint code
```

### Frontend
```bash
npm run dev        # Development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Lint code
```

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed information
- Check out [DOCKER.md](./DOCKER.md) for advanced Docker usage
- Explore the [API Endpoints](#) in the documentation
- Start implementing new features using TDD/BDD!

## 🆘 Troubleshooting

**Port already in use:**
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5173
lsof -i :5173
```

**Docker containers won't start:**
```bash
# Check logs
docker-compose logs

# Clean everything and rebuild
make clean
make dev-build
```

**Changes not reflecting (development):**
```bash
# Restart the containers
docker-compose restart

# Or rebuild
docker-compose up --build
```

**Node modules issues:**
```bash
# Remove node_modules and reinstall
rm -rf backend/node_modules frontend/node_modules
cd backend && npm install
cd ../frontend && npm install
```

## 💡 Pro Tips

1. **Use hot reload:** Development mode automatically reloads on code changes
2. **Check logs:** Use `make logs` or `docker-compose logs -f` to monitor
3. **Run tests:** Always run tests before committing (`npm test`)
4. **Use Make:** If you have Make, it simplifies all commands
5. **Read the docs:** Check README.md for comprehensive information

## 🎉 Happy Coding!

You're all set! Start building your finance tracking features with TDD and BDD practices.
