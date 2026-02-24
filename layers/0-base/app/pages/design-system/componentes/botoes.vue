<script setup lang="ts">
definePageMeta({
  layout: 'design-system'
})

useSeoPage({
  title: 'Botões - Design System',
  description: 'Variantes de botões do design system Detecta Alerta'
})
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Botões</h1>
    <p class="mb-8 text-muted-foreground">Variantes customizadas do design system Figma</p>

    <!-- Brand Outline -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Brand Outline (Primário)</h2>
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-sm">Small</Button>
          <span class="text-xs text-muted-foreground">brand-sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-md">Medium</Button>
          <span class="text-xs text-muted-foreground">brand-md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-lg">Large</Button>
          <span class="text-xs text-muted-foreground">brand-lg</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-md" disabled>Disabled</Button>
          <span class="text-xs text-muted-foreground">disabled</span>
        </div>
      </div>
    </section>

    <!-- Brand Secondary Soft -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Brand Secondary Soft (Secundário)</h2>
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-secondary-soft" size="brand-sm">Small</Button>
          <span class="text-xs text-muted-foreground">brand-sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-secondary-soft" size="brand-md">Medium</Button>
          <span class="text-xs text-muted-foreground">brand-md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-secondary-soft" size="brand-lg">Large</Button>
          <span class="text-xs text-muted-foreground">brand-lg</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-secondary-soft" size="brand-md" disabled>Disabled</Button>
          <span class="text-xs text-muted-foreground">disabled</span>
        </div>
      </div>
    </section>

    <!-- Com Ícones -->
    <section class="mb-10">
      <h2 class="mb-3 text-xl font-semibold text-foreground">Com Ícones</h2>
      <div class="flex flex-wrap items-end gap-4">
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-md">
            <Icon name="lucide:arrow-left" class="size-4" />
            Voltar
          </Button>
          <span class="text-xs text-muted-foreground">left icon</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-md">
            Próximo
            <Icon name="lucide:arrow-right" class="size-4" />
          </Button>
          <span class="text-xs text-muted-foreground">right icon</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Button variant="brand-outline" size="brand-md" disabled>
            <Icon name="lucide:loader-2" class="size-4 animate-spin" />
            Loading...
          </Button>
          <span class="text-xs text-muted-foreground">loading</span>
        </div>
      </div>
    </section>

    <!-- Código -->
    <div class="rounded-lg bg-muted p-4">
      <p class="mb-2 text-sm font-medium text-foreground">Uso:</p>
      <code class="text-xs text-muted-foreground">
        &lt;Button variant="brand-outline" size="brand-md"&gt;Texto&lt;/Button&gt;<br />
        &lt;Button variant="brand-secondary-soft" size="brand-lg"&gt;Texto&lt;/Button&gt;
      </code>
    </div>
  </div>
</template>
