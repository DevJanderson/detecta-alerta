---
title: 'Meu Município — Visão Geral'
description: 'Arquitetura, implementação atual e roadmap da página Meu Município.'
order: 1
---

# Meu Município — Visão Geral

## Contexto

A página **Meu Município** é o painel de vigilância epidemiológica local do Detecta Alerta. Enquanto a homepage oferece visão nacional/regional, esta página foca em um **município específico**, combinando mapa interativo, indicadores de lotação e feed de rumores epidemiológicos.

## Informações Técnicas

| Item       | Valor                                    |
| ---------- | ---------------------------------------- |
| **Rota**   | `/meu-municipio`                         |
| **Layer**  | `layers/meu-municipio/`                  |
| **Acesso** | Autenticado (`auth-guard`)               |
| **Mapa**   | MapLibre GL (estilo OpenFreeMap Liberty) |
| **Geo**    | TopoJSON estados (`public/geo/`)         |
| **Estado** | Pinia (`useMeuMunicipioStore`)           |

## Arquitetura da Layer

Segue o padrão feature layer do projeto:

```
layers/meu-municipio/
├── app/
│   ├── composables/
│   │   ├── types.ts                    — AlertCity, Noticia, MunicipioSelecionado, AsideTab
│   │   ├── useMeuMunicipioStore.ts     — Estado centralizado (Pinia)
│   │   ├── useMeuMunicipioMap.ts       — Orquestrador do mapa (96 linhas)
│   │   ├── useEpidemiologicalWeek.ts   — Composable reativo (delega ao VO)
│   │   └── mocks.ts                    — Dados temporários de notícias
│   ├── utils/
│   │   ├── semana-epidemiologica.ts    — Value Object (fonte de verdade)
│   │   ├── map-config.ts              — BRAZIL_CENTER, ZOOM, VECTOR_STYLE
│   │   ├── map-colors.ts             — Cores centralizadas + expressões MapLibre
│   │   ├── map-layers.ts             — Funções para adicionar camadas ao mapa
│   │   ├── map-connections.ts        — Construção de arcos GeoJSON
│   │   └── map-mock-data.ts          — Dados mock de alertas e conexões
│   ├── components/                    — 17 componentes (prefixo MeuMunicipio*)
│   └── pages/meu-municipio/index.vue
└── nuxt.config.ts
```

### Store (`useMeuMunicipioStore`)

Estado centralizado da página:

| Campo            | Tipo                           | Descrição                         |
| ---------------- | ------------------------------ | --------------------------------- |
| `municipio`      | `MunicipioSelecionado \| null` | Município ativo (mock: São Paulo) |
| `showOnboarding` | `boolean`                      | Exibe modal de seleção            |
| `activeTab`      | `'resumo' \| 'rumores'`        | Aba ativa no aside                |
| `noticias`       | `Noticia[]`                    | Feed de rumores                   |

Computed: `hasMunicipio`, `municipioDisplay` (nome + subtítulo formatado).

### Mapa (MapLibre GL)

O composable `useMeuMunicipioMap` orquestra a instância MapLibre e delega para funções puras em `utils/`:

| Módulo               | Responsabilidade                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------- |
| `map-config.ts`      | Constantes: centro do Brasil, zoom, URL do estilo                                                   |
| `map-colors.ts`      | Cores por nível (alto/medio/baixo) e região, expressões MapLibre                                    |
| `map-layers.ts`      | `addStateLayers`, `addAlertLayers`, `addConnectionLayers`, `addHeatmapLayer`, `startPulseAnimation` |
| `map-connections.ts` | `buildConnectionLines` — gera arcos GeoJSON entre cidades                                           |
| `map-mock-data.ts`   | 12 cidades com alertas mock, 10 conexões                                                            |

Camadas do mapa:

1. **States** — Preenchimento por região (Norte, Nordeste, etc.) com hover
2. **Alerts** — Círculos pulsantes por nível de alerta + labels com contagem
3. **Connections** — Linhas tracejadas entre cidades (rotas de propagação)
4. **Heatmap** — Mapa de calor baseado em número de casos

### Semana Epidemiológica

Duas camadas complementares:

- **Value Object** (`utils/semana-epidemiologica.ts`): `createSemanaEpidemiologica()`, `semanaEpidemiologicaFromDate()` — lógica pura, testada
- **Composable** (`useEpidemiologicalWeek`): adiciona reatividade Vue (`ref`, `computed`), delega cálculos ao VO

## Layout Atual

