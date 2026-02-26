---
title: 'Homepage — Dados e APIs'
description: 'Fontes de dados, endpoints e integração com a API Sinapse.'
order: 5
---

# Dados e APIs

Fontes de dados consumidas pela homepage, frequência de atualização e status de integração.

---

## Fontes de Dados

| Dado                     | Origem                                     | Frequência                | Status                    |
| ------------------------ | ------------------------------------------ | ------------------------- | ------------------------- |
| Indicadores regionais    | API Sinapse                                | Tempo real                | 🔲 Mock                   |
| Mapa de estados          | TopoJSON local (`public/geo/`) + dados API | Por semana epidemiológica | 🔲 Pendente               |
| Panorama / Risco         | Cálculo baseado em z-score da lotação      | Por semana epidemiológica | 🔲 Mock                   |
| Gráfico de lotação       | Histórico de 8 semanas via API             | Semanal                   | 🔲 Pendente               |
| Análise de especialistas | Gerada via API (possivelmente IA)          | Por atualização           | 🔲 Pendente               |
| Tabela de lotação        | Agregação por região e tipo via API        | Por semana epidemiológica | 🔲 Mock                   |
| Lista de estados         | Hardcoded (27 UFs com sigla e nome)        | Estática                  | ✅                        |
| Semanas epidemiológicas  | API Sinapse                                | Dinâmica                  | 🔲 Mock (4 semanas fixas) |

---

## Fluxo de Dados

```
API Sinapse ──→ BFF (server/api/) ──→ Composable/Store ──→ Componente
                    │                       │
                    ├─ Valida com Zod       ├─ ref() / computed()
                    ├─ Trata erros         └─ Reatividade Vue
                    └─ Cache (se aplicável)
```

### Padrão de integração

Cada fonte de dados segue o mesmo padrão:

1. **Endpoint BFF** em `layers/2-home/server/api/home/` — proxy para API Sinapse
2. **Service** (`useHomeApi()`) — funções `$fetch` para chamar o BFF
3. **Store** (`useHomeStore()`) — estado reativo com Pinia
4. **Componente** — consome a store e renderiza

---

## Endpoints Necessários (BFF)

Endpoints a serem criados em `layers/2-home/server/api/home/`:

| Endpoint                | Método | Descrição                        | Parâmetros                 | Status      |
| ----------------------- | ------ | -------------------------------- | -------------------------- | ----------- |
| `/api/home/indicadores` | GET    | Indicadores regionais (topbar)   | —                          | 🔲 Pendente |
| `/api/home/panorama`    | GET    | Resumo de risco por região       | `?regiao=&estado=&semana=` | 🔲 Pendente |
| `/api/home/lotacao`     | GET    | Dados do gráfico (8 semanas)     | `?regiao=&tipo=&semana=`   | 🔲 Pendente |
| `/api/home/tabela`      | GET    | Lotação por região e tipo        | `?semana=`                 | 🔲 Pendente |
| `/api/home/mapa`        | GET    | Dados de nível por estado        | `?semana=`                 | 🔲 Pendente |
| `/api/home/semanas`     | GET    | Lista de semanas epidemiológicas | —                          | 🔲 Pendente |
| `/api/home/analise`     | GET    | Análise de especialistas         | `?regiao=&semana=`         | 🔲 Pendente |

### Exemplo de resposta — Indicadores

```json
{
  "data": [
    { "regiao": "Norte", "nivel": "Medio", "variacao": -1, "tendencia": "alta" },
    { "regiao": "Nordeste", "nivel": "Alto", "variacao": -1, "tendencia": "estavel" },
    { "regiao": "Centro-Oeste", "nivel": "Medio", "variacao": 6, "tendencia": "alta" },
    { "regiao": "Sudeste", "nivel": "Baixo", "variacao": -3, "tendencia": "queda" },
    { "regiao": "Sul", "nivel": "Medio", "variacao": 2, "tendencia": "alta" }
  ]
}
```

### Exemplo de resposta — Panorama

```json
{
  "data": {
    "porcentagem": 44.7,
    "nivel": "Medio",
    "tendencia": "alta",
    "descricao": "dos estabelecimentos acima da média histórica",
    "analise": "Centro-Oeste mostra variação moderada...",
    "estabelecimentos": {
      "total": 3365,
      "drogarias": 880,
      "ubs": 510,
      "upas": 244
    }
  }
}
```

---

## Dados Mock Atuais

Componentes que usam dados hardcoded e precisam de integração:

| Componente     | Dados mock                         | Localização no código                                       |
| -------------- | ---------------------------------- | ----------------------------------------------------------- |
| `AppTopBar`    | 5 indicadores regionais            | Variável local no componente                                |
| `HomePanorama` | 44.7%, 3365 estabelecimentos       | Comentário: "Mock data — será substituído por dados da API" |
| `HomeChart`    | Controles sem dados                | Comentário: "ApexCharts — integração futura"                |
| `HomeTable`    | 5 linhas com níveis e porcentagens | Variável local no componente                                |
| `HomeFilters`  | 4 semanas epidemiológicas fixas    | Array hardcoded                                             |

---

## Cache e Atualização

| Dado                     | Estratégia de cache            | TTL        |
| ------------------------ | ------------------------------ | ---------- |
| Indicadores regionais    | Cache no BFF                   | 5 minutos  |
| Panorama                 | Cache no BFF por região        | 15 minutos |
| Gráfico (8 semanas)      | Cache no BFF por região + tipo | 1 hora     |
| Tabela                   | Cache no BFF                   | 15 minutos |
| Mapa                     | Cache no BFF                   | 15 minutos |
| Semanas epidemiológicas  | Cache no BFF                   | 24 horas   |
| Análise de especialistas | Sem cache (conteúdo dinâmico)  | —          |
