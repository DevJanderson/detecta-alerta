---
title: 'Homepage — Backlog de Integração'
description: 'Itens pendentes de integração com a API Sinapse na homepage — o que falta, por quê e o que é necessário.'
order: 99
---

# Backlog de Integração — Homepage

Itens que ainda usam **dados mock** ou estão incompletos na homepage. Para cada item: o que falta, por que ainda não foi feito e o que é necessário para implementar.

---

## 1. Agravos (HomePanorama)

**O que é:** Seção "Número de casos por agravo" dentro do `HomePanorama.vue` — 3 cards (Arboviroses, Síndromes Respiratórias, Outras síndromes) com dados de Dengue, Chikungunya, Zika, Covid-19, Influenza A/B, etc.

**Status:** Mock hardcoded no template (linhas 170–332 do `HomePanorama.vue`).

**Por que não foi feito:** A API Sinapse ainda não expõe um endpoint de agregações por agravo/doença. O endpoint atual (`/epidemiological/aggregations`) retorna dados de **movimento em estabelecimentos**, não de casos por doença.

**O que é necessário:**

- Endpoint na API Sinapse para dados de agravos (provavelmente `/noticias/agregacoes` ou similar)
- Definir tipos/schemas em `layers/base/shared/types/sinapse/`
- Criar método no `useHomeApi.ts` (ex: `getAgravos()`)
- Adicionar state na store (`agravos`) e integrar no `fetchAll()`
- Substituir o HTML mock por template dinâmico com `v-for`

---

## 2. Análise dos Especialistas (HomeChart + HomeTable)

**O que é:** Card "Análise dos Especialistas" que aparece tanto no `HomeChart.vue` (linhas 171–203) quanto no `HomeTable.vue` (linhas 141–174). Texto descritivo com análise contextual sobre a situação epidemiológica.

**Status:** Texto fixo hardcoded no template.

**Por que não foi feito:** Não há endpoint na API que retorne texto de análise. Esse conteúdo pode vir de:

- Um endpoint de análises/relatórios da API Sinapse
- Um CMS ou campo editorial no backend
- Geração automática baseada nos dados (ex: IA)

A decisão de produto sobre a fonte desse conteúdo ainda não foi definida.

**O que é necessário:**

- Definir fonte do conteúdo (API, CMS, gerado)
- Criar endpoint/método de busca
- Substituir texto fixo por dados dinâmicos
- Considerar estado vazio (quando não há análise disponível)

---

## 3. Gráficos de linha nos cards de Agravos

**O que é:** Dentro de cada card de agravo (item 1), o agravo principal tem um placeholder de gráfico de linha (ícone `chart-line` com borda tracejada).

**Status:** Placeholder visual, sem gráfico real.

**Por que não foi feito:** Depende do item 1 (endpoint de agravos). Sem dados históricos por agravo, não há série temporal para renderizar.

**O que é necessário:**

- Resolver item 1 (endpoint de agravos com série temporal)
- Definir se usa ECharts (como `HomeChartLine`) ou sparkline mais leve
- Implementar componente de mini-gráfico para os cards

---

## Prioridade sugerida

| #   | Item                      | Impacto                                     | Dependência                    |
| --- | ------------------------- | ------------------------------------------- | ------------------------------ |
| 1   | Agravos                   | Alto — seção grande com dados mock visíveis | Endpoint na API Sinapse        |
| 2   | Análise dos Especialistas | Médio — texto contextual                    | Decisão de produto sobre fonte |
| 3   | Gráficos dos agravos      | Baixo — depende do item 1                   | Item 1 resolvido               |
