---
title: 'Homepage — HomeChartLine'
description: 'Renderização do gráfico ECharts — linha/área, média tracejada, barras de variação com cores por alert status.'
order: 7
---

# HomeChartLine

Componente **client-only** (`.client.vue`) que renderiza o gráfico temporal usando **ECharts** via `vue-echarts`. Recebe dados e configurações via props do `HomeChart`.

---

## O que exibe

Gráfico com até 10 semanas epidemiológicas no eixo X e porcentagem de ocupação no eixo Y.

### Elementos visuais

| Elemento        | Descrição                                              | Controlado por         |
| --------------- | ------------------------------------------------------ | ---------------------- |
| Linha principal | Ocupação por semana. Pontos coloridos por alert status | Sempre visível         |
| Área gradiente  | Preenchimento sob a linha (azul translúcido)           | `chartType = 'area'`   |
| Linha tracejada | Média móvel histórica                                  | `showAverage = true`   |
| Barras duplas   | Variação semanal (barra atual + barra anterior)        | `showVariation = true` |
| Tooltip         | Semana, lotação, média, status                         | Hover sobre ponto      |

### Cores por alert status

Cada ponto da série usa cor baseada no `alert_status` da API:

| Alert Status      | Cor do ponto           | Cor da barra atual         | Cor da barra anterior       |
| ----------------- | ---------------------- | -------------------------- | --------------------------- |
| `green` (normal)  | Azul `secondary-900`   | Azul claro `secondary-400` | Azul pálido `secondary-200` |
| `yellow` (alerta) | Amarelo `alert-900`    | Amarelo `alert-900`        | Amarelo claro `alert-200`   |
| `red` (elevado)   | Vermelho `primary-950` | Vermelho `danger-800`      | Vermelho claro `danger-200` |

Pontos com status `alert` ou `danger` têm tamanho maior (14px vs 10px) para chamar atenção.

---

## Conexão com outros componentes

```
HomeChart (pai)
  └─ Props:
       ├─ chartData   ← store.chartData (série temporal da API)
       ├─ chartType   ← 'line' | 'area' (estado local do HomeChart)
       ├─ showAverage  ← boolean (checkbox do HomeChart)
       └─ showVariation ← boolean (checkbox do HomeChart)
            └─ HomeChartLine
                 └─ Computa ECharts option reativo
```

O componente é **puramente presentacional** — não acessa a store diretamente. Toda interação passa pelo `HomeChart` via props.

---

## Props

| Prop            | Tipo                      | Descrição                   |
| --------------- | ------------------------- | --------------------------- |
| `chartData`     | `ChartSeriesData \| null` | Dados da série temporal     |
| `chartType`     | `string`                  | `'line'` ou `'area'`        |
| `showAverage`   | `boolean`                 | Exibir linha da média móvel |
| `showVariation` | `boolean`                 | Exibir barras de variação   |

---

## Detalhes técnicos

### ECharts (tree-shaking)

Importa apenas os módulos necessários para reduzir bundle:

```
CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent
```

### Eixo Y dinâmico

O range do eixo Y é calculado automaticamente com margem de 30% sobre os dados:

```
min = floor(dataMin - margem)
max = ceil(dataMax + margem)
```

### Eixo X formatado

Cada tick mostra duas linhas:

- **Semana**: `SE 09` (bold)
- **Datas**: `(24/02 a 02/03)` (light)

---

## Estados da UI

| Estado     | Condição                      | O que aparece                          |
| ---------- | ----------------------------- | -------------------------------------- |
| Carregando | `chartData = null`            | Spinner centralizado                   |
| Sem dados  | `chartData.points` vazio      | "Sem dados para o período selecionado" |
| Com dados  | `chartData.points` preenchido | Gráfico ECharts interativo             |

---

## Arquivos

| Arquivo                                               | Responsabilidade                    |
| ----------------------------------------------------- | ----------------------------------- |
| `layers/home/app/components/HomeChartLine.client.vue` | Configuração ECharts + renderização |
| `layers/home/app/composables/types.ts`                | `ChartSeriesData`, `ChartPointData` |
