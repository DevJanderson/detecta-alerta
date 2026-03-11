---
title: 'Homepage — HomeTable'
description: 'Tabela de lotação por estabelecimento — exibe regiões ou estados conforme o filtro selecionado.'
order: 8
---

# HomeTable

Seção "Lotação por estabelecimento". Tabela que mostra o nível de alerta e variação por tipo de unidade (todos, drogarias, UPA, UBS), com linhas que mudam conforme os filtros.

---

## O que exibe

### Header

| Elemento   | Descrição                                                             |
| ---------- | --------------------------------------------------------------------- |
| Título     | "Lotação por estabelecimento"                                         |
| Subtítulo  | "Confira locais com lotação acima da média esperada."                 |
| Contadores | Quantidade e variação por tipo de unidade (dados do `store.panorama`) |

Os contadores no header usam os mesmos dados do `HomePanorama` — ambos lêem `store.panorama`.

### Tabela

| Coluna        | Descrição                                         |
| ------------- | ------------------------------------------------- |
| Região/Estado | Nome da linha (região ou estado, conforme filtro) |
| Todos         | Nível + variação de todas as unidades             |
| Drogarias     | Nível + variação de drogarias                     |
| UPA           | Nível + variação de UPAs                          |
| UBS           | Nível + variação de UBS                           |

Cada célula exibe:

| Elemento        | Exemplo                           | Cor                        |
| --------------- | --------------------------------- | -------------------------- |
| Nível           | `Normal` / `Moderado` / `Elevado` | Verde / Amarelo / Vermelho |
| Variação        | `12%`                             | Mesma cor do nível         |
| Ícone tendência | ↑ ↓ —                             | Mesma cor do nível         |

### Comportamento das linhas conforme filtro

| Região (switcher) | Estado (select) | Linhas da tabela                                      |
| ----------------- | --------------- | ----------------------------------------------------- |
| Brasil            | Todos           | 5 linhas: Norte, Nordeste, Centro-Oeste, Sudeste, Sul |
| Sul               | Todos           | 3 linhas: Paraná, Santa Catarina, Rio Grande do Sul   |
| Nordeste          | Todos           | 9 linhas: estados do Nordeste em ordem alfabética     |
| Qualquer          | SP              | 1 linha: São Paulo                                    |

Esta é a lógica mais importante do componente — a tabela **adapta suas linhas** conforme a combinação de filtros.

### Seções fixas

- **Card "Análise dos Especialistas"** — texto mock aguardando API
- **Source box** — fonte e link "como são feitos os cálculos"

---

## Conexão com outros componentes

```
HomeRegionTabs / HomeFilters
  └─ store.fetchAll()
       └─ api.getRegionTable({ region, estado, semana })
            └─ store.regionRows  ← HomeTable reage

HomePanorama (dados compartilhados)
  └─ store.panorama
       └─ HomeTable header (contadores de unidades)
```

O componente é **consumidor passivo** — lê `store.regionRows` e `store.panorama`. Não faz fetch próprio.

---

## API Sinapse

**Endpoint:** `GET /api/epidemiological/aggregations`

### Parâmetros conforme contexto

| Contexto         | `aggregation_level` | Filtro extra | Resultado         |
| ---------------- | ------------------- | ------------ | ----------------- |
| Brasil           | `region`            | —            | 5 regiões         |
| Região (ex: Sul) | `state`             | `region=S`   | Estados da região |
| Estado (ex: SP)  | `state`             | `state=SP`   | Estado único      |

### Campos utilizados

| Campo da API                       | Uso na tabela                                           |
| ---------------------------------- | ------------------------------------------------------- |
| `aggregation_key`                  | Identificador da linha (UF ou código de região)         |
| `unit_type`                        | Coluna (`all`, `drogarias`, `upa`, `ubs`)               |
| `metrics.alert_status`             | Nível: Normal (green), Moderado (yellow), Elevado (red) |
| `metrics.trend_weekday`            | Ícone de tendência ↑↓—                                  |
| `metrics.vs_previous_week_weekday` | Porcentagem de variação                                 |

### Lógica de agrupamento no `useHomeApi.ts`

- **Brasil**: agrupa por `aggregation_key` → mapeia para nome da região (`N` → Norte)
- **Região**: agrupa por `aggregation_key` → mapeia para nome do estado (`PR` → Paraná), ordena alfabeticamente
- **Estado**: filtra pelo UF → retorna linha única

---

## Estados da UI

| Estado         | O que aparece                                                       |
| -------------- | ------------------------------------------------------------------- |
| Carregando     | Tabela vazia (linhas aparecem quando `regionRows` é preenchido)     |
| Com dados      | Tabela com linhas coloridas por nível de alerta                     |
| Sem contadores | Header sem contadores (quando `panorama` não tem dados de unidades) |

---

## Arquivos

| Arquivo                                       | Responsabilidade                                           |
| --------------------------------------------- | ---------------------------------------------------------- |
| `layers/home/app/components/HomeTable.vue`    | Template da tabela + header com contadores                 |
| `layers/home/app/composables/useHomeStore.ts` | `regionRows` ref + `fetchRegionTable()`                    |
| `layers/home/app/composables/useHomeApi.ts`   | `getRegionTable()` — fetch + agrupamento por região/estado |
| `layers/home/app/composables/types.ts`        | `RegionRow`, `CellData`, `Level`, `Trend`                  |
