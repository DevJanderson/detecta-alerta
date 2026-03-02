---
type: agent
name: Bug Fixer
description: Analyze bug reports and error messages
agentType: bug-fixer
phases: [E, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Bug Fixer Playbook

### Investigation Steps

1. **Reproduce**: Understand the exact steps to trigger the bug
2. **Locate**: Identify which layer owns the affected code
3. **Trace data flow**: `UI → Store → Service → BFF → Sinapse API`
4. **Check types**: Run `npm run typecheck` for type-related clues
5. **Check logs**: Only `console.warn`/`console.error` are allowed — check server logs

### Common Bug Sources

| Area    | Common Issues               | Where to Look                                     |
| ------- | --------------------------- | ------------------------------------------------- |
| Auth    | Token expiry, refresh loops | `layers/auth/server/middleware/01.auth.ts`        |
| API     | Response shape changed      | `generated/sinapse/` types vs actual API response |
| State   | Stale store data            | `use*Store.ts` — check `persist.pick` config      |
| Routing | Middleware redirect loops   | `layers/auth/app/middleware/auth.global.ts`       |
| SSR     | Hydration mismatch          | Check `useFetch` vs `$fetch` usage                |

### Debugging Tools

```bash
npm run typecheck         # Catch type errors
npm run test:run          # Run all tests
npm run test -- path/to/file.test.ts  # Run specific test
```

### Fix Validation

1. `npm run typecheck` — no new type errors
2. `npm run quality:fix` — format clean
3. `npm run test:run` — all tests pass
4. Add regression test if applicable

### Key Directories

- `layers/*/server/api/` — BFF endpoints
- `layers/*/app/composables/` — Services and stores
- `layers/*/app/middleware/` — Route guards
- `layers/*/server/middleware/` — Server middleware (numbered order)
