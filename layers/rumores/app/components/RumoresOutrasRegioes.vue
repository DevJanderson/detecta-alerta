<script setup lang="ts">
// --- Mock data (será substituído por dados da API) ---
const featuredCards = [
  {
    title: 'Aumento de casos de dengue preocupa',
    description:
      'Especialistas alertam para o aumento de casos de dengue e a importância da prevenção',
    highlightLabel: 'Bombou!',
    highlightCount: '17 novos rumores',
    symptoms: 'febre alta, confusão, falta de ar e mais 3',
    diseaseTag: 'DENGUE',
    timeAgo: 'Há 4 horas'
  },
  {
    title: 'Gripe aviária H5N1 se espalha pelo interior',
    description: 'Novos casos de gripe aviária são registrados em aves silvestres e de criação.',
    symptoms: 'febre alta, confusão, falta de ar e mais 3',
    diseaseTag: 'H5N1',
    timeAgo: 'Há 4 horas'
  },
  {
    title: 'Surto de Zika em Olinda',
    description: 'Transmissão do Zika vírus aumenta em Olinda, Pernambuco.',
    highlightLabel: 'Crescendo!',
    highlightCount: '2 novos rumores',
    symptoms: 'febre baixa, erupções cutâneas, dor nas articulações e mais 3',
    diseaseTag: 'ZIKA',
    timeAgo: 'Há 4 horas'
  }
]

const subRegions = ['Norte', 'Centro-Oeste', 'Sudeste', 'Sul']
</script>

<template>
  <section class="flex flex-col gap-6">
    <!-- Título da seção -->
    <div class="flex items-center gap-6 pl-6">
      <svg class="size-4 text-primary-950" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0L16 8L8 16L0 8Z" />
      </svg>
      <h2 class="text-[28px] font-semibold leading-tight text-secondary-900">Outras Regiões</h2>
    </div>

    <!-- Cards destaque (top row) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RumoresCardFeatured v-for="card in featuredCards" :key="card.title" v-bind="card" />
    </div>

    <!-- Sub-seções por região -->
    <div class="flex flex-col gap-10 pt-4">
      <RumoresSubSection v-for="region in subRegions" :key="region" :region="region" />
    </div>
  </section>
</template>
