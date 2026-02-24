---
type: skill
name: Pr Review
description: Review pull requests against team standards and best practices
skillSlug: pr-review
phases: [R, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## PR Review Skill

### Review Process

1. **Scope check**: Are changes within the correct layer?
2. **Type check**: Run `npm run typecheck` mentally — look for type issues
3. **Style check**: No semicolons, single quotes, const everywhere, no console.log
4. **Security check**: No tokens in client, Zod validation in BFF, no hardcoded secrets
5. **Test check**: New features have tests, existing tests still pass
6. **SEO check**: New pages use `useSeoPage()`
7. **Commit check**: Conventional commits, lower-case subject, valid scope

### Checklist

#### Must Pass

- [ ] Code is in correct layer (`layers/{N}-{feature}/`)
- [ ] No `console.log` (only `console.warn`/`console.error`)
- [ ] `const` used everywhere possible
- [ ] No hardcoded colors — uses design system
- [ ] No tokens in localStorage
- [ ] Server endpoints validate with Zod
- [ ] New pages use `useSeoPage()`

#### Architecture

- [ ] Follows composable pattern: `types.ts` → `use*Api.ts` → `use*Store.ts`
- [ ] Components prefixed with layer name
- [ ] `useFetch` for SSR loads, `$fetch` for user events
- [ ] No code outside layers directory

#### Quality

- [ ] Tests included for new functionality
- [ ] No unnecessary abstractions or over-engineering
- [ ] Changes are minimal and focused

### PR Description Template

```markdown
## Summary

- Brief description of changes

## Test plan

- [ ] `npm run typecheck` passes
- [ ] `npm run quality:fix` clean
- [ ] `npm run test:run` passes
- [ ] Manual testing done
```
