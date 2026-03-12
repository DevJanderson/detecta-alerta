---
title: 'Homepage — HomeRegionTabs'
description: 'Switcher de regiões do Brasil — seleciona a região ativa e dispara re-fetch de toda a página.'
order: 3
---

# HomeRegionTabs

Barra de seleção de região no topo da coluna esquerda do dashboard. Permite alternar entre **Brasil** (visão nacional) e as 5 regiões.

---

## O que exibe

| Elemento         | Exemplo                                                         | Comportamento                                                                         |
| ---------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Botão por região | `Brasil`, `Norte`, `Nordeste`, `Centro-Oeste`, `Sudeste`, `Sul` | Pill arredondado. Ativo: fundo azul escuro com ícone `map-pin`. Inativo: transparente |
| Label            | "Selecione uma Região:"                                         | Texto branco acima dos botões                                                         |

As opções vêm de `HOME_REGIONS` (constante em `types.ts`), não da API.

---

## Conexão com outros componentes

```
HomeRegionTabs
  └─ store.setRegion(region.id)
       └─ store.fetchAll()
            ├─ HomePanorama  ← atualiza card de alert status
            ├─ HomeTable     ← brasil: linhas por região / região: linhas por estado
            └─ HomeChart     ← atualiza série temporal
```

Ao clicar em uma região:

1. Atualiza `filtros.region` na store
2. Se o estado selecionado não pertence à nova região → reseta para "Todos os Estados"
3. O dropdown de estados (`HomeFilters`) filtra para mostrar apenas estados da região
4. Chama `fetchAll()` que busca panorama + tabela em paralelo, depois gráfico
5. **Todos os componentes** da página reagem porque consomem a mesma store

---

## Interação com a tabela

| Região selecionada    | O que a tabela exibe                                  |
| --------------------- | ----------------------------------------------------- |
| Brasil                | Uma linha por região (Norte, Nordeste, etc.)          |
| Norte, Nordeste, etc. | Uma linha por estado da região (ex: Sul → PR, SC, RS) |

---

## Estados da UI

| Estado                      | O que aparece                                  |
| --------------------------- | ---------------------------------------------- |
| Brasil selecionado (padrão) | Botão "Brasil" ativo com fundo `secondary-900` |
| Região selecionada          | Botão da região ativo, demais inativos         |
| Mobile                      | Scroll horizontal nos botões                   |

---

## Arquivos

| Arquivo                                         | Responsabilidade                       |
| ----------------------------------------------- | -------------------------------------- |
| `layers/home/app/components/HomeRegionTabs.vue` | Template e interação                   |
| `layers/home/app/composables/useHomeStore.ts`   | `setRegion()` → `fetchAll()`           |
| `layers/home/app/composables/types.ts`          | `HOME_REGIONS` — lista fixa de regiões |
