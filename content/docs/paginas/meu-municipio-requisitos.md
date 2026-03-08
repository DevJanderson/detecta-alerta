---
title: 'Meu Município — Requisitos'
description: 'Requisitos funcionais detalhados de cada seção da página Meu Município.'
order: 3
---

# Requisitos Funcionais

Especificação detalhada das seções da página Meu Município, com elementos, comportamento e critérios de aceite.

---

## 4.1 Busca de Município

**Status:** 🎭 Mockado (autocomplete com lista estática)
**Componente:** `MeuMunicipioSearchField`

Campo de busca com autocomplete para selecionar município.

| Elemento     | Descrição                                              |
| ------------ | ------------------------------------------------------ |
| Input        | Placeholder "Buscar município", ícone de lupa          |
| Autocomplete | Dropdown com sugestões filtradas (mínimo 3 caracteres) |
| Formato      | "{nome}, {UF}" (ex: "Aracaju, SE")                     |
| Atalho       | Ctrl+K foca o campo                                    |
| Limpar       | Botão × reseta seleção e volta ao estado inicial       |

**Comportamento:**

- Filtra municípios a partir de 3 caracteres digitados
- Navegação por teclado (↑↓ + Enter)
- Fechar dropdown com Escape ou clique fora
- Ao selecionar: mapa faz flyTo + aside abre

**Critérios de aceite:**

- [x] Campo de busca com dropdown funcional
- [x] Navegação por teclado
- [ ] Autocomplete com lista completa (~5570 municípios via API ou lista local)
- [ ] Atalho Ctrl+K

---

## 4.2 Seletor de Semana Epidemiológica

**Status:** ✅ Implementado
**Componente:** `MeuMunicipioEpiWeekSelector`

Calendário para selecionar semana epidemiológica (SE).

| Elemento   | Descrição                                |
| ---------- | ---------------------------------------- |
| Display    | "SE {n} ({início} a {fim} {mês}. {ano})" |
| Calendário | Grid mensal com semanas destacadas       |
| Navegação  | Setas para mês anterior/próximo          |
| Restrição  | Semanas futuras desabilitadas            |

**Comportamento:**

- Semana atual selecionada por padrão
- Cálculo segue padrão brasileiro (domingo a sábado)
- Delega para Value Object `SemanaEpidemiologica`

**Critérios de aceite:**

- [x] Calendário com seleção de semana
- [x] Formato correto de exibição
- [x] Semanas futuras bloqueadas
- [ ] Ao trocar SE, recarrega dados de lotação e rumores

---

## 4.3 Mapa Interativo

**Status:** ✅ Implementado (dados mock)
**Componente:** `MeuMunicipioMap`

Mapa vetorial com MapLibre GL e estilo OpenFreeMap Liberty.

| Elemento | Descrição                                            |
| -------- | ---------------------------------------------------- |
| Base     | MapLibre GL com tiles vetoriais OpenFreeMap          |
| Geodata  | TopoJSON dos estados brasileiros (`public/geo/`)     |
| Camadas  | States, Alerts (pulso), Connections (arcos), Heatmap |
| Hover    | Estado muda de cor ao passar mouse, tooltip com nome |
| Click    | Alerta abre popup com dados + flyTo                  |

**Camadas do mapa:**

| Camada         | Fonte             | Descrição                                            |
| -------------- | ----------------- | ---------------------------------------------------- |
| `states-fill`  | TopoJSON          | Preenchimento por região com cores temáticas         |
| `states-line`  | TopoJSON          | Bordas dos estados                                   |
| `alerts`       | Mock (12 cidades) | Círculos pulsantes com cor por nível de alerta       |
| `connections`  | Mock (10 rotas)   | Arcos tracejados entre cidades (rotas de propagação) |
| `heatmap`      | Mock (12 cidades) | Mapa de calor baseado em número de casos             |
| `alert-labels` | Mock (12 cidades) | Contagem de casos sobre cada círculo                 |

**Critérios de aceite:**

- [x] Mapa renderiza com estilo vetorial
- [x] 4 camadas de dados (states, alerts, connections, heatmap)
- [x] Animação de pulso nos alertas
- [x] Hover nos estados com feedback visual
- [x] Click nos alertas com popup + flyTo
- [ ] Marcadores de unidades de saúde (UBS, UPA, Drogaria) com ícones tipados
- [ ] Polígono do município selecionado
- [ ] Dados reais vindos da API

