# Testing Guide

This document describes the testing strategy and practices for BPMS.

---

## 1. Testing Strategy

| Layer | Tool | Scope |
|-------|------|-------|
| Unit tests | Vitest | Pure functions, utilities, hooks |
| Component tests | Vitest + React Testing Library | UI components in isolation |
| Integration tests | Vitest + msw | API routes with mocked Supabase |
| E2E tests *(future)* | Playwright | Full user journeys in browser |

---

## 2. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

> **Note:** A test framework has not yet been configured in this repository.
> When adding tests, install Vitest and React Testing Library:
>
> ```bash
> npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom
> ```
>
> Then add to `vite.config.ts`:
> ```ts
> test: {
>   environment: 'jsdom',
>   globals: true,
>   setupFiles: './src/test-setup.ts',
> }
> ```

---

## 3. Writing Tests

### Unit Test Example

```ts
// src/utils/formatRefNumber.test.ts
import { describe, it, expect } from 'vitest';
import { formatRefNumber } from './formatRefNumber';

describe('formatRefNumber', () => {
  it('returns uppercase type prefix', () => {
    expect(formatRefNumber('pass', 1700000000000, 123))
      .toBe('PASS-1700000000000-123');
  });
});
```

### Component Test Example

```tsx
// src/components/StatusChecker.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusChecker from './StatusChecker';

describe('StatusChecker', () => {
  it('shows error when reference number is empty', async () => {
    render(<StatusChecker />);
    await userEvent.click(screen.getByRole('button', { name: /check status/i }));
    expect(screen.getByText(/reference number is required/i)).toBeInTheDocument();
  });
});
```

### API Integration Test Example

```ts
// src/supabase/functions/server/applications.test.ts
import { describe, it, expect, beforeAll } from 'vitest';

const BASE_URL = 'http://localhost:54321/functions/v1/server/make-server-8ee81f4f';

describe('POST /applications/passport', () => {
  it('returns a reference number', async () => {
    const res = await fetch(`${BASE_URL}/applications/passport`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        firstName: 'Jean',
        lastName: 'Test',
        dateOfBirth: '1990-01-01',
        nationality: 'Rwandan',
      }),
    });
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.referenceNumber).toMatch(/^PASS-/);
  });
});
```

---

## 4. Test Naming Conventions

- Describe blocks: noun phrase describing the unit under test.
- Test cases: start with a verb — `'returns ...'`, `'throws ...'`, `'renders ...'`.
- Use readable descriptions that serve as documentation.

---

## 5. Coverage Requirements

- **Target:** 70% line coverage for `src/utils/` and `src/supabase/functions/server/`.
- Coverage reports are uploaded to CI on every push.
- New features should include tests before merging.
