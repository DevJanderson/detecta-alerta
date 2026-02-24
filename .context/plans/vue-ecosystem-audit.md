---
status: filled
generated: 2026-02-24
agents:
  - type: 'code-reviewer'
    role: 'Auditar código existente contra best practices das skills'
  - type: 'refactoring-specialist'
    role: 'Aplicar correções de deprecações e padrões desatualizados'
  - type: 'frontend-specialist'
    role: 'Avaliar componentes UI e integração shadcn-vue/Reka UI'
  - type: 'performance-optimizer'
    role: 'Identificar oportunidades de lazy hydration e shallowRef'
  - type: 'test-writer'
    role: 'Validar correções com testes'
docs:
  - 'architecture.md'
  - 'project-overview.md'
phases:
  - id: 'phase-1'
    name: 'Auditoria — Scan completo'
    prevc: 'P'
    agent: 'code-reviewer'
  - id: 'phase-2'
    name: 'Correções — Aplicar fixes'
    prevc: 'E'
    agent: 'refactoring-specialist'
  - id: 'phase-3'
    name: 'Validação — Testes e typecheck'
    prevc: 'V'
    agent: 'test-writer'
---

# Auditoria Vue Ecosystem + Pragmatic Programmer

> Auditar o codebase usando as 7 skills do vue-ecosystem cruzadas com os checklists pragmáticos (ETC, DRY, Orthogonality, Reversibility) para identificar deprecações, anti-patterns e oportunidades de melhoria.

## Objetivo

- **Meta:** Identificar e corrigir padrões desatualizados, APIs deprecadas e anti-patterns
- **Sinal de sucesso:** Zero warnings de deprecação, `npm run typecheck` passando, código alinhado com best practices atuais
- **Skills usadas:** vue-skilld, shadcn-vue-skilld, pinia-skilld, vee-validate-skilld, vueuse-core-skilld, reka-ui-skilld, tanstack-vue-table-skilld
- **Checklists pragmáticos:** ETC, DRY, Orthogonality, Reversibility

## Escopo

**Incluído:**

- Todos os arquivos `.vue`, composables, stores, e server utils nas 6 layers
- Componentes shadcn-vue em `layers/0-base/app/components/ui/`
- Formulários com VeeValidate
- Uso de VueUse

**Excluído:**

- `generated/sinapse/` (auto-gerado pelo Kubb)
- `node_modules/`
- Arquivos de configuração (nuxt.config, vitest.config, etc.)

---

## Phase 1 — Auditoria: Scan Completo

> **Agent:** `code-reviewer` + `frontend-specialist`

**Objetivo:** Escanear todo o codebase procurando padrões que conflitam com as skills

### 1.1 Vue Core (vue-skilld)

| #     | O que verificar                                                                   | Checklist pragmático           | Onde procurar                           |
| ----- | --------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------- |
| 1.1.1 | Uso de `ref` + template `ref="x"` → migrar para `useTemplateRef()` (Vue 3.5+)     | ETC: API mais clara            | Todos os `.vue` com `ref="..."`         |
| 1.1.2 | `withDefaults(defineProps)` → migrar para destructure com defaults (Vue 3.5+)     | DRY: menos boilerplate         | Todos os `<script setup>`               |
| 1.1.3 | Oportunidades de `defineModel()` em vez de prop + emit manual                     | ETC: bidirecional simplificado | Componentes com `v-model`               |
| 1.1.4 | `watch` sem cleanup → usar `onWatcherCleanup()` (Vue 3.5+)                        | Orthogonality: cleanup isolado | Composables com watch + side effects    |
| 1.1.5 | Dados grandes em `ref()` → avaliar `shallowRef()`                                 | Performance + ETC              | Stores com arrays/objetos grandes       |
| 1.1.6 | Componentes async sem lazy hydration → avaliar `hydrateOnVisible`/`hydrateOnIdle` | Performance SSR                | Componentes pesados em páginas públicas |

### 1.2 shadcn-vue (shadcn-vue-skilld)

| #     | O que verificar                                                                | Checklist pragmático                 | Onde procurar                                        |
| ----- | ------------------------------------------------------------------------------ | ------------------------------------ | ---------------------------------------------------- |
| 1.2.1 | Toast legado → migrar para Sonner (deprecado oficialmente)                     | Reversibility: componente deprecated | Buscar `toast(` ou imports de toast                  |
| 1.2.2 | Cores HSL → verificar se OKLCH está correto                                    | ETC: design system consistente       | `main.css` e componentes com cores inline            |
| 1.2.3 | `data-slot` attributes → verificar se estão sendo usados para styling          | ETC: granular styling                | Componentes UI customizados                          |
| 1.2.4 | Novos componentes disponíveis: `Kbd`, `Spinner`, `ButtonGroup`, `NativeSelect` | DRY: evitar reinventar               | Componentes customizados que replicam funcionalidade |

