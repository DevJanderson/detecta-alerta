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
- **Decisao:** Todos os route params numericos validados com `/^\d+$/` antes do uso. Criada funcao `validateRouteId()` em `layers/base/server/utils/validation.ts`.
- **Consequencias:** Path traversal bloqueado. Funcao reutilizavel disponivel para novos endpoints.

### Utils compartilhados em base

- **Contexto:** Codigo duplicado em multiplas layers — `extractErrorMessage` em 4 stores, error handling em 23+ endpoints, `buildQueryString` em 3 endpoints.
- **Decisao:** Extrair para utils compartilhados em `layers/base/`: `app/utils/error.ts`, `server/utils/api-handler.ts`, `server/utils/validation.ts`, `server/utils/query-builder.ts`.
- **Consequencias:** ~410 linhas de duplicacao eliminadas. Padrao DRY aplicado. Novos endpoints usam utils prontos.

### Nuxt Content para documentacao

- **Contexto:** Projeto precisava de documentacao tecnica acessivel e navegavel, integrada ao site principal.
- **Decisao:** Criar layer `docs` com Nuxt Content v3, layout 3 colunas (sidebar + conteudo + TOC), componentes MDC customizados.
- **Consequencias:** Documentacao versionada junto ao codigo. Markdown com componentes ricos. Navegacao automatica via composable.

### Layers com nomes semânticos e extends explícito

- **Contexto:** Nuxt layers tem ordem de prioridade — layers posteriores sobrescrevem anteriores. Inicialmente usava-se prefixo numérico (`0-base`, `1-auth`, etc.) com auto-scan.
- **Decisao:** Migrar para nomes semânticos (`base`, `auth`, `home`, etc.) com `extends` explícito no `nuxt.config.ts`. A ordem é controlada pela posição no array, não pelo nome.
- **Consequencias:** Nomes mais claros. Layers portáveis (podem ser compostas em outros projetos). Sem acoplamento ao sistema de nomes.

### Result como discriminated union (não classe DDD)

- **Contexto:** Proposta de adotar DDD classico (classes `Result<T>`, `ValueObject<T>`, `Entity<Type, Props>`, `UseCase<IN, OUT>`, `Repository`) para o projeto. O documento `ARCHITECTURE-ISSUES.md` sugeria 7 issues com 4 semanas de trabalho.
- **Decisao:** Rejeitar a abordagem enterprise com classes/heranca. Implementar apenas `Result` como discriminated union leve (`{ ok: true, value: T } | { ok: false, error: E }`) com funcoes puras (`ok()`, `fail()`, `combineResults()`, `unwrap()`, `unwrapOr()`). Manter VOs no padrao funcional existente (factory + Object.freeze) e adicionar `tryCreate*()` retornando `Result` para validacao reativa.
- **Motivacao:** (1) O projeto ja tinha VOs funcionais consolidados — classes criariam dois estilos incompativeis. (2) `withStoreAction` ja resolve error handling nos stores. (3) Repository/UseCase/Entity adicionam indirencao sem ganho em um BFF proxy. (4) Principio ETC: abstracao prematura dificulta mudancas futuras.
- **Consequencias:** Tipo `Result` disponivel em `#shared/domain/result`. Email VO com `tryCreateEmail()`. Composable `useVoField()` conecta VOs a formularios. Sem mudancas nos stores ou server routes existentes.

### Value Objects com tryCreate (validacao client+server)

- **Contexto:** Validacao de formularios era manual (computed inline) e desconectada da validacao server-side. VOs existentes usavam apenas throw (sem retorno de erro tipado).
- **Decisao:** VOs novos devem ter `tryCreate*()` retornando `Result<T>` alem do `create*()` que lanca excecao. Composable `useVoField()` conecta tryCreate a formularios reativos.
- **Consequencias:** Mesma regra de validacao reutilizavel em client (formularios) e server (endpoints BFF). VOs antigos mantidos inalterados — migracao sob demanda.

### pinia-plugin-persistedstate com pick explicito

- **Contexto:** Stores precisam persistir preferencias do usuario (filtros, tema) entre navegacoes, mas dados de API e auth nao devem ser persistidos.
- **Decisao:** Usar `pinia-plugin-persistedstate` com `pick` explicito — sempre declarar exatamente quais campos persistir.
- **Consequencias:** Apenas dados intencionais sao persistidos. Dados de API sempre frescos. Auth continua em cookies httpOnly.
