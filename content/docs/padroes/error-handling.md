---
title: 'Error Handling'
description: 'Como tratar erros em todos os níveis: domain errors, withStoreAction, validação no servidor.'
order: 3
---

# Error Handling

O projeto trata erros de forma padronizada em todos os níveis. Este guia mostra como usar cada peça.

## Domain Errors — Mensagens centralizadas

Em vez de escrever textos de erro soltos pelo código, todas as mensagens ficam em um único arquivo, organizadas por domínio:

```typescript
// layers/base/shared/domain/errors.ts

export const AuthErrors = {
  LOGIN_FAILED: 'Erro ao fazer login',
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  SESSION_EXPIRED: 'Sessão expirada'
} as const

export const RumoresErrors = {
  LIST_FAILED: 'Erro ao listar rumores',
  CREATE_FAILED: 'Erro ao criar rumor'
} as const
```

### Todos os domain errors do projeto

| Objeto             | Domínio       | Exemplos de erros                                        |
| ------------------ | ------------- | -------------------------------------------------------- |
| `AuthErrors`       | Autenticação  | `LOGIN_FAILED`, `INVALID_CREDENTIALS`, `SESSION_EXPIRED` |
| `UsuariosErrors`   | Usuários      | `LIST_FAILED`, `CREATE_FAILED`, `PHOTO_TOO_LARGE`        |
| `GruposErrors`     | Grupos        | `LIST_FAILED`, `ADD_USER_FAILED`                         |
| `PermissoesErrors` | Permissões    | `LIST_FAILED`, `ADD_TO_USER_FAILED`                      |
| `HomeErrors`       | Homepage      | `PANORAMA_FAILED`, `TABLE_FAILED`                        |
| `ValidationErrors` | Validação BFF | `INVALID_BODY`, `INVALID_PARAM(name)`                    |

### Como usar

```typescript
import { UsuariosErrors } from '#shared/domain/errors'

// No store → como mensagem de fallback do withStoreAction
withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => { ... })

// No servidor → como mensagem de erro HTTP
throw createError({ statusCode: 400, statusMessage: UsuariosErrors.CREATE_FAILED })

// No componente → para reagir a um erro específico
if (error.value === AuthErrors.INVALID_CREDENTIALS) {
  // mostrar mensagem especial para credenciais inválidas
}
```

## Client — Stores com `withStoreAction`

Todo store do projeto usa `withStoreAction` para tratar erros nas actions. Ele faz 3 coisas automaticamente:

1. **Liga o loading** (`isLoading = true`) antes de executar
2. **Desliga o loading** (`isLoading = false`) quando termina
3. **Captura erros** e coloca a mensagem em `error.value`

### Exemplo completo

```typescript
export const useRumoresStore = defineStore('rumores', () => {
  const items = shallowRef<Rumor[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useRumoresApi()
  const refs = { isLoading, error } // Objeto reutilizado

  // Action que não retorna valor
  async function fetchAll(): Promise<void> {
    return withStoreAction(refs, RumoresErrors.LIST_FAILED, async () => {
      items.value = await api.listar()
    })
  }

  // Action que retorna boolean (true = sucesso, false = erro)
  async function criar(data: CriarData): Promise<boolean> {
    return withStoreAction(
      refs,
      RumoresErrors.CREATE_FAILED,
      async () => {
        await api.criar(data)
        return true
      },
      false // ← valor retornado se der erro
    )
  }

  return { items, isLoading, error, fetchAll, criar }
})
```

### `extractErrorMessage()`

Função que extrai uma mensagem legível de qualquer tipo de erro (`Error`, `FetchError`, `string`, `unknown`). É usada internamente pelo `withStoreAction`, mas você pode usar diretamente se tiver um fluxo customizado.

## Server — Validação nos endpoints

O servidor tem utilitários prontos para validar dados que chegam do client:

```typescript
// Validar body com schema Zod → retorna 400 se inválido
const data = await validateBody(event, meuZodSchema)

// Validar que um parâmetro da URL é número → retorna 400 se não for
const id = validateRouteParam(event, 'id')

// Validar que um parâmetro é UUID → retorna 400 se não for
const uuid = validateUniqueId(event, 'uniqueId')
```

### Chamadas à API Sinapse

Use `handleSinapseRequest` para chamar a API Sinapse com tratamento de erros:

```typescript
export default defineEventHandler(async event => {
  requireAuth(event) // Verifica se está logado

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/rumores', {
        accessToken: event.context.auth.accessToken
      }),
    errorContext: RumoresErrors.LIST_FAILED, // Mensagem se der erro
    schema: rumoresSchema // Validação Zod opcional
  })
})
```

### Auth helpers

```typescript
requireAuth(event) // → 401 se não autenticado
requireAdmin(event) // → 403 se não é admin
```

## Server — Use Cases (lógica complexa)

Quando a lógica do servidor é mais complexa que uma simples chamada à API, use um **use case** que retorna `Result`:

```typescript
// Use case — lógica pura e testável
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
```

## Fluxo completo — do servidor até a tela

Quando um erro acontece, ele percorre este caminho:

::docs-mermaid{title="Caminho do erro do servidor até a tela"}
graph TD
A["API Sinapse retorna erro"] --> B["Server Route captura"]
B --> C["createError + domain error"]
C --> D["$fetch no client recebe FetchError"]
D --> E["withStoreAction captura"]
E --> F["extractErrorMessage → error.value"]
F --> G["Componente exibe o erro"]
::

Em texto:

```
1. API Sinapse retorna erro (ex: 500)
2. Server route captura e lança createError(statusCode, domain error)
3. $fetch no client recebe um FetchError
4. withStoreAction captura o erro
5. extractErrorMessage extrai a mensagem → salva em error.value
6. Componente exibe error.value para o usuário
```

## Como adicionar erros para uma feature nova

1. Criar objeto `as const` em `layers/base/shared/domain/errors.ts`:

```typescript
export const MinhaFeatureErrors = {
  LIST_FAILED: 'Erro ao listar dados',
  CREATE_FAILED: 'Erro ao criar registro'
} as const
```

2. Exportar no barrel `layers/base/shared/domain/index.ts`
3. Usar nos stores: `withStoreAction(refs, MinhaFeatureErrors.LIST_FAILED, ...)`
4. Usar nos server routes: `handleSinapseRequest({ errorContext: MinhaFeatureErrors.X })`
