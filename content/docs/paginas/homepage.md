---
title: 'Homepage'
description: 'Documentação técnica da homepage do Detecta Alerta — estrutura, componentes e integração com a API Sinapse.'
order: 1
---

# Homepage

Página principal da plataforma Detecta Alerta. Apresenta o panorama nacional de vigilância epidemiológica com dados de lotação de estabelecimentos de saúde.

**Rota:** `/` · **Layer:** `home` · **Página:** `layers/home/app/pages/index.vue`

---

## Estrutura da Página

```
default.vue (layout)
├── AppTopBar ← indicadores regionais (API real)
├── AppHeader
├── HomeHero
├── HomeDashboard (orquestrador)
│   ├── HomeRegionTabs
│   ├── HomeMap (MapLibre GL + GeoJSON)
│   ├── HomeFilters
│   ├── HomePanorama
│   ├── HomeChart
│   └── HomeTable
├── HomeCtaMunicipio
└── AppFooter
```

Detalhes de cada componente nas páginas dedicadas:

- [AppTopBar](/docs/paginas/homepage-apptopbar) — indicadores regionais (API real)