```
┌───────────────────────────────────────────────────────────────┐
│ Header (navegação global)                                      │
├──────────────────┬──────────────────────────────────────────────┤
│ [Busca município]│ [Seletor Semana Epidemiológica]             │
├──────────────────┴──────────┬───────────────────────────────────┤
│                             │ Nome do município (do store)      │
│                             │ Estado, UF — Região               │
│                             │ [resumo] [rumores]                │
│   MAPA INTERATIVO           ├───────────────────────────────────┤
│   (MapLibre GL)             │ Filtros: Drogaria | UBS | UPA    │
│                             │ Lotação: [placeholder]            │
│   - Estados coloridos       │ Alerta: [card estático]           │
│   - Círculos de alerta      │ Rumores: [3 cards mock]           │
│   - Linhas de conexão       │                                   │
│   - Heatmap de casos        │                                   │
├─────────────────────────────┤                                   │
│ Nav | Sinapse | Trocar local│                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

## Componentes (17)

| Componente                      | Linhas | Descrição                                         |
| ------------------------------- | ------ | ------------------------------------------------- |
| `MeuMunicipioMap`               | 10     | Wrapper do composable `useMeuMunicipioMap`        |
| `MeuMunicipioEpiWeekSelector`   | 351    | Calendário com seleção de semana epidemiológica   |
| `MeuMunicipioSearchField`       | 216    | Busca de município com dropdown (mock)            |
| `MeuMunicipioOnboarding`        | 208    | Modal de seleção inicial (geolocalização + busca) |
| `MeuMunicipioAside`             | 74     | Painel lateral com tabs e header dinâmico         |
| `MeuMunicipioAsideResumo`       | 8      | Container dos 4 sub-componentes do resumo         |
| `MeuMunicipioAsideRumores`      | 23     | Lista de rumores (tab rumores)                    |
| `MeuMunicipioFiltros`           | 65     | Filtros UBS/UPA/Drogaria (mock)                   |
| `MeuMunicipioLotacao`           | 20     | Card de lotação (placeholder)                     |
| `MeuMunicipioAlerta`            | 20     | Card de alerta epidemiológico (mock)              |
| `MeuMunicipioRumoresPreview`    | 23     | Preview dos 3 primeiros rumores                   |
| `MeuMunicipioRumorCard`         | 61     | Card de notícia/rumor                             |
| `MeuMunicipioMapNavigation`     | 28     | Botões de navegação do mapa                       |
| `MeuMunicipioMapZoom`           | 30     | Controles de zoom                                 |
| `MeuMunicipioMapSinapseStatus`  | 18     | Badge "Dados via Sinapse"                         |
| `MeuMunicipioMapChangeLocation` | 17     | Botão "Trocar local"                              |

## O que está implementado vs planejado

### Implementado

- [x] Layout mapa + aside responsivo
- [x] Mapa MapLibre com 4 camadas (estados, alertas, conexões, heatmap)
- [x] Animação de pulso nos alertas
- [x] Hover nos estados com popup
- [x] Click nos alertas com popup + flyTo
- [x] Seletor de semana epidemiológica (calendário completo)
- [x] Store centralizado com município, onboarding, tabs
- [x] Aside dinâmico (nome do município vem do store)
- [x] Domain errors definidos (`MeuMunicipioErrors`)
- [x] Value Object `SemanaEpidemiologica` com testes

### Planejado (requer integração com API)

- [ ] `useMeuMunicipioApi.ts` — service stateless com `$fetch`
- [ ] Endpoints API Proxy em `server/api/meu-municipio/`
- [ ] Busca de municípios com autocomplete real (API ou lista local)
- [ ] Geolocalização ("Usar minha localização")
- [ ] Marcadores de unidades de saúde no mapa (UBS, UPA, Drogaria)
- [ ] Gráficos de lotação (ApexCharts — linha e faixa)
- [ ] Drill-down em unidade individual (popup + aside com detalhes)
- [ ] Filtros funcionais por tipo de estabelecimento
- [ ] Botões de navegação do mapa (centralizar, fullscreen, etc.)
- [ ] Compartilhar e imprimir

## APIs a Consumir (quando disponível)

| Endpoint                                              | Método | Uso                                    |
| ----------------------------------------------------- | ------ | -------------------------------------- |
| `/api/v1/detecta_alerta/epidemiological/aggregations` | GET    | Dados de lotação (município e unidade) |
| `/api/v1/detecta_alerta/units/{placeId}`              | GET    | Detalhes de uma unidade                |
| `/api/v1/cnes/by-place-id/{placeId}`                  | GET    | Dados CNES da unidade                  |
| `/api/v1/noticias/`                                   | GET    | Rumores filtrados por estado           |

## Complexidade

Esta é a página **mais complexa** da plataforma — quando completa terá:

- 3 níveis de visualização (inicial → município → unidade)
- Múltiplas fontes de dados (epidemiológico, unidades, CNES, notícias)
- Mapa interativo com marcadores tipados e popups
- 2 tipos de gráfico (linha + faixa)
- Painel lateral com navegação interna (tabs + drill-down)
- Busca com autocomplete (~5570 municípios)
