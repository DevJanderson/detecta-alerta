---
title: 'Homepage — HomeChart'
description: 'Controles do gráfico temporal — tipo de visualização, toggles de média/variação e filtro por tipo de unidade.'
order: 6
---

# HomeChart

Seção "Lotação vs. Média Histórica". Contém o **header com variação atual**, os **controles** (tipo de gráfico, checkboxes, filtro de unidade) e delega a renderização ao `HomeChartLine`.

---

## O que exibe

### Header

| Elemento               | Exemplo                                                   | Descrição                                         |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| Título                 | "Lotação vs. Média Histórica"                             | Fixo                                              |
| Subtítulo              | "Confira quando a lotação está acima da média histórica." | Fixo                                              |
| Card de variação       | `12% mais alto que o normal ↑`                            | Dados da semana mais recente do `store.chartData` |
| Descrição da tendência | "Tendência de aumento nas próximas semanas."              | Baseado no `currentWeekTrend`                     |

### Controles

| Controle                 | Tipo                                                       | Efeito                                                              |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| Content Switcher         | Pill com 2 opções: `gráfico de linha` / `gráfico de faixa` | Altera `chartType` (line/area) — estado **local**                   |
| Checkbox "média"         | Toggle                                                     | Mostra/oculta linha tracejada da média histórica — estado **local** |
| Checkbox "variação"      | Toggle                                                     | Mostra/oculta barras de variação — estado **local**                 |
| Filtro "tipo de unidade" | 4 botões: `todos` / `drogaria` / `UPA` / `UBS`             | Chama `store.setChartUnitType()` — estado **na store**              |

### Seções fixas

- **Card "Análise dos Especialistas"** — texto mock aguardando API
- **Source box** — fonte e link "como são feitos os cálculos"

---

## Conexão com outros componentes

```
HomeChart
  ├─ Lê store.chartData (alimentado por fetchAll / fetchChartData)
  ├─ Controles locais (chartType, showAverage, showVariation)
  │    └─ Props para HomeChartLine
  └─ store.setChartUnitType(key)
       └─ store.fetchChartData()  ← fetch ISOLADO (não recarrega panorama/tabela)
            └─ HomeChartLine reage via props
```

### Filtro de tipo de unidade vs. filtros globais

| Filtro            | Escopo               | Afeta                                             |
| ----------------- | -------------------- | ------------------------------------------------- |
| Região (switcher) | Global               | Panorama + Tabela + Gráfico                       |
| Estado (select)   | Global               | Panorama + Tabela + Gráfico                       |
| Semana (select)   | Global               | Panorama + Tabela (gráfico mostra série completa) |
| Tipo de unidade   | **Local do gráfico** | Apenas o gráfico                                  |

O filtro de tipo de unidade chama `fetchChartData()` — **não** `fetchAll()`. Isso evita recarregar panorama e tabela quando só o gráfico muda.

---

## API Sinapse

O `HomeChart` não faz chamadas direto. Usa `store.chartData` preenchido por `getChartSeries()`.

**Endpoint:** `GET /api/epidemiological/aggregations`

| Parâmetro           | Valor                            | Descrição                        |
| ------------------- | -------------------------------- | -------------------------------- |
| `aggregation_level` | `region` ou `state`              | Conforme filtro de região/estado |
| `unit_type`         | `all`, `drogarias`, `ubs`, `upa` | Conforme filtro local            |
| `weeks`             | `10`                             | Últimas 10 semanas               |

---

## Estados da UI

| Estado           | O que aparece                                                           |
| ---------------- | ----------------------------------------------------------------------- |
| Carregando       | Header sem card de variação, gráfico com spinner                        |
| Com dados        | Header com variação + controles + gráfico renderizado                   |
| Falha no gráfico | Panorama e tabela continuam funcionando (gráfico isolado no `fetchAll`) |

---

## Arquivos

| Arquivo                                               | Responsabilidade                                     |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `layers/home/app/components/HomeChart.vue`            | Header, controles, layout                            |
| `layers/home/app/components/HomeChartLine.client.vue` | Renderização ECharts (ver doc dedicada)              |
| `layers/home/app/composables/useHomeStore.ts`         | `chartData`, `chartUnitType`, `setChartUnitType()`   |
| `layers/home/app/composables/useHomeApi.ts`           | `getChartSeries()`                                   |
| `layers/home/app/composables/types.ts`                | `ChartSeriesData`, `ChartPointData`, `ChartUnitType` |
