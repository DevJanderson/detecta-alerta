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
    <div v-if="activeView === 'galeria'" class="flex flex-col gap-16 px-6 pt-20 pb-20 lg:px-40">
      <RumoresSection region="Região Nordeste" />
      <RumoresOutrasRegioes />
      <RumoresSection region="Outros países" />
    </div>

    <!-- Feed (coluna única cronológica) -->
    <div v-else-if="activeView === 'feed'" class="px-6 pt-20 pb-20 lg:px-40">
      <RumoresFeed />
    </div>

    <!-- Lista (tabela com filtros) -->
    <div v-else-if="activeView === 'lista'" class="px-6 pt-20 pb-20 lg:px-40">
      <RumoresList />
    </div>
  </div>
</template>
