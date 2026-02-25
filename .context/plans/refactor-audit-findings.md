---
status: completed
generated: 2026-02-25
completed: 2026-02-24
agents:
  - type: 'refactoring-specialist'
    role: 'Extrações DRY e refatorações de código'
  - type: 'frontend-specialist'
    role: 'Melhorias Vue 3.5+ e correções de componentes'
  - type: 'security-auditor'
    role: 'Sanitização de inputs e validação'
phases:
  - id: 'phase-1'
    name: 'Extrações DRY e Utils compartilhados'
    prevc: 'V'
    agent: 'refactoring-specialist'
  - id: 'phase-2'
    name: 'Fixes de consistência e segurança'
    prevc: 'V'
    agent: 'security-auditor'
  - id: 'phase-3'
    name: 'Melhorias Vue 3.5+ e correções de bug'
    prevc: 'V'
    agent: 'frontend-specialist'
  - id: 'phase-4'
    name: 'Validação'
    prevc: 'V'
    agent: 'refactoring-specialist'
skills:
  - 'etc-checklist'
  - 'dry-checklist'
  - 'orthogonality-checklist'
  - 'code-review'
  - 'vue-skilld'
---

# Refatoração — Auditoria Pragmatic Programmer + Vue 3.5+

> Implementar todas as melhorias da auditoria combinada de princípios do Programador Pragmático (ETC, DRY, Ortogonalidade, Reversibilidade), code review e boas práticas Vue 3.5+/shadcn-vue.

## Task Snapshot

- **Primary goal:** Eliminar duplicações, melhorar consistência e adotar APIs modernas do Vue 3.5+
- **Success signal:** `npm run typecheck` passa, zero regressões, padrões DRY aplicados
- **Escala PREVC:** MEDIUM (P → E → V)

## Working Phases

### Phase 1 — Extrações DRY e Utils compartilhados

**Objetivo:** Extrair conhecimento duplicado para utils/composables reutilizáveis.

| #   | Task                                                                                  | Arquivos                                                                                      | Status |
| --- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------ |
| 1.1 | Criar `ESTADOS_BR` em `layers/0-base/app/utils/constants.ts`                          | Novo arquivo                                                                                  | done   |
| 1.2 | Substituir lista de UFs nos 3 componentes pelo import compartilhado                   | `RumoresFilters.vue`, `UsuariosAdminForm.vue`, `UsuariosPerfilForm.vue`                       | done   |
| 1.3 | Criar helper `withStoreAction()` em `layers/0-base/app/utils/store-helpers.ts`        | Novo arquivo                                                                                  | done   |
| 1.4 | Refatorar stores para usar `withStoreAction()` (~31 repetições)                       | `useUsuariosStore`, `useGruposStore`, `usePermissoesStore`, `useRumoresStore`, `useAuthStore` | done   |
| 1.5 | Criar composable `useNavigation(groups)` genérico em `layers/0-base/app/composables/` | Novo arquivo                                                                                  | done   |
| 1.6 | Refatorar `useDocsNavigation` e `useDesignSystemNav` para usar `useNavigation`        | 2 composables                                                                                 | done   |
| 1.7 | Extrair `formatDate` para `layers/0-base/app/utils/date.ts`                           | `UsuariosAdminDetail.vue` + novo util                                                         | done   |

**Commit:** `refactor(base): extrai utils DRY (UFs, withStoreAction, useNavigation, formatDate)`

### Phase 2 — Fixes de consistência e segurança

**Objetivo:** Corrigir inconsistências e problemas de segurança identificados.

| #   | Task                                                                 | Arquivos                                                    | Status |
| --- | -------------------------------------------------------------------- | ----------------------------------------------------------- | ------ |
| 2.1 | Trocar `useSeoMeta` por `useSeoPage` na page de docs                 | `layers/5-docs/app/pages/docs/[...slug].vue:24`             | done   |
| 2.2 | Usar `extractErrorMessage` no `useRumoresStore`                      | `useRumoresStore.ts:59,73`                                  | done   |
| 2.3 | Usar `validateBody` em `login.post.ts` e `reset-password.post.ts`    | 2 endpoints BFF                                             | done   |
| 2.4 | Criar `validateUniqueId` e sanitizar params nos endpoints de rumores | `[uniqueId].get.ts`, `[uniqueId].relacionadas.get.ts`       | done   |
| 2.5 | Estender `fetchSinapse` para suportar FormData (upload)              | `layers/1-auth/server/utils/auth.ts`, `upload-foto.post.ts` | done   |

**Commit:** `fix(base): corrige consistência de validação e sanitização de inputs`

### Phase 3 — Melhorias Vue 3.5+ e correções de bug

**Objetivo:** Adotar APIs modernas do Vue e corrigir bugs de UX.

| #   | Task                                                       | Arquivos                                                                                   | Status |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| 3.1 | Migrar `ref()` para `useTemplateRef()` (3 componentes)     | `UsuariosPerfilFoto.vue`, `RumoresFeed.vue`, `docs/[...slug].vue`                          | done   |
| 3.2 | Migrar `props+emit` para `defineModel()` (4 dialogs)       | `DeleteConfirmDialog.vue`, `GruposForm.vue`, `PermissoesForm.vue`, `UsuariosAdminForm.vue` | done   |
| 3.3 | Fix `isRemoving` resetado sem await em `GruposMembros.vue` | `GruposMembros.vue:57-61`                                                                  | done   |
| 3.4 | Eliminar `as never` nas pages admin (tipar corretamente)   | `admin/usuarios/index.vue:73-75`, `admin/usuarios/[id].vue:56`                             | done   |
| 3.5 | Usar destructure com default no `AppLoading.vue`           | `AppLoading.vue`                                                                           | done   |

**Commit:** `refactor(vue): adota defineModel, useTemplateRef e corrige bugs de UX`

### Phase 4 — Validação

**Objetivo:** Garantir que tudo funciona corretamente.

| #   | Task                                     | Status |
| --- | ---------------------------------------- | ------ |
| 4.1 | `npm run typecheck` passa sem erros      | done   |
| 4.2 | `npm run quality:fix` sem novos warnings | done   |
| 4.3 | `npm run test:run` sem regressões        | done   |

## Success Criteria

- Zero erros em `npm run typecheck`
- Zero regressões em testes existentes
- Lista de UFs em 1 lugar (não 3)
- Padrão try/catch em stores via helper (não inline)
- Endpoints BFF consistentes (todos usando `validateBody`)
- `uniqueId` sanitizado nos endpoints de rumores
