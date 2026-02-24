---
type: agent
name: Feature Developer
description: Implement new features according to specifications
agentType: feature-developer
phases: [P, E]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Feature Developer Playbook

### Project Context

- **Framework**: Nuxt 4 (layers-only architecture) + Vue 3 + shadcn-vue + Tailwind CSS v4
- **Architecture**: All code lives in `layers/{N}-{feature}/` — no root `app/` directory
- **API**: BFF proxy pattern — server endpoints in `layers/*/server/api/` proxy to Sinapse API
- **State**: Pinia stores with Composition API (`defineStore` setup function)

### Before Starting

1. Read the relevant layer's `CLAUDE.md` for context
2. Check existing patterns in similar layers
3. Run `npm run typecheck` to verify current state is clean

### Implementation Checklist

#### New Feature Layer

1. Create `layers/{N}-{feature}/nuxt.config.ts` (can be empty `export default defineNuxtConfig({})`)
2. Create composables: `types.ts` → `use{Feature}Api.ts` → `use{Feature}Store.ts`
3. Create pages under `app/pages/{feature}/`
4. Create BFF endpoints under `server/api/{feature}/`
5. Add `useSeoPage()` to all new pages
6. Add tests in `tests/unit/` or `tests/integration/`
7. Create layer `CLAUDE.md` with documentation

#### Within Existing Layer

1. Follow the existing layer's composable/store pattern
2. Use types from `generated/sinapse/types/` (Kubb)
3. Use Zod schemas from `generated/sinapse/zod/` for BFF validation
4. Components: prefix with layer name (e.g., `RumoresCard.vue` in layer 4)

### Code Style Rules

- No semicolons, single quotes, 100 columns, no trailing commas
- Arrow parens: avoid (`x => x + 1`)
- `const` everywhere possible (`prefer-const` error)
- No `console.log` — only `console.warn` and `console.error`
- Self-close Vue components (`<MyComp />`)
- Colors: always use design system variables, never hardcoded

### Data Flow

```
UI → Composable/Store → Service (use*Api) → $fetch('/api/...') → BFF → Sinapse API
```

### Service Pattern

```typescript
export function useExampleApi() {
  async function getAll() {
    return $fetch('/api/examples')
  }
  return { getAll }
}
```

### Store Pattern

```typescript
export const useExampleStore = defineStore('example', () => {
  const items = ref<Example[]>([])
  const api = useExampleApi()
  async function fetchAll() {
    items.value = await api.getAll()
  }
  return { items, fetchAll }
})
```

### Validation

- After implementing: `npm run typecheck`
- Format: `npm run quality:fix`
- Tests: `npm run test:run`
