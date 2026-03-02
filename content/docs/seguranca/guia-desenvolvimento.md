---
title: 'Segurança — Guia para Desenvolvedores'
description: 'Receitas práticas de segurança para o dia a dia: como criar endpoints seguros, validar dados, tratar erros e evitar anti-patterns.'
order: 4
---

# Segurança — Guia para Desenvolvedores

Receitas práticas para escrever código seguro no Detecta Alerta. Para cada situação: **o que fazer**, **como fazer** e **por que**.

## Como Criar um Endpoint BFF Seguro

Um endpoint BFF (Backend-for-Frontend) é a camada entre o browser e a API Sinapse. Todo o código roda no servidor — tokens e dados sensíveis nunca chegam ao client.

### Passo a passo

```typescript
// layers/usuarios/server/api/usuarios/admin/permissoes/index.get.ts

import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'
import { z } from 'zod'

export default defineEventHandler(async event => {
  // 1. Verificar permissão (lança 401/403 automaticamente)
  requireAdmin(event)
  const accessToken = requireAuth(event)

  // 2. Chamar API Sinapse com tratamento de erro centralizado
  return handleSinapseRequest({
    fn: () => fetchSinapse('/usuarios/permissoes/', { accessToken }),
    errorContext: 'Erro ao listar permissoes',
    schema: z.array(permissaoAcessoSchemaListSchema) // 3. Validar resposta
  })
})
```

### O que cada parte faz

| Passo                    | Função                                                | O que acontece se falhar                                                |
| ------------------------ | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `requireAdmin(event)`    | Verifica autenticação + grupo admin                   | 401 (não autenticado) ou 403 (não admin)                                |
| `requireAuth(event)`     | Retorna o access token                                | 401 (não autenticado)                                                   |
| `handleSinapseRequest()` | Executa chamada com try/catch centralizado            | Erro da Sinapse retornado com status correto, erro genérico retorna 500 |
| `schema: z.array(...)`   | Valida que a resposta da API está no formato esperado | Lança erro se API mudou o formato                                       |

---

## Como Validar Body com Zod

Use `validateBody()` para ler e validar o body de uma requisição POST/PUT/PATCH em uma única chamada:

```typescript
import { z } from 'zod'

const meuSchema = z.object({
  nome: z.string().min(1).max(100),
  email: z.string().email(),
  ativo: z.boolean().default(true)
})

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  // Lê body + valida com Zod → retorna dados tipados ou lança 400
  const body = await validateBody(event, meuSchema)

  // body tem tipo { nome: string, email: string, ativo: boolean }
  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/endpoint', {
        method: 'POST',
        body,
        accessToken
      }),
    errorContext: 'Erro ao criar recurso'
  })
})
```

::docs-warning
**Sempre** valide o body no servidor, mesmo que o formulário já valide no client. Validação client-side é UX — validação server-side é segurança.
::

---

## Como Validar Route Params

Route params vêm diretamente da URL e **nunca devem ser confiados**. Sem validação, um atacante pode injetar valores como `../../../etc/passwd` (path traversal).

### ID numérico

```typescript
// /api/usuarios/[id].get.ts
export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  // Aceita apenas dígitos (ex: "123") — lança 400 se inválido
  const id = validateRouteParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { accessToken }),
    errorContext: 'Erro ao buscar usuario'
  })
})
```

### UUID

```typescript
// /api/recursos/[uniqueId].get.ts
export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  // Aceita apenas UUIDs válidos — lança 400 se inválido
  const uniqueId = validateUniqueId(event, 'uniqueId')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/recursos/${uniqueId}`, { accessToken }),
    errorContext: 'Erro ao buscar recurso'
  })
})
```

---

## Como Construir Query Strings Seguras

Use `buildQueryString()` para aceitar **apenas query params conhecidos** e ignorar o resto. Isso previne injeção de parâmetros inesperados na API upstream.

```typescript
// /api/usuarios/index.get.ts
export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  // Aceita APENAS page, search e status — ignora qualquer outro param
  const qs = buildQueryString(getQuery(event), ['page', 'search', 'status'])

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/?${qs}`, { accessToken }),
    errorContext: 'Erro ao listar usuarios'
  })
})
```

### Como funciona internamente

```typescript
export function buildQueryString(query: Record<string, unknown>, allowedParams: string[]): string {
  const params = new URLSearchParams()

  for (const key of allowedParams) {
    const value = query[key]
    if (value === undefined || value === null || value === '') continue

    if (Array.isArray(value)) {
      for (const v of value) params.append(key, String(v))
    } else {
      params.append(key, String(value))
    }
  }

  return params.toString()
}
```

A **whitelist** é a parte importante: apenas parâmetros listados em `allowedParams` são incluídos. Qualquer parâmetro extra enviado pelo client é silenciosamente descartado.

