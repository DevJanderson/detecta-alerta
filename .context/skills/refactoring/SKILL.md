---
type: skill
name: Refactoring
description: Safe code refactoring with step-by-step approach
skillSlug: refactoring
phases: [E]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Refactoring Skill

### Step-by-Step Process

1. **Verify baseline**: `npm run typecheck && npm run test:run`
2. **Identify scope**: Which layer(s) are affected?
3. **Make changes**: Small, incremental steps
4. **Verify each step**: `npm run typecheck` after each change
5. **Final validation**: `npm run quality:fix && npm run test:run`

### Safe Refactoring Targets

| Target             | From                        | To                           |
| ------------------ | --------------------------- | ---------------------------- |
| Extract service    | Logic in store              | Separate `use*Api.ts`        |
| Extract composable | Repeated logic              | Shared composable            |
| Split component    | Large component             | Smaller, prefixed components |
| Consolidate types  | Scattered types             | Layer `types.ts`             |
| Extract util       | Pure function in composable | `layers/0-base/app/utils/`   |

### Boundaries

- **Never** edit `generated/sinapse/` (regenerate with `npm run api:generate`)
- **Never** move code outside `layers/` directory
- **Never** create abstractions for single-use code
- **Never** break public composable APIs without updating all consumers
- **Always** keep utils pure (no Vue reactivity) in `layers/0-base/app/utils/`
- **Always** keep composables in their own layer

### Validation

```bash
npm run typecheck      # No type regressions
npm run quality:fix    # Style clean
npm run test:run       # All tests pass
```
