---
type: skill
name: Feature Breakdown
description: Break down features into implementable tasks
skillSlug: feature-breakdown
phases: [P]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Feature Breakdown Skill

### Breakdown Structure

For each feature, create tasks in this order:

#### 1. Types & API Contract

- Define interfaces in `layers/{N}-{feature}/app/composables/types.ts`
- Import Kubb types from `generated/sinapse/types/` if applicable
- Define Zod schemas for BFF validation

#### 2. BFF Endpoints

- Create `layers/{N}-{feature}/server/api/{feature}/` endpoints
- Use `fetchSinapse()` to proxy to Sinapse API
- Validate responses with Zod schemas

#### 3. Service Layer

- Create `use{Feature}Api.ts` as thin `$fetch` wrapper
- One function per API call, return typed data

#### 4. Store

- Create `use{Feature}Store.ts` with `defineStore` setup function
- State, computed getters, async actions
- Use `persist.pick` for filter/preference state only

#### 5. Components & Pages

- Prefix components with layer name: `{Feature}Card.vue`
- Use `useSeoPage()` on all pages
- Use design system colors (never hardcoded)

#### 6. Tests

- Services → `tests/unit/` (mock `$fetch`)
- Stores/composables → `tests/integration/` (mock API, use `mockNuxtImport`)

#### 7. Documentation

- Create/update `layers/{N}-{feature}/CLAUDE.md`

### Task Sizing

| Size   | Description            | Typical Scope                  |
| ------ | ---------------------- | ------------------------------ |
| Small  | Single file change     | Bug fix, style update          |
| Medium | 2-5 files in one layer | New endpoint + service + store |
| Large  | Multiple layers        | New feature layer from scratch |

### New Layer Checklist

- [ ] `layers/{N}-{feature}/nuxt.config.ts`
- [ ] `app/composables/types.ts`
- [ ] `app/composables/use{Feature}Api.ts`
- [ ] `app/composables/use{Feature}Store.ts`
- [ ] `app/pages/{feature}/`
- [ ] `server/api/{feature}/`
- [ ] `tests/unit/{feature}/`
- [ ] `CLAUDE.md`
