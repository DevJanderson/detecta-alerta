---
type: doc
name: security
description: Security policies, authentication, secrets management, and compliance requirements
category: security
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Security Overview

Detecta Alerta uses a defense-in-depth approach with the `nuxt-security` module as the foundation. All API communication goes through a BFF (Backend-for-Frontend) proxy that keeps JWT tokens in httpOnly cookies, never exposing them to client-side JavaScript.

## Authentication Architecture

```
Browser → Nuxt Server (BFF) → Sinapse API
              ↓
     httpOnly cookies (access_token, refresh_token)
```

- **Tokens**: Stored in httpOnly cookies with `secure: true` and `sameSite: 'strict'`
- **Auto-refresh**: Server middleware `01.auth.ts` transparently renews expired tokens
- **No client exposure**: Client never sees raw JWT tokens — only user data

## Security Headers (nuxt-security)

| Header                       | Value                                              |
| ---------------------------- | -------------------------------------------------- |
| Content-Security-Policy      | Strict policy in production, disabled in dev (HMR) |
| Strict-Transport-Security    | `max-age=31536000; includeSubdomains`              |
| X-Content-Type-Options       | `nosniff`                                          |
| X-Frame-Options              | `SAMEORIGIN`                                       |
| Referrer-Policy              | `strict-origin-when-cross-origin`                  |
| Cross-Origin-Resource-Policy | `same-origin`                                      |
| Cross-Origin-Opener-Policy   | `same-origin`                                      |
| Cross-Origin-Embedder-Policy | `credentialless` (prod) / `unsafe-none` (dev)      |
| X-Powered-By                 | Hidden                                             |

### CSP Policy (Production)

```
default-src: 'self'
script-src: 'self' 'unsafe-inline' 'unsafe-eval'
style-src: 'self' 'unsafe-inline'
img-src: 'self' data: https:
font-src: 'self' data:
connect-src: 'self'
frame-ancestors: 'self'
form-action: 'self'
object-src: 'none'
```

## Rate Limiting

| Route                      | Limit        | Interval  |
| -------------------------- | ------------ | --------- |
| Global (all routes)        | 150 requests | 5 minutes |
| `/api/auth/login`          | 10 requests  | 5 minutes |
| `/api/auth/reset-password` | 5 requests   | 5 minutes |

## CSRF Protection

CSRF is enabled globally for POST, PUT, PATCH, DELETE methods using `nuxt-csurf`.

**Exceptions** (use httpOnly cookies + SameSite strict instead):

- `/api/auth/*` — all auth endpoints
- `/api/usuarios/**` — user management
- `/api/rumores/admin/**` — rumores admin operations

## Request Size Limits

| Type             | Limit |
| ---------------- | ----- |
| General requests | 2 MB  |
| File uploads     | 8 MB  |

## XSS Protection

- `xssValidator` enabled with defaults on all input
- CSP headers prevent inline script injection in production
- Legacy `X-XSS-Protection: 0` (disabled — CSP is the modern replacement)

## Secrets Management

| Secret                 | Storage                   | Access                        |
| ---------------------- | ------------------------- | ----------------------------- |
| `NUXT_SINAPSE_API_URL` | `.env` file (server-only) | `runtimeConfig.sinapseApiUrl` |
| JWT access_token       | httpOnly cookie           | Server middleware only        |
| JWT refresh_token      | httpOnly cookie           | Server middleware only        |
| CSRF token             | Cookie (`csrf`)           | Auto-managed by nuxt-csurf    |

### Rules

- **Never** store tokens in localStorage or sessionStorage
- **Never** expose `runtimeConfig` private keys to client
- `.env` files are gitignored (only `.env.example` is committed)
- All server-side validation uses Zod schemas (from Kubb)

## Server-Side Validation

```typescript
// All BFF endpoints validate input with Zod
const result = schema.safeParse(body)
if (!result.success) throw createError({ statusCode: 400 })
```

## SEO & Robots

Internal routes are protected from indexing via `X-Robots-Tag: noindex, nofollow`:

- `/auth/**`, `/design-system/**`, `/perfil/**`, `/admin/**`, `/rumores/**`, `/docs/**`

## Key Files

- [`nuxt.config.ts`](../../nuxt.config.ts) — Security configuration (headers, rate limiter, CSRF, routeRules)
- [`layers/1-auth/server/middleware/01.auth.ts`](../../layers/1-auth/server/middleware/01.auth.ts) — Token management
- [`layers/1-auth/server/utils/auth.ts`](../../layers/1-auth/server/utils/auth.ts) — Auth helpers (fetchSinapse, cookie management)
- [`layers/3-usuarios/server/middleware/02.admin.ts`](../../layers/3-usuarios/server/middleware/02.admin.ts) — Admin route guard

## Related Resources

- [Architecture](./architecture.md)
- [Auth Layer CLAUDE.md](../../layers/1-auth/CLAUDE.md)
