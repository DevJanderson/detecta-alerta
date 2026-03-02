---
title: 'Segurança — Visão Geral'
description: 'Panorama de todas as camadas de proteção do Detecta Alerta: headers, autenticação, CSRF, rate limiting e mais.'
order: 1
---

# Segurança — Visão Geral

O Detecta Alerta utiliza múltiplas camadas de segurança para proteger dados epidemiológicos sensíveis e garantir a integridade da plataforma. Esta página oferece um panorama rápido de tudo que está implementado.

## Arquitetura de Segurança

Toda requisição passa por uma cadeia de proteções antes de chegar ao handler da rota:

::docs-mermaid{title="Fluxo de uma requisição"}
graph TD
A["Browser"] --> B

subgraph B["nuxt-security (automático)"]
B1["Rate Limiter\n150 req/5min"]
B2["CSRF Token"]
B3["XSS Validator"]
B4["Request Size\nLimiter (2MB)"]
end

B --> C

subgraph C["Server Middlewares"]
C1["01.auth.ts\nJWT + Refresh"] --> C2["02.admin.ts\nVerifica grupo"]
end

C --> D

subgraph D["Handler do Endpoint"]
D1["requireAuth\nrequireAdmin"]
D2["validateBody\nvalidateParam"]
D3["handleSinapseRequest\ntry/catch + Zod"]
end

D --> E["Resposta\nCSP · HSTS · X-Frame-Options\nReferrer-Policy · Permissions-Policy"]
::

---

## Camadas de Proteção

| Proteção                          | O que faz                                                     | Onde está configurado                                       | Status                             |
| --------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------- |
| **CSP (Content Security Policy)** | Controla quais scripts, estilos e recursos podem carregar     | `nuxt.config.ts` → `security.headers.contentSecurityPolicy` | ✅ Enforcing                       |
| **CSP Report-Only (nonce)**       | Testa política restritiva sem bloquear — violações no console | `server/plugins/csp-report-only.ts`                         | ✅ Monitorando                     |
| **HSTS**                          | Força HTTPS por 1 ano, incluindo subdomínios                  | `security.headers.strictTransportSecurity`                  | ✅ Ativo                           |
| **X-Frame-Options**               | Previne clickjacking (iframes)                                | `security.headers.xFrameOptions`                            | ✅ SAMEORIGIN                      |
| **X-Content-Type-Options**        | Previne MIME sniffing                                         | `security.headers.xContentTypeOptions`                      | ✅ nosniff                         |
| **Referrer-Policy**               | Controla dados enviados no header Referer                     | `security.headers.referrerPolicy`                           | ✅ strict-origin-when-cross-origin |
| **Permissions-Policy**            | Bloqueia acesso a câmera, microfone, geolocalização           | `security.headers.permissionsPolicy`                        | ✅ Bloqueadas                      |
| **Rate Limiting**                 | Limita requisições por IP (150/5min global)                   | `security.rateLimiter`                                      | ✅ Ativo                           |
| **CSRF Protection**               | Token anti-CSRF em POST/PUT/PATCH/DELETE                      | `security.csrf`                                             | ✅ Ativo                           |
| **XSS Validator**                 | Sanitiza inputs contra XSS                                    | `security.xssValidator`                                     | ✅ Ativo                           |
| **Request Size Limiter**          | Limita body a 2MB (8MB uploads)                               | `security.requestSizeLimiter`                               | ✅ Ativo                           |
| **Auth (httpOnly cookies)**       | Tokens JWT em cookies httpOnly + SameSite strict              | `layers/auth/server/utils/auth.ts`                          | ✅ Ativo                           |
| **Auto-refresh de tokens**        | Renova JWT automaticamente antes de expirar                   | `layers/auth/server/middleware/01.auth.ts`                  | ✅ Ativo                           |
| **Validação Zod (server)**        | Valida body e respostas com schemas tipados                   | `layers/base/server/utils/validation.ts`                    | ✅ Ativo                           |
| **Query whitelist**               | Aceita apenas query params conhecidos                         | `layers/base/server/utils/query-builder.ts`                 | ✅ Ativo                           |
| **Route param validation**        | Aceita apenas IDs numéricos ou UUIDs                          | `layers/base/server/utils/validation.ts`                    | ✅ Ativo                           |
| **hidePoweredBy**                 | Remove header X-Powered-By                                    | `security.hidePoweredBy`                                    | ✅ Ativo                           |
| **upgrade-insecure-requests**     | Redireciona HTTP → HTTPS automaticamente                      | CSP directive                                               | ✅ Ativo                           |

---

## Arquivos de Segurança Pública

| Arquivo                           | Propósito                                                                     | Referência                                  |
| --------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- |
| `public/.well-known/security.txt` | Contato para reporte de vulnerabilidades (RFC 9116)                           | [securitytxt.org](https://securitytxt.org/) |
| `robots.txt`                      | Gerado automaticamente pelo módulo `@nuxtjs/seo`                              | Configurado no `nuxt.config.ts`             |
| `X-Robots-Tag`                    | Headers `noindex, nofollow` em rotas internas (`/auth/**`, `/admin/**`, etc.) | `routeRules` no `nuxt.config.ts`            |

---

## Próximos Passos

Para entender cada camada em detalhe, consulte:

- [Autenticação](/docs/seguranca/autenticacao) — fluxo de login, cookies httpOnly, refresh automático
- [Headers e Proteções](/docs/seguranca/headers-protecoes) — CSP, HSTS, rate limiting, CSRF e mais
- [Guia para Desenvolvedores](/docs/seguranca/guia-desenvolvimento) — receitas práticas e checklist de segurança
