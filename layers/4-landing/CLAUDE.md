# Landing Layer - CLAUDE.md

Camada responsável pela landing page e páginas públicas do Detecta Alerta.

---

## Propósito

Esta layer contém:

- **Homepage** (`/`) - Página inicial da aplicação
- **Página de Estilos** (`/styles`) - Visualização do design system
- Outras páginas públicas (marketing, institucional)

---

## Estrutura

```
layers/4-landing/
├── nuxt.config.ts              # Configuração da layer
├── CLAUDE.md                   # Este arquivo
│
└── app/
    └── pages/
        ├── index.vue           # Homepage (/)
        └── styles/
            └── index.vue       # Design system (/styles)
```

---

## Páginas

| Rota      | Arquivo                      | Descrição                            |
| --------- | ---------------------------- | ------------------------------------ |
| `/`       | `app/pages/index.vue`        | Landing page principal               |
| `/styles` | `app/pages/styles/index.vue` | Visualização das cores e componentes |

---

## Prioridade

Esta é a layer de **maior prioridade** (4), o que significa:

- Pode sobrescrever páginas de layers anteriores
- A página `/` aqui sobrescreve qualquer `/` de outras layers
- Útil para customizações específicas do produto final

---

## Adicionar Novas Páginas

### Página Simples

```vue
<!-- layers/4-landing/app/pages/about.vue -->
<script setup lang="ts">
// /about
</script>

<template>
  <div class="container mx-auto py-12">
    <h1 class="text-3xl font-bold">Sobre o Detecta Alerta</h1>
    <p class="mt-4 text-muted-foreground">Plataforma de vigilância epidemiológica em tempo real.</p>
  </div>
</template>
```

### Página com Subpasta

```vue
<!-- layers/4-landing/app/pages/features/index.vue -->
<script setup lang="ts">
// /features
</script>

<template>
  <div>
    <h1>Funcionalidades</h1>
  </div>
</template>
```

---

## Expandindo a Layer

Se a landing page crescer, considere adicionar:

```
layers/4-landing/
├── app/
│   ├── components/             # Componentes específicos da landing
│   │   ├── LandingHero.vue
│   │   ├── LandingFeatures.vue
│   │   └── LandingCTA.vue
│   │
│   ├── composables/            # Lógica específica (se necessário)
│   │   └── useLandingAnalytics.ts
│   │
│   └── pages/
│       ├── index.vue
│       ├── about.vue
│       ├── features.vue
│       ├── pricing.vue
│       └── contact.vue
```

---

## Padrões

### SEO

Use `useHead` ou `useSeoMeta` para SEO específico da página:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description: 'Monitoramento de surtos e epidemias em tempo real para o Brasil.',
  ogImage: '/og-image.png'
})
</script>
```

### Layout

Por padrão, usa o layout `default` de `layers/1-base`. Para layout customizado:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'landing' // Se criar um layout específico
})
</script>
```

---

## O que vai nesta Layer

- Páginas públicas (não autenticadas)
- Conteúdo institucional
- Marketing e conversão
- Visualização do design system

## O que NÃO vai nesta Layer

| Tipo                 | Onde colocar                           |
| -------------------- | -------------------------------------- |
| Páginas autenticadas | `layers/3-auth/` ou feature específica |
| Componentes globais  | `layers/1-base/app/components/`        |
| Endpoints de API     | `layers/0-core/server/` ou feature     |

---

## Referências

- [Nuxt Pages](https://nuxt.com/docs/4.x/directory-structure/app/pages)
- [Nuxt SEO](https://nuxt.com/docs/getting-started/seo-meta)
