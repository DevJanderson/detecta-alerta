---
title: 'Homepage — HomeFilters'
description: 'Selects de estado e semana epidemiológica — filtros que refinam os dados de toda a página.'
order: 4
---

# HomeFilters

Barra com dois selects que refinam os dados exibidos em toda a página: **Estado** e **Semana Epidemiológica**.

---

## O que exibe

| Elemento                       | Valores                                             | Fonte                                                  |
| ------------------------------ | --------------------------------------------------- | ------------------------------------------------------ |
| Select "Estado"                | `Todos os Estados`, `Acre` ... `Tocantins` (27 UFs) | Constante `ESTADOS_BRASIL` em `useHomeApi.ts`          |
| Select "Semana Epidemiológica" | `Semana 09 (24 fev a 02 mar. 2026)`                 | API via `store.semanas` (carregadas no `fetchLookups`) |

A semana mais recente é selecionada automaticamente ao carregar a página.

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

| Arquivo                                       | Responsabilidade                                 |
| --------------------------------------------- | ------------------------------------------------ |
| `layers/home/app/components/HomeFilters.vue`  | Template dos selects                             |
| `layers/home/app/composables/useHomeStore.ts` | `setEstado()`, `setSemana()`, `fetchLookups()`   |
| `layers/home/app/composables/useHomeApi.ts`   | `getEstados()` (constante), `getSemanas()` (API) |
