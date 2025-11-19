# Frontend Development Rules

## Core Principles

### 1. Custom Hooks for Reusable Logic

**Rule:** Extract all reusable logic into custom hooks.

**Good:**
```typescript
// hooks/useExpenses.ts
export function useExpenses(userId: string, month: number, year: number) {
  return useQuery({
    queryKey: ['expenses', userId, month, year],
    queryFn: () => expenseService.getMonthlyExpenses(userId, month, year),
  });
}

// Component
function ExpenseList() {
  const { data: expenses, isLoading } = useExpenses('user-123', 1, 2025);
  // ...
}
```

**Bad:**
```typescript
// ❌ Logic directly in component
function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    fetch('/api/expenses').then(/* ... */);
  }, []);
}
```

### 2. TanStack Query for All Server Data

**Rule:** Use TanStack Query for ALL async server operations (GET, POST, PUT, DELETE).

**Why:**
- Automatic caching
- Background refetching
- Optimistic updates
- Request deduplication
- Loading/error states

**Queries (GET):**
```typescript
export function useExpenses(userId: string) {
  return useQuery({
    queryKey: ['expenses', userId],
    queryFn: () => expenseService.getAll(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}
```

**Mutations (POST, PUT, DELETE):**
```typescript
export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpenseDto) => expenseService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error) => {
      // Handle error
    },
  });
}
```

**Usage in Component:**
```typescript
function ExpenseForm() {
  const createExpense = useCreateExpense();

  const handleSubmit = async (data: CreateExpenseDto) => {
    await createExpense.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {createExpense.isPending && <span>Saving...</span>}
      {createExpense.isError && <span>Error!</span>}
    </form>
  );
}
```

### 3. All API Calls in Service Files

**Rule:** ALL API calls must be in Service files. Components and hooks should NEVER call fetch/axios directly.

**File Structure:**
```
frontend/src/services/
├── expense.service.ts
├── spending-limit.service.ts
└── api.config.ts  // shared config
```

**Service Template:**
```typescript
// services/expense.service.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class ExpenseService {
  private baseUrl = `${API_BASE_URL}/expenses`;

  async getAll(userId: string): Promise<Expense[]> {
    const response = await fetch(`${this.baseUrl}?userId=${userId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch expenses: ${response.statusText}`);
    }
    return response.json();
  }

  async create(data: CreateExpenseDto): Promise<Expense> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to create expense: ${response.statusText}`);
    }
    return response.json();
  }

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update expense: ${response.statusText}`);
    }
    return response.json();
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete expense: ${response.statusText}`);
    }
  }
}

export const expenseService = new ExpenseService();
```

## Architecture Layers

```
┌─────────────────────────────────────┐
│         Components                   │  ← UI Layer
│  - Only presentation logic           │
│  - Use hooks for data                │
│  - Tailwind for styling              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Custom Hooks                 │  ← Logic Layer
│  - useExpenses, useCreateExpense     │
│  - TanStack Query hooks              │
│  - Reusable business logic           │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Services                     │  ← API Layer
│  - expenseService                    │
│  - All fetch/axios calls             │
│  - Error handling                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Backend API                  │
└─────────────────────────────────────┘
```

## Naming Conventions

### Hooks
- **Must** start with `use`
- **Should** describe what they do
- Examples:
  - `useExpenses()`
  - `useCreateExpense()`
  - `useSpendingSummary()`
  - `useDebounce()`

### Services
- **Must** end with `.service.ts`
- **Should** be a class with methods
- Export instance: `export const expenseService = new ExpenseService()`
- Examples:
  - `expense.service.ts`
  - `auth.service.ts`

### Components
- **PascalCase** for files and exports
- Examples:
  - `ExpenseForm.tsx`
  - `SpendingSummary.tsx`

## Complete Example

### 1. Service Layer
```typescript
// services/expense.service.ts
export class ExpenseService {
  async getMonthlyExpenses(
    userId: string,
    month: number,
    year: number,
  ): Promise<Expense[]> {
    const response = await fetch(
      `${API_BASE_URL}/expenses?userId=${userId}&month=${month}&year=${year}`,
    );
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  }

