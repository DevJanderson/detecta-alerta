---
title: 'Segurança — Headers e Proteções'
description: 'Headers HTTP de segurança e proteções automáticas do Detecta Alerta: CSP, HSTS, rate limiting, CSRF, XSS e mais.'
order: 3
---

# Segurança — Headers e Proteções

O Detecta Alerta usa o módulo [`nuxt-security`](https://nuxt-security.vercel.app) para aplicar automaticamente headers de segurança e proteções em todas as respostas. A configuração fica no `nuxt.config.ts`, seção `security`.

## CSP (Content Security Policy) — Enforcing

CSP é a proteção mais importante contra XSS. Define quais recursos o navegador pode carregar e de onde.

::docs-info
O CSP está **desabilitado em desenvolvimento** porque interfere com o HMR (Hot Module Replacement) do Vite. Em produção/staging ele é enforcing.
::

### Diretivas atuais

| Diretiva                    | Valor                                  | O que controla                                                  |
| --------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| `default-src`               | `'self'`                               | Fallback: só permite recursos do próprio domínio                |
| `script-src`                | `'self' 'unsafe-inline' 'unsafe-eval'` | Scripts — permite inline e eval (necessário para o framework)   |
| `style-src`                 | `'self' 'unsafe-inline'`               | Estilos — permite inline (Tailwind injeta estilos)              |
| `img-src`                   | `'self' data: https:`                  | Imagens — próprio domínio, data URIs e qualquer HTTPS           |
| `font-src`                  | `'self' data:`                         | Fontes — próprio domínio e data URIs                            |
| `connect-src`               | `'self'`                               | Fetch/XHR — só próprio domínio (BFF, não chama API diretamente) |
| `frame-ancestors`           | `'self'`                               | Quem pode embutir a página em iframe — só o próprio site        |
| `form-action`               | `'self'`                               | Destino de forms — só próprio domínio                           |
| `object-src`                | `'none'`                               | Bloqueia Flash, Java applets, etc.                              |
| `upgrade-insecure-requests` | `true`                                 | Converte automaticamente HTTP → HTTPS                           |
| `base-uri`                  | `'self'`                               | Previne alteração da base URL via `<base>`                      |

---

## CSP Report-Only (Nonce-based)

Além do CSP enforcing, existe um segundo header **CSP-Report-Only** com política mais restritiva usando **nonce**:

```
Content-Security-Policy-Report-Only:
  default-src 'self';
  script-src 'self' 'strict-dynamic' 'nonce-<random>';
  style-src 'self' 'unsafe-inline';
  ...
```

### O que é nonce?

Um **nonce** (number used once) é um valor aleatório gerado a cada request e injetado nos `<script>` da página. O navegador só executa scripts que tenham o nonce correto, bloqueando scripts injetados por atacantes.

### Como funciona o Report-Only?

- O header `Content-Security-Policy-Report-Only` **não bloqueia** nada
- Violações aparecem como **warnings no console** do navegador
- Serve para testar uma política mais restritiva antes de ativá-la

### Roadmap

O objetivo é migrar do CSP atual (com `unsafe-inline` e `unsafe-eval`) para o CSP nonce-based. Quando as violações no Report-Only zerarem em staging, a política restritiva será promovida para o CSP principal.

### Onde está o código

Plugin Nitro: `layers/base/server/plugins/csp-report-only.ts`

---

## Permissions-Policy

Bloqueia acesso a APIs do navegador que a aplicação não utiliza. Um atacante que consiga injetar código não poderá acessar:

| Feature           | Valor        | Efeito                                  |
| ----------------- | ------------ | --------------------------------------- |
| `camera`          | `()` (vazio) | Nenhuma origem pode usar a câmera       |
| `microphone`      | `()`         | Nenhuma origem pode usar o microfone    |
| `geolocation`     | `()`         | Nenhuma origem pode usar geolocalização |
| `display-capture` | `()`         | Nenhuma origem pode capturar a tela     |

---

## HSTS (HTTP Strict Transport Security)

Instrui o navegador a **sempre usar HTTPS** ao acessar o domínio, por 1 ano:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

| Atributo            | Valor              | Significado                                    |
| ------------------- | ------------------ | ---------------------------------------------- |
| `max-age`           | `31536000` (1 ano) | Navegador lembra por 1 ano que deve usar HTTPS |
| `includeSubDomains` | `true`             | Subdomínios também forçam HTTPS                |

Após a primeira visita, o navegador recusa conexões HTTP, mesmo se o usuário digitar `http://`.

---

## X-Frame-Options

Previne **clickjacking** — um ataque onde um site malicioso embutia a página em um iframe transparente para capturar cliques:

```
X-Frame-Options: SAMEORIGIN
```

Permite que a página seja embutida apenas em iframes do mesmo domínio. Reforçado pela diretiva CSP `frame-ancestors 'self'`.

---

## X-Content-Type-Options

Previne **MIME sniffing** — quando o navegador tenta "adivinhar" o tipo de um arquivo e pode executar acidentalmente um arquivo texto como script:

```
X-Content-Type-Options: nosniff
```

Força o navegador a respeitar o `Content-Type` declarado pelo servidor.

---

## Referrer-Policy

Controla quanta informação é enviada no header `Referer` quando o usuário navega para outro site:

```
Referrer-Policy: strict-origin-when-cross-origin
```

| Navegação                     | O que é enviado                                   |
| ----------------------------- | ------------------------------------------------- |
| Mesmo domínio                 | URL completa (path, query, etc.)                  |
| Outro domínio (HTTPS → HTTPS) | Apenas a origem (`https://alerta.sinapse.org.br`) |
| HTTPS → HTTP                  | Nada (downgrade = sem referer)                    |

Protege contra vazamento de URLs internas com dados sensíveis (IDs, tokens em query string, etc.).

---

## Rate Limiting

Limita o número de requisições por IP em um intervalo de tempo. Previne **brute-force**, **DoS** e **scraping abusivo**.

### Limites configurados

| Rota                        | Limite       | Intervalo | Motivo                             |
| --------------------------- | ------------ | --------- | ---------------------------------- |
| **Global** (todas as rotas) | 150 requests | 5 minutos | Proteção geral                     |
| `/api/auth/login`           | 10 requests  | 5 minutos | Previne brute-force de senhas      |
| `/api/auth/reset-password`  | 5 requests   | 5 minutos | Previne enumeração de emails       |
| `/api/auth/signup`          | 5 requests   | 5 minutos | Previne criação em massa de contas |
| `/__nuxt_content/**`        | Desabilitado | —         | API interna do Nuxt Content        |
| `/api/_content/**`          | Desabilitado | —         | API interna do Nuxt Content        |

---

## CSRF (Cross-Site Request Forgery)

CSRF é um ataque onde um site malicioso faz o navegador do usuário enviar requisições autenticadas para a aplicação sem o consentimento do usuário.

### Como funciona a proteção

O módulo `nuxt-security` usa `nuxt-csurf` internamente para gerar e verificar tokens CSRF:

1. O servidor gera um token CSRF e envia ao client via cookie
2. O client inclui o token nos headers das requisições mutativas
3. O servidor compara o token do header com o do cookie

### Métodos protegidos

`POST`, `PUT`, `PATCH`, `DELETE` — todas as operações que modificam dados.

### Rotas com CSRF desabilitado

| Rota                       | Motivo                                                   |
| -------------------------- | -------------------------------------------------------- |
| `/api/auth/login`          | Protegida por rate limiting + cookies `SameSite: strict` |
| `/api/auth/logout`         | Protegida por cookies `SameSite: strict`                 |
| `/api/auth/refresh`        | Protegida por cookies `SameSite: strict`                 |
| `/api/auth/reset-password` | Protegida por rate limiting                              |
| `/api/auth/signup`         | Protegida por rate limiting                              |
| `/api/usuarios/**`         | Protegida por cookies `SameSite: strict` + requireAuth   |
| `/api/rumores/admin/**`    | Protegida por cookies `SameSite: strict` + requireAdmin  |
| `/__nuxt_content/**`       | API interna do Nuxt Content (POST para queries)          |
| `/api/_content/**`         | API interna do Nuxt Content                              |

::docs-tip
As rotas de auth e usuários usam `SameSite: strict`, o que significa que os cookies **não são enviados** em requisições vindas de outros sites. Isso torna o CSRF inviável mesmo sem token CSRF.
::

---

## XSS Validator

Sanitiza automaticamente inputs de usuário para prevenir **Cross-Site Scripting** (XSS) — ataques onde um atacante injeta scripts maliciosos via campos de formulário.

Configurado com defaults do `nuxt-security` (sem personalização adicional).

---

## Limite de Tamanho de Request

Previne ataques de **resource exhaustion** limitando o tamanho do body das requisições:

| Tipo              | Limite | Uso                            |
| ----------------- | ------ | ------------------------------ |
| Request geral     | 2 MB   | Bodies JSON, formulários       |
| Upload de arquivo | 8 MB   | Uploads de imagens, documentos |

---

## Headers Adicionais

| Header                         | Valor                            | Efeito                                              |
| ------------------------------ | -------------------------------- | --------------------------------------------------- |
| `Cross-Origin-Resource-Policy` | `same-origin`                    | Recursos só podem ser carregados pelo mesmo domínio |
| `Cross-Origin-Opener-Policy`   | `same-origin`                    | Isola a janela de outros contextos de navegação     |
| `Cross-Origin-Embedder-Policy` | `credentialless` (prod)          | Controla carregamento de recursos cross-origin      |
| `X-Powered-By`                 | Removido (`hidePoweredBy: true`) | Não revela tecnologia do servidor                   |
| `X-XSS-Protection`             | `0`                              | Desabilitado (obsoleto — CSP é a proteção moderna)  |

::docs-info
O `X-XSS-Protection: 0` está desabilitado intencionalmente. Este header é legado e [pode introduzir vulnerabilidades](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection). O CSP é a proteção adequada contra XSS.
::
