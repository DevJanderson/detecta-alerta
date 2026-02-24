---
type: agent
name: Refactoring Specialist
description: Identify code smells and improvement opportunities
agentType: refactoring-specialist
phases: [E]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Refactoring Specialist Playbook

### Architecture Constraints

Refactoring must respect the layers-only architecture:

- All code must stay within `layers/{N}-{feature}/`
- Layer boundaries: lower layers should not import from higher layers
- `generated/sinapse/` is auto-generated — never refactor manually

### Common Refactoring Targets

| Pattern                 | Location                   | Guideline                               |
| ----------------------- | -------------------------- | --------------------------------------- |
| Composable extraction   | `app/composables/`         | Split large stores into service + store |
| Component decomposition | `app/components/`          | Prefix with layer name                  |
| Server endpoint cleanup | `server/api/`              | Validate with Zod, use `fetchSinapse()` |
| Type consolidation      | `app/composables/types.ts` | One types file per layer                |
| Utils extraction        | `layers/0-base/app/utils/` | Pure functions only, no Vue state       |

### Rules

- **Utils** (`layers/0-base/app/utils/`): Pure functions, no Vue reactivity
- **Composables** (`layers/*/app/composables/`): Can use `ref`, `computed`, etc.
- Services (`use*Api.ts`): Thin `$fetch` wrappers — no state
- Stores (`use*Store.ts`): State management with `defineStore` setup function

### Validation After Refactoring

1. `npm run typecheck` — no regressions
2. `npm run quality:fix` — style clean
3. `npm run test:run` — all tests still pass
4. No breaking changes to public composable APIs without updating consumers

### Anti-Patterns to Avoid

- Don't create abstractions for single-use code
- Don't add error handling for impossible scenarios
- Don't refactor `generated/sinapse/` — regenerate with `npm run api:generate`
- Don't move code outside the layers directory
