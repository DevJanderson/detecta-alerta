# Arquitetura - Detecta Alerta

## Stack

- **Framework:** Nuxt 4 (layers-only, sem pasta app/ na raiz)
- **UI:** shadcn-vue (reka-ui headless) + Tailwind CSS v4 (config em CSS, sem tailwind.config.js)
- **State:** Pinia (Composition API) + pinia-plugin-persistedstate
- **Validacao:** Zod (server) + VeeValidate (forms) + Value Objects (domínio)
- **Mapas:** MapLibre GL (API direta, sem módulo Nuxt)
- **Tabelas:** TanStack Vue Table
- **Testes:** Vitest (unit + nuxt projects) + Playwright (e2e)
- **SEO:** @nuxtjs/seo (sitemap, robots, schema.org)
- **Seguranca:** nuxt-security (CSP, rate limiter, CSRF via nuxt-csurf)
- **Icons:** Lucide via @nuxt/icon
- **Toasts:** vue-sonner
- **Mascaras:** maska

## Layers (ordem de prioridade crescente)

```
base → auth → home → meu-municipio → mapa-risco → usuarios → rumores → docs
```

## Fluxo de Dados

```
UI (Vue) → Store (Pinia) → Service (useXxxApi) → BFF (Nitro) → API Sinapse
```

## Autenticacao

- Tokens em cookies httpOnly (nunca localStorage)
- Server middleware `01.auth.ts` extrai token + auto-refresh
- Server middleware `02.admin.ts` verifica grupo admin
- Client middleware `auth.global.ts` inicializa state + revalida a cada 5min
- Client middleware `auth-guard.ts` protege rotas autenticadas

## Stores (6 Pinia stores)

| Store         | Persist | Dados reais?      |
| ------------- | ------- | ----------------- |
| auth          | Nao     | Sim (Sinapse API) |
| home          | filtros | NAO (mock)        |
| meu-municipio | Nao     | NAO (mock)        |
| usuarios      | Nao     | Sim (Sinapse API) |
| grupos        | Nao     | Sim (Sinapse API) |
| permissoes    | Nao     | Sim (Sinapse API) |

## Endpoints BFF (31+)

- `/api/auth/*` — 6 endpoints (login, logout, me, refresh, reset-password, signup)
- `/api/usuarios/admin/*` — 5 endpoints CRUD users
- `/api/usuarios/admin/grupos/*` — 7 endpoints CRUD groups + membros
- `/api/usuarios/admin/permissoes/*` — 7 endpoints CRUD permissions + assign
- `/api/usuarios/perfil/*` — 3 endpoints (me, update, upload-foto)
- `/api/health` — health check

## Design System

- Paleta: primary (vermelho/coral), secondary (azul), base (neutros), success, alert, danger
- Escala: {50-950} para cada cor
- Tokens CSS em `layers/base/app/assets/css/main.css`
- shadcn-vue components em `layers/base/app/components/ui/` (22 componentes)
