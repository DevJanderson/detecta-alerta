<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Meu Município - Detecta Alerta',
  description:
    'Monitoramento epidemiológico municipal com mapa interativo, unidades de saúde e indicadores em tempo real.'
})

useHead({
  bodyAttrs: { class: 'scrollbar-hidden' }
})
</script>

<template>
  <MeuMunicipioDashboard />
</template>
