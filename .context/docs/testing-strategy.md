---
type: doc
name: testing-strategy
description: Test frameworks, patterns, coverage requirements, and quality gates
category: testing
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Testing Strategy

Detecta Alerta uses a three-tier testing approach: unit tests (fast, Node-only), integration tests (Nuxt environment), and E2E tests (Playwright with real browsers).

## Vitest Dual-Project Setup

The project runs **two Vitest projects** to optimize speed:

| Project  | Environment                  | Directory            | Use When                                                                |
| -------- | ---------------------------- | -------------------- | ----------------------------------------------------------------------- |
| **unit** | Node (pure)                  | `tests/unit/`        | Pure functions, API services (no Nuxt auto-imports)                     |
| **nuxt** | happy-dom + @nuxt/test-utils | `tests/integration/` | Stores, composables (need auto-imports like `useRouter`, `defineStore`) |

### Decision Rule

- **Needs Nuxt auto-imports** (`useRoute`, `useRouter`, `useHead`, `useSeoMeta`, `defineStore`)? → `tests/integration/`
- **Only `$fetch` mocks and pure functions**? → `tests/unit/`

### Speed Comparison

- Unit project: ~500ms startup
- Nuxt project: ~25s startup (includes Nuxt build)

## E2E Tests (Playwright)

| Browser                     | Local | CI  |
| --------------------------- | ----- | --- |
| Desktop Chrome (1920x1200)  | Yes   | Yes |
| Desktop Firefox (1920x1200) | Yes   | Yes |
| Laptop Chrome (1366x768)    | Yes   | Yes |
| Tablet (iPad Pro 11)        | Yes   | Yes |
| Mobile Chrome (Pixel 5)     | Yes   | Yes |
| Desktop Safari              | No    | Yes |
| Mobile Safari (iPhone 12)   | No    | Yes |

WebKit browsers run only in CI (`process.env.CI`) due to OS requirements.

### Hydration Helper

Tests interacting with reactive elements must use `waitForHydration(page)` before actions like `fill()`, `click()` on Vue components.

## Test Structure

```
tests/
├── setup.ts           # Setup for "nuxt" project (component stubs)
├── unit/              # Node-only tests (fast)
│   └── auth/          # Service tests (useAuthApi)
├── integration/       # Nuxt environment tests
│   ├── auth/          # Store tests (useAuthStore)
│   └── composables/   # Composable tests (useSeoPage)
└── e2e/               # Playwright E2E
    ├── helpers.ts     # Shared helpers (waitForHydration)
    ├── auth.spec.ts   # Auth flow tests
    └── homepage.spec.ts
```

## Naming Conventions

| Type              | Pattern                | Example                                       |
| ----------------- | ---------------------- | --------------------------------------------- |
| Unit/Integration  | `*.test.ts`            | `useAuthApi.test.ts`                          |
| E2E               | `*.spec.ts`            | `auth.spec.ts`                                |
| Test descriptions | Portuguese, behavioral | `'deve mostrar erro quando email é inválido'` |

## Mocking Patterns

### Mock `$fetch` (unit project)

```typescript
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)
```

### Mock Nuxt auto-imports (nuxt project)

```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
mockNuxtImport('useRouter', () => () => ({ push: vi.fn() }))
```

### Mock composables

```typescript
vi.mock('~/layers/1-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({ login: vi.fn().mockResolvedValue({ user: mockUser }) })
}))
```

## Quality Gates

Before submitting code:

1. `npm run typecheck` — passes with no errors
2. `npm run quality:fix` — Prettier + ESLint clean
3. `npm run test:run` — all tests pass
4. New features include tests (unit or integration)

## Commands

| Command                   | Purpose                   |
| ------------------------- | ------------------------- |
| `npm run test`            | Watch mode (all projects) |
| `npm run test:run`        | Run once (all projects)   |
| `npm run test:unit`       | Unit project only (fast)  |
| `npm run test:nuxt`       | Nuxt project only         |
| `npm run test:coverage`   | With coverage report      |
| `npm run test:ui`         | Visual Vitest UI          |
| `npm run test:e2e`        | Playwright E2E            |
| `npm run test:e2e:headed` | E2E with visible browser  |

## Coverage

- Provider: V8
- Reporters: text, json, html
- Output: `./coverage/`
- Excludes: `node_modules/`, `.nuxt/`, `.output/`, `tests/`, `*.d.ts`, `*.config.*`

## Related Resources

- [Development Workflow](./development-workflow.md)
- [tests/CLAUDE.md](../../tests/CLAUDE.md) — Detailed testing patterns and examples
