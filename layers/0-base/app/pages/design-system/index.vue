<script setup lang="ts">
definePageMeta({
  layout: 'design-system',
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Cores da Marca - Design System',
  description: 'Paletas Brand Primary, Secondary e Tertiary do Detecta Alerta'
})

const brandPrimary = [
  { shade: '50', class: 'bg-brand-primary-50' },
  { shade: '100', class: 'bg-brand-primary-100' },
  { shade: '200', class: 'bg-brand-primary-200' },
  { shade: '300', class: 'bg-brand-primary-300' },
  { shade: '400', class: 'bg-brand-primary-400' },
  { shade: '500', class: 'bg-brand-primary-500' },
  { shade: '600', class: 'bg-brand-primary-600' },
  { shade: '700', class: 'bg-brand-primary-700' },
  { shade: '800', class: 'bg-brand-primary-800' },
  { shade: '900', class: 'bg-brand-primary-900' },
  { shade: '950', class: 'bg-brand-primary-950' }
]

const brandSecondary = [
  { shade: '50', class: 'bg-brand-secondary-50' },
  { shade: '100', class: 'bg-brand-secondary-100' },
  { shade: '200', class: 'bg-brand-secondary-200' },
  { shade: '300', class: 'bg-brand-secondary-300' },
  { shade: '400', class: 'bg-brand-secondary-400' },
  { shade: '500', class: 'bg-brand-secondary-500' },
  { shade: '600', class: 'bg-brand-secondary-600' },
  { shade: '700', class: 'bg-brand-secondary-700' },
  { shade: '800', class: 'bg-brand-secondary-800' },
  { shade: '900', class: 'bg-brand-secondary-900' },
  { shade: '950', class: 'bg-brand-secondary-950' }
]

const brandTertiary = [
  { shade: '50', class: 'bg-brand-tertiary-50' },
  { shade: '100', class: 'bg-brand-tertiary-100' },
  { shade: '200', class: 'bg-brand-tertiary-200' },
  { shade: '300', class: 'bg-brand-tertiary-300' },
  { shade: '400', class: 'bg-brand-tertiary-400' },
  { shade: '500', class: 'bg-brand-tertiary-500' }
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Cores da Marca</h1>
    <p class="mb-8 text-muted-foreground">
      Paletas Brand Primary, Secondary e Tertiary extraídas do Figma
    </p>

    <CommonDesignSystemPalette
      title="Primary"
      subtitle="Vermelho/Coral — CTAs, destaques e elementos principais"
      :colors="brandPrimary"
      class-prefix="bg-brand-primary-"
    />

    <CommonDesignSystemPalette
      class="mt-12"
      title="Secondary"
      subtitle="Azul — Links, ações secundárias e elementos informativos"
      :colors="brandSecondary"
      class-prefix="bg-brand-secondary-"
    />

    <CommonDesignSystemPalette
      class="mt-12"
      title="Tertiary"
      subtitle="Verde acinzentado — Elementos decorativos e fundos suaves"
      :colors="brandTertiary"
      class-prefix="bg-brand-tertiary-"
    />
  </div>
</template>
