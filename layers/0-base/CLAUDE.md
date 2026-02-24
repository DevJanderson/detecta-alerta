# Base Layer - CLAUDE.md

Camada de fundacao com app.vue, error.vue, CSS global, componentes UI, composables, utilitarios e tipos compartilhados por todas as outras layers.

---

## Proposito

Esta layer fornece:

- **Fundacao da aplicacao** - `app.vue`, `error.vue`, CSS global, health check
- **Componentes UI** (shadcn-vue) - Primitivos de interface reutilizaveis
- **Componentes globais** - AppHeader, AppLoading, DeleteConfirmDialog
- **Composables globais** - useSeoPage, useDebounce
- **Utilitarios** - cn(), extractErrorMessage()
- **Layout padrao** - Header + conteudo
- **Tipos compartilhados** - ApiResponse, PaginatedResponse
- **Server utils** - handleSinapseRequest, validateBody, buildQueryString

---

## Estrutura

```
layers/0-base/
├── nuxt.config.ts              # CSS global, alias #shared
├── CLAUDE.md
│
├── app/
│   ├── app.vue                 # Root: Toaster (vue-sonner) + NuxtLayout + NuxtPage
│   ├── error.vue               # Pagina de erro (404, 500) com useSeoPage
│   ├── assets/css/
│   │   └── main.css            # Tailwind CSS v4 + variaveis de tema
│   ├── components/
│   │   ├── ui/                 # shadcn-vue (21 grupos, auto-import)
│   │   │   ├── alert/
│   │   │   ├── alert-dialog/
│   │   │   ├── avatar/
│   │   │   ├── badge/
│   │   │   ├── button/         # Variantes extras: brand-outline, brand-secondary-soft
│   │   │   ├── card/
│   │   │   ├── checkbox/
│   │   │   ├── collapsible/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   ├── input/
│   │   │   ├── label/
│   │   │   ├── pagination/
│   │   │   ├── scroll-area/
│   │   │   ├── select/
│   │   │   ├── separator/
│   │   │   ├── sheet/
│   │   │   ├── switch/
│   │   │   ├── table/
│   │   │   ├── tabs/
│   │   │   └── textarea/
│   │   └── common/
│   │       ├── AppHeader.vue           # Header: logos, nav desktop/mobile, auth menu
│   │       ├── AppLoading.vue          # Spinner (props: size, text)
│   │       └── DeleteConfirmDialog.vue # Dialog generico de exclusao (AlertDialog)
│   │
│   ├── composables/
│   │   ├── useSeoPage.ts       # SEO: title, OG, Twitter Cards, canonical
│   │   └── useDebounce.ts      # Debounce reativo (default 300ms)
│   │
│   ├── layouts/
│   │   └── default.vue         # AppHeader + main.flex-1
│   │
│   ├── pages/
│   │   └── design-system/
│   │       └── index.vue       # /design-system - visualizacao de cores e botoes
│   │
│   └── utils/
│       ├── utils.ts            # cn() - clsx + tailwind-merge
│       └── error.ts            # extractErrorMessage() - erros de $fetch
│
├── server/
│   ├── api/
│   │   └── health.get.ts       # GET /api/health
│   └── utils/                  # Auto-importados pelo Nitro em TODOS os endpoints
│       ├── api-handler.ts      # handleSinapseRequest({ fn, errorContext, schema? })
│       ├── query-builder.ts    # buildQueryString(query, allowedParams)
│       └── validation.ts       # validateBody(event, zodSchema), validateRouteParam(event, name)
│
└── shared/
    └── types/
        ├── api.ts              # ApiResponse<T>, ApiError, PaginatedResponse<T>, RequestOptions
        └── index.ts            # Barrel file → import type { ... } from '#shared/types'
```

---

## O que vai nesta Layer

| Tipo                      | Exemplos                                   | Local                    |
| ------------------------- | ------------------------------------------ | ------------------------ |
| Arquivos globais          | app.vue, error.vue, main.css               | `app/`                   |
| Componentes UI primitivos | Button, Card, Input, Dialog, Table         | `app/components/ui/`     |
| Componentes globais       | AppHeader, AppLoading, DeleteConfirmDialog | `app/components/common/` |
| Composables reutilizaveis | useSeoPage, useDebounce                    | `app/composables/`       |
| Funcoes utilitarias puras | cn, extractErrorMessage                    | `app/utils/`             |
| Layouts globais           | default                                    | `app/layouts/`           |
| Tipos TypeScript globais  | ApiResponse, PaginatedResponse             | `shared/types/`          |
| Server utils BFF          | handleSinapseRequest, validateBody         | `server/utils/`          |
| Endpoints utilitarios     | health check                               | `server/api/`            |

---

## O que NAO vai nesta Layer

| Tipo                               | Onde colocar                            |
| ---------------------------------- | --------------------------------------- |
| Componentes especificos de feature | `layers/{N}-{feature}/app/components/`  |
| Stores Pinia de feature            | `layers/{N}-{feature}/app/composables/` |
| Paginas                            | `layers/{N}-{feature}/app/pages/`       |
| Endpoints de API de feature        | `layers/{N}-{feature}/server/api/`      |

---

## Adicionar Componente shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes sao instalados em `app/components/ui/` (configurado em `components.json`).

---

## Componentes Comuns

### AppHeader

Header principal da aplicacao. Exibe logos ITpS + Detecta Alerta, navegacao desktop (5 links), menu mobile via `Sheet`, estado de autenticacao via `useAuthStore` e `AuthUserMenu` (da layer 1-auth).

### AppLoading

Spinner de carregamento. Props: `size` (`sm`/`md`/`lg`) e `text` (opcional).

### DeleteConfirmDialog

Dialog generico de confirmacao de exclusao. Props: `open`, `title`, `item: { id, nome } | null`. Emite `confirm(id)` e `update:open`. Reutilizado por todas as features que precisam de confirmacao de delete.

---

## Server Utils

Auto-importados pelo Nitro em todos os endpoints BFF do projeto:

```typescript
// handleSinapseRequest — wrapper centralizado para chamadas a API Sinapse
return handleSinapseRequest({
  fn: () => fetchSinapse('/endpoint', { event }),
  errorContext: 'Erro ao buscar dados',
  schema: myZodSchema // opcional, valida com Zod
})

// validateBody — le body + valida com Zod
const data = await validateBody(event, myZodSchema)

// validateRouteParam — valida que route param e numerico (previne path traversal)
const id = validateRouteParam(event, 'id')

// buildQueryString — constroi query params com whitelist
const qs = buildQueryString(getQuery(event), ['page', 'search', 'status'])
```

> **Nota:** `fetchSinapse` vive em `layers/1-auth/server/utils/auth.ts`, mas tambem e auto-importado pelo Nitro.

---

## Configuracao do CSS

```ts
// layers/0-base/nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/layers/0-base/app/assets/css/main.css'],
  alias: { '#shared': '../layers/0-base/shared' }
})
```

> **IMPORTANTE:** Use `~/layers/...` para referenciar arquivos em layers. Caminhos relativos como `./app/...` nao funcionam.

---

## Prioridade

Esta e a layer com **menor prioridade** (0). Todas as outras layers podem sobrescrever seus arquivos.

```
0-base < 1-auth < 2-home < 3-usuarios < 4-rumores < 5-docs
```