  async create(data: CreateExpenseDto): Promise<Expense> {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  }
}

export const expenseService = new ExpenseService();
```

### 2. Custom Hooks Layer
```typescript
// hooks/useExpenses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '../services/expense.service';

export function useMonthlyExpenses(
  userId: string,
  month: number,
  year: number,
) {
  return useQuery({
    queryKey: ['expenses', userId, month, year],
    queryFn: () => expenseService.getMonthlyExpenses(userId, month, year),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
```

### 3. Component Layer
```typescript
// components/ExpenseList.tsx
import { useMonthlyExpenses } from '../hooks/useExpenses';

export function ExpenseList({ userId, month, year }: Props) {
  const { data: expenses, isLoading, error } = useMonthlyExpenses(
    userId,
    month,
    year,
  );

  if (isLoading) return <div className="text-gray-500">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      {expenses?.map((expense) => (
        <div key={expense.id}>{expense.description}</div>
      ))}
    </div>
  );
}
```

## TanStack Query Best Practices

### Query Keys
```typescript
// Use arrays for query keys
queryKey: ['expenses']                          // all expenses
queryKey: ['expenses', userId]                  // user's expenses
queryKey: ['expenses', userId, month, year]     // monthly expenses
queryKey: ['expense', expenseId]                // single expense
```

### Stale Time
```typescript
// How long data is considered fresh
useQuery({
  staleTime: 5 * 60 * 1000, // 5 minutes
  // or
  staleTime: Infinity, // never stale
  // or
  staleTime: 0, // always stale (refetch immediately)
});
```

### Cache Time (gcTime in v5+)
```typescript
// How long unused data stays in cache
useQuery({
  gcTime: 10 * 60 * 1000, // 10 minutes
});
```

### Optimistic Updates
```typescript
export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => expenseService.update(id, data),
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['expenses'] });

      // Snapshot previous value
      const previous = queryClient.getQueryData(['expenses']);

      // Optimistically update
      queryClient.setQueryData(['expenses'], (old) => {
        return old.map((exp) =>
          exp.id === variables.id ? { ...exp, ...variables.data } : exp
        );
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['expenses'], context.previous);
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
```

## Common Patterns

### Loading States
```typescript
const { data, isLoading, isFetching, isError } = useQuery(/* ... */);

// isLoading: true on first fetch
// isFetching: true on any fetch (including background)
// isError: true if error occurred
```

### Dependent Queries
```typescript
const { data: user } = useUser(userId);
const { data: expenses } = useExpenses(user?.id, {
  enabled: !!user?.id, // only run if user.id exists
});
```

### Parallel Queries
```typescript
function Dashboard() {
  const expenses = useExpenses();
  const summary = useSpendingSummary();
  const limits = useSpendingLimits();

  // All fetch in parallel automatically
}
```

## Testing with TanStack Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useExpenses', () => {
  it('should fetch expenses', async () => {
    const { result } = renderHook(() => useExpenses('user-123'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(5);
  });
});
```

## Checklist for New Features

Frontend:
- [ ] API methods added to Service file
- [ ] Custom hooks created with TanStack Query
- [ ] Components use hooks (not services directly)
- [ ] Query keys follow convention
- [ ] Loading/error states handled
- [ ] Optimistic updates if needed
- [ ] Tests include QueryClientProvider wrapper
- [ ] TypeScript types defined
- [ ] Tailwind CSS for styling only

## Don'ts

❌ **DON'T** call fetch/axios in components
❌ **DON'T** call fetch/axios in hooks
❌ **DON'T** use useState for server data
❌ **DON'T** use useEffect for fetching
❌ **DON'T** manage loading/error states manually
❌ **DON'T** write custom CSS
❌ **DON'T** forget to invalidate queries after mutations

## Do's

✅ **DO** put all API calls in Services
✅ **DO** use TanStack Query for server data
✅ **DO** create custom hooks for reusable logic
✅ **DO** use Tailwind CSS for all styling
✅ **DO** handle loading and error states
✅ **DO** invalidate queries after mutations
✅ **DO** use TypeScript strict mode
✅ **DO** write tests with proper wrappers
