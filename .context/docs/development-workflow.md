---
type: doc
name: development-workflow
description: Day-to-day engineering processes, branching, and contribution guidelines
category: workflow
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Development Workflow

This document covers the day-to-day engineering processes for the Detecta Alerta project.

## Branching (Gitflow)

The project uses **Gitflow** with three permanent branches:

```
feature/* ──→ develop ──→ staging ──→ main
               (dev)       (QA)      (production)
```

| Branch    | Purpose                     | Deploy      |
| --------- | --------------------------- | ----------- |
| `main`    | Production — stable code    | Production  |
| `staging` | QA/homologation before prod | Staging env |
| `develop` | Feature integration         | Dev env     |

### Rules

- **Default working branch:** `develop` (never commit directly to `main` or `staging`)
- **Feature branches:** created from `develop`, prefixed by commit type
  - `feat/description`, `fix/description`, `refactor/description`, `chore/description`
- **Merge to develop:** via PR (squash or merge commit)
- **Merge develop → staging:** when features are ready for QA
- **Merge staging → main:** after staging approval (release)
- **Hotfix:** branch `hotfix/description` from `main`, merge into both `main` and `develop`

### Typical flow

```bash
git checkout develop
git pull origin develop
git checkout -b feat/new-feature
# ... work ...
git push -u origin feat/new-feature
# Open PR to develop
```

## Commits

- **Convention**: Conventional Commits enforced by Commitlint (Husky pre-commit hook)
- **Subject**: MUST be lower-case, max 72 characters
- **Body**: max 100 characters per line
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`
- **Scopes**: `auth`, `home`, `usuarios`, `rumores`, `docs`, `base`, `deps`, `kubb`

### Commit Examples

```
feat(rumores): adiciona filtro por doença
fix(auth): corrige refresh token expirado
chore(deps): atualiza dependências de segurança
```

## Local Development

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm install`          | Install dependencies                    |
| `npm run setup`        | Configure git hooks (Husky, Commitlint) |
| `npm run dev`          | Dev server at http://localhost:3000     |
| `npm run build`        | Production build                        |
| `npm run typecheck`    | Type checking (use to detect errors)    |
| `npm run quality:fix`  | Lint + format (ESLint + Prettier)       |
| `npm run test:run`     | All Vitest tests                        |
| `npm run test:unit`    | Unit tests only (Node, fast)            |
| `npm run test:nuxt`    | Nuxt tests (happy-dom)                  |
| `npm run test:e2e`     | Playwright E2E tests                    |
| `npm run api:generate` | Regenerate Kubb API client              |

> **Important**: NEVER run `npm run dev` in background or with timeout from AI tools. Let the developer start it in their terminal.

## Code Review Expectations

Before submitting code for review, ensure:

1. `npm run typecheck` passes with no errors
2. `npm run quality:fix` has been run (Prettier + ESLint)
3. Tests pass: `npm run test:run`
4. New features include tests (unit or integration)
5. New pages use `useSeoPage` composable
6. No `console.log` (only `console.warn` and `console.error` allowed)
7. `const` used everywhere possible (`prefer-const` rule)
8. Components follow layer naming convention (e.g., `RumoresCard.vue` in layer 4)
9. No hardcoded colors - use design system variables
10. Tokens/secrets never in localStorage - always httpOnly cookies

### Code Style Quick Reference

- No semicolons, single quotes, 100 column width, no trailing commas
- Arrow parens: avoid (`x => x + 1`, not `(x) => x + 1`)
- Vue components: always self-close (`<MyComp />`)
- Unused variables: prefix with `_` (e.g., `_unused`)

## Adding a New Feature Layer

1. Create `layers/{N}-{feature}/nuxt.config.ts` (can be empty `export default defineNuxtConfig({})`)
2. Create composables: `types.ts` → `use{Feature}Api.ts` → `use{Feature}Store.ts`
3. Create pages under `app/pages/{feature}/`
4. Create server endpoints under `server/api/{feature}/`
5. Add tests in `tests/unit/` or `tests/integration/`

## Related Resources

- [Testing Strategy](./testing-strategy.md)
- [Tooling Guide](./tooling.md)
