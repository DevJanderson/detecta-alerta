---
slug: error-handling
category: operations
generatedAt: 2026-03-08T16:50:00.000Z
relevantFiles:
  - layers/base/shared/domain/errors.ts
  - layers/base/shared/domain/result.ts
  - layers/base/app/utils/store-helpers.ts
  - layers/base/app/utils/error.ts
  - layers/base/server/utils/validation.ts
  - layers/base/server/utils/api-handler.ts
  - layers/auth/server/utils/auth.ts
---

# How are errors handled?

## Visao Geral

O projeto usa uma abordagem de **domain errors tipados** — constantes `as const` organizadas por dominio, compartilhadas entre client e server via alias `#shared/domain/errors`.

Dois mecanismos complementares:

1. **Domain Errors** (`errors.ts`) — mensagens centralizadas com autocomplete
2. **Result** (`result.ts`) — discriminated union para fluxos sem excecoes (use cases, Value Objects)

## Domain Errors

### Estrutura

Cada dominio tem seu objeto `as const` em `layers/base/shared/domain/errors.ts`:

| Objeto             | Dominio       | Exemplos                                                 |
| ------------------ | ------------- | -------------------------------------------------------- |
| `AuthErrors`       | Autenticacao  | `LOGIN_FAILED`, `INVALID_CREDENTIALS`, `SESSION_EXPIRED` |
| `UsuariosErrors`   | Usuarios      | `LIST_FAILED`, `CREATE_FAILED`, `PHOTO_TOO_LARGE`        |
| `GruposErrors`     | Grupos        | `LIST_FAILED`, `ADD_USER_FAILED`                         |
| `PermissoesErrors` | Permissoes    | `LIST_FAILED`, `ADD_TO_USER_FAILED`                      |
| `HomeErrors`       | Homepage      | `PANORAMA_FAILED`, `TABLE_FAILED`                        |
| `ValidationErrors` | Validacao BFF | `INVALID_BODY`, `INVALID_PARAM(name)`                    |

### Import

```typescript
import { AuthErrors } from '#shared/domain/errors'
import { UsuariosErrors } from '#shared/domain/errors'
```

### Tipos utilitarios

```typescript
type AuthErrorCode = (typeof AuthErrors)[keyof typeof AuthErrors]
// => 'Credenciais invalidas' | 'Sessao expirada...' | ...
```

## Tratamento no Client (Stores)

### `withStoreAction()`

Wrapper em `layers/base/app/utils/store-helpers.ts` que elimina boilerplate de `isLoading` / `error` / `try-catch`:

```typescript
// Assinatura
withStoreAction<T>(refs: { isLoading, error }, errorMessage: string, fn, defaultValue?): Promise<T>
```

### Padrao nos stores

Todos os stores seguem o mesmo padrao — domain error como segundo argumento:

```typescript
async function fetchAll(): Promise<void> {
  return withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => {
    items.value = await api.listar()
  })
}

async function criar(data: CreateData): Promise<boolean> {
  return withStoreAction(
    refs,
    UsuariosErrors.CREATE_FAILED,
    async () => {
      await api.criar(data)
      return true
    },
    false
  ) // defaultValue: retorna false em caso de erro
}
```

### `extractErrorMessage()`

Funcao pura em `layers/base/app/utils/error.ts` que extrai string de qualquer tipo de erro (Error, FetchError, string, unknown). Usada internamente pelo `withStoreAction` e tambem diretamente em stores com fluxo customizado (ex: `useAuthStore.fetchUser`).

## Tratamento no Server (BFF)

### Server Routes

Endpoints usam `createError()` do H3 com domain errors como `statusMessage`:

```typescript
import { AuthErrors } from '#shared/domain/errors'

// Em middleware ou endpoint
throw createError({ statusCode: 401, statusMessage: AuthErrors.NOT_AUTHENTICATED })
throw createError({ statusCode: 403, statusMessage: AuthErrors.ADMIN_ONLY })
```

### Utilitarios de validacao

Em `layers/base/server/utils/validation.ts` (auto-importados pelo Nitro):

- `validateBody(event, zodSchema)` — le body + valida com Zod, lanca 400 com `ValidationErrors.INVALID_BODY`
- `validateRouteParam(event, name)` — valida param numerico, lanca 400 com `ValidationErrors.INVALID_PARAM(name)`
- `validateUniqueId(event, name)` — valida param UUID, lanca 400

### `handleSinapseRequest()`

Wrapper em `layers/base/server/utils/api-handler.ts` para chamadas a API Sinapse. Trata erros, valida com Zod (opcional), faz logging.

### `fetchSinapse()`

Fetch pre-configurado em `layers/auth/server/utils/` que injeta Authorization header. Erros de rede/auth sao capturados pelo `handleSinapseRequest` ou pelo use case.

## Result Pattern

Discriminated union em `layers/base/shared/domain/result.ts`:

```typescript
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }
```

### Helpers

| Funcao                       | Descricao                        |
| ---------------------------- | -------------------------------- |
| `ok(value)`                  | Cria Result de sucesso           |
| `fail(error)`                | Cria Result de falha             |
| `combineResults(results)`    | Combina multiplos Results        |
| `unwrap(result)`             | Extrai valor ou lanca erro       |
| `unwrapOr(result, fallback)` | Extrai valor ou retorna fallback |

### Uso em Use Cases

Use cases retornam `Result<T>` em vez de lancar excecoes. O adapter HTTP converte para resposta H3:

```typescript
// Use case (puro, testavel)
const result = await executeLogin({ username, password })

// Adapter (converte para HTTP)
if (!result.ok) {
  throw createError({ statusCode: 401, statusMessage: result.error })
}
return { user: result.value.user }
```

### Uso em Value Objects (`tryCreate`)

Factory functions de VOs retornam `Result<T>` para validacao sem excecoes:

```typescript
const result = tryCreateEmail('invalido')
if (!result.ok) console.log(result.error) // 'Email invalido'
```

## Fluxo Completo

```
UI Component
  → Store action (withStoreAction + domain error)
    → API composable ($fetch para BFF)
      → Server route (validateBody, createError + domain error)
        → fetchSinapse / handleSinapseRequest
          → API Sinapse externa

Erro retorna:
  API Sinapse → FetchError
    → Server route captura, lanca createError(statusCode, domain error)
      → $fetch no client recebe FetchError
        → withStoreAction captura, extractErrorMessage → error.value
          → Componente exibe error.value
```

## Como adicionar erros para novo dominio

1. Adicionar objeto `as const` em `layers/base/shared/domain/errors.ts`
2. Exportar no barrel `layers/base/shared/domain/index.ts`
3. Importar nos stores: `import { NovoErrors } from '#shared/domain/errors'`
4. Usar como segundo argumento do `withStoreAction()`
5. Usar nos server routes com `createError({ statusMessage: NovoErrors.X })`
