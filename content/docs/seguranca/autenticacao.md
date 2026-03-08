---
title: 'Segurança — Autenticação'
description: 'Como funciona o sistema de autenticação do Detecta Alerta: fluxo de login, cookies httpOnly, refresh automático e guards de acesso.'
order: 2
---

# Segurança — Autenticação

O Detecta Alerta usa um padrão **BFF (Backend-for-Frontend)** para autenticação. Tokens JWT nunca ficam acessíveis ao JavaScript do navegador — são armazenados exclusivamente em cookies `httpOnly`.

## Fluxo de Login

::docs-mermaid{title="Fluxo de login"}
sequenceDiagram
participant B as Browser
participant BFF as BFF (Nitro)
participant API as API Sinapse

B->>BFF: POST /api/auth/login<br/>{ email, senha }
BFF->>API: POST /auth/login<br/>{ email, senha }
API-->>BFF: { access_token, refresh_token }
Note over BFF: tokenSchema.parse()<br/>Valida com Zod
BFF-->>B: Set-Cookie: access_token (httpOnly)<br/>Set-Cookie: refresh_token (httpOnly)<br/>{ user }
::

1. O **browser** envia credenciais para o BFF (`/api/auth/login`)
2. O **BFF** repassa para a API Sinapse e recebe os tokens JWT
3. O BFF valida a resposta com o schema Zod (`tokenSchema.parse` de `#shared/types/sinapse`)
4. O BFF armazena os tokens em **cookies httpOnly** e retorna os dados do usuário
5. O browser **nunca tem acesso direto** aos tokens

---

## Cookies de Autenticação

Os tokens são armazenados em dois cookies separados, cada um com atributos de segurança:

| Atributo     | `access_token`                                  | `refresh_token`                                 |
| ------------ | ----------------------------------------------- | ----------------------------------------------- |
| **httpOnly** | `true` — inacessível via JavaScript             | `true` — inacessível via JavaScript             |
| **secure**   | `true` em produção — só HTTPS                   | `true` em produção — só HTTPS                   |
| **sameSite** | `strict` — não enviado em requests cross-origin | `strict` — não enviado em requests cross-origin |
| **path**     | `/`                                             | `/`                                             |
| **maxAge**   | Não definido (sessão do navegador)              | 7 dias                                          |

### Por que httpOnly e não localStorage?

::docs-warning
**Nunca armazene tokens em `localStorage` ou `sessionStorage`.**
::

| Aspecto                  | localStorage                                   | Cookie httpOnly                     |
| ------------------------ | ---------------------------------------------- | ----------------------------------- |
| Acessível via JavaScript | Sim — qualquer script na página                | Não — invisível para JS             |
| Vulnerável a XSS         | Sim — `document.cookie` ou storage API         | Não — cookie não aparece no JS      |
| Enviado automaticamente  | Não — precisa ler e injetar manualmente        | Sim — browser envia em cada request |
| CSRF                     | Não vulnerável (não é enviado automaticamente) | Mitigado com `SameSite: strict`     |

O atributo `SameSite: strict` garante que os cookies **não são enviados** em requisições originadas de outros sites, mitigando ataques CSRF sem precisar de token CSRF adicional nas rotas de auth.

::docs-tip
O CSRF nas rotas `/api/auth/*` e `/api/usuarios/**` está desabilitado intencionalmente porque essas rotas já são protegidas por `httpOnly + SameSite: strict`.
::

---

## Refresh Automático de Tokens

O middleware `01.auth.ts` verifica automaticamente se o `access_token` está próximo de expirar e o renova antes que expire:

::docs-mermaid{title="Fluxo de refresh automático"}
flowchart TD
A["Requisição chega"] --> B{"Rota pública?"}
B -- Sim --> C["Ignora auth"]
B -- Não --> D{"Tem access_token?"}
D -- Não --> E["{ isAuthenticated: false }"]
D -- Sim --> F{"Expira em < 5 min?"}
F -- Não --> G["Usa token atual"]
F -- Sim --> H{"Tem refresh_token?"}
H -- Não --> I["Limpa cookies\n{ isAuthenticated: false }"]
H -- Sim --> J["POST /auth/refresh\npara API Sinapse"]
J --> K{"Sucesso?"}
K -- Não --> I
K -- Sim --> L["Atualiza cookies\n{ isAuthenticated: true }"]
::

