---
title: 'Meu Município — Visão Geral'
description: 'Contexto, objetivo, layout e escopo da página Meu Município do Detecta Alerta.'
order: 1
---

# Meu Município — Visão Geral

## Contexto

A página **Meu Município** é o painel de vigilância epidemiológica local do Detecta Alerta. Enquanto a homepage oferece visão nacional/regional, esta página foca em um **município específico**, mostrando as unidades de saúde no mapa, a lotação ao longo das semanas e os rumores epidemiológicos relevantes.

É a página mais rica em dados e interações da plataforma — combina mapa interativo, gráficos temporais, feed de rumores e detalhes de unidades individuais.

## Objetivo

Permitir que o usuário:

1. **Selecione seu município** — via busca por nome ou geolocalização
2. **Visualize as unidades de saúde** — marcadores no mapa com ícones por tipo (UBS, UPA, Drogaria)
3. **Analise a lotação** — gráfico de linha ou faixa com evolução semanal
4. **Filtre por tipo de estabelecimento** — Drogaria, UBS, UPA com indicadores de tendência
5. **Acompanhe rumores** — notícias epidemiológicas relevantes para a região
6. **Inspecione unidades individuais** — clique num marcador para ver detalhes específicos

## Layout

A página segue um layout **mapa + painel lateral**:

```
┌───────────────────────────────────────────────────────────────────┐
│ Header (navegação global)                                         │
├──────────────────┬────────────────────────────────────────────────┤
│ Barra de Busca   │ Seletor Semana Epidemiológica                 │
├──────────────────┴──────────┬─────────────────────────────────────┤
│                             │ Título: "Aracaju, SE"               │
│                             │ 36 unidades ativas                  │
│                             │ [resumo] [rumores]                  │
│                             ├─────────────────────────────────────┤
│                             │ Filtrar: Drogaria(21) UBS(14) UPA(1)│
│     MAPA INTERATIVO         │                                     │
│     (Leaflet)               │ Lotação: [Baixo/Médio/Alto]         │
│                             │ [gráfico linha] [gráfico faixa]     │
│     Marcadores por tipo:    │                                     │
│     - UBS (stethoscope)     │ Rumor destacado (resumo IA)         │
│     - UPA (hospital)        │ "ver todos os rumores →"            │
│     - Drogaria (pill)       │                                     │
│                             │ Últimos rumores (5 cards)           │
│                             │ "ir para rumores →"                 │
├─────────────────────────────┤                                     │
│ Controles | Dados Sinapse   │                                     │
└─────────────────────────────┴─────────────────────────────────────┘
```

## Estados da Página

### 1. Estado Inicial (sem município selecionado)

- Mapa mostra o Brasil inteiro
- Card central "Meu Município" com:
  - Combobox de busca com autocomplete
  - Botão "Usar minha localização"
- Painel lateral **não** aparece

### 2. Município Selecionado (visão geral)

- Mapa centraliza no município com marcadores das unidades
- Painel lateral abre com:
  - **Header**: nome do município, total de unidades ativas, botões compartilhar/imprimir/colapsar
  - **Tabs**: "resumo" e "rumores"
  - **Filtros por tipo**: Drogaria, UBS, UPA — cada um com contagem e porcentagem de variação
  - **Lotação**: nível de risco (Baixo/Médio/Alto) + gráfico temporal (linha ou faixa)
  - **Rumor destacado**: resumo gerado por IA com título, descrição e link
  - **Últimos rumores**: lista de 5 artigos com título, fonte, data e tags

### 3. Unidade de Saúde Selecionada (clique no marcador)

- Popup no mapa com nome, tipo e ocupação
- Painel lateral troca para detalhes da unidade:
  - **Header**: botão "Voltar", nome da unidade, endereço, tipo (UBS/UPA/Drogaria)
  - **Tabs**: "resumo", "rumores", "sobre"
  - **Resumo**: gráfico de lotação individual (barras por semana) + rumor relacionado
  - **Sobre**: localização (endereço, cidade, estado) + status (tipo, dados em tempo real, ativa)

## Seções e Componentes

### Barra Superior (Top Bar)

