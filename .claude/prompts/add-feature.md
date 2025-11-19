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

export interface CreateYourTypeDto {
  field1: string;
  field2: number;
}
```

### 2. Create Service (API Layer)
**IMPORTANT:** All API calls must be in Service files

In `frontend/src/services/your.service.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class YourService {
  // GET request
  async getById(id: string): Promise<YourType> {
    const response = await fetch(`${API_BASE_URL}/your-route/${id}`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }

  // GET list
  async getAll(): Promise<YourType[]> {
    const response = await fetch(`${API_BASE_URL}/your-route`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }

  // POST request
  async create(data: CreateYourTypeDto): Promise<YourType> {
    const response = await fetch(`${API_BASE_URL}/your-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  }
}

export const yourService = new YourService();
```

### 3. Create Custom Hook with TanStack Query
**IMPORTANT:** Use TanStack Query for all server data

In `frontend/src/hooks/useYourData.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { yourService } from '../services/your.service';
import type { YourType, CreateYourTypeDto } from '../types/your';

// Query hook for fetching data
export function useYourData(id: string) {
  return useQuery({
    queryKey: ['yourData', id],
    queryFn: () => yourService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Query hook for fetching list
export function useYourDataList() {
  return useQuery({
    queryKey: ['yourDataList'],
    queryFn: () => yourService.getAll(),
  });
}

// Mutation hook for creating data
export function useCreateYourData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateYourTypeDto) => yourService.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['yourDataList'] });
    },
  });
}
```

### 4. Write Component Test
In `frontend/src/components/YourComponent.test.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('YourComponent', () => {
  it('should fetch data', async () => {
    const { result } = renderHook(() => useYourData('123'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

### 5. Create Component
**IMPORTANT:** Use custom hooks, never call services directly

In `frontend/src/components/YourComponent.tsx`:
```typescript
import { useYourDataList, useCreateYourData } from '../hooks/useYourData';

export function YourComponent() {
  const { data, isLoading, error } = useYourDataList();
  const createMutation = useCreateYourData();

  const handleCreate = async (formData: CreateYourTypeDto) => {
    await createMutation.mutateAsync(formData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Your Title
      </h2>
      {/* Your UI with Tailwind classes */}
      {data?.map(item => (
        <div key={item.id}>{item.field1}</div>
      ))}
    </div>
  );
}
```

### 6. Setup QueryClient (if not already done)
In `frontend/src/main.tsx`:
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
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