---

## 4.4 Controles do Mapa

**Status:** 🎭 Mockado (botões sem ação)
**Componentes:** `MeuMunicipioMapNavigation`, `MeuMunicipioMapZoom`, `MeuMunicipioMapSinapseStatus`, `MeuMunicipioMapChangeLocation`

| Controle           | Componente                      | Funcional? |
| ------------------ | ------------------------------- | ---------- |
| Zoom +/−           | `MeuMunicipioMapZoom`           | ✅ Sim     |
| Navegação (4 btns) | `MeuMunicipioMapNavigation`     | 🔲 Mock    |
| Status Sinapse     | `MeuMunicipioMapSinapseStatus`  | 🔲 Mock    |
| Trocar local       | `MeuMunicipioMapChangeLocation` | ✅ Sim     |

**Critérios de aceite:**

- [x] Zoom funcional via botões
- [x] Botão "Trocar local" abre onboarding
- [ ] Centralizar no município selecionado
- [ ] Mostrar localização do usuário
- [ ] Tela cheia
- [ ] Trocar tileset
- [ ] Status Sinapse com timestamp real

---

## 4.5 Painel Lateral (Aside)

**Status:** ✅ Implementado (dados mock)
**Componente:** `MeuMunicipioAside`

Painel fixo à direita (520px desktop, hidden mobile) com dados do município.

| Elemento | Descrição                                      |
| -------- | ---------------------------------------------- |
| Header   | Nome do município (do store) + estado + região |
| Tabs     | "resumo" e "rumores"                           |
| Ações    | Compartilhar, imprimir, colapsar (planejado)   |
| Largura  | `w-130` (520px) no desktop, oculto no mobile   |

**Tab Resumo:**

| Sub-seção | Componente                   | Status         |
| --------- | ---------------------------- | -------------- |
| Filtros   | `MeuMunicipioFiltros`        | 🎭 Mock        |
| Lotação   | `MeuMunicipioLotacao`        | 🔲 Placeholder |
| Alerta    | `MeuMunicipioAlerta`         | 🎭 Mock        |
| Rumores   | `MeuMunicipioRumoresPreview` | 🎭 Mock        |

**Tab Rumores:**

| Sub-seção | Componente                 | Status          |
| --------- | -------------------------- | --------------- |
| Lista     | `MeuMunicipioAsideRumores` | 🎭 Mock         |
| Card      | `MeuMunicipioRumorCard`    | ✅ Implementado |

**Critérios de aceite:**

- [x] Header dinâmico com nome do município do store
- [x] Tabs funcionais (resumo/rumores)
- [x] Cards de rumor com título, fonte, data e tags
- [ ] Dados reais vindos da API
- [ ] Botões compartilhar, imprimir e colapsar funcionais
- [ ] Drill-down em unidade individual

---

## 4.6 Onboarding

**Status:** ✅ Implementado
**Componente:** `MeuMunicipioOnboarding`

Modal de seleção inicial exibida quando nenhum município está selecionado.

| Elemento       | Descrição                                 |
| -------------- | ----------------------------------------- |
| Busca          | Campo "Buscar município" com autocomplete |
| Geolocalização | Botão "Usar minha localização"            |
| Visibilidade   | Controlada por `store.showOnboarding`     |

**Critérios de aceite:**

- [x] Modal renderiza no estado inicial
- [x] Campo de busca funcional (mock)
- [x] Fecha ao selecionar município
- [x] Reabre via botão "Trocar local"
- [ ] Geolocalização funcional

---

## 4.7 Responsividade

| Breakpoint  | Largura  | Comportamento                                       |
| ----------- | -------- | --------------------------------------------------- |
| **Mobile**  | < 1024px | Mapa tela cheia, aside oculto (drawer/bottom sheet) |
| **Desktop** | ≥ 1024px | Mapa à esquerda, aside fixo à direita (520px)       |

**Critérios de aceite:**

- [x] Layout desktop com mapa + aside
- [ ] Layout mobile com drawer para dados
- [ ] Controles do mapa adaptados para touch
