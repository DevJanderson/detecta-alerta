---
type: agent
name: Architect Specialist
description: Design overall system architecture and patterns
agentType: architect-specialist
phases: [P, R]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Architect Specialist Playbook

### Architecture Overview

```
Browser → Nuxt Server (BFF) → Sinapse API (FastAPI)
              ↓
       layers/*/server/api/ → fetchSinapse() → NUXT_SINAPSE_API_URL
```

**Pattern**: Modular monolith with layers-only architecture. No root `app/` directory.

### Layer System

| Layer        | Priority    | Purpose                                                   |
| ------------ | ----------- | --------------------------------------------------------- |
| `0-base`     | Lowest      | Foundation: app.vue, CSS, shadcn-vue, shared types, utils |
| `1-auth`     | Low         | Authentication BFF (JWT cookies, login, logout)           |
| `2-home`     | Medium      | Landing page, public pages                                |
| `3-usuarios` | Medium-High | User management, groups, permissions (admin)              |
| `4-rumores`  | High        | Epidemiological rumors feed, filters, CRUD                |
| `5-docs`     | Highest     | Project documentation (Nuxt Content)                      |

Higher number = higher priority = overrides lower layers.

### Design Principles

1. **Layer isolation**: Each feature is self-contained in its layer
2. **BFF proxy**: All API calls go through Nuxt server (tokens never exposed)
3. **Composable pattern**: `types.ts` → `use*Api.ts` (service) → `use*Store.ts` (state)
4. **Generated types**: Kubb generates types/schemas from OpenAPI — never edit `generated/`
5. **Middleware chain**: Numbered prefixes (`01.auth.ts`, `02.admin.ts`) define execution order

### Adding New Layers

1. Choose the next number prefix (currently 0-5)
2. Create `layers/{N}-{feature}/nuxt.config.ts`
3. Follow the composable pattern for API integration
4. Consider layer dependencies (can import from lower layers, not higher)

### Key Decisions

| Decision             | Rationale                                           |
| -------------------- | --------------------------------------------------- |
| Layers-only          | Prevents accidental code outside feature boundaries |
| BFF pattern          | Keeps JWT tokens secure in httpOnly cookies         |
| Kubb code generation | Ensures type safety with Sinapse API                |
| Dual Vitest projects | Optimizes test speed (Node vs happy-dom)            |
| shadcn-vue           | Accessible, customizable, works with Tailwind v4    |
