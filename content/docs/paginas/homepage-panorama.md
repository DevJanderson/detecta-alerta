---
title: 'Homepage — HomePanorama'
description: 'Card principal com nível de alerta, variação semanal, tendência e contadores por tipo de unidade.'
order: 5
---

# HomePanorama

Card principal do dashboard. Mostra o **nível de alerta geral**, a **variação semanal** e contadores por tipo de estabelecimento (drogarias, UBS, UPAs).

---

## O que exibe

### Header

| Elemento         | Exemplo                                       | Cor                                              |
| ---------------- | --------------------------------------------- | ------------------------------------------------ |
| Título           | "Movimento em estabelecimentos de saúde"      | Texto escuro                                     |
| Dica explicativa | Ícone `lightbulb` + texto sobre o significado | `text-base-800`                                  |
| Tag de variação  | `42% mais alto que o normal ↑`                | Tendência: up=vermelho, down=verde, stable=cinza |

O **fundo do header** e a **borda do card** mudam conforme o `alertStatus`:

| Alert Status | Fundo           | Borda                | Tag              |
| ------------ | --------------- | -------------------- | ---------------- |
| `green`      | `bg-success-50` | `border-success-200` | `bg-success-200` |
| `yellow`     | `bg-alert-50`   | `border-alert-200`   | `bg-alert-200`   |
| `red`        | `bg-primary-50` | `border-primary-200` | `bg-primary-200` |

### Barra de estabelecimentos

Para cada tipo de unidade com `count > 0`:

| Elemento | Exemplo                             | Descrição                        |
| -------- | ----------------------------------- | -------------------------------- |
| Ícone    | `pill` / `stethoscope` / `hospital` | Tipo de unidade                  |
| Contagem | `45 drogarias:`                     | Quantidade de unidades           |
| Variação | `12%` ↑                             | Porcentagem + ícone de tendência |
| Total    | `171 estabelecimentos analisados`   | Soma de todas as unidades        |

### Seção "Agravos" (mock)

Cards de agravos por categoria (Arboviroses, Síndromes Respiratórias, Outras). **Ainda com dados mock** — aguardando endpoint de notícias/agregações da API.

---

## Conexão com outros componentes

```
HomeRegionTabs / HomeFilters
  └─ store.fetchAll()
       └─ api.getPanorama({ region, estado, semana })
            └─ store.panorama  ← HomePanorama reage
```

O componente é **consumidor passivo** — não faz fetch próprio. Lê `store.panorama` que é alimentado pelo `fetchAll()` disparado pelos filtros.

O `HomePanorama` também fornece dados para o header da `HomeTable` (contadores de unidades).

---

## API Sinapse

**Endpoint:** `GET /api/epidemiological/aggregations`

### Parâmetros conforme contexto

| Contexto         | `aggregation_level` | Filtro extra                             |
| ---------------- | ------------------- | ---------------------------------------- |
| Brasil           | `region`            | Nenhum — soma todas as regiões           |
| Região (ex: Sul) | `region`            | Filtra client-side por `aggregation_key` |
| Estado (ex: SP)  | `state`             | `state=SP`                               |

### Campos utilizados

| Campo da API                        | Uso no componente              |
| ----------------------------------- | ------------------------------ |
| `metrics.alert_status`              | Cor do card (green/yellow/red) |
| `metrics.trend_weekday`             | Ícone ↑↓ e cor da variação     |
| `metrics.vs_previous_week_weekday`  | Porcentagem de variação        |
| `metrics.average_occupancy_weekday` | Taxa de ocupação               |
| `units_count`                       | Contagem por tipo de unidade   |

### Lógica de agregação (Brasil)

Quando a visão é "Brasil", os dados vêm de 5 registros (um por região). O `useHomeApi` calcula:

- **Variação**: média ponderada por `units_count`
- **Alert status**: pior entre as regiões (`green < yellow < red`)
- **Trend**: tendência da maioria das regiões
- **Total**: soma de `units_count`

---

## Estados da UI

| Estado     | Condição                    | O que aparece                     |
| ---------- | --------------------------- | --------------------------------- |
| Carregando | `store.isLoading`           | Spinner centralizado              |
| Com dados  | `store.panorama` preenchido | Card completo com cores dinâmicas |
| Sem dados  | `store.panorama` null       | Nada renderizado (`v-if`)         |

---

## Arquivos

| Arquivo                                       | Responsabilidade                    |
| --------------------------------------------- | ----------------------------------- |
| `layers/home/app/components/HomePanorama.vue` | Template com cores dinâmicas        |
| `layers/home/app/composables/useHomeStore.ts` | `panorama` ref + `fetchPanorama()`  |
| `layers/home/app/composables/useHomeApi.ts`   | `getPanorama()` — fetch + agregação |
| `layers/home/app/composables/types.ts`        | `PanoramaData`, `UnitTypeStats`     |
