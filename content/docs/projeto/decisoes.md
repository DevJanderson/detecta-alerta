---
title: Decisoes Tecnicas
description: Registro de decisoes tecnicas do projeto Detecta Alerta.
---

# Decisoes Tecnicas

Registro de decisoes tecnicas relevantes, no estilo ADR (Architecture Decision Record) simplificado.

## 2026-02

### Signup movido para /api/auth/

- **Contexto:** O endpoint de signup estava em `/api/usuarios/admin/signup.post.ts`, dentro da rota `/api/usuarios/**` que tem CSRF desabilitado globalmente. Isso expunha o endpoint publico a ataques CSRF e criacao massiva de contas.
- **Decisao:** Mover para `/api/auth/signup.post.ts` onde o CSRF esta habilitado e o rate limiting de auth se aplica (5 req/5min).
- **Consequencias:** Endpoint agora protegido por CSRF e rate limiting. Rota semanticamente correta dentro do dominio de autenticacao.

### requireAdmin sincrono via event.context

- **Contexto:** `requireAdmin()` fazia uma segunda chamada a API Sinapse para verificar permissoes, duplicando a chamada ja feita pelo middleware `02.admin.ts`.
- **Decisao:** `requireAdmin()` agora le `event.context.isAdmin` setado pelo middleware, sem chamada extra.
- **Consequencias:** Eliminada duplicacao de chamada API em todos os endpoints admin (~23 endpoints). Performance melhorada em ~50% por request admin.

### Validacao de route params com regex

- **Contexto:** Parametros de rota (`[id]`, `[userId]`, `[permId]`) eram interpolados na URL da API Sinapse sem validacao, permitindo path traversal.
- **Decisao:** Todos os route params numericos validados com `/^\d+$/` antes do uso. Criada funcao `validateRouteId()` em `layers/0-base/server/utils/validation.ts`.
- **Consequencias:** Path traversal bloqueado. Funcao reutilizavel disponivel para novos endpoints.

### Utils compartilhados em 0-base

- **Contexto:** Codigo duplicado em multiplas layers — `extractErrorMessage` em 4 stores, error handling em 23+ endpoints, `buildQueryString` em 3 endpoints.
- **Decisao:** Extrair para utils compartilhados em `layers/0-base/`: `app/utils/error.ts`, `server/utils/api-handler.ts`, `server/utils/validation.ts`, `server/utils/query-builder.ts`.
- **Consequencias:** ~410 linhas de duplicacao eliminadas. Padrao DRY aplicado. Novos endpoints usam utils prontos.

### Nuxt Content para documentacao

- **Contexto:** Projeto precisava de documentacao tecnica acessivel e navegavel, integrada ao site principal.
- **Decisao:** Criar layer `5-docs` com Nuxt Content v3, layout 3 colunas (sidebar + conteudo + TOC), componentes MDC customizados.
- **Consequencias:** Documentacao versionada junto ao codigo. Markdown com componentes ricos. Navegacao automatica via composable.

### Layers numeradas com prefixo

- **Contexto:** Nuxt layers tem ordem de prioridade — layers posteriores sobrescrevem anteriores.
- **Decisao:** Prefixo numerico (`0-base`, `1-auth`, `2-home`, etc.) para tornar a ordem explicita e evitar ambiguidade.
- **Consequencias:** Ordem de prioridade visivel no filesystem. Facil adicionar novas layers no lugar correto.

### pinia-plugin-persistedstate com pick explicito

- **Contexto:** Stores precisam persistir preferencias do usuario (filtros, tema) entre navegacoes, mas dados de API e auth nao devem ser persistidos.
- **Decisao:** Usar `pinia-plugin-persistedstate` com `pick` explicito — sempre declarar exatamente quais campos persistir.
- **Consequencias:** Apenas dados intencionais sao persistidos. Dados de API sempre frescos. Auth continua em cookies httpOnly.
