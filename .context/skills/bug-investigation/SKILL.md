---
name: bug-investigation
description: Systematic bug investigation and root cause analysis
allowed-tools: Read, Grep, Glob, Bash
---

## Bug Investigation Skill

### Investigation Flow

1. **Reproduce**: Define exact steps to trigger the bug
2. **Isolate layer**: Determine which layer owns the code (`layers/{N}-{feature}/`)
3. **Trace data flow**: `UI → Store → Service → BFF → Sinapse API`
4. **Check types**: `npm run typecheck` for type-related issues
5. **Run tests**: `npm run test:run` to see if tests catch the issue
6. **Fix and verify**: Apply fix, add regression test

### Common Root Causes

| Symptom             | Likely Cause                             | Where to Look                               |
| ------------------- | ---------------------------------------- | ------------------------------------------- |
| 401/403 errors      | Token expired, missing auth              | `layers/auth/server/middleware/01.auth.ts`  |
| Hydration mismatch  | `$fetch` in setup (should be `useFetch`) | Component `<script setup>`                  |
| Stale data          | Store not refreshing                     | `use*Store.ts` — check fetch triggers       |
| Redirect loop       | Middleware conflict                      | `layers/auth/app/middleware/auth.global.ts` |
| Type mismatch       | API changed                              | Regenerate: `npm run api:generate`          |
| Missing auto-import | Wrong test project                       | Move to `tests/integration/` for Nuxt env   |

### Debugging Commands

```bash
npm run typecheck                    # Type errors
npm run test -- path/to/file.test.ts # Specific test
npm run test:run                     # All tests
```

### Fix Validation

1. Bug is reproduced before fix
2. Fix addresses root cause (not symptoms)
3. `npm run typecheck` passes
4. Regression test added
5. `npm run test:run` passes