---

## Como Tratar Erros sem Vazar Dados

`handleSinapseRequest()` centraliza o tratamento de erro de todas as chamadas à API Sinapse:

```typescript
return handleSinapseRequest({
  fn: () => fetchSinapse('/endpoint', { accessToken }),
  errorContext: 'Erro ao buscar dados',
  schema: meuSchema // opcional — valida resposta com Zod
})
```

### O que acontece internamente

| Cenário             | Comportamento                                                      |
| ------------------- | ------------------------------------------------------------------ |
| Sucesso             | Retorna os dados (validados com Zod se `schema` foi fornecido)     |
| Erro da API Sinapse | Retorna o `statusCode` e `statusMessage` da API                    |
| Erro desconhecido   | Retorna 500 com a mensagem de `errorContext` (sem stack trace)     |
| Logs em produção    | Apenas o contexto — **nunca** o erro completo (pode conter tokens) |

::docs-info
Em desenvolvimento, o erro completo é logado para facilitar debugging. Em produção, apenas o contexto é logado via `logAuthError()`.
::

---

## Checklist de Segurança para Code Review

Use esta lista ao revisar PRs que criam ou modificam endpoints BFF:

- [ ] **Auth**: usa `requireAuth()` ou `requireAdmin()` para rotas protegidas?
- [ ] **Body**: validado com `validateBody(event, schema)` antes de usar?
- [ ] **Route params**: validados com `validateRouteParam()` ou `validateUniqueId()`?
- [ ] **Query params**: construídos com `buildQueryString()` e whitelist explícita?
- [ ] **Erros**: tratados com `handleSinapseRequest()` (sem try/catch manual vazando detalhes)?
- [ ] **Tokens**: acessados via `event.context.auth` (nunca de headers ou query string)?
- [ ] **Dados sensíveis**: nenhum token, senha ou dado pessoal nos logs ou na resposta de erro?
- [ ] **Schema Zod**: respostas da API validadas com schema Kubb quando disponível?

---

## Anti-patterns: O que Nunca Fazer

### Tokens no localStorage

```typescript
// ❌ NUNCA — vulnerável a XSS
localStorage.setItem('token', response.access_token)

// ✅ CORRETO — tokens ficam no servidor (BFF)
setAuthCookies(event, accessToken, refreshToken)
```

### Body sem validação

```typescript
// ❌ NUNCA — aceita qualquer coisa que o client enviar
const body = await readBody(event)
await fetchSinapse('/usuarios', { method: 'POST', body, accessToken })

// ✅ CORRETO — valida formato e tipos com Zod
const body = await validateBody(event, createUserSchema)
await fetchSinapse('/usuarios', { method: 'POST', body, accessToken })
```

### Route param sem validação

```typescript
// ❌ NUNCA — aceita "../../../etc/passwd", "1; DROP TABLE"
const id = getRouterParam(event, 'id')
await fetchSinapse(`/usuarios/${id}`, { accessToken })

// ✅ CORRETO — aceita apenas dígitos
const id = validateRouteParam(event, 'id')
await fetchSinapse(`/usuarios/${id}`, { accessToken })
```

### Query params sem whitelist

```typescript
// ❌ NUNCA — repassa todos os params para a API upstream
const query = getQuery(event)
const qs = new URLSearchParams(query as Record<string, string>).toString()
await fetchSinapse(`/usuarios?${qs}`, { accessToken })

// ✅ CORRETO — aceita apenas params conhecidos
const qs = buildQueryString(getQuery(event), ['page', 'search', 'status'])
await fetchSinapse(`/usuarios?${qs}`, { accessToken })
```

### Erro com detalhes internos

```typescript
// ❌ NUNCA — expõe stack trace, mensagens internas, tokens
catch (error) {
  throw createError({
    statusCode: 500,
    statusMessage: `Erro: ${error.message}`,
    data: error // NUNCA enviar o objeto de erro completo
  })
}

// ✅ CORRETO — mensagem genérica, sem detalhes
catch (error) {
  logAuthError('Erro ao buscar usuario', error) // Log seguro
  throw createError({
    statusCode: 500,
    statusMessage: 'Erro ao buscar usuario'
  })
}

// ✅ MELHOR — usar handleSinapseRequest que faz tudo isso
return handleSinapseRequest({
  fn: () => fetchSinapse('/usuarios', { accessToken }),
  errorContext: 'Erro ao buscar usuario'
})
```

### console.log em produção

```typescript
// ❌ NUNCA — console.log não é permitido pelo ESLint
console.log('Token:', accessToken)
console.log('Body:', body)

// ✅ CORRETO — apenas warn e error, sem dados sensíveis
console.error('[Usuarios] Erro ao buscar permissoes')
```
