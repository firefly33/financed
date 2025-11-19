# Adding a New Feature

When adding a new feature to the Finance Manager, follow this workflow:

## Backend (Hexagonal Architecture)

### 1. Write BDD Feature First
Create a feature file in `backend/features/`:

```gherkin
Feature: Feature Name
  As a user
  I want to [do something]
  So that [achieve goal]

  Scenario: Scenario name
    Given [context]
    When [action]
    Then [outcome]
```

### 2. Domain Layer (Pure Business Logic)

**Create Entity** (`backend/src/domain/entities/`)
```typescript
export class YourEntity {
  constructor(
    public readonly id: string,
    public readonly field1: string,
    public readonly field2: number,
  ) {}
}
```

**Define Repository Interface** (`backend/src/domain/ports/`)
```typescript
export interface IYourRepository {
  findById(id: string): Promise<YourEntity | null>;
  create(data: Omit<YourEntity, 'id'>): Promise<YourEntity>;
}

export const YOUR_REPOSITORY = Symbol('IYourRepository');
```

### 3. Application Layer (Use Cases)

**Write Test First** (`backend/src/application/use-cases/your-use-case.spec.ts`)
```typescript
describe('YourUseCase', () => {
  it('should do something', async () => {
    // Arrange - set up mocks
    // Act - execute use case
    // Assert - verify results
  });
});
```

**Implement Use Case** (`backend/src/application/use-cases/`)
```typescript
@Injectable()
export class YourUseCase {
  constructor(
    @Inject(YOUR_REPOSITORY)
    private readonly repository: IYourRepository,
  ) {}

  async execute(input: InputDto): Promise<OutputDto> {
    // Business logic here
  }
}
```

### 4. Infrastructure Layer

**Implement Repository** (`backend/src/infrastructure/repositories/`)
```typescript
@Injectable()
export class InMemoryYourRepository implements IYourRepository {
  private items: YourEntity[] = [];

  async findById(id: string): Promise<YourEntity | null> {
    return this.items.find(item => item.id === id) || null;
  }

  async create(data: Omit<YourEntity, 'id'>): Promise<YourEntity> {
    const entity = new YourEntity(randomUUID(), ...data);
    this.items.push(entity);
    return entity;
  }
}
```

**Create Controller** (`backend/src/infrastructure/adapters/http/`)
```typescript
@Controller('your-route')
export class YourController {
  constructor(private readonly useCase: YourUseCase) {}

  @Post()
  async create(@Body() dto: CreateDto) {
    return this.useCase.execute(dto);
  }
}
```

### 5. Wire Everything in Module
Update `backend/src/app.module.ts`:
```typescript
@Module({
  controllers: [YourController],
  providers: [
    {
      provide: YOUR_REPOSITORY,
      useClass: InMemoryYourRepository,
    },
    YourUseCase,
  ],
})
```

## Frontend

### 1. Define Types
Create in `frontend/src/types/`:
```typescript
export interface YourType {
  id: string;
  field1: string;
  field2: number;
}
```

### 2. Create Service
In `frontend/src/services/`:
```typescript
export class YourService {
  async getData(id: string): Promise<YourType> {
    const response = await fetch(`${API_BASE_URL}/your-route/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }
}
```

### 3. Write Component Test
In `frontend/src/components/YourComponent.test.tsx`:
```typescript
describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

### 4. Create Component
In `frontend/src/components/YourComponent.tsx`:
```typescript
export function YourComponent() {
  const [data, setData] = useState<YourType | null>(null);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Your Title
      </h2>
      {/* Your UI with Tailwind classes */}
    </div>
  );
}
```

## Testing Workflow

1. **Backend Unit Tests**: `npm test` in backend/
2. **Backend BDD Tests**: `npm run test:bdd` in backend/
3. **Frontend Tests**: `npm test` in frontend/
4. **Manual Testing**: Use Docker containers for full integration

## Commit Workflow

1. Commit backend changes:
   ```bash
   git add backend/
   git commit -m "feat(backend): add [feature] with hexagonal architecture"
   ```

2. Commit frontend changes:
   ```bash
   git add frontend/
   git commit -m "feat(frontend): add [feature] component with Tailwind"
   ```

3. Commit tests:
   ```bash
   git add */tests/
   git commit -m "test: add tests for [feature]"
   ```

## Checklist

Backend:
- [ ] BDD feature file written
- [ ] Domain entity created
- [ ] Repository interface defined
- [ ] Use case with unit tests
- [ ] Repository implementation
- [ ] HTTP controller
- [ ] Registered in app.module.ts
- [ ] API endpoint tested with curl/Postman

Frontend:
- [ ] TypeScript types defined
- [ ] Service created
- [ ] Component test written
- [ ] Component implemented with Tailwind
- [ ] Component integrated in App
- [ ] UI tested in browser

Both:
- [ ] All tests passing
- [ ] Code follows project conventions
- [ ] Documentation updated if needed
- [ ] Conventional commit messages used
