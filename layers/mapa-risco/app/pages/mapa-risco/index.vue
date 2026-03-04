<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Mapa de Risco - Detecta Alerta',
  description:
    'Visualize o mapa de risco epidemiológico do Brasil. Acompanhe alertas e indicadores de saúde por região.'
})
</script>

<template>
  <div class="flex h-[calc(100vh-5.5rem)] w-full">
    <div class="relative flex-1 min-w-0">
      <MapaRiscoMap />
    </div>
    <MapaRiscoAside />
  </div>
</template>