| Elemento              | Descrição                                                             |
| --------------------- | --------------------------------------------------------------------- |
| Busca município       | Input com autocomplete, exibe resultados como "Cidade, Estado (UF)"   |
| Botão limpar          | Aparece após seleção, reseta para estado inicial                      |
| Semana Epidemiológica | Picker customizado com calendário mensal + numeração de SE na lateral |

### Mapa Interativo

| Elemento   | Descrição                                                |
| ---------- | -------------------------------------------------------- |
| Base       | Mapa Leaflet com tiles (OpenStreetMap ou similar)        |
| Polígono   | Contorno do município selecionado (azul claro)           |
| Marcadores | Ícones por tipo de unidade de saúde                      |
| Popup      | Ao clicar: nome, tipo e percentual de ocupação           |
| Controles  | Centralizar, Mostrar meu Local, Tela cheia, Trocar Mapa  |
| Footer     | "Dados via Sinapse, há X minutos" + botão "Trocar local" |

### Painel Lateral — Aba Resumo (Município)

| Elemento           | Descrição                                                                     |
| ------------------ | ----------------------------------------------------------------------------- |
| Filtros por tipo   | Botões toggle: Drogaria, UBS, UPA — com contagem e tendência (% + seta)       |
| Card Lotação       | Título + subtítulo + badge de risco (Baixo/Médio/Alto)                        |
| Gráfico de Lotação | Tabs "linha" e "faixa" — eixo X: semanas epidemiológicas, eixo Y: % ocupação  |
| Rumor Destacado    | Card com fundo salmão, título, descrição resumida, tags e link                |
| Últimos Rumores    | Lista de articles com h4, fonte (favicon + nome), data relativa e "ver rumor" |

### Painel Lateral — Aba Rumores (Município)

| Elemento | Descrição                                                          |
| -------- | ------------------------------------------------------------------ |
| Título   | "Rumores Recentes" + subtítulo com nome do município               |
| Lista    | ~20 articles com título, fonte, data, tags (doenças + localidades) |

### Painel Lateral — Aba Resumo (Unidade)

| Elemento          | Descrição                                                |
| ----------------- | -------------------------------------------------------- |
| Card Lotação      | Título + nível de risco (texto, sem badge)               |
| Gráfico           | Barras por semana (SE 51 a SE 7), cores variam por nível |
| Menu gráfico      | Download SVG, PNG, CSV                                   |
| Rumor relacionado | Card com título, resumo IA, tags e link                  |

### Painel Lateral — Aba Sobre (Unidade)

| Elemento    | Descrição                                                                                       |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Localização | Endereço, Cidade, Estado                                                                        |
| Status      | Tipo de estabelecimento, Dados em tempo real (Disponível/Indisponível), Unidade ativa (Sim/Não) |
| Disclaimer  | Nota sobre dados baseados no CNES                                                               |

## APIs Consumidas

### Dados Epidemiológicos

| Endpoint                                              | Método | Parâmetros                                                                  | Uso                                 |
| ----------------------------------------------------- | ------ | --------------------------------------------------------------------------- | ----------------------------------- |
| `/api/v1/detecta_alerta/epidemiological/aggregations` | GET    | `aggregation_level=city`, `ibge_code`, `weeks`, `direction`                 | Dados de lotação do município       |
| `/api/v1/detecta_alerta/epidemiological/aggregations` | GET    | `aggregation_level=unit`, `ibge_code`, `weeks`, `direction`, `limit`        | Lista de unidades e ocupação        |
| `/api/v1/detecta_alerta/epidemiological/aggregations` | GET    | `aggregation_level=unit`, `aggregation_key={placeId}`, `weeks`, `direction` | Histórico de lotação de uma unidade |

### Unidades de Saúde

| Endpoint                                 | Método | Parâmetros                  | Uso                                       |
| ---------------------------------------- | ------ | --------------------------- | ----------------------------------------- |
| `/api/v1/detecta_alerta/units/{placeId}` | GET    | `placeId` (Google Place ID) | Detalhes de uma unidade específica        |
| `/api/v1/cnes/by-place-id/{placeId}`     | GET    | `placeId`                   | Dados CNES da unidade (pode retornar 404) |

