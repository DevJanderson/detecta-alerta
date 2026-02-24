---
status: filled
generated: 2026-02-24
agents:
  - type: 'refactoring-specialist'
    role: 'Implementar extrações de código e eliminar duplicações'
  - type: 'test-writer'
    role: 'Atualizar testes existentes para usar novos utils'
phases:
  - id: 'phase-1'
    name: 'Baseline & Utilities'
    prevc: 'E'
    agent: 'refactoring-specialist'
  - id: 'phase-2'
    name: 'Refatorar Consumers'
    prevc: 'E'
    agent: 'refactoring-specialist'
  - id: 'phase-3'
    name: 'Validação'
    prevc: 'V'
    agent: 'test-writer'
---

# Refatoração Pragmatic Programmer — Eliminar Duplicações

> Implementar correções P0, P1 e P2 identificadas na análise dos 4 princípios do Programador Pragmático (ETC, DRY, Ortogonalidade, Reversibilidade). Eliminar ~410+ linhas de duplicação em ~33+ arquivos.

## Task Snapshot

- **Primary goal:** Eliminar duplicações de código identificadas pela análise DRY/ETC/Ortogonalidade, criando utils e composables compartilhados em `0-base`
- **Success signal:** `npm run typecheck` + `npm run test:run` passam, zero duplicações de `extractErrorMessage`, error handling e CRUD patterns

## Working Phases

### Phase 1 — Baseline & Criar Utilities (E)

> **Primary Agent:** `refactoring-specialist`

**Objetivo:** Verificar baseline, criar os utils/composables compartilhados novos

| #   | Task                                                                                   | Status  | Deliverable     |
| --- | -------------------------------------------------------------------------------------- | ------- | --------------- |
| 1.1 | Rodar `npm run typecheck` para baseline                                                | pending | Zero erros      |
| 1.2 | Criar `layers/0-base/app/utils/error.ts` — `extractErrorMessage()` + tipo `FetchError` | pending | Arquivo novo    |
| 1.3 | Criar `layers/0-base/server/utils/api-handler.ts` — `handleSinapseRequest()` wrapper   | pending | Arquivo novo    |
| 1.4 | Criar `layers/0-base/server/utils/validation.ts` — `validateBody()` helper             | pending | Arquivo novo    |
| 1.5 | Criar `layers/0-base/server/utils/query-builder.ts` — `buildQueryString()`             | pending | Arquivo novo    |
| 1.6 | Criar `layers/0-base/app/components/common/DeleteConfirmDialog.vue` genérico           | pending | Componente novo |

### Phase 2 — Refatorar Consumers (E)

> **Primary Agent:** `refactoring-specialist`

**Objetivo:** Substituir código duplicado pelos novos utils em todos os consumers

| #   | Task                                                                        | Status  | Deliverable               |
| --- | --------------------------------------------------------------------------- | ------- | ------------------------- |
| 2.1 | Refatorar stores: remover `extractErrorMessage` local, importar de `0-base` | pending | 4 stores atualizados      |
| 2.2 | Refatorar server endpoints: usar `handleSinapseRequest()`                   | pending | 23+ endpoints atualizados |
| 2.3 | Refatorar server endpoints: usar `validateBody()`                           | pending | 5+ endpoints atualizados  |
| 2.4 | Refatorar server endpoints: usar `buildQueryString()`                       | pending | 3 endpoints atualizados   |
| 2.5 | Refatorar delete dialogs: usar `DeleteConfirmDialog` genérico               | pending | 3 dialogs substituídos    |
| 2.6 | Corrigir URLs hardcoded em `useSeoPage.ts` e `index.vue`                    | pending | 2 arquivos                |
| 2.7 | Extrair magic numbers de `RumoresCard.vue`                                  | pending | Constantes extraídas      |

### Phase 3 — Validação (V)

> **Primary Agent:** `test-writer`

**Objetivo:** Garantir que tudo funciona

| #   | Task                        | Status  | Deliverable  |
| --- | --------------------------- | ------- | ------------ |
| 3.1 | Rodar `npm run typecheck`   | pending | Zero erros   |
| 3.2 | Rodar `npm run test:run`    | pending | Todos passam |
| 3.3 | Rodar `npm run quality:fix` | pending | Código limpo |

## Rollback

- **Estratégia:** `git stash` ou `git checkout -- .` antes de cada fase
- **Risco:** BAIXO — refatoração de extração, sem mudança de comportamento
