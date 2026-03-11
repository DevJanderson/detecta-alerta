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

const tableHeaders = [
  { label: 'notícia', flex: true },
  { label: 'doenças relacionadas', width: 'w-54' },
  { label: 'sintomas', width: 'w-54' },
  { label: 'região', width: 'w-54' },
  { label: 'relevância', width: 'w-30' }
]

const rows = [
  {
    title: 'Aumento de casos de dengue preocupa',
    description:
      'Especialistas alertam para o aumento de casos de dengue e a importância da prevenção.',
    highlightLabel: 'Bombou!',
    highlightCount: '17 novos rumores',
    diseases: ['dengue'],
    symptoms: ['febre alta', 'confusão', 'falta de ar', 'olhos vermelhos'],
    regions: ['Brasil'],
    relevance: 'alta' as const,
    timeAgo: 'Há 4 horas',
    sourceName: 'UOL, United Health e mais 3 fontes'
  },
  {
    title: 'Dengue avança em 5 cidades no Pernambuco e Rio Grande do Norte',
    description:
      'Confira os números da dengue divulgados no último Boletim do Ministério da Saúde.',
    highlightLabel: 'Virou assunto!',
    highlightCount: '3 novos rumores',
    diseases: ['dengue', 'zika'],
    symptoms: ['febre alta', 'dor de cabeça', 'manchas vermelhas'],
    regions: ['Nordeste'],
    relevance: 'alta' as const,
    timeAgo: 'Há 5 horas',
    sourceName: 'G1, Folha de PE'
  },
  {
    title: 'Níveis de Sarampo caem pela sexta semana seguida',
    description:
      'MPPE e Governo do Estado lançam selo para certificar municípios com melhor cobertura vacinal.',
    highlightLabel: 'Crescendo!',
    highlightCount: '2 novos rumores',
    diseases: ['sarampo'],
    symptoms: ['febre', 'tosse', 'erupção cutânea'],
    regions: ['Nordeste'],
    relevance: 'média' as const,
    timeAgo: 'Há 6 horas',
    sourceName: 'Folha de PE'
  },
  {
    title: 'Meningite atinge novo recorde entre o público infantil',
    description: 'Mortes de crianças por meningite acendem alerta em cidades no Sul da Paraíba.',
    diseases: ['meningite'],
    symptoms: ['febre', 'dor de cabeça', 'rigidez na nuca'],
    regions: ['Nordeste', 'Sudeste'],
    relevance: 'alta' as const,
    timeAgo: 'Há 7 horas',
    sourceName: 'G1 Paraíba'
  },
  {
    title: 'Gripe aviária H5N1 se espalha pelo interior',
    description: 'Novos casos de gripe aviária são registrados em aves silvestres e de criação.',
    diseases: ['H5N1'],
    symptoms: ['febre alta', 'tosse', 'dificuldade respiratória'],
    regions: ['Sul'],
    relevance: 'média' as const,
    timeAgo: 'Há 8 horas',
    sourceName: 'Reuters, BBC Brasil'
  },
  {
    title: 'Surto de Zika em Olinda preocupa gestantes',
    description: 'Transmissão do Zika vírus aumenta em Olinda, Pernambuco.',
    highlightLabel: 'Crescendo!',
    highlightCount: '2 novos rumores',
    diseases: ['zika'],
    symptoms: ['febre baixa', 'erupções cutâneas', 'dor nas articulações'],
    regions: ['Nordeste'],
    relevance: 'média' as const,
    timeAgo: 'Há 9 horas',
    sourceName: 'Diário de PE'
  },
  {
    title: 'Alerta de Chikungunya em Aracaju',
    description: 'Aracaju, Sergipe, enfrenta aumento preocupante nos casos de Chikungunya.',
    diseases: ['chikungunya'],
    symptoms: ['febre', 'dor articular', 'inchaço'],
    regions: ['Nordeste'],
    relevance: 'baixa' as const,
    timeAgo: 'Há 11 horas',
    sourceName: 'Infonet Sergipe'
  },
  {
    title: 'Crescimento da Coqueluche em Teresina',
    description:
      'Teresina, Piauí, registra aumento de casos de Coqueluche entre crianças menores de 1 ano.',
    diseases: ['coqueluche'],
    symptoms: ['tosse intensa', 'falta de ar', 'vômitos'],
    regions: ['Nordeste'],
    relevance: 'baixa' as const,
    timeAgo: 'Há 12 horas',
    sourceName: 'Cidade Verde'
  }
]
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Busca e filtros -->
    <div class="flex flex-col gap-4">
      <!-- Linha de busca + dropdowns -->
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <!-- Search -->
        <div
          class="flex flex-1 items-center gap-3 rounded-full border border-base-100 bg-white px-4 py-3 sm:px-6 sm:py-3.5"
        >
          <Icon name="lucide:search" class="size-5 text-base-400" />
          <span class="text-sm text-secondary-400 sm:text-base"
            >Busque por notícia ou município...</span
          >
        </div>

        <!-- Dropdown: Relevância -->
        <button
          class="flex w-full items-center gap-2 rounded-full border border-base-100 bg-white px-4 py-3 sm:w-60 sm:py-3.5"
        >
          <span class="flex-1 text-left text-sm text-base-950 sm:text-base"
            >Qualquer relevância</span
          >
          <Icon name="lucide:chevron-down" class="size-5 text-base-400" />
        </button>

        <!-- Dropdown: Sintomas -->
        <button
          class="flex w-full items-center gap-2 rounded-full border border-base-100 bg-white px-4 py-3 sm:w-70 sm:py-3.5"
        >
          <Icon name="lucide:cross" class="size-5 text-secondary-500" />
          <span class="flex-1 text-left text-sm text-base-950 sm:text-base">Todos os sintomas</span>
          <Icon name="lucide:chevron-down" class="size-5 text-base-400" />
        </button>

        <!-- Dropdown: Localização -->
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

    <!-- Tabela -->
    <div class="flex flex-col overflow-x-auto">
      <!-- Header -->
      <div class="flex min-w-[800px] items-center gap-10 rounded-t-md bg-secondary-50 px-2 py-3">
        <div
          v-for="header in tableHeaders"
          :key="header.label"
          class="flex items-center gap-2"
          :class="header.flex ? 'flex-1' : header.width"
        >
          <span class="text-sm text-secondary-600">{{ header.label }}</span>
          <span
            v-if="header.label !== 'notícia'"
            class="flex size-4 items-center justify-center rounded-full bg-secondary-200/60 text-xs font-semibold text-secondary-600"
          >
            ?
          </span>
        </div>
      </div>

      <!-- Rows -->
      <RumoresListRow v-for="row in rows" :key="row.title" v-bind="row" />
    </div>

    <!-- Carregar mais -->
    <div class="flex justify-center pt-4">
      <button
        class="flex items-center gap-2 rounded-full border border-secondary-200 px-6 py-3 text-sm font-semibold text-secondary-900 transition-colors hover:bg-secondary-50"
      >
        <Icon name="lucide:chevron-down" class="size-4" />
        carregar mais rumores
      </button>
    </div>
  </div>
</template>
