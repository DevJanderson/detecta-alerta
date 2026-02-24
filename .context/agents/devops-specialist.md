---
type: agent
name: Devops Specialist
description: Design and maintain CI/CD pipelines
agentType: devops-specialist
phases: [E, C]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## DevOps Specialist Playbook

### Build & Deploy

| Command               | Purpose                         |
| --------------------- | ------------------------------- |
| `npm run build`       | Production build (Nuxt + Nitro) |
| `npm run typecheck`   | Type checking (CI gate)         |
| `npm run quality:fix` | Lint + format                   |
| `npm run test:run`    | All tests (CI gate)             |
| `npm run test:e2e`    | E2E tests (CI gate)             |

### Environment Variables

| Variable               | Scope       | Required                                      |
| ---------------------- | ----------- | --------------------------------------------- |
| `NUXT_SINAPSE_API_URL` | Server-only | Yes                                           |
| `NUXT_PUBLIC_SITE_URL` | Public      | No (default: `https://alerta.sinapse.org.br`) |

### Git Hooks (Husky)

- **pre-commit**: Commitlint validates commit message format
- Setup: `npm run setup`

### Commitlint Rules

- Subject: lower-case, max 72 chars
- Types: feat, fix, docs, style, refactor, perf, test, chore, ci, build, revert
- Scopes: auth, home, usuarios, rumores, docs, base, deps, kubb

### Playwright CI Configuration

- Browsers: Chromium, Firefox, Mobile Chrome + WebKit, Mobile Safari (CI only)
- Workers: 1 (CI), unlimited (local)
- Retries: 2 (CI), 0 (local)
- Artifacts: screenshots on failure, video on first retry

### Security Modules

- `nuxt-security`: Headers, rate limiter, CSRF, XSS validator
- CSP disabled in dev (HMR compatibility)

### Key Config Files

| File                   | Purpose                  |
| ---------------------- | ------------------------ |
| `nuxt.config.ts`       | Build, modules, security |
| `vitest.config.ts`     | Test projects            |
| `playwright.config.ts` | E2E browser matrix       |
| `kubb.config.ts`       | API client generation    |
| `.husky/`              | Git hooks                |
| `commitlint.config.ts` | Commit validation        |
