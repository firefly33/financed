# Code Review Guidelines

When reviewing code in the Finance Manager project, check the following:

## Architecture Compliance

### Backend (Hexagonal Architecture)
- [ ] Is the domain layer pure (no external dependencies)?
- [ ] Are use cases in the application layer?
- [ ] Do repositories implement domain/ports interfaces?
- [ ] Are controllers in infrastructure/adapters?
- [ ] Is dependency injection used correctly?
- [ ] Are imports using `type` for interfaces with decorators?

### Frontend (Component Architecture)
- [ ] Are components properly decomposed?
- [ ] Is TypeScript used for type safety?
- [ ] Are props typed with interfaces?
- [ ] Are custom hooks used for reusable logic?
- [ ] Is TanStack Query used for ALL server data?
- [ ] Are API calls in Service files (not components/hooks)?
- [ ] Do components use hooks (not services directly)?
- [ ] Are query keys properly structured?
- [ ] Are mutations invalidating queries?
- [ ] Are loading/error states handled?

## Testing

### Backend
- [ ] Unit tests for use cases?
- [ ] BDD scenarios for features?
- [ ] Mocks used for dependencies?
- [ ] Test coverage adequate?
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)?

### Frontend
- [ ] Component tests present?
- [ ] User interactions tested?
- [ ] Edge cases covered?
- [ ] Accessibility considered?

## Code Quality

### General
- [ ] No hardcoded values (use constants/env vars)
- [ ] Error handling implemented
- [ ] No console.logs in production code
- [ ] Comments only where necessary
- [ ] Self-documenting variable/function names
- [ ] No unused imports or variables
- [ ] No backwards-compatibility hacks

### TypeScript
- [ ] No `any` types
- [ ] Proper type inference
- [ ] Interfaces for object shapes
- [ ] Enums for fixed sets of values

### Security
- [ ] No secrets in code
- [ ] Input validation
- [ ] No SQL injection risks
- [ ] No XSS vulnerabilities
- [ ] CORS properly configured

## Styling (Frontend)

- [ ] Only Tailwind CSS used (no custom CSS)
- [ ] Consistent color scheme (slate/blue)
- [ ] Responsive design
- [ ] Accessibility (ARIA labels, semantic HTML)
- [ ] No inline styles

## Git

- [ ] Conventional commit format
- [ ] Descriptive commit message
- [ ] Logical commit boundaries
- [ ] Co-authored by Claude if applicable

## Documentation

- [ ] API changes reflected in README
- [ ] Complex logic commented
- [ ] Types/interfaces documented
- [ ] Breaking changes noted

## Performance

- [ ] No unnecessary re-renders (React)
- [ ] Memoization where appropriate
- [ ] Lazy loading considered
- [ ] Bundle size reasonable

## Review Questions

1. Does this code follow TDD/BDD practices?
2. Is the hexagonal architecture maintained?
3. Are all tests passing?
4. Is the code self-documenting?
5. Are there any security concerns?
6. Is error handling comprehensive?
7. Could this be simpler?
8. Does it integrate well with existing code?
