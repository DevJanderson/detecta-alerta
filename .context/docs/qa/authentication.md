---
slug: authentication
category: features
generatedAt: 2026-03-08T16:50:00.000Z
relevantFiles:
  - layers/auth/app/composables/useAuthStore.ts
  - layers/auth/app/composables/useAuthApi.ts
  - layers/auth/app/composables/types.ts
  - layers/auth/app/utils/user-model.ts
  - layers/auth/app/middleware/auth.global.ts
  - layers/auth/app/middleware/auth-guard.ts
  - layers/auth/server/api/auth/login.post.ts
  - layers/auth/server/api/auth/logout.post.ts
  - layers/auth/server/api/auth/refresh.post.ts
  - layers/auth/server/api/auth/me.get.ts
  - layers/auth/server/api/auth/signup.post.ts
  - layers/auth/server/usecase/login.ts
  - layers/auth/server/utils/auth.ts
  - layers/auth/server/middleware/01.auth.ts
  - layers/auth/server/middleware/02.admin.ts
---

# How does authentication work?

## Arquitetura BFF (Backend-for-Frontend)

A autenticacao usa padrao BFF — tokens nunca ficam expostos no client. O fluxo passa pelo server Nitro que gerencia cookies `httpOnly`.

```
Browser → Nuxt Server (BFF) → API Sinapse
         cookies httpOnly      Authorization header
```

## Tipos Principais

Definidos em `layers/auth/app/composables/types.ts`:

| Tipo                | Descricao                                                       |
| ------------------- | --------------------------------------------------------------- |
| `AuthUser`          | DTO da API Sinapse (id, nome, email, ativo, permissoes, grupos) |
| `AuthPermissao`     | `{ id, codigo, nome }`                                          |
| `AuthGrupo`         | `{ id, nome }`                                                  |
| `LoginCredentials`  | `{ username, password }`                                        |
| `ResetPasswordData` | `{ email }`                                                     |

## UserModel (Domain Model)

`layers/auth/app/utils/user-model.ts` — enriquece o DTO `AuthUser` com logica de negocio.

### Interface

```typescript
interface UserModel {
  readonly raw: AuthUser // DTO original
  readonly id: number
  readonly nome: string
  readonly email: string
  readonly ativo: boolean
  readonly initials: string // "JS" para "Joao Silva"
  readonly permissions: string[] // codigos extraidos de permissoes
  readonly groups: string[] // nomes extraidos de grupos
  readonly isAdmin: boolean // groups.includes('administradores')
}
```

### Factory e funcoes puras

```typescript
createUserModel(user: AuthUser): UserModel  // factory + Object.freeze
userHasPermission(model, codigo): boolean
userHasAnyPermission(model, codigos): boolean
userHasGroup(model, nome): boolean
userHasAnyGroup(model, nomes): boolean
```

Auto-importados pelo Nuxt (estao em `layers/auth/app/utils/`).

## Auth Store (`useAuthStore`)

Store Pinia em `layers/auth/app/composables/useAuthStore.ts`.

### Estado

| Campo           | Tipo                | Descricao                           |
| --------------- | ------------------- | ----------------------------------- |
| `user`          | `UserModel \| null` | Modelo de dominio do usuario logado |
| `isLoading`     | `boolean`           | Flag de carregamento                |
| `error`         | `string \| null`    | Mensagem de erro (domain error)     |
| `isInitialized` | `boolean`           | Se ja tentou buscar usuario         |
| `lastFetchAt`   | `number`            | Timestamp do ultimo fetch           |

### Getters

Delegam para o `UserModel`: `isAuthenticated`, `userName`, `userEmail`, `userInitials`, `permissions`, `groups`.

### Helpers de permissao

`hasPermission()`, `hasAnyPermission()`, `hasGroup()`, `hasAnyGroup()` — delegam para as funcoes puras do UserModel.

### Actions

| Action                | Descricao                              | Retorno                |
| --------------------- | -------------------------------------- | ---------------------- |
| `login(credentials)`  | Login via BFF, cria UserModel          | `boolean`              |
| `logout()`            | Logout, limpa estado (mesmo se falhar) | `boolean`              |
| `fetchUser()`         | Busca `/api/auth/me`, cria UserModel   | `void`                 |
| `resetPassword(data)` | Solicita reset                         | `{ success, message }` |

Erros usam `AuthErrors.*` do `#shared/domain/errors`.

## Login Use Case

`layers/auth/server/usecase/login.ts` — logica de login extraida como funcao pura.

### Fluxo

```
executeLogin({ username, password })
  1. POST /auth/login na API Sinapse
  2. Valida resposta de tokens com Zod (tokenSchema)
  3. GET /usuarios/me com novo access_token
  4. Valida usuario com Zod (usuarioSchemaDetalhesSchema)
  5. Retorna Result<LoginOutput>
```

### Tipos

```typescript
interface LoginInput {
  username: string
  password: string
}
interface LoginOutput {
  user: UsuarioSchemaDetalhes
  accessToken: string
  refreshToken: string
}
```

### Adapter HTTP

`handleLoginResult(event, result)` converte o `Result<LoginOutput>` em resposta HTTP:

- Sucesso: seta cookies httpOnly + retorna `{ user }`
- Falha 401: credenciais invalidas
- Falha 500: erro inesperado

### Server Route

`layers/auth/server/api/auth/login.post.ts` — reduzido a ~15 linhas:

```typescript
export default defineEventHandler(async event => {
  const { username, password } = await validateBody(event, loginRequestSchema)
  const result = await executeLogin({ username, password })
  return handleLoginResult(event, result)
})
```

## Middlewares

### Client-side

| Middleware       | Tipo   | Descricao                                                                   |
| ---------------- | ------ | --------------------------------------------------------------------------- |
| `auth.global.ts` | Global | Roda em todas as rotas, inicializa auth state                               |
| `auth-guard.ts`  | Named  | Protege rotas autenticadas (`definePageMeta({ middleware: 'auth-guard' })`) |

### Server-side

| Middleware    | Ordem | Descricao                                           |
| ------------- | ----- | --------------------------------------------------- |
| `01.auth.ts`  | 1o    | Extrai token do cookie, injeta `event.context.auth` |
| `02.admin.ts` | 2o    | Verifica se e admin, injeta `event.context.isAdmin` |

Contexto disponivel nos endpoints:

```typescript
event.context.auth?.isAuthenticated // boolean
event.context.auth?.accessToken // string
event.context.isAdmin // boolean
```

## Endpoints BFF

| Metodo | Rota                       | Descricao                         |
| ------ | -------------------------- | --------------------------------- |
| POST   | `/api/auth/login`          | Login (usa executeLogin use case) |
| POST   | `/api/auth/logout`         | Logout (limpa cookies)            |
| POST   | `/api/auth/refresh`        | Refresh token                     |
| GET    | `/api/auth/me`             | Dados do usuario logado           |
| POST   | `/api/auth/signup`         | Cadastro                          |
| POST   | `/api/auth/reset-password` | Solicitar reset de senha          |

## Seguranca

- Tokens em cookies `httpOnly` + `secure` + `sameSite`
- CSRF habilitado para POST/PUT/PATCH/DELETE (exceto `/api/auth/*`)
- Cookies limpos no logout e em erros de login
- Server middleware valida auth antes de chegar ao endpoint
- Validacao com Zod em todas as respostas da API Sinapse
