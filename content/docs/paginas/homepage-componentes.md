---
title: 'Homepage — Componentes'
description: 'Mapa técnico de componentes, status de implementação e arquitetura.'
order: 7
---

# Mapa de Componentes

Todos os componentes envolvidos na homepage, com status de implementação e detalhes técnicos.

---

## Visão da Página

Hierarquia de componentes na homepage (`layers/home/app/pages/index.vue`):

```
index.vue
├── HomeHero
├── HomeDashboard (orquestrador)
│   ├── HomeRegionTabs
│   ├── HomeMap (sticky, coluna esquerda)
│   └── (coluna direita, scroll)
│       ├── HomeFilters
│       ├── HomePanorama
│       ├── HomeChart
│       └── HomeTable
└── HomeCtaMunicipio
```

Componentes globais (presentes em todas as páginas via layout):

```
default.vue (layout)
├── AppTopBar
├── AppHeader
└── AppFooter
```

---

## Status por Componente

### Componentes Globais (layer base)

| Componente  | Arquivo                | Status          | Dados      | Observação            |
| ----------- | ---------------------- | --------------- | ---------- | --------------------- |
| `AppTopBar` | `common/AppTopBar.vue` | ✅ Implementado | Mock       | TODO: integrar API    |
| `AppHeader` | `common/AppHeader.vue` | ✅ Implementado | Store auth | Pronto para produção  |
| `AppFooter` | `common/AppFooter.vue` | ✅ Implementado | Hardcoded  | Links Sinapse com `#` |

### Componentes Home (layer home)

| Componente         | Arquivo                | Status          | Dados         | Observação                            |
| ------------------ | ---------------------- | --------------- | ------------- | ------------------------------------- |
| `HomeHero`         | `HomeHero.vue`         | ✅ Implementado | Estático      | Pronto para produção                  |
| `HomeDashboard`    | `HomeDashboard.vue`    | ✅ Implementado | State interno | Orquestrador: gerencia `activeRegion` |
| `HomeRegionTabs`   | `HomeRegionTabs.vue`   | ✅ Implementado | Hardcoded     | 6 tabs com v-model bidirecional       |
| `HomeMap`          | `HomeMap.vue`          | 🔧 Esqueleto    | —             | Leaflet não integrado                 |
| `HomeFilters`      | `HomeFilters.vue`      | ✅ Implementado | Mock          | 27 UFs + 4 semanas fixas              |
| `HomePanorama`     | `HomePanorama.vue`     | 🎭 Mockado      | Mock          | UI pronta, aguarda API                |
| `HomeChart`        | `HomeChart.vue`        | 🔧 Esqueleto    | —             | ApexCharts não integrado              |
| `HomeTable`        | `HomeTable.vue`        | ✅ Implementado | Mock          | 5 regiões com dados simulados         |
| `HomeCtaMunicipio` | `HomeCtaMunicipio.vue` | ✅ Implementado | Estático      | Pronto para produção                  |

### Componentes Auth (layer auth)

| Componente      | Arquivo             | Status          | Dados    | Observação                |
| --------------- | ------------------- | --------------- | -------- | ------------------------- |
| `AuthLoginForm` | `AuthLoginForm.vue` | ✅ Implementado | API real | Login funcional via store |

---

## Legenda de Status

| Ícone | Status       | Significado                                                   |
| ----- | ------------ | ------------------------------------------------------------- |
| ✅    | Implementado | Componente funcional, pode ter dados mock                     |
| 🎭    | Mockado      | UI completa, dados hardcoded, pronto para integração API      |
| 🔧    | Esqueleto    | Estrutura visual existe mas funcionalidade principal pendente |
| 🔲    | Pendente     | Ainda não criado                                              |

---

## Comunicação entre Componentes

### Estado compartilhado

O `HomeDashboard` é o orquestrador central. Ele gerencia:

```
HomeDashboard
  └── activeRegion (ref)
        │
        ├── HomeRegionTabs (v-model: lê e escreve)
        ├── HomeMap (prop: lê, emit: escreve ao clicar estado)
        ├── HomeFilters (prop: lê região para filtrar estados)
        ├── HomePanorama (prop: lê para buscar dados da região)
        ├── HomeChart (prop: lê para filtrar dados do gráfico)
        └── HomeTable (prop: lê para destacar região ativa)
```

### Fluxo ao trocar região

```
1. Usuário clica na tab "Nordeste"
2. HomeRegionTabs emite update:modelValue
3. HomeDashboard atualiza activeRegion
4. Todos os componentes filhos recebem nova prop e reagem
5. (Futuro) Store dispara fetch para API com nova região
```

---

## Componentes Pendentes

Componentes que existem no PRD mas ainda não foram criados:

| Componente          | Seção | Descrição                                                         | Prioridade |
| ------------------- | ----- | ----------------------------------------------------------------- | ---------- |
| `HomeMapLegend`     | 3.5a  | Legenda separada do mapa (atualmente inline)                      | Baixa      |
| `HomeChartControls` | 3.5d  | Controles extraídos do HomeChart (atualmente inline)              | Baixa      |
| `HomeAnalysis`      | 3.5d  | Card "Análise dos Especialistas" (atualmente dentro do HomeChart) | Média      |

---

## Dependências Externas

| Biblioteca              | Uso                                   | Status no projeto         |
| ----------------------- | ------------------------------------- | ------------------------- |
| **Leaflet**             | Mapa interativo SVG do Brasil         | 🔲 Não instalado          |
| **ApexCharts**          | Gráfico de linhas (lotação vs. média) | 🔲 Não instalado          |
| **@tanstack/vue-table** | Tabela com sort/filter                | ✅ Instalado (disponível) |
| **shadcn-vue (Tabs)**   | Tabs de região                        | ✅ Instalado (usado)      |
| **shadcn-vue (Select)** | Dropdowns de filtro                   | ✅ Instalado (usado)      |
| **shadcn-vue (Switch)** | Toggles do gráfico                    | ✅ Instalado (usado)      |
| **vue-sonner**          | Toasts de erro/feedback               | ✅ Instalado (disponível) |