### Rumores (Notícias)

| Endpoint            | Método | Parâmetros                              | Uso                                   |
| ------------------- | ------ | --------------------------------------- | ------------------------------------- |
| `/api/v1/noticias/` | GET    | `limit`, `status=active`, `states={UF}` | Rumores filtrados por estado          |
| `/api/v1/noticias/` | GET    | `limit`, `status=active`                | Rumores gerais (sem filtro de estado) |

### GeoJSON

| Recurso                              | Uso                                         |
| ------------------------------------ | ------------------------------------------- |
| `/geojson/brazil_simplified.geojson` | Polígonos de estados/municípios para o mapa |

## Interações

| Ação do Usuário                          | Resultado                                                            |
| ---------------------------------------- | -------------------------------------------------------------------- |
| Digitar no campo de busca                | Autocomplete com municípios (nome + UF)                              |
| Selecionar município                     | Mapa centraliza, carrega marcadores, painel lateral abre             |
| Clicar botão limpar (×)                  | Volta ao estado inicial                                              |
| Trocar semana epidemiológica             | Recarrega dados de lotação e rumores                                 |
| Clicar filtro de tipo (Drogaria/UBS/UPA) | Filtra marcadores no mapa                                            |
| Clicar marcador no mapa                  | Popup com nome/tipo/ocupação + painel troca para detalhes da unidade |
| Clicar "Voltar" na unidade               | Retorna ao nível do município                                        |
| Alternar gráfico linha/faixa             | Muda visualização do gráfico de lotação                              |
| Clicar "ver rumor"                       | Navega para a notícia no feed de rumores                             |
| Clicar "ir para rumores"                 | Navega para `/rumores`                                               |
| Clicar "Compartilhar"                    | Copia link da página                                                 |
| Clicar "Imprimir"                        | Abre diálogo de impressão                                            |
| Clicar "Colapsar menu"                   | Esconde painel lateral, maximiza mapa                                |
| Clicar "Trocar local"                    | Reabre card de seleção de município                                  |
| Clicar "Usar minha localização"          | Solicita geolocalização do navegador                                 |
| Clicar controles do mapa                 | Centralizar, localizar, fullscreen, trocar tiles                     |

## Informações Técnicas

| Item           | Valor                                  |
| -------------- | -------------------------------------- |
| **Rota**       | `/meu-municipio`                       |
| **Layer**      | `meu-municipio` (a criar)              |
| **Acesso**     | Autenticado (requer login)             |
| **Middleware** | `auth-guard`                           |
| **SEO**        | `useSeoPage()`                         |
| **Mapa**       | Leaflet                                |
| **Gráficos**   | ApexCharts (linha, faixa/area, barras) |

## Dependências

| Dependência                             | Tipo       | Status                 |
| --------------------------------------- | ---------- | ---------------------- |
| API Sinapse (`/api/v1/detecta_alerta/`) | Backend    | Disponível             |
| API Notícias (`/api/v1/noticias/`)      | Backend    | Disponível             |
| GeoJSON municípios                      | Asset      | A mapear               |
| Leaflet (mapa)                          | Biblioteca | A integrar             |
| ApexCharts (gráficos)                   | Biblioteca | A integrar             |
| Busca de municípios (autocomplete)      | API/Local  | A definir fonte        |
| Google Places API (placeId)             | Externo    | Usado pela API Sinapse |

## Complexidade

Esta é a página **mais complexa** da plataforma:

- **3 níveis de visualização**: estado inicial → município → unidade
- **Múltiplas fontes de dados**: epidemiológico, unidades, CNES, notícias, GeoJSON
- **Mapa interativo**: Leaflet com polígonos, marcadores tipados e popups
- **2 tipos de gráfico**: linha e faixa com séries temporais
- **Painel lateral com navegação interna**: tabs + drill-down em unidades
- **Busca com autocomplete**: municípios brasileiros (~5570)
- **Picker de semana epidemiológica**: calendário customizado

Estimativa: **Large** — múltiplas layers de componentes, integrações com mapa e gráficos, vários endpoints de API.
