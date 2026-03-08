---
type: doc
name: architecture
description: System architecture, layers, patterns, and design decisions
category: architecture
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Architecture Notes

Detecta Alerta uses a **layers-only** Nuxt 4 architecture. There is no root `app/` directory - all code lives inside numbered layers under `layers/`. This enforces separation of concerns and allows features to be developed independently.

## System Architecture Overview

The system is a modular monolith deployed as a single Nuxt application. The Nuxt server acts as a BFF (Backend-for-Frontend), proxying authenticated requests to the Sinapse API (Python/FastAPI backend). Client-side rendering uses Vue 3 with SSR support.

```
Browser → Nuxt Server (BFF) → Sinapse API (FastAPI)
                ↓
         layers/*/server/api/ → fetchSinapse() → NUXT_SINAPSE_API_URL
```

## Architectural Layers

Layers use semantic names and explicit `extends` in `nuxt.config.ts`. Order in the array defines priority (last = highest).

| Layer           | Purpose                                                                     | Key Directories                                                               |
| --------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `base`          | Foundation: app.vue, error.vue, CSS, shadcn-vue, shared types/domain, utils | `app/components/ui/`, `app/composables/`, `shared/types/`, `shared/domain/`   |
| `auth`          | Authentication BFF: login, logout, signup, JWT cookies, middleware          | `server/api/auth/`, `server/utils/auth.ts`, `app/composables/useAuthStore.ts` |
| `home`          | Landing page, public pages                                                  | `app/pages/`, `app/composables/useHome*.ts`                                   |
| `meu-municipio` | Municipal surveillance page (MapLibre GL map + sidebar)                     | `app/pages/meu-municipio/`, `app/composables/useMeuMunicipio*.ts`             |
| `mapa-risco`    | Epidemiological risk map                                                    | `app/pages/mapa-risco/`                                                       |
| `usuarios`      | User profile, admin management of users, groups, permissions                | `server/api/usuarios/`, `app/composables/useUsuarios*.ts`                     |
| `rumores`       | Epidemiological rumors feed, filters, CRUD                                  | `server/api/rumores/`, `app/composables/useRumores*.ts`                       |
| `docs`          | Project documentation via Nuxt Content                                      | `app/pages/docs/`, `app/composables/useDocsNavigation.ts`                     |

> See [`codebase-map.json`](./codebase-map.json) for complete symbol counts and dependency graphs.

## Detected Design Patterns

| Pattern                 | Confidence | Locations                               | Description                                             |
| ----------------------- | ---------- | --------------------------------------- | ------------------------------------------------------- |
| BFF Proxy               | 95%        | `layers/*/server/api/`                  | Server endpoints proxy to Sinapse API with auth headers |
| Composition API Store   | 95%        | `useAuthStore`, `useRumoresStore`, etc. | Pinia stores using `defineStore` with setup function    |
| Service Layer           | 90%        | `use*Api.ts` composables                | Thin $fetch wrappers separating API calls from state    |
| Feature Layer           | 90%        | `layers/{feature}/`                     | Each feature is an isolated Nuxt layer                  |
| Server Middleware Chain | 85%        | `01.auth.ts`, `02.admin.ts`             | Numeric prefixes define middleware execution order      |

## Entry Points

- [`nuxt.config.ts`](../../nuxt.config.ts) - Root config, layer registration, modules, routeRules
- [`layers/base/app/app.vue`](../../layers/base/app/app.vue) - Root Vue component
- [`layers/auth/server/middleware/01.auth.ts`](../../layers/auth/server/middleware/01.auth.ts) - Auth middleware (runs on every request)

## Shared Domain Layer

`layers/base/shared/domain/` contains domain primitives shared between client (`app/`) and server (`server/`):

- **Result** (`result.ts`): Discriminated union for typed error handling. Used by Value Objects' `tryCreate*()` functions.
- **Value Objects**: Immutable objects via factory function + `Object.freeze()`. Located in `app/utils/` (auto-imported). Each VO has `create*()` (throws) and `tryCreate*()` (returns `Result<T>`).

Import via `#shared/domain/result` (alias configured in Nuxt and Vitest).

## Internal System Boundaries

- **Auth boundary**: `layers/auth/server/` owns all token management. Client-side code never accesses tokens directly.
- **Admin boundary**: `layers/usuarios/server/middleware/02.admin.ts` guards admin routes.
- **Generated code boundary**: `generated/sinapse/` is auto-generated by Kubb. Never edit manually.
- **Domain boundary**: `layers/base/shared/domain/` contains pure domain logic with no framework dependencies.

## External Service Dependencies

- **Sinapse API** (`NUXT_SINAPSE_API_URL`): Primary backend. REST API with OpenAPI spec. Auth via Bearer JWT tokens.
- **OpenAPI Spec** (`https://staging.sinapse.org.br/openapi.json`): Source for Kubb code generation.

## Key Decisions & Trade-offs

- **Layers-only**: No root `app/` prevents accidental code outside the layer system. Trade-off: slightly more verbose paths (`~/layers/...`).
- **BFF pattern**: Server-side proxy keeps tokens in httpOnly cookies (never exposed to client JS). Trade-off: all API calls go through Nuxt server.
- **Kubb code generation**: Types and Zod schemas auto-generated from OpenAPI. Trade-off: `generated/` directory is large but ensures type safety with backend.

## Top Directories Snapshot

- `layers/` - 8 feature layers (~150 files)
- `generated/sinapse/` - Auto-generated API client (~800 files)
- `tests/` - Unit, integration, E2E tests (~20 files)
- `content/docs/` - Markdown documentation (~15 files)

## Related Resources

- [Project Overview](./project-overview.md)
- [Security Notes](./security.md)
- [`codebase-map.json`](./codebase-map.json)
