---
title: Padrão BFF
description: O padrão Backend-for-Frontend usado no Detecta Alerta.
---

# Padrão BFF

O Detecta Alerta usa o padrão **Backend-for-Frontend (BFF)**: o servidor Nuxt (Nitro) atua como intermediário entre o frontend e a API Sinapse.

## Por que BFF?

```
Browser → Nuxt Server (BFF) → API Sinapse
```

- **Segurança**: Tokens nunca são expostos ao browser (cookies httpOnly)
- **Validação**: Respostas da API são validadas com Zod no servidor
- **Abstração**: Frontend não conhece detalhes da API externa
- **Rate limiting**: Controle de taxa por rota no BFF

## Fluxo de autenticação

::docs-steps
::docs-step{title="Login" :step="1"}
Usuário submete credenciais via formulário.
::

::docs-step{title="BFF processa" :step="2"}
O endpoint `/api/auth/login` envia credenciais para a API Sinapse e recebe tokens.
::

::docs-step{title="Cookie seguro" :step="3"}
Tokens são armazenados em cookies httpOnly, secure, SameSite strict.
::

::docs-step{title="Requisições autenticadas" :step="4"}
BFF lê o token do cookie e o envia como Bearer token para a API Sinapse.
::
::

## Exemplo de endpoint BFF

```typescript
// server/api/rumores/index.get.ts
export default defineEventHandler(async event => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401 })

  const data = await $fetch('https://api.sinapse.org.br/noticias', {
    headers: { Authorization: `Bearer ${token}` }
  })

  // Validar resposta com Zod
  const validated = rumoresSchema.parse(data)
  return validated
})
```

## Padrões de segurança

```typescript
// Tokens em cookies httpOnly (nunca localStorage)
setCookie(event, 'token', value, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
})

// SEMPRE validar no servidor com Zod
const result = schema.safeParse(body)
if (!result.success) {
  throw createError({ statusCode: 400 })
}
```

::docs-warning
Nunca armazene tokens no `localStorage`. Use sempre cookies `httpOnly` para tokens de autenticação.
::

## Rate Limiting

O BFF configura rate limiting por rota:

| Rota                       | Limite          |
| -------------------------- | --------------- |
| Global                     | 150 req / 5 min |
| `/api/auth/login`          | 10 req / 5 min  |
| `/api/auth/reset-password` | 5 req / 5 min   |
