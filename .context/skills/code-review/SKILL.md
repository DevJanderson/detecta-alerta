---
name: code-review
description: Review code quality, patterns, and best practices
allowed-tools: Read, Grep, Glob
---

## Code Review Skill

### Style Rules

| Rule                  | Correct       | Incorrect                         |
| --------------------- | ------------- | --------------------------------- |
| No semicolons         | `const x = 1` | `const x = 1;`                    |
| Single quotes         | `'text'`      | `"text"`                          |
| Avoid arrow parens    | `x => x + 1`  | `(x) => x + 1`                    |
| No trailing commas    | `{ a: 1 }`    | `{ a: 1, }`                       |
| 100 column width      | —             | Lines > 100 chars                 |
| Self-close components | `<MyComp />`  | `<MyComp></MyComp>`               |
| Prefer const          | `const x = 1` | `let x = 1` (if never reassigned) |

### Pattern Checks

| Pattern       | Expected                                           |
| ------------- | -------------------------------------------------- |
| Service       | `use*Api.ts` — thin `$fetch` wrapper, no state     |
| Store         | `use*Store.ts` — `defineStore` with setup function |
| Types         | `types.ts` — one per layer                         |
| Components    | Prefixed with layer name (e.g., `RumoresCard`)     |
| Pages         | Use `useSeoPage()` composable                      |
| BFF endpoints | Validate with Zod, use `fetchSinapse()`            |

### Security Checks

- No `console.log` in production code
- No tokens in localStorage (httpOnly cookies only)
- No hardcoded secrets in client code
- Zod validation on all server inputs
- `isValidRedirectUrl()` for user-controlled redirects

### Anti-Patterns

- Over-engineering: unnecessary abstractions for single-use code
- Editing `generated/sinapse/` manually (regenerate with `npm run api:generate`)
- Code outside layers directory
- Using `useSeoMeta` instead of `useSeoPage`
- Hardcoded colors instead of design system variables
