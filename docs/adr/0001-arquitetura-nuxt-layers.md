# ADR-0001: Arquitetura Nuxt Layers-Only

## Status

Accepted

## Contexto

O Detecta Alerta é uma plataforma de vigilância epidemiológica com múltiplos domínios
(autenticação, dashboard, mapas, relatórios, rumores). Precisávamos de uma arquitetura
que permitisse:

- Organização modular por domínio/feature
- Adição incremental de novas features sem impactar as existentes
- Reutilização de componentes e lógica entre domínios
- Prioridade clara de sobrescrita entre camadas

## Decisão

Adotamos uma arquitetura **layers-only** usando Nuxt Layers, onde **não existe pasta
`app/` na raiz**. Todo código fica organizado em layers numeradas:

```
layers/
  0-base/    # Fundação + UI: app.vue, error.vue, CSS, shadcn-vue, utils, tipos
  3-auth/    # Autenticação BFF
  4-home/    # Landing page e páginas públicas
```

A prioridade segue a numeração: `4-home > 3-auth > 0-base`.

## Opções Consideradas

### Opção 1: Estrutura tradicional com `app/` na raiz

- **Prós**: Mais simples, padrão Nuxt default
- **Contras**: Mistura responsabilidades, difícil escalar para múltiplos domínios

### Opção 2: Layers-only (escolhida)

- **Prós**: Modular, cada feature isolada, reutilizável, escalável
- **Contras**: Caminhos de importação mais longos (`~/layers/...`), curva de aprendizado

### Opção 3: Micro-frontends

- **Prós**: Independência total de deploy
- **Contras**: Complexidade operacional desproporcional ao tamanho do time

## Racional

Layers-only oferece o melhor equilíbrio entre modularidade e simplicidade. Cada nova
feature é uma nova layer com `nuxt.config.ts` próprio, componentes, composables, pages
e endpoints isolados. A numeração garante prioridade previsível.

## Consequências

### Positivas

- Features independentes (auth, home, dashboard) em contextos isolados
- Fácil adicionar novas layers (5-dashboard, 6-reports)
- Componentes auto-importados de todas as layers
- Cada layer pode ter seu próprio `CLAUDE.md` com documentação

### Negativas

- Caminhos de importação mais verbosos (`~/layers/0-base/app/utils/...`)
- Precisa usar `~/layers/...` (alias da raiz) em `nuxt.config.ts` de layers
- Caminhos relativos como `./app/...` não funcionam em configs de layers

## Referências

- [Nuxt Layers Documentation](https://nuxt.com/docs/guide/going-further/layers)
- [docs/NUXT_LAYERS.md](../NUXT_LAYERS.md)
