---
title: 'Homepage — AppTopBar'
description: 'Barra de indicadores regionais — estrutura, dados da API Sinapse e fluxo.'
order: 2
---

# AppTopBar

Barra fixa no topo de todas as páginas. Exibe o **movimento em estabelecimentos de saúde comparado à semana anterior**, por região do Brasil.

---

## O que exibe

Para cada região (Norte, Nordeste, Centro-Oeste, Sudeste, Sul):

| Elemento           | Exemplo                    | Cor                                                                |
| ------------------ | -------------------------- | ------------------------------------------------------------------ |
| Nome da região     | `Norte:`                   | Branco                                                             |
| Nível de alerta    | `Baixo` / `Médio` / `Alto` | Severidade — verde / amarelo / vermelho                            |
| Variação semanal   | `42%`                      | Tendência — subindo: vermelho, descendo: verde, estável: branco/60 |
| Ícone de tendência | ↑ ou ↓                     | Mesma cor da variação. Só aparece quando não é estável             |

O nível de alerta e a variação usam **cores independentes** para evitar ambiguidade. Um nível "Baixo" (verde) pode ter variação alta em vermelho — significa que o nível está ok mas está subindo.

---

## API Sinapse

**Endpoint API Proxy:** `GET /api/epidemiological/aggregations`

| Parâmetro           | Valor    | Descrição                              |
| ------------------- | -------- | -------------------------------------- |
| `aggregation_level` | `region` | Agrupa por região                      |
| `unit_type`         | `all`    | Todos os tipos de unidade consolidados |
| `weeks`             | `1`      | Semana mais recente                    |
| `direction`         | `desc`   | Mais recente primeiro                  |
| `limit`             | `10`     | 5 regiões esperadas                    |

A API retorna **um registro por região** com `unit_type: "all"` — dados já consolidados pelo backend. O frontend não faz nenhum cálculo, apenas mapeia os campos.

### Campos utilizados

| Campo da API                       | Valores                    | Uso no componente                |
| ---------------------------------- | -------------------------- | -------------------------------- |
| `aggregation_key`                  | `N`, `NE`, `CO`, `SE`, `S` | Nome da região                   |
| `metrics.alert_status`             | `green`, `yellow`, `red`   | Nível: Baixo, Médio, Alto        |
| `metrics.trend_weekday`            | `up`, `down`, `stable`     | Cor da variação e ícone ↑↓       |
| `metrics.vs_previous_week_weekday` | Número (ex: `42.38`)       | Variação arredondada (ex: `42%`) |

### Exemplo de resposta

```json
{
  "data": [
    {
      "aggregation_level": "region",
      "aggregation_key": "N",
      "unit_type": "all",
      "week_ending_date": "2026-02-28",
      "metrics": {
        "alert_status": "green",
        "trend_weekday": "stable",
        "vs_previous_week_weekday": 42.38
      },
      "units_count": 171
    }
  ]
}
```

---

## Fluxo de dados

```
API Sinapse
  ↓
API Proxy: layers/home/server/api/epidemiological/aggregations.get.ts
  - Valida token (getAccessToken)
  - Proxy com buildQueryString
  ↓
Composable: layers/base/app/composables/useRegionStats.ts
  - Filtra unit_type=all
  - Mapeia campos direto (sem cálculos)
  - Ordena: Norte → Nordeste → Centro-Oeste → Sudeste → Sul
  ↓
Componente: layers/base/app/components/common/AppTopBar.vue
  - Renderiza indicadores com cores separadas (nível vs tendência)
```

---

## Estados da UI

| Estado          | Condição           | O que aparece                         |
| --------------- | ------------------ | ------------------------------------- |
| Carregando      | `isLoading = true` | Spinner + "Carregando..."             |
| Erro            | `error !== null`   | Mensagem em vermelho                  |
| Não autenticado | Usuário não logado | Valores padrão: Baixo / --% / estável |
| Com dados       | Resposta ok        | Dados reais por região                |

---

## Arquivos

| Arquivo                                                      | Responsabilidade                        |
| ------------------------------------------------------------ | --------------------------------------- |
| `layers/base/app/components/common/AppTopBar.vue`            | Template e estilos                      |
| `layers/base/app/composables/useRegionStats.ts`              | Fetch e mapeamento dos dados            |
| `layers/home/server/api/epidemiological/aggregations.get.ts` | Endpoint API Proxy (proxy para Sinapse) |
| `layers/base/shared/types/sinapse/epidemiological.ts`        | Tipos e schemas Zod                     |
