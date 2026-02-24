---
type: doc
name: project-overview
description: High-level overview of the project, its purpose, and key components
category: overview
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Project Overview

Detecta Alerta is a real-time epidemiological surveillance and monitoring platform for Brazil. It centralizes health facility data (UBS, UPA, pharmacies) to analyze epidemiological patterns and enable early outbreak detection. Built by ITpS (Instituto Todos pela Saude).

> **Detailed Analysis**: For complete symbol counts, architecture layers, and dependency graphs, see [`codebase-map.json`](./codebase-map.json).

## Quick Facts

- **Root**: `/home/devnote/Documentos/00-Work/ITpS/versao_nuxt/detecta-alerta`
- **Language**: TypeScript (Nuxt 4 / Vue 3)
- **Framework**: Nuxt 4 + shadcn-vue + Tailwind CSS v4
- **Architecture**: Layers-only (no root `app/` directory)
- **API Backend**: Sinapse API (Python/FastAPI) via BFF proxy
- **Full analysis**: [`codebase-map.json`](./codebase-map.json)

## Entry Points

- [`nuxt.config.ts`](../../nuxt.config.ts) - Root Nuxt configuration, registers all layers
- [`layers/0-base/nuxt.config.ts`](../../layers/0-base/nuxt.config.ts) - Foundation layer config
- [`layers/1-auth/nuxt.config.ts`](../../layers/1-auth/nuxt.config.ts) - Auth layer config
- [`kubb.config.ts`](../../kubb.config.ts) - API client generation config
- [`vitest.config.ts`](../../vitest.config.ts) - Test configuration
- [`playwright.config.ts`](../../playwright.config.ts) - E2E test configuration

## Key Exports

See [`codebase-map.json`](./codebase-map.json) for the complete exports list. Key composables: `useAuthStore`, `useRumoresStore`, `useUsuariosStore`, `useGruposStore`, `usePermissoesStore`.

## File Structure & Code Organization

- `layers/` - All application code organized as Nuxt layers
  - `0-base/` - Foundation: app.vue, CSS, shadcn-vue components, shared types, utils
  - `1-auth/` - Authentication BFF (login, logout, signup, JWT management)
  - `2-home/` - Landing page and public pages
  - `3-usuarios/` - User management, groups, permissions (admin area)
  - `4-rumores/` - Epidemiological rumors feed (news monitoring)
  - `5-docs/` - Project documentation (Nuxt Content)
- `generated/sinapse/` - Kubb-generated API client (types + Zod schemas) - DO NOT EDIT
- `tests/` - Unit, integration, and E2E tests
- `content/docs/` - Markdown documentation (projeto/backlog, projeto/decisoes)
- `public/` - Static assets

## Technology Stack Summary

**Runtime**: Node.js with Nuxt 4 (Vue 3, Nitro server)
**UI**: shadcn-vue components, Tailwind CSS v4, @tailwindcss/typography, Lucide icons, VeeValidate forms
**State**: Pinia stores with Composition API, pinia-plugin-persistedstate
**API Client**: Kubb (auto-generated from OpenAPI spec) with Zod validation
**Testing**: Vitest (unit + nuxt projects), Playwright (E2E)
**Tooling**: Prettier, ESLint, Husky, Commitlint, TypeScript strict mode
**Security**: nuxt-security (CSP, HSTS, rate limiter, CSRF, XSS)
**SEO**: @nuxtjs/seo (sitemap, robots, schema.org)

## Getting Started Checklist

1. Clone the repo and run `npm install`
2. Copy `.env.example` to `.env` and configure `NUXT_SINAPSE_API_URL`
3. Run `npm run setup` to configure git hooks (Husky, Commitlint)
4. Run `npm run dev` to start dev server at http://localhost:3000
5. Visit http://localhost:3000/design-system to review the color palette
6. Review [Development Workflow](./development-workflow.md) for day-to-day tasks

## Related Resources

- [Architecture Notes](./architecture.md)
- [Development Workflow](./development-workflow.md)
- [Tooling Guide](./tooling.md)
