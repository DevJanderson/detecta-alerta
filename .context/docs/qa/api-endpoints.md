---
slug: api-endpoints
category: features
generatedAt: 2026-03-08T16:50:00.000Z
relevantFiles:
  - layers/base/shared/types/api.ts
  - layers/base/server/utils/validation.ts
  - layers/base/server/utils/api-handler.ts
  - layers/base/server/utils/query.ts
  - layers/auth/server/utils/auth.ts
  - layers/auth/server/utils/sinapse.ts
  - layers/auth/server/api/auth/login.post.ts
  - layers/usuarios/server/api/usuarios/admin/index.get.ts
---

# What API endpoints are available?

## Tipos Base

Definidos em `layers/base/shared/types/api.ts`:

| Tipo                   | Descricao                                                 |
| ---------------------- | --------------------------------------------------------- |
| `ApiResponse<T>`       | `{ data: T, success: boolean, message?: string }`         |
| `PaginatedResponse<T>` | `{ data: T[], meta: { total, page, perPage, lastPage } }` |
| `ApiError`             | Estrutura de erro da API                                  |

## Endpoints por Dominio

### Auth (`layers/auth/server/api/auth/`)

| Metodo | Rota                       | Descricao               | Auth |
| ------ | -------------------------- | ----------------------- | ---- |
| POST   | `/api/auth/login`          | Login                   | Nao  |
| POST   | `/api/auth/logout`         | Logout                  | Sim  |
| POST   | `/api/auth/refresh`        | Refresh token           | Nao  |
| GET    | `/api/auth/me`             | Dados do usuario logado | Sim  |
| POST   | `/api/auth/signup`         | Cadastro                | Nao  |
| POST   | `/api/auth/reset-password` | Reset de senha          | Nao  |

### Usuarios - Admin (`layers/usuarios/server/api/usuarios/admin/`)

| Metodo | Rota                      | Descricao         | Auth  |
| ------ | ------------------------- | ----------------- | ----- |
| GET    | `/api/usuarios/admin`     | Listar usuarios   | Admin |
| POST   | `/api/usuarios/admin`     | Criar usuario     | Admin |
| GET    | `/api/usuarios/admin/:id` | Obter usuario     | Admin |
| PUT    | `/api/usuarios/admin/:id` | Atualizar usuario | Admin |
| DELETE | `/api/usuarios/admin/:id` | Remover usuario   | Admin |

### Grupos - Admin (`layers/usuarios/server/api/usuarios/admin/grupos/`)

| Metodo | Rota                                              | Descricao               | Auth  |
| ------ | ------------------------------------------------- | ----------------------- | ----- |
| GET    | `/api/usuarios/admin/grupos`                      | Listar grupos           | Admin |
| POST   | `/api/usuarios/admin/grupos`                      | Criar grupo             | Admin |
| GET    | `/api/usuarios/admin/grupos/:id`                  | Obter grupo             | Admin |
| PUT    | `/api/usuarios/admin/grupos/:id`                  | Atualizar grupo         | Admin |
| DELETE | `/api/usuarios/admin/grupos/:id`                  | Remover grupo           | Admin |
| POST   | `/api/usuarios/admin/grupos/:id/usuarios/:userId` | Add usuario ao grupo    | Admin |
| DELETE | `/api/usuarios/admin/grupos/:id/usuarios/:userId` | Remove usuario do grupo | Admin |

### Permissoes - Admin (`layers/usuarios/server/api/usuarios/admin/permissoes/`)

| Metodo | Rota                                                             | Descricao                   | Auth  |
| ------ | ---------------------------------------------------------------- | --------------------------- | ----- |
| GET    | `/api/usuarios/admin/permissoes`                                 | Listar permissoes           | Admin |
| POST   | `/api/usuarios/admin/permissoes`                                 | Criar permissao             | Admin |
| GET    | `/api/usuarios/admin/permissoes/:id`                             | Obter permissao             | Admin |
| PUT    | `/api/usuarios/admin/permissoes/:id`                             | Atualizar permissao         | Admin |
| DELETE | `/api/usuarios/admin/permissoes/:id`                             | Remover permissao           | Admin |
| POST   | `/api/usuarios/admin/permissoes/usuarios/:userId/add/:permId`    | Add permissao a usuario     | Admin |
| DELETE | `/api/usuarios/admin/permissoes/usuarios/:userId/remove/:permId` | Remove permissao de usuario | Admin |

### Perfil (`layers/usuarios/server/api/usuarios/perfil/`)

| Metodo | Rota                               | Descricao        | Auth |
| ------ | ---------------------------------- | ---------------- | ---- |
| GET    | `/api/usuarios/perfil/me`          | Dados do perfil  | Sim  |
| PUT    | `/api/usuarios/perfil/me`          | Atualizar perfil | Sim  |
| POST   | `/api/usuarios/perfil/upload-foto` | Upload de foto   | Sim  |

### Health

| Metodo | Rota          | Descricao    | Auth |
| ------ | ------------- | ------------ | ---- |
| GET    | `/api/health` | Health check | Nao  |

## Utilitarios Server (auto-importados)

### Validacao (`layers/base/server/utils/validation.ts`)

```typescript
// Valida body com Zod — lanca 400 com ValidationErrors.INVALID_BODY
const data = await validateBody(event, myZodSchema)

// Valida route param numerico — lanca 400 com ValidationErrors.INVALID_PARAM
const id = validateRouteParam(event, 'id')

// Valida route param UUID
const uuid = validateUniqueId(event, 'uniqueId')
```

### Query string (`layers/base/server/utils/query.ts`)

```typescript
// Constroi query params com whitelist
const qs = buildQueryString(getQuery(event), ['page', 'search', 'status'])
```

### API Sinapse (`layers/auth/server/utils/`)

```typescript
// Fetch pre-configurado com Authorization header
const data = await fetchSinapse('/endpoint', { accessToken })

// Wrapper centralizado com tratamento de erros
return handleSinapseRequest({
  fn: () => fetchSinapse('/endpoint', { event }),
  errorContext: 'Erro ao buscar dados',
  schema: myZodSchema // opcional
})
```

### Auth helpers (`layers/auth/server/utils/auth.ts`)

```typescript
// Funcoes para gerenciar cookies de auth
setAuthCookies(event, accessToken, refreshToken)
clearAuthCookies(event)
getAccessTokenFromCookie(event)
getRefreshTokenFromCookie(event)

// Middleware helpers
requireAuth(event) // lanca 401 com AuthErrors.NOT_AUTHENTICATED
requireAdmin(event) // lanca 403 com AuthErrors.ADMIN_ONLY
```

## Padrao de Endpoint

Todos os endpoints seguem a mesma estrutura:

```typescript
import { UsuariosErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  // 1. Auth (via middleware ou manual)
  requireAdmin(event)

  // 2. Validacao
  const id = validateRouteParam(event, 'id')
  const body = await validateBody(event, updateSchema)

  // 3. Chamada a API Sinapse
  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/${id}`, {
        method: 'PUT',
        body,
        accessToken: event.context.auth.accessToken
      }),
    errorContext: UsuariosErrors.UPDATE_FAILED
  })
})
```

## Tratamento de Erros nos Endpoints

Domain errors de `#shared/domain/errors` sao usados como `errorContext` no `handleSinapseRequest` e como `statusMessage` no `createError`:

```typescript
// Via handleSinapseRequest (mais comum)
handleSinapseRequest({ fn, errorContext: UsuariosErrors.LIST_FAILED })

// Via createError direto (middlewares, validacao)
throw createError({ statusCode: 403, statusMessage: AuthErrors.ADMIN_ONLY })
```
