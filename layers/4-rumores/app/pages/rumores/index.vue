<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Rumores Epidemiológicos - Detecta Alerta',
  description:
    'Acompanhe rumores e notícias epidemiológicas do Brasil em tempo real. Monitore surtos, tendências e alertas de saúde pública.',
  noindex: true
})

const store = useRumoresStore()

// Carregar lookups para os filtros
await store.fetchLookups()

// Carregar feed inicial
await store.fetchRumores(true)
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold">Rumores Epidemiológicos</h1>
      <p class="mt-1 text-sm text-muted-foreground">
        Notícias e rumores sobre eventos de saúde pública no Brasil.
      </p>
    </div>

    <RumoresFilters />

    <RumoresFeed />
  </div>
</template>
