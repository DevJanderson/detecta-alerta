<script setup lang="ts">
// --- Mock data (será substituído por dados da API) ---
const diseaseChips = [
  { label: 'dengue', active: true },
  { label: 'leptospirose', active: false },
  { label: 'chikungunya', active: false },
  { label: 'zika', active: false },
  { label: 'sarampo', active: false },
  { label: 'coqueluche', active: false },
  { label: 'tosse convulsa', active: false },
  { label: 'influenza', active: false },
  { label: 'gripe', active: false },
  { label: 'meningite', active: false }
]

const feedItems = [
  {
    title: 'Dengue avança em 5 cidades no Pernambuco e Rio Grande do Norte',
    description:
      'Primeiras 5 linhas da notícia. Confira os números da dengue divulgados no último Boletim do Ministério da saúde. As cidades de Recife, Olinda, Jaboatão dos Guararapes, Natal e Mossoró registraram aumento significativo nos casos nas últimas duas semanas. A situação preocupa autoridades sanitárias locais que pedem reforço nas ações de combate ao mosquito.',
    diseaseTag: 'DENGUE e +3',
    symptoms: 'febre alta, confusão, falta de ar e mais 3',
    timeAgo: 'Há 4 horas',
    sourceName: 'UOL, United Health e mais 3 fontes'
  },
  {
    title: 'Níveis de Sarampo caem pela sexta semana seguida',
    description:
      'Primeiras 5 linhas da notícia. MPPE e Governo do Estado lançam selo para certificar municípios com melhor cobertura vacinal de bebês e de adolescentes. A iniciativa busca incentivar a vacinação e reduzir os índices de sarampo na região. Os resultados mostram uma tendência positiva que pode ser consolidada com a manutenção das campanhas.',
    diseaseTag: 'SARAMPO',
    symptoms: 'sintoma, sintoma, sintoma e mais 3',
    timeAgo: 'Há 5 horas',
    sourceName: 'UOL, United Health e mais 3 fontes'
  },
  {
    title: 'Meningite atinge novo record entre o público infantil',
    description:
      'Primeiras 5 linhas da notícia. Mortes de crianças por meningite acendem alerta em cidades no Sul da Paraíba. Autoridades sanitárias pedem atenção redobrada dos pais e responsáveis para os sinais da doença. Hospitais da região registram aumento de internações e buscam reforço de equipes para atender a demanda crescente.',
    diseaseTag: 'MENINGITE',
    symptoms: 'sintoma, confusão, sintoma e mais 3',
    timeAgo: 'Há 6 horas',
    sourceName: 'UOL, United Health e mais 3 fontes'
  }
]
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- Busca e filtros -->
    <div class="flex flex-col gap-4">
      <!-- Linha de busca + dropdowns -->
      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div
          class="flex flex-1 items-center gap-3 rounded-full border border-base-100 bg-white px-4 py-3 sm:px-6 sm:py-3.5"
        >
          <Icon name="lucide:search" class="size-5 text-base-400" />
          <span class="text-sm text-secondary-400 sm:text-base"
            >Busque por notícia ou município...</span
          >
        </div>

        <button
          class="flex w-full items-center gap-2 rounded-full border border-base-100 bg-white px-4 py-3 sm:w-70 sm:py-3.5"
        >
          <Icon name="lucide:cross" class="size-5 text-secondary-500" />
          <span class="flex-1 text-left text-sm text-base-950 sm:text-base">Todos os sintomas</span>
          <Icon name="lucide:chevron-down" class="size-5 text-base-400" />
        </button>

        <button
          class="flex w-full items-center gap-2 rounded-full border border-base-100 bg-white px-4 py-3 sm:w-70 sm:py-3.5"
        >
          <Icon name="lucide:map-pin" class="size-5 text-secondary-500" />
          <span class="flex-1 text-left text-sm text-base-950 sm:text-base">Todo o Brasil</span>
          <Icon name="lucide:chevron-down" class="size-5 text-base-400" />
        </button>
      </div>

      <!-- Quick filter chips -->
      <div class="flex flex-wrap items-center gap-2 sm:px-6">
        <span class="text-xs font-semibold text-base-600">Filtrar por:</span>
        <button
          v-for="chip in diseaseChips"
          :key="chip.label"
          class="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-secondary-600 transition-colors"
          :class="chip.active ? 'bg-secondary-200' : 'bg-secondary-50 hover:bg-secondary-100'"
        >
          {{ chip.label }}
          <span v-if="chip.active" class="border-l border-secondary-300 pl-2">
            <Icon name="lucide:x" class="size-3.5" />
          </span>
        </button>
      </div>
    </div>

    <!-- Container de notícias (fundo azul claro) -->
    <div
      class="flex flex-col items-center gap-6 rounded-2xl bg-secondary-50 px-4 py-10 sm:px-6 sm:py-20"
    >
      <!-- Título da seção -->
      <div class="flex w-full max-w-264.5 items-center gap-3 sm:gap-6 sm:pl-6">
        <svg class="size-3 text-primary-950 sm:size-4" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0L16 8L8 16L0 8Z" />
        </svg>
        <h2 class="text-xl font-semibold leading-tight text-secondary-600 sm:text-[28px]">
          As mais Recentes do Nordeste
        </h2>
      </div>

      <!-- Cards do feed -->
      <div class="flex w-full max-w-264.5 flex-col gap-6">
        <RumoresFeedCard v-for="item in feedItems" :key="item.title" v-bind="item" />
      </div>

      <!-- Carregar mais -->
      <div class="pt-6">
        <button
          class="flex items-center gap-2 rounded-full border border-primary-300 px-4 py-2.5 text-base font-semibold text-secondary-600 transition-colors hover:bg-white sm:px-6 sm:py-3.5 sm:text-xl"
        >
          <Icon name="lucide:plus" class="size-6" />
          carregar mais notícias
        </button>
      </div>
    </div>
  </div>
</template>
