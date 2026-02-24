---
type: doc
name: tooling
description: Scripts, IDE settings, automation, and developer productivity tips
category: tooling
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Tooling Overview

Development tools for Detecta Alerta, covering code quality, generation, testing, and automation.

## Package Scripts

| Command                 | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `npm run dev`           | Dev server at http://localhost:3000                      |
| `npm run build`         | Production build                                         |
| `npm run typecheck`     | TypeScript type checking (detect errors without running) |
| `npm run quality:fix`   | Lint + format (ESLint + Prettier)                        |
| `npm run test:run`      | All Vitest tests (single run)                            |
| `npm run test:unit`     | Unit tests only (Node, fast ~500ms)                      |
| `npm run test:nuxt`     | Integration tests (happy-dom, ~25s)                      |
| `npm run test:e2e`      | Playwright E2E tests                                     |
| `npm run test:coverage` | Tests with V8 coverage report                            |
| `npm run api:generate`  | Regenerate Kubb API client from OpenAPI                  |
| `npm run setup`         | Configure git hooks (Husky + Commitlint)                 |

## Code Quality

### Prettier

Config: no semicolons, single quotes, 100 columns, no trailing commas, avoid arrow parens.

```typescript
// Correct style
const name = 'detecta'
const fn = x => x + 1
```

### ESLint

Key rules:

- `no-console`: only `console.warn` and `console.error` allowed
- `prefer-const`: required (error level)
- `vue/html-self-closing`: always self-close (`<MyComp />`)
- Unused variables: prefix with `_` to ignore

### Commitlint

Enforced by Husky pre-commit hook. Requires Conventional Commits:

- **Subject**: lower-case only, max 72 characters
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`
- **Scopes**: `auth`, `home`, `usuarios`, `rumores`, `docs`, `base`, `deps`, `kubb`

```
feat(rumores): adiciona filtro por doença     ✅
feat(auth): Implementa Login                  ❌ (uppercase)
```

## API Generation (Kubb)

Generates TypeScript types and Zod schemas from the Sinapse OpenAPI spec.

- **Input**: `https://staging.sinapse.org.br/openapi.json` (remote)
- **Output**: `generated/sinapse/` (types + zod schemas)
- **Config**: `kubb.config.ts`

### Important Config Notes

- `extension: { '.ts': '' }` — required for `verbatimModuleSyntax`
- `pluginZod`: do NOT use `typed: true` or `inferred: true` (conflicts with `verbatimModuleSyntax`)

### Regenerate

```bash
npm run api:generate
```

## UI Components (shadcn-vue)

```bash
npx shadcn-vue@latest add <component>
```

Components are installed to `layers/0-base/app/components/ui/` and auto-imported.

## Git Hooks (Husky)

- **pre-commit**: Runs Commitlint to validate commit message format
- Setup: `npm run setup`

## Nuxt Modules

| Module                             | Purpose                              |
| ---------------------------------- | ------------------------------------ |
| `@nuxt/eslint`                     | ESLint integration                   |
| `@nuxt/icon`                       | Icon auto-import (Lucide)            |
| `@nuxt/content`                    | Markdown/YAML content                |
| `@nuxt/image`                      | Image optimization (webp, avif)      |
| `shadcn-nuxt`                      | shadcn-vue component library         |
| `@pinia/nuxt`                      | Pinia state management               |
| `@vee-validate/nuxt`               | Form validation (VeeForm, VeeField)  |
| `nuxt-security`                    | Security headers, rate limiter, CSRF |
| `vue-sonner/nuxt`                  | Toast notifications                  |
| `@nuxtjs/seo`                      | SEO (sitemap, robots, schema.org)    |
| `@nuxtjs/color-mode`               | Light/dark mode                      |
| `pinia-plugin-persistedstate/nuxt` | Persist Pinia state to localStorage  |

## Testing Tools

| Tool                 | Purpose                               |
| -------------------- | ------------------------------------- |
| Vitest               | Unit + integration tests              |
| Playwright           | E2E browser tests                     |
| @nuxt/test-utils     | Nuxt testing environment              |
| @vue/test-utils      | Vue component mounting                |
| @testing-library/vue | User-focused testing                  |
| happy-dom            | DOM environment for integration tests |

## Key Config Files

| File                   | Purpose                                               |
| ---------------------- | ----------------------------------------------------- |
| `nuxt.config.ts`       | Root Nuxt config (modules, security, SEO, routeRules) |
| `kubb.config.ts`       | API client generation                                 |
| `vitest.config.ts`     | Test projects (unit + nuxt)                           |
| `playwright.config.ts` | E2E browser matrix                                    |
| `.prettierrc`          | Code formatting                                       |
| `eslint.config.mjs`    | Linting rules                                         |
| `commitlint.config.ts` | Commit message validation                             |
| `tsconfig.json`        | TypeScript (strict mode)                              |

## Related Resources

- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
