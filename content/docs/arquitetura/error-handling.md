---
title: 'Arquitetura — Error Handling'
description: 'Domain errors centralizados, withStoreAction e fluxo completo de tratamento de erros.'
order: 3
---

# Arquitetura — Error Handling

O projeto usa **domain errors tipados** — constantes `as const` organizadas por domínio, compartilhadas entre client e server via `#shared/domain/errors`.

## Domain Errors

Cada domínio tem seu objeto de erros em `layers/base/shared/domain/errors.ts`:

| Objeto             | Domínio       | Exemplos                                                 |
| ------------------ | ------------- | -------------------------------------------------------- |
| `AuthErrors`       | Autenticação  | `LOGIN_FAILED`, `INVALID_CREDENTIALS`, `SESSION_EXPIRED` |
| `UsuariosErrors`   | Usuários      | `LIST_FAILED`, `CREATE_FAILED`, `PHOTO_TOO_LARGE`        |
| `GruposErrors`     | Grupos        | `LIST_FAILED`, `ADD_USER_FAILED`                         |
| `PermissoesErrors` | Permissões    | `LIST_FAILED`, `ADD_TO_USER_FAILED`                      |
| `HomeErrors`       | Homepage      | `PANORAMA_FAILED`, `TABLE_FAILED`                        |
| `ValidationErrors` | Validação BFF | `INVALID_BODY`, `INVALID_PARAM(name)`                    |

### Uso

```typescript
import { UsuariosErrors } from '#shared/domain/errors'

// No store (client)
withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => { ... })

// No server route
throw createError({ statusCode: 400, statusMessage: UsuariosErrors.CREATE_FAILED })

// No componente (reação a código específico)
if (error.value === AuthErrors.INVALID_CREDENTIALS) {
  // mostrar mensagem específica
}
```

### Tipos utilitários

```typescript
type AuthErrorCode = (typeof AuthErrors)[keyof typeof AuthErrors]
// => 'Credenciais inválidas' | 'Sessão expirada...' | ...
```

## Client: Stores

### `withStoreAction()`

Wrapper que elimina boilerplate de `isLoading` / `error` / `try-catch` em todas as actions de store:

```typescript
// Sem retorno (void)
async function fetchAll(): Promise<void> {
  return withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => {
    items.value = await api.listar()
  })
}

// Com retorno e defaultValue
async function criar(data: CreateData): Promise<boolean> {
  return withStoreAction(
    refs,
    UsuariosErrors.CREATE_FAILED,
    async () => {
      await api.criar(data)
      return true
    },
    false
  ) // retorna false em caso de erro
}
```

**Todos os stores do projeto** seguem este padrão. O segundo argumento é sempre um domain error.

### `extractErrorMessage()`

Função pura que extrai string de qualquer tipo de erro (`Error`, `FetchError`, `string`, `unknown`). Usada internamente pelo `withStoreAction` e diretamente em stores com fluxo customizado.

## Server: Endpoints BFF

### Validação

Utilitários auto-importados em `layers/base/server/utils/validation.ts`:

```typescript
// Valida body com Zod → 400 + ValidationErrors.INVALID_BODY
const data = await validateBody(event, myZodSchema)

// Valida param numérico → 400 + ValidationErrors.INVALID_PARAM
const id = validateRouteParam(event, 'id')

// Valida param UUID
const uuid = validateUniqueId(event, 'uniqueId')
```

### Chamadas à API Sinapse

```typescript
// handleSinapseRequest — wrapper com tratamento de erros
return handleSinapseRequest({
  fn: () => fetchSinapse(`/usuarios/${id}`, { accessToken }),
  errorContext: UsuariosErrors.UPDATE_FAILED,
  schema: myZodSchema // validação Zod opcional
})
```

### Auth helpers

```typescript
requireAuth(event) // → 401 + AuthErrors.NOT_AUTHENTICATED
requireAdmin(event) // → 403 + AuthErrors.ADMIN_ONLY
```

## Server: Use Cases

Para lógica de negócio complexa, use cases retornam `Result<T>` em vez de lançar exceções:

```typescript
// Use case puro e testável
export async function executeLogin(input: LoginInput): Promise<Result<LoginOutput>> {
  try {
    const tokens = await fetchSinapse('/auth/login', { method: 'POST', body: input })
    const user = await fetchSinapse('/usuarios/me', { accessToken: tokens.access_token })
    return ok({ user, accessToken: tokens.access_token, refreshToken: tokens.refresh_token })
  } catch (error) {
    if (isCredentialsError(error)) return fail(AuthErrors.INVALID_CREDENTIALS)
    return fail(AuthErrors.LOGIN_FAILED)
  }
}

// Adapter HTTP converte Result → resposta H3
export function handleLoginResult(event: H3Event, result: Result<LoginOutput>) {
  if (!result.ok) {
    throw createError({ statusCode: 401, statusMessage: result.error })
  }
  setAuthCookies(event, result.value.accessToken, result.value.refreshToken)
  return { user: result.value.user }
}
```

## Fluxo Completo

::docs-mermaid{title="Fluxo de erro do servidor até a UI"}
graph TD
A["API Sinapse"] -->|FetchError| B["Server Route"]
B -->|createError + domain error| C["$fetch no client"]
C -->|FetchError| D["withStoreAction"]
D -->|extractErrorMessage| E["store.error.value"]
E --> F["Componente exibe erro"]
::

```
Sinapse retorna erro
  → Server route captura, lança createError(statusCode, domain error)
    → $fetch no client recebe FetchError
      → withStoreAction captura, extractErrorMessage → error.value
        → Componente exibe error.value ao usuário
```

## Como adicionar erros para novo domínio

1. Criar objeto `as const` em `layers/base/shared/domain/errors.ts`:

```typescript
export const RumoresErrors = {
  LIST_FAILED: 'Erro ao listar rumores',
  CREATE_FAILED: 'Erro ao criar rumor'
} as const
```

2. Exportar no barrel `layers/base/shared/domain/index.ts`
3. Importar nos stores: `import { RumoresErrors } from '#shared/domain/errors'`
4. Usar como segundo argumento do `withStoreAction()`
5. Usar nos server routes com `handleSinapseRequest({ errorContext: RumoresErrors.X })`
