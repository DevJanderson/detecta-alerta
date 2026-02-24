<script setup lang="ts">
definePageMeta({
  layout: 'design-system'
})

useSeoPage({
  title: 'Cores Semânticas - Design System',
  description: 'Cores semânticas shadcn/ui do Detecta Alerta'
})

const semanticColors = [
  { name: 'background', class: 'bg-background' },
  { name: 'foreground', class: 'bg-foreground' },
  { name: 'primary', class: 'bg-primary' },
  { name: 'primary-foreground', class: 'bg-primary-foreground' },
  { name: 'secondary', class: 'bg-secondary' },
  { name: 'secondary-foreground', class: 'bg-secondary-foreground' },
  { name: 'muted', class: 'bg-muted' },
  { name: 'muted-foreground', class: 'bg-muted-foreground' },
  { name: 'accent', class: 'bg-accent' },
  { name: 'accent-foreground', class: 'bg-accent-foreground' },
  { name: 'destructive', class: 'bg-destructive' },
  { name: 'border', class: 'bg-border' },
  { name: 'input', class: 'bg-input' },
  { name: 'ring', class: 'bg-ring' }
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Cores Semânticas</h1>
    <p class="mb-8 text-muted-foreground">
      Tokens semânticos mapeados para as cores da marca via CSS variables
    </p>

    <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      <div v-for="color in semanticColors" :key="color.name" class="flex flex-col items-center">
        <div class="h-16 w-full rounded-lg border border-border shadow-sm" :class="color.class" />
        <span class="mt-1 text-xs text-muted-foreground">{{ color.name }}</span>
      </div>
    </div>

    <div class="mt-8 rounded-lg bg-muted p-4">
      <p class="mb-2 text-sm font-medium text-foreground">Mapeamento:</p>
      <code class="text-xs leading-relaxed text-muted-foreground">
        primary → brand-primary-950<br />
        secondary → brand-secondary-900<br />
        muted → base-100<br />
        accent → brand-tertiary-100<br />
        destructive → danger-900
      </code>
    </div>
  </div>
</template>
