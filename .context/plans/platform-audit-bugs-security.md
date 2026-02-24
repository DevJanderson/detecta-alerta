---
status: filled
generated: 2026-02-24
agents:
  - type: 'security-auditor'
    role: 'Corrigir vulnerabilidades CRITICAL e HIGH'
  - type: 'bug-fixer'
    role: 'Corrigir bugs confirmados e potenciais'
  - type: 'code-reviewer'
    role: 'Validar correcoes e garantir qualidade'
phases:
  - id: 'phase-1'
    name: 'Correcoes CRITICAL de Seguranca'
    prevc: 'E'
    agent: 'security-auditor'
  - id: 'phase-2'
    name: 'Correcoes HIGH + Bugs Confirmados'
    prevc: 'E'
    agent: 'bug-fixer'
  - id: 'phase-3'
    name: 'Validacao (typecheck + testes)'
    prevc: 'V'
    agent: 'code-reviewer'
---

# Auditoria Completa - Bugs e Seguranca

> Resultados da auditoria de 2026-02-24. Typecheck passou sem erros.

## Resumo Executivo

| Categoria    | CRITICAL | HIGH | MEDIUM | LOW | OK                |
| ------------ | -------- | ---- | ------ | --- | ----------------- |
| Seguranca    | 3        | 4    | 4      | 4   | 15                |
| Bugs         | 0        | 2    | 3      | 2   | 10+ areas solidas |
| Potenciais   | 0        | 1    | 4      | 2   | -                 |
| Code Quality | 0        | 0    | 0      | 7   | -                 |

**Veredito:** A plataforma tem uma base solida (auth, cookies, error handling, validacao Zod), mas precisa corrigir 3 vulnerabilidades CRITICAL antes de ir para producao.

---

## SEGURANCA - Findings

### CRITICAL

#### C1. Signup publico sem CSRF e sem rate limiting

- **Arquivo:** `layers/3-usuarios/server/api/usuarios/admin/signup.post.ts`
- **Problema:** Endpoint publico em rota `/api/usuarios/**` que tem CSRF desabilitado globalmente no `nuxt.config.ts`. Sem rate limiting.
- **Risco:** Criacao massiva de contas, CSRF de criacao de conta.
- **Fix:** Mover para `/api/auth/signup`, adicionar rate limiting (5 req/5min).

#### C2. Route params sem validacao (path traversal)

- **Arquivos:** Todos os endpoints com `[id]`, `[userId]`, `[permId]` em `layers/3-usuarios/server/api/usuarios/admin/`
- **Problema:** `getRouterParam(event, 'id')` interpolado na URL sem validar formato numerico.
- **Risco:** Path traversal na API Sinapse.
- **Fix:** Validar `if (!id || !/^\d+$/.test(id))` em todos os endpoints.

#### C3. Query param `limit` injetado direto na URL

- **Arquivo:** `layers/4-rumores/server/api/rumores/[uniqueId].relacionadas.get.ts:17`
- **Problema:** `query.limit` concatenado na URL sem sanitizacao.
- **Risco:** Parameter injection na API upstream.
- **Fix:** Validar como numero: `const limit = Number(query.limit)`.

### HIGH

#### H1. Admin check duplica chamada API (2x fetchSinapse por request)

- **Arquivos:** `layers/3-usuarios/server/middleware/02.admin.ts` + `layers/3-usuarios/server/utils/admin.ts`
- **Problema:** Middleware calcula `isAdmin` e seta no context, mas `requireAdmin()` ignora e faz segunda chamada.
- **Fix:** `requireAdmin()` deve ler `event.context.isAdmin`.

#### H2. Respostas de rumores sem validacao Zod

- **Arquivos:** Todos os endpoints em `layers/4-rumores/server/api/rumores/`
- **Problema:** `handleSinapseRequest` sem `schema` — dados da API repassados sem filtro.
- **Fix:** Adicionar schemas Zod em todos os endpoints de rumores.

#### H3. Upload de foto sem validacao MIME/tamanho no servidor

- **Arquivo:** `layers/3-usuarios/server/api/usuarios/perfil/upload-foto.post.ts`
- **Problema:** Aceita qualquer tipo de arquivo. Sem validacao de MIME, extensao ou tamanho individual.
- **Fix:** Whitelist `['image/jpeg', 'image/png', 'image/webp']`, max 5MB, max 1 arquivo.

#### H4. CSP com unsafe-inline e unsafe-eval em producao

- **Arquivo:** `nuxt.config.ts:126-127`
- **Problema:** `'unsafe-inline'` e `'unsafe-eval'` anulam protecao CSP contra XSS.
- **Fix:** Substituir por nonces (requer mais investigacao).
- **Nota:** Fix complexo, pode ficar para sprint seguinte.

### MEDIUM

- M1. Token refresh sem protecao contra race condition (`layers/1-auth/server/utils/auth.ts`)
- M2. Non-null assertion `!` no access token em 14 endpoints admin
- M3. HSTS sem preload flag (`nuxt.config.ts:136-139`)
- M4. Sem rate limiting no upload de foto

### LOW

- L1. `logAuthError` sem informacao util em producao
- L2. Cookie CSRF com nome previsivel
- L3. `apiBaseUrl` nao usado no runtimeConfig publico
- L4. Ausencia de header Permissions-Policy

### OK (15 areas que passaram)

