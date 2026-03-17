# Development Guide

This guide covers day-to-day development practices for the BPMS project.

---

## 1. Setting Up Your Environment

Follow [SETUP.md](../SETUP.md) first.

---

## 2. Project Structure

```
.
├── src/
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   ├── components/           # UI components
│   └── supabase/             # Backend edge function
├── docs/                     # Documentation
├── migrations/               # Database migration scripts
├── .github/workflows/        # CI/CD workflows
├── Dockerfile                # Frontend container
├── docker-compose.yml        # Dev environment
└── .env.example              # Environment variable template
```

---

## 3. Coding Standards

### TypeScript

- Enable `strict` mode.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Use named exports; avoid default exports except for React components.
- Add JSDoc comments for exported functions and complex logic.

### React

- Functional components only.
- Hooks follow the `use` prefix convention.
- Keep components small — if a component exceeds ~150 lines, split it.
- Co-locate styles, types, and tests with their component.

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files / directories | kebab-case | `passport-application.tsx` |
| React components | PascalCase | `PassportApplication` |
| Functions / variables | camelCase | `submitApplication` |
| Constants | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| CSS classes (Tailwind) | utility-first | `flex items-center gap-4` |

### Formatting

Code is formatted with **Prettier** (defaults). Run before committing:

```bash
npx prettier --write "src/**/*.{ts,tsx}"
```

### Linting

```bash
npx eslint "src/**/*.{ts,tsx}"
```

Fix auto-fixable issues:

```bash
npx eslint --fix "src/**/*.{ts,tsx}"
```

---

## 4. Git Workflow

### Branch Naming

```
feature/<short-description>      # New features
fix/<short-description>          # Bug fixes
chore/<short-description>        # Maintenance tasks
docs/<short-description>         # Documentation only
```

### Commit Message Format (Conventional Commits)

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(passport): add passport renewal workflow
fix(api): handle missing email field in visa application
docs(setup): add Docker Compose instructions
```

### Pull Request Process

1. Create a branch from `develop`.
2. Make your changes with atomic commits.
3. Open a PR against `develop`.
4. Ensure CI (lint + build) passes.
5. Request review from at least one other developer.
6. Address review feedback.
7. Squash-merge after approval.

---

## 5. Working with the Backend

The backend is a Hono server running as a Supabase Edge Function.

To run locally (requires Deno):

```bash
supabase functions serve server --env-file .env.local
```

This starts the function at `http://localhost:54321/functions/v1/server`.

To deploy:

```bash
supabase functions deploy server --project-ref <project-ref>
```

---

## 6. Working with the Database

Always use migrations to change the schema (see [`migrations/`](../../migrations/)).

Never run `ALTER TABLE` or `DROP TABLE` statements directly in production.