### 1.3 Pinia (pinia-skilld)

| #     | O que verificar                                                                | Checklist pragmático            | Onde procurar                                |
| ----- | ------------------------------------------------------------------------------ | ------------------------------- | -------------------------------------------- |
| 1.3.1 | `defineStore({ id: 'x' })` → trocar para `defineStore('x', ...)` (breaking v3) | Reversibility: compat v3        | Todos os stores                              |
| 1.3.2 | Mutações diretas → usar `$patch()` com callback                                | DRY: batch mutations            | Actions que fazem `.value =` múltiplas vezes |
| 1.3.3 | `watch(store.state)` → usar `$subscribe()`                                     | Orthogonality: observer pattern | Componentes que watcham stores               |
| 1.3.4 | `useOtherStore()` após `await` → mover para antes do await                     | Bug SSR                         | Actions assíncronas que compõem stores       |
| 1.3.5 | Estado com persistedstate → verificar `skipHydrate()` para SSR                 | Bug SSR                         | Stores com `persist: { pick: [...] }`        |
| 1.3.6 | Objetos externos (router, etc.) → verificar `markRaw()`                        | Performance                     | Stores que armazenam objetos não-reativos    |

### 1.4 VeeValidate (vee-validate-skilld)

| #     | O que verificar                                                         | Checklist pragmático    | Onde procurar                       |
| ----- | ----------------------------------------------------------------------- | ----------------------- | ----------------------------------- |
| 1.4.1 | `defineComponentBinds`/`defineInputBinds` → migrar para `defineField()` | DRY: API unificada      | Forms com Composition API           |
| 1.4.2 | Schemas Zod sem `markRaw()` → adicionar para performance                | Performance             | `useForm({ validationSchema })`     |
| 1.4.3 | Erros exibidos sem `meta.touched` → adicionar guard                     | UX: validação agressiva | Templates com `errors.field` direto |
| 1.4.4 | `toTypedSchema()` com Zod → verificar uso correto                       | ETC: type safety        | Forms com validação Zod             |
| 1.4.5 | Multi-step forms → verificar `keepValuesOnUnmount`                      | Bug: perda de dados     | Formulários com v-if/tabs           |

### 1.5 VueUse Core (vueuse-core-skilld)

| #     | O que verificar                                                          | Checklist pragmático     | Onde procurar                           |
| ----- | ------------------------------------------------------------------------ | ------------------------ | --------------------------------------- |
| 1.5.1 | `watchPausable` → trocar por `watch()` nativo (Vue 3.5 tem pause/resume) | DRY: nativo é melhor     | Buscar `watchPausable`                  |
| 1.5.2 | `computedEager` → remover (Vue 3.4+ não precisa)                         | DRY: redundante          | Buscar `computedEager`                  |
| 1.5.3 | `templateRef()` do VueUse → trocar por `useTemplateRef()` nativo         | DRY: nativo é melhor     | Buscar `templateRef(`                   |
| 1.5.4 | Verificar se `@vueuse/core` >= 14 está instalado                         | Reversibility: compat    | `package.json`                          |
| 1.5.5 | Oportunidades de `createSharedComposable` → evitar listeners duplicados  | Orthogonality: singleton | Composables com event listeners globais |

### 1.6 Reka UI (reka-ui-skilld)

| #     | O que verificar                                                     | Checklist pragmático | Onde procurar                      |
| ----- | ------------------------------------------------------------------- | -------------------- | ---------------------------------- |
| 1.6.1 | `v-model:checked` / `v-model:pressed` → trocar por `v-model` padrão | Breaking change      | Checkbox, Toggle, MenuCheckboxItem |
| 1.6.2 | CSS vars com prefixo antigo `--radix-` → trocar para `--reka-`      | Breaking rename      | CSS com `--radix-`                 |
| 1.6.3 | Data attributes `data-radix-` → trocar para `data-reka-`            | Breaking rename      | Templates/CSS com `data-radix-`    |
| 1.6.4 | Combobox com `filter-function` → refatorar (removido)               | Breaking change      | Componentes Combobox               |
| 1.6.5 | Listas grandes sem virtualização → avaliar `ComboboxVirtualizer`    | Performance          | Select/Combobox com muitos items   |

