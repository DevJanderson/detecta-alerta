# Home Layer - CLAUDE.md

Camada responsável pela homepage e páginas públicas do Detecta Alerta.

---

## Propósito

Esta layer contém:

- **Homepage** (`/`) - Página inicial da aplicação
- Outras páginas públicas (institucional, contato, etc.)

---

## Estrutura

```
layers/4-home/
├── nuxt.config.ts              # Configuração da layer
├── CLAUDE.md                   # Este arquivo
│
└── app/
    └── pages/
        └── index.vue           # Homepage (/)
```

---

## Páginas

| Rota | Arquivo               | Descrição          |
| ---- | --------------------- | ------------------ |
| `/`  | `app/pages/index.vue` | Homepage principal |

> **Nota:** A página de design system está em `layers/1-base/app/pages/design-system/` (rota `/design-system`).

---

## Prioridade

Esta é a layer de **maior prioridade** (4), o que significa:

- Pode sobrescrever páginas de layers anteriores
- A página `/` aqui sobrescreve qualquer `/` de outras layers
- Útil para customizações específicas do produto final

---

## Adicionar Novas Páginas

```vue
<!-- layers/4-home/app/pages/about.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'Sobre - Detecta Alerta',
  description: 'Conheça o Detecta Alerta.'
})
</script>

<template>
  <div class="container mx-auto py-12">
    <h1 class="text-3xl font-bold">Sobre o Detecta Alerta</h1>
    <p class="mt-4 text-muted-foreground">Plataforma de vigilância epidemiológica em tempo real.</p>
  </div>
</template>
```

---

## Expandindo a Layer

Se a homepage crescer, considere adicionar:

```
layers/4-home/
├── app/
│   ├── components/             # Componentes específicos da home
│   │   ├── HomeHero.vue
│   │   ├── HomeFeatures.vue
│   │   └── HomeCTA.vue
│   │
│   └── pages/
│       ├── index.vue
│       ├── about.vue
│       └── contact.vue
```

---

## Padrões

### SEO

Use `useSeoMeta` para SEO específico da página:

```vue
<script setup lang="ts">
useSeoMeta({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description: 'Monitoramento de surtos e epidemias em tempo real para o Brasil.',
  ogImage: '/og-image.png'
})
</script>
```

---

## O que vai nesta Layer

- Homepage da aplicação
- Páginas públicas (não autenticadas)
- Conteúdo institucional

## O que NÃO vai nesta Layer

| Tipo                 | Onde colocar                             |
| -------------------- | ---------------------------------------- |
| Páginas autenticadas | `layers/3-auth/` ou feature específica   |
| Componentes globais  | `layers/1-base/app/components/`          |
| Design system        | `layers/1-base/app/pages/design-system/` |
| Endpoints de API     | `layers/0-core/server/` ou feature       |
