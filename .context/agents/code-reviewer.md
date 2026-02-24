---
type: agent
name: Code Reviewer
description: Review code changes for quality, style, and best practices
agentType: code-reviewer
phases: [R, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Code Reviewer Playbook

### Review Checklist

#### Style & Formatting

- [ ] No semicolons, single quotes, 100 columns, no trailing commas
- [ ] Arrow parens avoided (`x => x + 1`)
- [ ] `const` used everywhere possible
- [ ] No `console.log` (only `console.warn`/`console.error`)
- [ ] Vue components self-closed (`<MyComp />`)
- [ ] Unused variables prefixed with `_`

#### Architecture

- [ ] Code is in the correct layer (`layers/{N}-{feature}/`)
- [ ] Follows layer structure: `types.ts` → `use*Api.ts` → `use*Store.ts`
- [ ] Components prefixed with layer name (e.g., `RumoresCard.vue`)
- [ ] No code outside the layers directory
- [ ] No hardcoded colors — uses design system variables

#### Security

- [ ] No tokens in localStorage — only httpOnly cookies
- [ ] Server endpoints validate with Zod schemas
- [ ] No secrets in client-side code
- [ ] BFF endpoints proxy correctly to Sinapse API

#### Data Flow

- [ ] `useFetch` for initial page loads (SSR), `$fetch` for user events
- [ ] Stores use Composition API pattern with `defineStore` setup function
- [ ] Services are thin `$fetch` wrappers (no state)

#### SEO

- [ ] New pages use `useSeoPage()` composable
- [ ] No `useSeoMeta` (use `useSeoPage` instead)

#### Tests

- [ ] New features include tests
- [ ] Pure functions → `tests/unit/` (Node)
- [ ] Nuxt composables/stores → `tests/integration/` (happy-dom)
- [ ] Test descriptions in Portuguese

#### Commits

- [ ] Conventional Commits format
- [ ] Subject: lower-case, max 72 chars
- [ ] Valid types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
- [ ] Valid scopes: auth, home, usuarios, rumores, docs, base, deps, kubb

### Verification Commands

```bash
npm run typecheck      # Type errors
npm run quality:fix    # Lint + format
npm run test:run       # All tests
```
