---
title: 'Homepage — HomeFilters'
description: 'Selects de estado e semana epidemiológica — filtros que refinam os dados de toda a página.'
order: 4
---

# HomeFilters

Barra com dois selects que refinam os dados exibidos em toda a página: **Estado** e **Semana Epidemiológica**.

---

## O que exibe

| Elemento                       | Valores                                            | Fonte                                                     |
| ------------------------------ | -------------------------------------------------- | --------------------------------------------------------- |
| Select "Estado"                | `Todos os Estados` + estados da região selecionada | `store.filteredEstados` (filtrado por `REGION_TO_STATES`) |
| Select "Semana Epidemiológica" | `Semana 09 (24 fev a 02 mar. 2026)`                | API via `store.semanas` (carregadas no `fetchLookups`)    |

O select de estados **filtra automaticamente** conforme a região selecionada no switcher. Ex: ao selecionar "Norte", mostra apenas AC, AM, AP, PA, RO, RR, TO. Na visão "Brasil", mostra todos os 27 estados.

A semana mais recente é selecionada automaticamente ao carregar a página. Se a semana persistida no localStorage não existir mais na lista de semanas disponíveis (ex: após semanas sem uso), é resetada para a mais recente.

---

## Conexão com outros componentes

```
HomeFilters
  ├─ store.setEstado(value)
  │    └─ store.fetchAll()
  │         ├─ HomePanorama  ← dados filtrados por estado
  │         ├─ HomeTable     ← linha única com o estado selecionado
  │         └─ HomeChart     ← série temporal do estado
  │
  └─ store.setSemana(value)
       └─ store.fetchAll()
            ├─ HomePanorama  ← dados da semana específica
            ├─ HomeTable     ← dados da semana específica
            └─ HomeChart     ← série temporal (não usa filtro de semana)
```

### Combinação com HomeRegionTabs

Os filtros funcionam **em conjunto** com o switcher de região:

| Região | Estado | Semana       | Resultado                        |
| ------ | ------ | ------------ | -------------------------------- |
| Brasil | Todos  | Mais recente | Visão nacional, semana atual     |
| Sul    | Todos  | Mais recente | Estados do Sul, semana atual     |
| Brasil | SP     | Mais recente | Dados de São Paulo, semana atual |
| Sul    | Todos  | Semana 05    | Estados do Sul, semana 05        |

Quando um **estado é selecionado**, ele tem prioridade sobre a região — a API busca `aggregation_level=state` com o UF específico.

Ao trocar de região, se o estado selecionado **não pertence** à nova região (ex: SP selecionado e troca para Norte), o estado é resetado para "Todos os Estados".

---

## API Sinapse

Os selects não fazem chamadas próprias. Ao mudar valor:

- `setEstado()` e `setSemana()` atualizam `filtros` na store e chamam `fetchAll()`
- Os parâmetros de filtro são passados para `getPanorama()`, `getRegionTable()` e `getChartSeries()`

As **opções de semana** são carregadas uma única vez no `fetchLookups()`:

| Parâmetro           | Valor    | Descrição                  |
| ------------------- | -------- | -------------------------- |
| `aggregation_level` | `region` | Buscar semanas disponíveis |
| `unit_type`         | `all`    | Consolidado                |
| `weeks`             | `10`     | Últimas 10 semanas         |

---

## Estados da UI

| Estado             | O que aparece                                        |
| ------------------ | ---------------------------------------------------- |
| Carregando semanas | Select de semana vazio até `fetchLookups` completar  |
| Semana selecionada | Label formatado: "Semana XX (DD mmm a DD mmm. AAAA)" |
| Estado selecionado | Nome do estado no select                             |

---

## Arquivos

| Arquivo                                       | Responsabilidade                                                         |
| --------------------------------------------- | ------------------------------------------------------------------------ |
| `layers/home/app/components/HomeFilters.vue`  | Template dos selects (usa `store.filteredEstados`)                       |
| `layers/home/app/composables/useHomeStore.ts` | `setEstado()`, `setSemana()`, `fetchLookups()`, `filteredEstados`        |
| `layers/home/app/composables/useHomeApi.ts`   | `getEstados()`, `getEstadosByRegion()` (constante), `getSemanas()` (API) |
