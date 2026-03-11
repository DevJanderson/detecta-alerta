<script setup lang="ts">
defineProps<{
  region: string
}>()

// --- Mock data (será substituído por dados da API) ---
const featuredCards = [
  {
    title: 'Dengue avança em 5 cidades no Pernambuco e Rio Grande do Norte',
    description:
      'Confira os números da dengue divulgados no último Boletim do Ministério da saúde.',

    highlightLabel: 'Virou assunto!',
    highlightCount: '3 novos rumores',
    symptoms: 'febre alta, confusão, falta de ar e mais 3',
    diseaseTag: 'DENGUE e +3',
    timeAgo: 'Há 4 horas'
  },
  {
    title: 'Níveis de Sarampo caem pela sexta semana seguida',
    description:
      'MPPE e Governo do Estado lançam selo para certificar municípios com melhor cobertura vacinal de bebês e de adolescentes.',

    highlightLabel: 'Crescendo!',
    highlightCount: '2 novos rumores',
    symptoms: 'sintoma, sintoma, sintoma e mais 3',
    diseaseTag: 'SARAMPO',
    timeAgo: 'Há 4 horas'
  },
  {
    title: 'Meningite atinge novo record entre o público infantil',
    description: 'Mortes de crianças por meningite acendem alerta em cidades no Sul da Paraíba.',
    symptoms: 'febre, dor de cabeça, rigidez na nuca e mais 3',
    diseaseTag: 'MENINGITE',
    timeAgo: 'Há 4 horas'
  }
]

const smallCards = [
  {
    title: 'Surto de Zika em Camaçari',
    description:
      'Casos de Zika disparam em Camaçari, Bahia, com aumento de 150% em relação ao ano anterior.',
    highlightLabel: 'Virou assunto!',
    highlightCount: '4 novos rumores',
    diseaseTag: 'ZIKA',
    timeAgo: 'Há 2 horas'
  },
  {
    title: 'Alerta de Chikungunya em Aracaju',
    description:
      'Aracaju, Sergipe, enfrenta um aumento preocupante nos casos de Chikungunya, com hospitais sobrecarregados.',
    diseaseTag: 'ZIKA',
    timeAgo: 'Há 2 horas'
  },
  {
    title: 'Crescimento da Coqueluche em Teresina',
    description:
      'Teresina, Piauí, registra um aumento de casos de Coqueluche, especialmente entre crianças menores de 1 ano.',
    diseaseTag: 'COQUELUCHE',
    timeAgo: 'Há 1 hora'
  },
  {
    title: 'Surto de Sarampo em São Luís',
    description:
      'São Luís, Maranhão, declara estado de emergência devido a um surto de Sarampo, com alta taxa de contágio.',
    diseaseTag: 'SARAMPO',
    timeAgo: 'Há 5 horas'
  },
  {
    title: 'Leptospirose atinge Salvador',
    description:
      'Salvador, Bahia, enfrenta surto de Leptospirose após fortes chuvas, com chances de contaminação elevado.',
    diseaseTag: 'LEPTOSPIROSE',
    timeAgo: 'Há 5 horas'
  },
  {
    title: 'Aumento da Dengue em Fortaleza',
    description:
      'Fortaleza, Ceará, registra um aumento significativo nos casos de Dengue, com hospitais em alerta máximo.',
    diseaseTag: 'DENGUE',
    timeAgo: 'Há 5 horas'
  }
]
</script>

<template>
  <section class="flex flex-col gap-6">
    <!-- Título da região -->
    <div class="flex items-center gap-3 sm:gap-6 sm:pl-6">
      <!-- Ícone decorativo (losango vermelho) -->
      <svg class="size-3 text-primary-950 sm:size-4" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0L16 8L8 16L0 8Z" />
      </svg>
      <h2 class="text-xl font-semibold leading-tight text-secondary-900 sm:text-[28px]">
        {{ region }}
      </h2>
    </div>

    <!-- Cards destaque (top row) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RumoresCardFeatured v-for="card in featuredCards" :key="card.title" v-bind="card" />
    </div>

    <!-- Cards menores (bottom rows) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <RumoresCardSmall v-for="card in smallCards" :key="card.title" v-bind="card" />
    </div>
  </section>
</template>
