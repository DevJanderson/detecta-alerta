<script setup lang="ts">
definePageMeta({
  layout: 'design-system'
})

useSeoPage({
  title: 'Base (Neutros) - Design System',
  description: 'Paleta de cores neutras do Detecta Alerta'
})

const colors = [
  { shade: '0', class: 'bg-base-0' },
  { shade: '50', class: 'bg-base-50' },
  { shade: '100', class: 'bg-base-100' },
  { shade: '200', class: 'bg-base-200' },
  { shade: '300', class: 'bg-base-300' },
  { shade: '400', class: 'bg-base-400' },
  { shade: '500', class: 'bg-base-500' },
  { shade: '600', class: 'bg-base-600' },
  { shade: '700', class: 'bg-base-700' },
  { shade: '800', class: 'bg-base-800' },
  { shade: '900', class: 'bg-base-900' },
  { shade: '950', class: 'bg-base-950' }
]
</script>

<template>
  <div>
    <h1 class="mb-2 text-3xl font-bold text-foreground">Base (Neutros)</h1>
    <p class="mb-8 text-muted-foreground">
      Escala de cinzas para textos, fundos, bordas e elementos estruturais
    </p>

    <CommonDesignSystemPalette
      title="Base"
      subtitle="Tons baixos (0-200) para fundos, tons altos (600-950) para textos"
      :colors="colors"
      class-prefix="bg-base-"
      show-border
    />
  </div>
</template>
