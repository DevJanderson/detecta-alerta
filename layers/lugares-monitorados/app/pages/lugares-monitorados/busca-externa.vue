<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Busca Externa - Detecta Alerta',
  description: 'Busque e importe unidades de saúde a partir de fontes externas.'
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 py-10">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-base-900">Busca Externa</h1>
        <p class="mt-1 text-sm text-base-500">Importe unidades de fontes externas</p>
      </div>
      <NuxtLink
        to="/lugares-monitorados"
        class="inline-flex items-center gap-1.5 rounded-full border border-base-200 px-4 py-2 text-sm font-medium text-secondary-900 transition-colors hover:bg-base-50"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
        Voltar ao mapa
      </NuxtLink>
    </div>
    <CommonPlaceholderBox
      icon="lucide:search"
      label="Busca externa"
      sublabel="(em desenvolvimento)"
      class="h-96"
    />
  </div>
</template>
