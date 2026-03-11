---
title: 'Meu Município — Dados e APIs'
description: 'Endpoints API Proxy necessários, dados mock atuais e estratégia de cache.'
order: 5
---

# Dados e APIs

Estado atual dos dados consumidos pela página Meu Município e endpoints API Proxy a implementar.

---

## Estado Atual: Mock

Toda a página funciona com dados mock. Não há endpoints API Proxy nem chamadas à API Sinapse.

| Dado                       | Fonte atual           | Arquivo                       | Substituir por                   |
| -------------------------- | --------------------- | ----------------------------- | -------------------------------- |
| Municípios (busca)         | Lista estática inline | `MeuMunicipioSearchField.vue` | API ou lista local (~5570 itens) |
| Alertas (mapa)             | 12 cidades hardcoded  | `utils/map-mock-data.ts`      | `/api/meu-municipio/alertas`     |
| Conexões (mapa)            | 10 rotas hardcoded    | `utils/map-mock-data.ts`      | `/api/meu-municipio/alertas`     |
| Município selecionado      | São Paulo (default)   | `useMeuMunicipioStore.ts`     | Busca ou geolocalização          |
| Notícias/rumores           | 6 notícias mock       | `composables/mocks.ts`        | `/api/meu-municipio/noticias`    |
| Filtros (UBS/UPA/Drogaria) | Contagens estáticas   | `MeuMunicipioFiltros.vue`     | `/api/meu-municipio/unidades`    |
| Lotação                    | Placeholder vazio     | `MeuMunicipioLotacao.vue`     | `/api/meu-municipio/lotacao`     |
| Alerta epidemiológico      | Texto estático        | `MeuMunicipioAlerta.vue`      | `/api/meu-municipio/alertas`     |

---

## Endpoints API Proxy a Implementar

Quando a integração com a API Sinapse for feita, criar estes endpoints em `layers/meu-municipio/server/api/meu-municipio/`:

### GET `/api/meu-municipio/lotacao`

Dados de lotação agregados por município e semana.

| Param       | Tipo            | Descrição                        |
| ----------- | --------------- | -------------------------------- |
| `municipio` | query (string)  | Código IBGE do município         |
| `semana`    | query (number)  | Semana epidemiológica            |
| `ano`       | query (number)  | Ano                              |
| `tipo`      | query (string?) | Filtro: `ubs`, `upa`, `drogaria` |

**API Sinapse:** `GET /api/v1/detecta_alerta/epidemiological/aggregations`

**Resposta esperada:**

```typescript
{
  nivel: 'baixo' | 'medio' | 'alto'
  percentual: number
  tendencia: 'alta' | 'baixa' | 'estavel'
  historico: Array<{ semana: number; percentual: number }>
}
```

### GET `/api/meu-municipio/unidades`

Unidades de saúde do município com coordenadas para marcadores no mapa.

| Param       | Tipo            | Descrição                        |
| ----------- | --------------- | -------------------------------- |
| `municipio` | query (string)  | Código IBGE do município         |
| `tipo`      | query (string?) | Filtro: `ubs`, `upa`, `drogaria` |

**API Sinapse:** `GET /api/v1/detecta_alerta/units/{placeId}`

**Resposta esperada:**

```typescript
{
  total: number
  unidades: Array<{
    id: string
    nome: string
    tipo: 'ubs' | 'upa' | 'drogaria'
    lat: number
    lng: number
    ocupacao: number
    nivel: 'baixo' | 'medio' | 'alto'
  }>
}
```

### GET `/api/meu-municipio/unidades/[id]`

Detalhes de uma unidade individual (drill-down).

**API Sinapse:** `GET /api/v1/detecta_alerta/units/{placeId}` + `GET /api/v1/cnes/by-place-id/{placeId}`

### GET `/api/meu-municipio/noticias`

Rumores filtrados por estado do município.

| Param    | Tipo            | Descrição                  |
| -------- | --------------- | -------------------------- |
| `uf`     | query (string)  | UF do município (ex: "SE") |
| `semana` | query (number?) | Semana epidemiológica      |

**API Sinapse:** `GET /api/v1/noticias/`

### GET `/api/meu-municipio/alertas`

Alertas epidemiológicos ativos para o município.

| Param       | Tipo           | Descrição                |
| ----------- | -------------- | ------------------------ |
| `municipio` | query (string) | Código IBGE do município |

---

## Service a Implementar

Criar `layers/meu-municipio/app/composables/useMeuMunicipioApi.ts` seguindo o [padrão feature layer](/docs/padroes/feature-layer):

```typescript
export function useMeuMunicipioApi() {
  async function getLotacao(params: LotacaoParams) {
    return $fetch('/api/meu-municipio/lotacao', { params })
  }

  async function getUnidades(municipio: string, tipo?: string) {
    return $fetch('/api/meu-municipio/unidades', { params: { municipio, tipo } })
  }

  async function getNoticias(uf: string, semana?: number) {
    return $fetch('/api/meu-municipio/noticias', { params: { uf, semana } })
  }

  async function getAlertas(municipio: string) {
    return $fetch('/api/meu-municipio/alertas', { params: { municipio } })
  }

  return { getLotacao, getUnidades, getNoticias, getAlertas }
}
```

---

## Estratégia de Cache (planejada)

| Dado               | TTL sugerido | Motivo                          |
| ------------------ | ------------ | ------------------------------- |
| Lotação (agregado) | 5 min        | Atualiza frequentemente         |
| Unidades (lista)   | 24h          | Raramente muda                  |
| Detalhes CNES      | 24h          | Dados estáveis                  |
| Notícias           | 15 min       | Feed com atualizações moderadas |
| Alertas            | 5 min        | Necessita ser recente           |

---

## Domain Errors

Erros tipados já definidos em `#shared/domain/errors`:

```typescript
export const MeuMunicipioErrors = {
  FETCH_ALERTAS_FAILED: 'Erro ao carregar alertas epidemiológicos',
  FETCH_NOTICIAS_FAILED: 'Erro ao carregar notícias',
  MUNICIPIO_NOT_FOUND: 'Município não encontrado'
} as const
```
