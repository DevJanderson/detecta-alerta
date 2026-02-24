---
type: doc
name: glossary
description: Project terminology, type definitions, domain entities, and business rules
category: glossary
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Domain Glossary

### Epidemiological Domain

| Term                          | Definition                                                                                  |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| **Rumor**                     | An epidemiological news item (health-related media report) monitored for outbreak detection |
| **Agravo**                    | A health condition or disease being tracked (e.g., dengue, COVID-19)                        |
| **Surto**                     | An outbreak — unusual increase in disease cases in a specific area                          |
| **Vigilância epidemiológica** | Epidemiological surveillance — systematic monitoring of disease patterns                    |
| **UBS**                       | Unidade Básica de Saúde — primary healthcare facility                                       |
| **UPA**                       | Unidade de Pronto Atendimento — urgent care facility                                        |
| **Drogaria**                  | Pharmacy (tracked as health data source)                                                    |

### System Entities

| Entity            | Description                                              | Layer             |
| ----------------- | -------------------------------------------------------- | ----------------- |
| **AuthUser**      | Authenticated user with permissions and groups           | 1-auth            |
| **AuthPermissao** | Permission code (e.g., `dashboard.view`, `reports.view`) | 1-auth            |
| **AuthGrupo**     | User group (e.g., `administradores`)                     | 1-auth            |
| **Usuario**       | User management entity (admin CRUD)                      | 3-usuarios        |
| **Grupo**         | Group management entity (admin CRUD)                     | 3-usuarios        |
| **Permissao**     | Permission management entity (admin CRUD)                | 3-usuarios        |
| **CasoAgravo**    | Disease case record from Sinapse API                     | generated/sinapse |
| **Token**         | JWT token pair (access_token + refresh_token)            | generated/sinapse |
| **LoginRequest**  | Login credentials (username + password)                  | generated/sinapse |

### Architecture Terms

| Term             | Definition                                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| **BFF**          | Backend-for-Frontend — Nuxt server acts as proxy between browser and Sinapse API                               |
| **Layer**        | Nuxt Layer — isolated feature module under `layers/` with its own config, components, pages, and server routes |
| **Sinapse API**  | External Python/FastAPI backend that provides all business logic and data                                      |
| **fetchSinapse** | Server-side utility to make authenticated requests to Sinapse API                                              |
| **Kubb**         | Code generation tool that creates TypeScript types and Zod schemas from OpenAPI spec                           |

### Composable Patterns

| Pattern     | Convention             | Example                                                          |
| ----------- | ---------------------- | ---------------------------------------------------------------- |
| **Service** | `use{Feature}Api.ts`   | `useAuthApi()` — thin `$fetch` wrapper                           |
| **Store**   | `use{Feature}Store.ts` | `useAuthStore()` — Pinia store with `defineStore` setup function |
| **Types**   | `types.ts`             | Interface definitions per layer                                  |

### Key Types (from Kubb)

All types below are auto-generated in `generated/sinapse/types/` and should be imported with `import type`:

- `Token` — JWT token response (`access_token`, `refresh_token`)
- `LoginRequest` — Login credentials
- `UsuarioSchemaDetalhes` — Full user details
- `CasoAgravo` — Disease case record
- `RumorSchema` — Epidemiological rumor

### Zod Schemas (from Kubb)

Validation schemas in `generated/sinapse/zod/` used in BFF endpoints:

- `tokenSchema` — Validates token responses
- `loginRequestSchema` — Validates login input
- `usuarioSchemaDetalhesSchema` — Validates user detail responses

## Related Resources

- [Project Overview](./project-overview.md)
- [Architecture](./architecture.md)
