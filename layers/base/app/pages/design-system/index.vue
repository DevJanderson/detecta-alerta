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
  { shade: '50', class: 'bg-primary-50' },
  { shade: '100', class: 'bg-primary-100' },
  { shade: '200', class: 'bg-primary-200' },
  { shade: '300', class: 'bg-primary-300' },
  { shade: '400', class: 'bg-primary-400' },
  { shade: '500', class: 'bg-primary-500' },
  { shade: '600', class: 'bg-primary-600' },
  { shade: '700', class: 'bg-primary-700' },
  { shade: '800', class: 'bg-primary-800' },
  { shade: '900', class: 'bg-primary-900' },
  { shade: '950', class: 'bg-primary-950' }
]

const brandSecondary = [
  { shade: '50', class: 'bg-secondary-50' },
  { shade: '100', class: 'bg-secondary-100' },
  { shade: '200', class: 'bg-secondary-200' },
  { shade: '300', class: 'bg-secondary-300' },
  { shade: '400', class: 'bg-secondary-400' },
  { shade: '500', class: 'bg-secondary-500' },
  { shade: '600', class: 'bg-secondary-600' },
  { shade: '700', class: 'bg-secondary-700' },
  { shade: '800', class: 'bg-secondary-800' },
  { shade: '900', class: 'bg-secondary-900' },
  { shade: '950', class: 'bg-secondary-950' }
]

const brandTertiary = [
  { shade: '50', class: 'bg-tertiary-50' },
  { shade: '100', class: 'bg-tertiary-100' },
  { shade: '200', class: 'bg-tertiary-200' },
  { shade: '300', class: 'bg-tertiary-300' },
  { shade: '400', class: 'bg-tertiary-400' },
  { shade: '500', class: 'bg-tertiary-500' }
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
      class-prefix="bg-primary-"
    />

    <CommonDesignSystemPalette
      class="mt-12"
      title="Secondary"
      subtitle="Azul — Links, ações secundárias e elementos informativos"
      :colors="brandSecondary"
      class-prefix="bg-secondary-"
    />

    <CommonDesignSystemPalette
      class="mt-12"
      title="Tertiary"
      subtitle="Verde acinzentado — Elementos decorativos e fundos suaves"
      :colors="brandTertiary"
      class-prefix="bg-tertiary-"
    />
  </div>
</template>