A margem de renovação é de **5 minutos** (`REFRESH_MARGIN_SECONDS = 5 * 60`). O token é renovado antes de expirar para evitar que requisições falhem com 401.

### Onde está o código

- **Middleware**: `layers/auth/server/middleware/01.auth.ts`
- **Lógica de refresh**: `tryRefreshTokens()` em `layers/auth/server/utils/auth.ts`
- **Manipulação de cookies**: `setAuthCookies()`, `clearAuthCookies()` no mesmo arquivo

---

## Rotas Públicas

O middleware de auth ignora rotas que não precisam de verificação:

```typescript
const PUBLIC_PATH_PREFIXES = [
  '/api/auth/login',
  '/api/auth/reset-password',
  '/_nuxt', // Assets estáticos do Nuxt
  '/__nuxt', // DevTools
  '/.well-known', // security.txt
  '/favicon.ico'
] as const
```

Rotas que não estão nesta lista **passam pelo middleware**, mas isso não significa que exigem autenticação. Se não houver token, o contexto é marcado como `{ isAuthenticated: false }` e a rota pode decidir se permite acesso anônimo.

---

## Guards de Acesso

Dois helpers são usados dentro dos handlers de endpoint para controlar acesso:

### `requireAuth(event)`

Garante que o usuário está autenticado. Retorna o `accessToken` ou lança **401**.

```typescript
// layers/usuarios/server/utils/admin.ts
export function requireAuth(event: H3Event): string {
  const auth = event.context.auth
  if (!auth?.isAuthenticated || !auth.accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }
  return auth.accessToken
}
```

### `requireAdmin(event)`

Garante que o usuário é admin. Lança **401** se não autenticado ou **403** se não é admin.

```typescript
// layers/usuarios/server/utils/admin.ts
export function requireAdmin(event: H3Event): void {
  const auth = event.context.auth
  if (!auth?.isAuthenticated || !auth.accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Nao autenticado' })
  }
  if (!event.context.isAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito a administradores' })
  }
}
```

### Uso nos endpoints

```typescript
// Endpoint que requer apenas autenticação
export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  // ... usar accessToken para chamar API Sinapse
})

// Endpoint que requer autenticação + admin
export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)
  // ... apenas administradores chegam aqui
})
```

---

## Middleware Admin (02.admin.ts)

O middleware `02.admin.ts` roda **após** o `01.auth.ts` (ordem garantida pelo prefixo numérico) e verifica se o usuário autenticado pertence ao grupo `administradores`:

```typescript
// layers/usuarios/server/middleware/02.admin.ts
export default defineEventHandler(async event => {
  const path = getRequestURL(event).pathname

  // Apenas verificar em rotas de admin
  if (!path.startsWith('/api/usuarios/admin')) return

  const auth = event.context.auth
  if (!auth?.isAuthenticated || !auth.accessToken) {
    event.context.isAdmin = false
    return
  }

  const rawUser = await fetchSinapse<{
    grupos?: Array<{ nome: string }>
  }>('/usuarios/me', { accessToken: auth.accessToken })

  event.context.isAdmin = rawUser.grupos?.some(g => g.nome === 'administradores') ?? false
})
```

O resultado é injetado em `event.context.isAdmin` e consumido pelo helper `requireAdmin()`, evitando chamadas duplicadas à API.

---

## Resumo da Cadeia de Auth

::docs-mermaid{title="Cadeia completa de autenticação"}
graph LR
A["Requisição"] --> B["01.auth.ts\nVerifica/renova token\nInjeta event.context.auth"]
B --> C["02.admin.ts\nVerifica grupo admin\nInjeta event.context.isAdmin"]
C --> D["Handler\nrequireAuth()\nrequireAdmin()"]
D --> E["fetchSinapse\nEnvia token p/ API"]
E --> F["Resposta"]
::
