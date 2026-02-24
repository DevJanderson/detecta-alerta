---
type: agent
name: Security Auditor
description: Identify security vulnerabilities
agentType: security-auditor
phases: [R, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Security Auditor Playbook

### Security Checklist

#### Authentication & Tokens

- [ ] JWT tokens stored ONLY in httpOnly cookies (never localStorage)
- [ ] Cookies use `secure: true` and `sameSite: 'strict'`
- [ ] Token refresh is handled server-side (`01.auth.ts`)
- [ ] Client-side code never accesses raw tokens

#### Input Validation

- [ ] All BFF endpoints validate input with Zod schemas
- [ ] `schema.safeParse(body)` with proper error handling
- [ ] No user input passed directly to Sinapse API without validation

#### CSRF

- [ ] CSRF enabled globally for POST/PUT/PATCH/DELETE
- [ ] Exceptions justified (auth routes use httpOnly + SameSite strict)
- [ ] No new unprotected mutation endpoints

#### Rate Limiting

- [ ] Sensitive endpoints have stricter limits (login: 10/5min, reset: 5/5min)
- [ ] New auth-related endpoints include rate limiting in `routeRules`

#### Headers

- [ ] CSP policy maintained in production
- [ ] No weakening of security headers without justification
- [ ] HSTS, X-Frame-Options, X-Content-Type-Options present

#### Secrets

- [ ] No secrets in client-side code or public runtimeConfig
- [ ] `.env` files properly gitignored
- [ ] `NUXT_SINAPSE_API_URL` is server-only (`runtimeConfig.sinapseApiUrl`)

#### Redirects

- [ ] `isValidRedirectUrl()` used for all user-controlled redirects
- [ ] No open redirect vulnerabilities

### Key Security Files

| File                                              | Purpose                                               |
| ------------------------------------------------- | ----------------------------------------------------- |
| `nuxt.config.ts`                                  | Security headers, CSP, rate limiter, CSRF, routeRules |
| `layers/1-auth/server/middleware/01.auth.ts`      | Token management                                      |
| `layers/1-auth/server/utils/auth.ts`              | `fetchSinapse()`, cookie helpers                      |
| `layers/1-auth/app/utils/auth.ts`                 | `isValidRedirectUrl()`, `getSafeRedirectUrl()`        |
| `layers/3-usuarios/server/middleware/02.admin.ts` | Admin route guard                                     |

### OWASP Top 10 Quick Check

1. **Injection**: Zod validation on all inputs
2. **Broken Auth**: httpOnly cookies, auto-refresh
3. **Sensitive Data Exposure**: No tokens in client, HSTS enforced
4. **XXE**: Not applicable (JSON only)
5. **Broken Access Control**: Middleware chain (01.auth, 02.admin)
6. **Security Misconfiguration**: nuxt-security module handles defaults
7. **XSS**: CSP + xssValidator enabled
8. **Insecure Deserialization**: Zod parsing validates structure
9. **Known Vulnerabilities**: `npm audit` + regular dependency updates
10. **Insufficient Logging**: Server-side `logAuthError()` for security events