- Tokens JWT em cookies httpOnly (secure, sameSite strict)
- Login com validacao Zod completa (entrada e saida)
- Reset password nao revela existencia de email
- Open redirect prevention com `isValidRedirectUrl`
- `sinapseApiUrl` server-only (nao exposta ao client)
- Erros internos nao vazam stack traces
- `buildQueryString` usa whitelist de parametros
- Sem uso de `v-html` nos templates (sem XSS direto)
- Sem `localStorage` direto (usa pinia-plugin-persistedstate com `pick`)
- `.env` corretamente gitignored
- Logout limpa cookies mesmo se API falhar
- Rate limiting em login (10/5min) e reset-password (5/5min)
- Headers de seguranca (HSTS, X-Frame-Options, nosniff, referrer-policy)
- Middleware auth protege rotas corretamente
- Respostas de auth validadas com schemas Zod

---

## BUGS - Findings

### Confirmados (ALTA prioridade)

#### BUG-2. GruposMembros recebe `:membros="[]"` hardcoded

- **Arquivo:** `layers/3-usuarios/app/pages/admin/grupos/[id].vue:162`
- **Problema:** Lista de membros do grupo NUNCA exibida.
- **Fix:** `:membros="grupo.usuarios ?? []"`

#### BUG-3. Docs catch-all nao recarrega conteudo ao navegar client-side

- **Arquivo:** `layers/5-docs/app/pages/docs/[...slug].vue:14`
- **Problema:** Key do `useAsyncData` e estatica, nao reativa ao `slug`.
- **Fix:** Adicionar `{ watch: [slug] }` no `useAsyncData`.

### Confirmados (MEDIA prioridade)

#### BUG-1. Admin endpoints fazem 2x chamada API por request

- Mesmo que H1 da seguranca.

#### BUG-5. Rumores `await` no setup bloqueia navegacao sem feedback

- **Arquivo:** `layers/4-rumores/app/pages/rumores/index.vue:15-18`
- **Fix:** Mover para `onMounted`.

### Confirmados (BAIXA prioridade)

#### BUG-4. error.vue usa `useSeoMeta` ao inves de `useSeoPage`

- **Arquivo:** `layers/0-base/app/error.vue:8-11`

### Potenciais

- POTENTIAL-1. `useDebounce` nao limpa timeout ao desmontar (`layers/0-base/app/composables/useDebounce.ts`)
- POTENTIAL-2. `RumoresCard` crash se descricao e conteudo forem null (`layers/4-rumores/app/components/RumoresCard.vue:13-16`)
- POTENTIAL-3. `isLoading` compartilhado causa race conditions em 3 stores
- POTENTIAL-4. Pagination `default-page` nao sincroniza ao filtrar
- POTENTIAL-7. Filtros persistidos no store nao refletem na UI ao recarregar

### Code Quality

- CQ-1. Lista UF duplicada em 3 arquivos (extrair para `0-base/app/utils/constants.ts`)
- CQ-2. `as never` type casts suprimem erros de tipo
- CQ-3. DeleteConfirmDialog permite duplo-clique (falta prop `loading`)
- CQ-4. Texto sem acentuacao no dialog de exclusao
- CQ-5. Upload sem validacao MIME client-side
- CQ-6. `as Record<string, unknown>` em body validado por Zod
- CQ-7. `fetchSinapse` nao suporta FormData

---

## Plano de Correcao

### Fase 1 — Correcoes CRITICAL de Seguranca (estimativa: 1h)

| #   | Task                                                   | Esforco |
| --- | ------------------------------------------------------ | ------- |
| 1.1 | C2: Adicionar validacao regex em todos os route params | Baixo   |
| 1.2 | C3: Sanitizar `query.limit` como numero                | Baixo   |
| 1.3 | C1: Mover signup para rota correta + rate limiting     | Baixo   |

### Fase 2 — Correcoes HIGH + Bugs (estimativa: 2h)

| #   | Task                                                      | Esforco |
| --- | --------------------------------------------------------- | ------- | ------------------ | ------- |
| 2.1 | H1/BUG-1: Unificar admin check (requireAdmin usa context) | Medio   |
| 2.2 | H3: Validacao MIME/tamanho no upload                      | Baixo   |
| 2.3 | BUG-2: Corrigir `:membros="[]"` hardcoded                 | Trivial |
| 2.4 | BUG-3: Adicionar `watch: [slug]` no useAsyncData docs     | Trivial |
| 2.5 | BUG-5: Mover await para onMounted na pagina de rumores    | Baixo   |
| 2.6 | M2: Substituir `!` assertions por `requireAuth()`         | Baixo   |
| 2.7 | POTENTIAL-1: Adicionar `onScopeDispose` no useDebounce    | Trivial |
| 2.8 | POTENTIAL-2: Fallback `                                   |         | ''` no RumoresCard | Trivial |

### Fase 3 — Validacao

| #   | Task                      |
| --- | ------------------------- |
| 3.1 | Rodar `npm run typecheck` |
| 3.2 | Rodar `npm run test:run`  |
| 3.3 | Rodar `npm run quality`   |

### Backlog (proximo sprint)

- H2: Adicionar schemas Zod nos endpoints de rumores
- H4: Investigar CSP com nonces
- M1: Lock no token refresh
- M3: HSTS preload
- M4: Rate limiting no upload
- POTENTIAL-3/4/7: Melhorias de UX nos stores e filtros
- CQ-1 a CQ-7: Melhorias de code quality
