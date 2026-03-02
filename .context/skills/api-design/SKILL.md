---
type: skill
name: Api Design
description: Design RESTful APIs following best practices
skillSlug: api-design
phases: [P, R]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## API Design Skill

### BFF Pattern

All client-facing API endpoints are BFF proxies in `layers/*/server/api/`:

```
Client → $fetch('/api/{feature}/...') → BFF endpoint → fetchSinapse() → Sinapse API
```

### Endpoint Naming Convention

Nitro uses file-based routing:

| File             | Method | Route                |
| ---------------- | ------ | -------------------- |
| `index.get.ts`   | GET    | `/api/{feature}/`    |
| `index.post.ts`  | POST   | `/api/{feature}/`    |
| `[id].get.ts`    | GET    | `/api/{feature}/:id` |
| `[id].put.ts`    | PUT    | `/api/{feature}/:id` |
| `[id].delete.ts` | DELETE | `/api/{feature}/:id` |

### BFF Endpoint Template

```typescript
import { fetchSinapse } from '~/layers/auth/server/utils/auth'
import { exampleSchema } from '~/generated/sinapse/zod/exampleSchema'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const validated = exampleSchema.safeParse(body)
  if (!validated.success) {
    throw createError({ statusCode: 400, message: 'Dados inválidos' })
  }

  return fetchSinapse('/examples', {
    method: 'POST',
    body: validated.data,
    event
  })
})
```

### Security Rules

- Always validate input with Zod schemas (from Kubb)
- Use `fetchSinapse()` (adds auth headers automatically)
- Never expose Sinapse API URL to client
- Rate limit sensitive endpoints in `routeRules`
- Disable CSRF only when using httpOnly cookies + SameSite strict

### Middleware Chain

Server middleware runs in order of numeric prefix:

- `01.auth.ts` — Token refresh
- `02.admin.ts` — Admin route guard

### Types

Import from Kubb for type safety:

```typescript
import type { ExampleType } from '~/generated/sinapse/types/ExampleType'
import { exampleSchema } from '~/generated/sinapse/zod/exampleSchema'
```
