---
name: security-audit
description: Security review checklist for code and infrastructure
allowed-tools: Read, Grep, Glob
---

## Security Audit Skill

### Quick Checklist

#### Authentication

- [ ] Tokens in httpOnly cookies only (never localStorage)
- [ ] `secure: true` and `sameSite: 'strict'` on cookies
- [ ] Auto-refresh handled server-side
- [ ] Client code never accesses raw JWT

#### Input Validation

- [ ] All BFF endpoints validate with Zod
- [ ] `safeParse` used (not `parse`) with proper error handling
- [ ] No user input passed directly to external API without validation

#### CSRF

- [ ] Enabled for POST/PUT/PATCH/DELETE globally
- [ ] Exceptions documented and justified

#### Rate Limiting

- [ ] Global: 150 req/5min
- [ ] Login: 10 req/5min
- [ ] Reset password: 5 req/5min
- [ ] New sensitive endpoints have stricter limits

#### Headers

- [ ] CSP policy active in production
- [ ] HSTS with includeSubdomains
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: SAMEORIGIN
- [ ] X-Powered-By hidden

#### Secrets

- [ ] No secrets in client-side code
- [ ] No secrets in public runtimeConfig
- [ ] `.env` files gitignored
- [ ] `NUXT_SINAPSE_API_URL` is server-only

#### Redirects

- [ ] `isValidRedirectUrl()` for user-controlled redirects
- [ ] No open redirect vulnerabilities

### Key Security Files

- `nuxt.config.ts` — Headers, CSP, rate limiter, CSRF
- `layers/auth/server/middleware/01.auth.ts` — Token management
- `layers/auth/server/utils/auth.ts` — `fetchSinapse()`, cookies
- `layers/auth/app/utils/auth.ts` — Redirect validation
- `layers/usuarios/server/middleware/02.admin.ts` — Admin guard
