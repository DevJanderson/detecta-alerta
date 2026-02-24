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
layers/2-home/
├── nuxt.config.ts              # Configuração da layer
├── CLAUDE.md                   # Este arquivo
│
└── app/
    ├── components/
    │   └── HomeHero.vue        # Hero section da homepage
    └── pages/
        └── index.vue           # Homepage (/)
```

---

## Páginas

| Rota | Arquivo               | Descrição          |
| ---- | --------------------- | ------------------ |
| `/`  | `app/pages/index.vue` | Homepage principal |

> **Nota:** A página de design system está em `layers/0-base/app/pages/design-system/` (rota `/design-system`).

---

## Prioridade

Esta é a layer de **prioridade** (2), o que significa:

- Pode sobrescrever páginas de layers anteriores
- A página `/` aqui sobrescreve qualquer `/` de outras layers
- Útil para customizações específicas do produto final

---

## Adicionar Novas Páginas

```vue
<!-- layers/2-home/app/pages/about.vue -->
<script setup lang="ts">
useSeoPage({
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

Se a homepage crescer, considere adicionar mais componentes:

```
layers/2-home/
├── app/
│   ├── components/             # Componentes específicos da home
│   │   ├── HomeHero.vue        # ✅ Já existe
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

Use `useSeoPage` para SEO completo (OG, Twitter Cards, canonical, robots):

```vue
<script setup lang="ts">
// Página pública (indexável)
useSeoPage({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description: 'Monitoramento de surtos e epidemias em tempo real para o Brasil.'
})

// Página interna (não indexável)
useSeoPage({
  title: 'Sobre - Detecta Alerta',
  noindex: true
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
| Páginas autenticadas | `layers/1-auth/` ou feature específica   |
| Componentes globais  | `layers/0-base/app/components/`          |
| Design system        | `layers/0-base/app/pages/design-system/` |
| Endpoints de API     | `layers/0-base/server/` ou feature       |
