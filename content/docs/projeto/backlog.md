---
title: Backlog
description: Itens pendentes identificados na auditoria de seguranca e bugs da plataforma.
---

# Backlog

Itens pendentes identificados durante a auditoria de seguranca e bugs realizada em fevereiro de 2026. Organizados por severidade.

## Alta prioridade

| Item | Titulo                                           | Categoria | Descricao                                                                                                                                             |
| ---- | ------------------------------------------------ | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| H2   | Respostas de rumores sem validacao Zod           | Backend   | Endpoints em `layers/rumores/server/api/rumores/` repassam dados da API Sinapse sem schema Zod. Adicionar validacao em todos os endpoints de rumores. |
| H4   | CSP com unsafe-inline e unsafe-eval              | Infra     | `nuxt.config.ts` usa `'unsafe-inline'` e `'unsafe-eval'` no CSP, anulando protecao contra XSS. Substituir por nonces (requer investigacao).           |
| M1   | Token refresh sem protecao contra race condition | Backend   | `layers/auth/server/utils/auth.ts` pode disparar multiplos refreshes simultaneos. Implementar lock/mutex.                                             |

## Media prioridade

| Item        | Titulo                                        | Categoria | Descricao                                                                                                                              |
| ----------- | --------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| M3          | HSTS sem preload flag                         | Infra     | Header HSTS em `nuxt.config.ts` sem diretiva `preload`. Adicionar e submeter ao HSTS preload list.                                     |
| M4          | Rate limiting no upload de foto               | Backend   | Endpoint de upload em `layers/usuarios/server/api/usuarios/perfil/upload-foto.post.ts` sem rate limiting dedicado.                     |
| POTENTIAL-3 | isLoading compartilhado causa race conditions | Frontend  | Stores de usuarios, grupos e permissoes usam flag `isLoading` compartilhada — acoes concorrentes podem resetar o estado.               |
| POTENTIAL-4 | Paginacao nao sincroniza ao filtrar           | Frontend  | `default-page` do componente de paginacao nao reseta para 1 ao aplicar novos filtros.                                                  |
| POTENTIAL-7 | Filtros persistidos nao refletem na UI        | Frontend  | Ao recarregar a pagina, filtros salvos no `localStorage` (via pinia-plugin-persistedstate) nao sao refletidos nos controles de filtro. |

## Baixa prioridade (code quality)

| Item | Titulo                                        | Categoria | Descricao                                                                                          |
| ---- | --------------------------------------------- | --------- | -------------------------------------------------------------------------------------------------- |
| CQ-2 | `as never` type casts                         | Frontend  | Type casts suprimem erros de tipo em vez de corrigi-los. Revisar e substituir por tipagem correta. |
| CQ-3 | DeleteConfirmDialog permite duplo-clique      | Frontend  | Falta prop `loading` para desabilitar botao durante a acao.                                        |
| CQ-4 | Texto sem acentuacao em dialogs               | Frontend  | Dialogs de exclusao usam texto sem acentos (`Excluir usuario` em vez de `Excluir usuario`).        |
| CQ-5 | Upload sem validacao MIME client-side         | Frontend  | Componente de upload aceita qualquer tipo de arquivo antes de enviar ao servidor.                  |
| CQ-6 | `as Record<string, unknown>` em body validado | Backend   | Cast desnecessario em bodies ja validados por Zod. Remover e usar inferencia de tipo.              |

## Itens resolvidos

Itens corrigidos na sprint de fevereiro de 2026:

- **C1** — Signup movido para `/api/auth/signup` com rate limiting
- **C2** — Validacao regex em todos os route params (`/^\d+$/`)
- **C3** — Query param `limit` sanitizado como numero
- **H1/BUG-1** — Admin check unificado (`requireAdmin` usa `event.context`)
- **H3** — Validacao MIME/tamanho no upload (server-side)
- **BUG-3** — `useAsyncData` com `watch: [slug]` no docs catch-all
- **BUG-4** — `error.vue` usando `useSeoPage`
- **BUG-5** — Await movido para `onMounted` na pagina de rumores
- **M2** — Non-null assertions substituidas por validacao
- **POTENTIAL-1** — `useDebounce` com `onScopeDispose`
- **POTENTIAL-2** — Fallback para descricao/conteudo null no `RumoresCard`
- **CQ-1** — Lista UF extraida para `base/app/utils/constants.ts`
- **CQ-7** — `fetchSinapse` agora suporta FormData (upload)
