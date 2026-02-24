---
title: Segurança
description: Configuração de segurança do Detecta Alerta.
---

# Segurança

O módulo **nuxt-security** fornece proteções automáticas contra ataques comuns.

## Configuração atual

| Feature           | Configuração                                          |
| ----------------- | ----------------------------------------------------- |
| **Headers**       | CSP (desabilitado em dev), HSTS, X-Frame-Options      |
| **Rate Limiter**  | 150 req/5min (global)                                 |
| **CSRF**          | POST/PUT/PATCH/DELETE (desabilitado em `/api/auth/*`) |
| **XSS Validator** | Habilitado com defaults                               |
| **Request Size**  | 2MB (geral), 8MB (upload)                             |

## Headers de segurança

```typescript
security: {
  headers: {
    crossOriginResourcePolicy: 'same-origin',
    crossOriginOpenerPolicy: 'same-origin',
    referrerPolicy: 'strict-origin-when-cross-origin',
    strictTransportSecurity: {
      maxAge: 31536000,
      includeSubdomains: true
    },
    xContentTypeOptions: 'nosniff',
    xFrameOptions: 'SAMEORIGIN'
  }
}
```

::docs-info
O CSP (Content Security Policy) é desabilitado em desenvolvimento para não interferir com o HMR do Vite.
::

## CSRF Protection

O CSRF usa `nuxt-csurf` internamente. Está habilitado para métodos que alteram dados:

```typescript
csrf: {
  https: process.env.NODE_ENV === 'production',
  cookieKey: 'csrf',
  methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE']
}
```

### Desabilitar CSRF por rota

Para rotas que usam cookies httpOnly (como auth), o CSRF pode ser desabilitado:

```typescript
// nuxt.config.ts
routeRules: {
  '/api/auth/login': { csurf: false },
  '/api/auth/logout': { csurf: false }
}
```

## Rate Limiter

Proteção contra abuso com limites configuráveis por rota:

```typescript
// Global
rateLimiter: {
  tokensPerInterval: 150,
  interval: 300000 // 5 minutos
}

// Por rota (mais restritivo)
routeRules: {
  '/api/auth/login': {
    security: {
      rateLimiter: { tokensPerInterval: 10, interval: 300000 }
    }
  }
}
```

## Boas práticas

::docs-tip
Sempre valide dados no servidor com Zod, mesmo que já tenha validação no frontend.
::

- Tokens em cookies `httpOnly` (nunca `localStorage`)
- Validação com Zod em todos os endpoints
- Rate limiting em rotas sensíveis
- Headers de segurança automáticos via nuxt-security
- CSRF protection para operações de escrita
