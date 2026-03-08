---
title: 'Meu Município — Componentes'
description: 'Mapa técnico dos componentes da página Meu Município e seus status.'
order: 4
---

# Componentes

Mapa técnico dos 16 componentes da página Meu Município, organizados por área funcional.

---

## Orquestrador

| Componente | Arquivo                         | Status          | Dados | Descrição                                               |
| ---------- | ------------------------------- | --------------- | ----- | ------------------------------------------------------- |
| Página     | `pages/meu-municipio/index.vue` | ✅ Implementado | Store | Orquestra layout: mapa + busca + SE + controles + aside |

A página usa `useMeuMunicipioStore()` para estado centralizado e `useTemplateRef('map')` para acesso ao componente do mapa.

---

## Mapa

| Componente                      | Arquivo                             | Status          | Dados | Descrição                                                           |
| ------------------------------- | ----------------------------------- | --------------- | ----- | ------------------------------------------------------------------- |
| `MeuMunicipioMap`               | `MeuMunicipioMap.vue`               | ✅ Implementado | Mock  | Wrapper do composable `useMeuMunicipioMap`                          |
| `MeuMunicipioMapZoom`           | `MeuMunicipioMapZoom.vue`           | ✅ Implementado | —     | Botões +/− emitem `zoom-in`/`zoom-out`                              |
| `MeuMunicipioMapNavigation`     | `MeuMunicipioMapNavigation.vue`     | 🎭 Mockado      | —     | 4 botões de navegação (centralizar, local, fullscreen, trocar mapa) |
| `MeuMunicipioMapSinapseStatus`  | `MeuMunicipioMapSinapseStatus.vue`  | 🎭 Mockado      | —     | Badge "Dados via Sinapse, há X minutos"                             |
| `MeuMunicipioMapChangeLocation` | `MeuMunicipioMapChangeLocation.vue` | ✅ Implementado | —     | Botão "Trocar local" → `store.openOnboarding()`                     |

### Composable do mapa (`useMeuMunicipioMap`)

Orquestrador de 96 linhas que delega para 5 módulos puros em `utils/`:

| Módulo               | Responsabilidade                                                           |
| -------------------- | -------------------------------------------------------------------------- |
| `map-config.ts`      | Constantes: centro do Brasil, zoom, URL do estilo vetorial                 |
| `map-colors.ts`      | Cores por nível e região + expressões MapLibre                             |
| `map-layers.ts`      | Funções para adicionar as 4 camadas (states, alerts, connections, heatmap) |
| `map-connections.ts` | Gera arcos GeoJSON entre cidades (rotas de propagação)                     |
| `map-mock-data.ts`   | 12 cidades com alertas + 10 conexões (dados temporários)                   |

---

## Busca e Seleção

| Componente                    | Arquivo                           | Status          | Dados          | Descrição                                         |
| ----------------------------- | --------------------------------- | --------------- | -------------- | ------------------------------------------------- |
| `MeuMunicipioSearchField`     | `MeuMunicipioSearchField.vue`     | 🎭 Mockado      | Lista estática | Busca com autocomplete e navegação por teclado    |
| `MeuMunicipioEpiWeekSelector` | `MeuMunicipioEpiWeekSelector.vue` | ✅ Implementado | VO             | Calendário de semana epidemiológica               |
| `MeuMunicipioOnboarding`      | `MeuMunicipioOnboarding.vue`      | ✅ Implementado | Store          | Modal de seleção inicial (busca + geolocalização) |

---

## Painel Lateral (Aside)

| Componente                 | Arquivo                        | Status          | Dados | Descrição                                    |
| -------------------------- | ------------------------------ | --------------- | ----- | -------------------------------------------- |
| `MeuMunicipioAside`        | `MeuMunicipioAside.vue`        | ✅ Implementado | Store | Container com header + tabs (resumo/rumores) |
| `MeuMunicipioAsideResumo`  | `MeuMunicipioAsideResumo.vue`  | 🎭 Mockado      | —     | Container dos sub-componentes da aba resumo  |
| `MeuMunicipioAsideRumores` | `MeuMunicipioAsideRumores.vue` | 🎭 Mockado      | Mocks | Lista de rumores na aba rumores              |

---

## Dados do Município

| Componente                   | Arquivo                          | Status          | Dados | Descrição                                  |
| ---------------------------- | -------------------------------- | --------------- | ----- | ------------------------------------------ |
| `MeuMunicipioFiltros`        | `MeuMunicipioFiltros.vue`        | 🎭 Mockado      | Mock  | Filtros UBS/UPA/Drogaria com contagem      |
| `MeuMunicipioLotacao`        | `MeuMunicipioLotacao.vue`        | 🔲 Placeholder  | —     | Card de lotação (nível de risco + gráfico) |
| `MeuMunicipioAlerta`         | `MeuMunicipioAlerta.vue`         | 🎭 Mockado      | Mock  | Card de alerta epidemiológico              |
| `MeuMunicipioRumoresPreview` | `MeuMunicipioRumoresPreview.vue` | 🎭 Mockado      | Mocks | Prévia dos 3 rumores mais recentes         |
| `MeuMunicipioRumorCard`      | `MeuMunicipioRumorCard.vue`      | ✅ Implementado | Props | Card de notícia com título, fonte, tags    |

---

## Legenda de Status

| Ícone | Status       | Significado                                              |
| ----- | ------------ | -------------------------------------------------------- |
| ✅    | Implementado | Componente funcional, pode ter dados mock                |
| 🎭    | Mockado      | UI completa, dados hardcoded, pronto para integração API |
| 🔲    | Placeholder  | Estrutura visual mínima, funcionalidade pendente         |

---

## Dependências entre componentes

```
index.vue (página)
├── MeuMunicipioMap
│   └── useMeuMunicipioMap (composable)
│       ├── map-config.ts
│       ├── map-colors.ts
│       ├── map-layers.ts
│       ├── map-connections.ts
│       └── map-mock-data.ts
├── MeuMunicipioSearchField
├── MeuMunicipioEpiWeekSelector
│   └── useEpidemiologicalWeek → SemanaEpidemiologica (VO)
├── MeuMunicipioMapNavigation
├── MeuMunicipioMapSinapseStatus
├── MeuMunicipioMapChangeLocation → store.openOnboarding()
├── MeuMunicipioMapZoom → mapRef.zoomIn/zoomOut
├── MeuMunicipioOnboarding (condicional: store.showOnboarding)
└── MeuMunicipioAside
    ├── Tab Resumo
    │   ├── MeuMunicipioAsideResumo
    │   │   ├── MeuMunicipioFiltros
    │   │   ├── MeuMunicipioLotacao
    │   │   └── MeuMunicipioAlerta
    │   └── MeuMunicipioRumoresPreview
    │       └── MeuMunicipioRumorCard (×3)
    └── Tab Rumores
        └── MeuMunicipioAsideRumores
            └── MeuMunicipioRumorCard (×N)
```