### 1.7 TanStack Vue Table (tanstack-vue-table-skilld)

| #     | O que verificar                                                              | Checklist pragmático | Onde procurar                                          |
| ----- | ---------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------ |
| 1.7.1 | Tabelas admin com sorting/filtering manual → avaliar adoção                  | ETC: headless table  | `UsuariosAdminTable`, `GruposTable`, `PermissoesTable` |
| 1.7.2 | Se já usa → verificar `FlexRender`, data reativa, `manual*` para server-side | Best practices       | Componentes de tabela existentes                       |

---

## Phase 2 — Correções: Aplicar Fixes

> **Agent:** `refactoring-specialist` + `frontend-specialist`

**Objetivo:** Corrigir os problemas encontrados na Phase 1, priorizando por impacto

### Prioridade de correção

| Prioridade   | Tipo             | Critério                                          |
| ------------ | ---------------- | ------------------------------------------------- |
| P0 - Crítico | Breaking changes | Código que vai quebrar com upgrade de dependência |
| P1 - Alto    | Deprecações      | APIs deprecated que serão removidas               |
| P2 - Médio   | Best practices   | Padrões subótimos mas funcionais                  |
| P3 - Baixo   | Oportunidades    | Melhorias opcionais (performance, DX)             |

### Tasks

| #    | Task                                                                      | Prioridade | Status   | Notas                                                          |
| ---- | ------------------------------------------------------------------------- | ---------- | -------- | -------------------------------------------------------------- |
| 2.1  | Corrigir breaking changes Reka UI (v-model, prefixos)                     | P0         | n/a      | Nenhum uso de `--radix-` ou `v-model:checked` encontrado       |
| 2.2  | Migrar APIs deprecadas VueUse (watchPausable, templateRef, computedEager) | P1         | n/a      | Nenhuma API deprecada em uso                                   |
| 2.3  | Migrar toast legado para Sonner (se aplicável)                            | P1         | n/a      | Toast legado não encontrado                                    |
| 2.4  | Migrar para `useTemplateRef()` (Vue 3.5)                                  | P1         | n/a      | Nenhum uso de `ref="x"` + `ref()` encontrado                   |
| 2.5  | Migrar `withDefaults` para destructure (Vue 3.5)                          | P2         | done     | Button, Separator, AuthLoginForm migrados                      |
| 2.6  | Adicionar `markRaw()` em schemas Zod do VeeValidate                       | P2         | n/a      | VeeValidate não usa schemas Zod inline no projeto              |
| 2.7  | Avaliar `$patch()` nos stores Pinia                                       | P2         | avaliado | Desnecessário: composition stores com mutations síncronas      |
| 2.8  | Verificar `skipHydrate()` para SSR em stores persistidos                  | P2         | avaliado | rumoresStore usa `persist: { pick: ['filtros'] }` — correto    |
| 2.9  | Avaliar `shallowRef()` para dados grandes                                 | P3         | done     | 7 campos migrados em 4 stores                                  |
| 2.10 | Avaliar lazy hydration para componentes pesados                           | P3         | avaliado | Todas as páginas requerem auth — lazy hydration não aplica     |
| 2.11 | Avaliar `defineModel()` em componentes com v-model                        | P3         | avaliado | Componentes usam v-model via shadcn-vue (Reka UI) — já correto |

**Tasks adicionais (encontradas na Phase 1):**

| #    | Task                                                     | Prioridade | Status |
| ---- | -------------------------------------------------------- | ---------- | ------ |
| 2.12 | Migrar debounce manual para `onWatcherCleanup` (Vue 3.5) | P2         | done   |
| 2.13 | Remover `reactiveOmit` (VueUse) do Separator.vue         | P2         | done   |

**Commit Checkpoint:** `refactor: aplica correções do audit vue-ecosystem`

---

## Phase 3 — Validação

> **Agent:** `test-writer`

**Objetivo:** Garantir que as correções não quebraram nada

| #   | Task                                                        | Status  |
| --- | ----------------------------------------------------------- | ------- |
| 3.1 | Rodar `npm run typecheck` — zero erros                      | done    |
| 3.2 | Rodar `npm run quality:fix` — zero erros de lint            | done    |
| 3.3 | Rodar `npm run test:run` — testes existentes passando       | done    |
| 3.4 | Testar manualmente páginas afetadas (forms, admin, rumores) | pending |
| 3.5 | Atualizar `.context/docs/` se necessário                    | n/a     |

**Commit Checkpoint:** `test: valida correções do audit vue-ecosystem`
