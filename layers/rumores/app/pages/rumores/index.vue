<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Rumores Epidemiológicos - Detecta Alerta',
  description:
    'Acompanhe rumores e notícias epidemiológicas do Brasil em tempo real. Monitore surtos, tendências e alertas de saúde pública.'
})

const activeView = ref('galeria')
</script>

<template>
  <div>
    <RumoresHero v-model="activeView" />

    <!-- Galeria (cards por região) -->
    <div
      v-if="activeView === 'galeria'"
      class="flex flex-col gap-10 px-4 pb-16 pt-14 sm:gap-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-40"
    >
      <RumoresSection region="Região Nordeste" />
      <RumoresOutrasRegioes />
      <RumoresSection region="Outros países" />
    </div>

    <!-- Feed (coluna única cronológica) -->
    <div
      v-else-if="activeView === 'feed'"
      class="px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-40"
    >
      <RumoresFeed />
    </div>

    <!-- Lista (tabela com filtros) -->
    <div
      v-else-if="activeView === 'lista'"
      class="px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 lg:px-40"
    >
      <RumoresList />
    </div>
  </div>
</template>
