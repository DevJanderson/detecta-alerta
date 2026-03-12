---
title: 'Homepage'
description: 'Documentação técnica da homepage do Detecta Alerta — estrutura, componentes, conexões e integração com a API Sinapse.'
order: 1
---

# Homepage

Página principal da plataforma Detecta Alerta. Apresenta o panorama nacional de vigilância epidemiológica com dados de lotação de estabelecimentos de saúde.

**Rota:** `/` · **Layer:** `home` · **Página:** `layers/home/app/pages/index.vue`

---

## Estrutura da Página

```
default.vue (layout)
├── AppTopBar ← indicadores regionais (API real)
├── AppHeader
├── HomeHero (estático)
├── HomeDashboard (orquestrador — ver abaixo)
│   ├── HomeRegionTabs ← switcher de regiões
│   ├── HomeMap (MapLibre GL + GeoJSON — mock)
│   ├── HomeFilters ← selects estado/semana
│   ├── HomePanorama ← card de alert status
│   ├── HomeChart ← controles do gráfico
│   │   └── HomeChartLine ← renderização ECharts
│   └── HomeTable ← tabela de lotação
├── HomeCtaMunicipio (estático)
└── AppFooter
```

---

## HomeDashboard (orquestrador)

O `HomeDashboard.vue` não é um componente visual — é o **orquestrador** que monta o layout e dispara o carregamento inicial dos dados.

No `onMounted`:

1. `store.fetchLookups()` — carrega opções de semana epidemiológica
2. `store.fetchAll()` — busca panorama + tabela em paralelo, depois gráfico

O layout divide a tela em duas colunas no desktop:

| Coluna         | Conteúdo                                                   | Comportamento             |
| -------------- | ---------------------------------------------------------- | ------------------------- |
| Esquerda (45%) | `HomeRegionTabs` + `HomeMap`                               | Sticky (acompanha scroll) |
| Direita (55%)  | `HomeFilters` + `HomePanorama` + `HomeChart` + `HomeTable` | Scroll natural            |

---

## Como tudo se conecta

```
                    useHomeStore (Pinia)
                    ┌──────────────────────────────────────────┐
                    │  filtros: { region, estado, semana }     │
                    │  chartUnitType: 'all'|'drogarias'|...    │
                    │                                          │
                    │  panorama ──────────► HomePanorama        │
                    │       └──────────────► HomeTable (header) │
                    │  regionRows ────────► HomeTable (linhas)  │
                    │  chartData ─────────► HomeChart/ChartLine │
                    └──────────────────────────────────────────┘
                          ▲                    ▲
            setRegion()   │   setEstado()       │  setChartUnitType()
            setSemana()   │                     │
                ┌─────────┘                     └──────────┐
                │                                          │
        HomeRegionTabs                              HomeChart
        HomeFilters                          (filtro local de unidade)
```

### Fluxo de um clique no switcher de região

```
1. Usuário clica "Sul" no HomeRegionTabs
2. store.setRegion('sul')
3. filtros.region = 'sul'
4. Se estado selecionado não pertence à região Sul → reset para ''
5. Dropdown de estados filtra para PR, SC, RS (via filteredEstados)
6. store.fetchAll() (com proteção de versão contra race condition)
   ├─ api.getPanorama({ region: 'sul', ... })
   │    → aggregation_level=region, filtra client-side por key 'S'
   │    → store.panorama atualiza → HomePanorama reage
   │
   ├─ api.getRegionTable({ region: 'sul', ... })
   │    → aggregation_level=state, filtra client-side por REGION_TO_STATES
   │    → retorna estados: PR, SC, RS
   │    → store.regionRows atualiza → HomeTable reage
   │
   └─ api.getChartSeries({ region: 'sul', ... })
        → aggregation_level=region, filtra por key 'S'
        → store.chartData atualiza → HomeChart/ChartLine reage
```

### Proteção contra race condition

O `fetchAll()` usa um **contador de versão** (`fetchVersion`). Se o usuário trocar de região enquanto um fetch ainda está em andamento, a resposta stale é descartada — apenas o resultado mais recente é aplicado ao estado.

### Isolamento de falhas

O `fetchAll()` isola o gráfico: se a chamada de `getChartSeries` falhar, panorama e tabela continuam funcionando normalmente. O gráfico fica com `chartData = null` (spinner).

---

## Documentação por componente

- [AppTopBar](/docs/paginas/homepage-apptopbar) — indicadores regionais no topo
- [HomeRegionTabs](/docs/paginas/homepage-region-tabs) — switcher Brasil / regiões
- [HomeFilters](/docs/paginas/homepage-filters) — selects de estado e semana
- [HomePanorama](/docs/paginas/homepage-panorama) — card de alert status e contadores
- [HomeChart](/docs/paginas/homepage-chart) — controles do gráfico temporal
- [HomeChartLine](/docs/paginas/homepage-chart-line) — renderização ECharts
- [HomeTable](/docs/paginas/homepage-tabela) — tabela de lotação por região/estado
- [Backlog de Integração](/docs/paginas/homepage-backlog) — itens pendentes (agravos, análise, mapa)

---

## Arquivos principais

| Arquivo                                                      | Responsabilidade                         |
| ------------------------------------------------------------ | ---------------------------------------- |
| `layers/home/app/pages/index.vue`                            | Página / rota                            |
| `layers/home/app/components/HomeDashboard.vue`               | Orquestrador (layout + fetch inicial)    |
| `layers/home/app/composables/useHomeStore.ts`                | Store centralizada (estado + actions)    |
| `layers/home/app/composables/useHomeApi.ts`                  | Service (chamadas à API + transformação) |
| `layers/home/app/composables/types.ts`                       | Tipos TypeScript da feature              |
| `layers/home/server/api/epidemiological/aggregations.get.ts` | BFF proxy para API Sinapse               |
