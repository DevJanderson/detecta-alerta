<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Relatório 45 - Detecta Alerta',
  description: 'Relatório epidemiológico semanal com dados consolidados de vigilância em saúde.'
})

// --- Mock data (será substituído por dados da API) ---
const report = {
  number: 45,
  dateRange: '9 a 15 nov. 2025',
  epiWeek: 45,
  region: 'Todo o Brasil',
  diseases: 'Todas as doenças',
  title: 'Dengue avança 32% na Região Sul e mostra queda no Norte',
  subtitle:
    'Durante o período de 9 a 15 de novembro houve picos epidêmicos de dengue em diversas regiões, com destaque para o avanço na Região Sul.'
}

const activeTab = ref<'boletim' | 'tecnico'>('boletim')

const diagnosisRegions: {
  name: string
  severity: string
  percent: string
  direction: 'up' | 'down'
  color: 'secondary' | 'alert' | 'danger'
}[] = [
  { name: 'Norte', severity: 'Normal', percent: '4%', direction: 'down', color: 'secondary' },
  { name: 'Nordeste', severity: 'Moderado', percent: '7%', direction: 'up', color: 'alert' },
  {
    name: 'Centro-Oeste',
    severity: 'Normal',
    percent: '12%',
    direction: 'down',
    color: 'secondary'
  },
  { name: 'Sudeste', severity: 'Normal', percent: '4%', direction: 'down', color: 'secondary' },
  { name: 'Sul', severity: 'Elevado', percent: '421%', direction: 'up', color: 'danger' }
]

const reportSources = [
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' },
  { name: 'Nome de uma notícia', portal: 'Portal de Notícias', year: '2026' }
]

const trendingRumors = [
  {
    title: 'Surto de Zika em Camaçari',
    description:
      'Casos de Zika disparam em Camaçari, Bahia, com aumento de 150% em relação ao ano anterior.',
    highlight: 'Virou assunto!',
    highlightExtra: '4 novos rumores',
    tag: 'ZIKA',
    time: 'Há 2 horas'
  },
  {
    title: 'Alerta de Chikungunya em Aracaju',
    description:
      'Aracaju, Sergipe, enfrenta um aumento preocupante nos casos de Chikungunya, com hospitais sobrecarregados.',
    tag: 'ZIKA',
    time: 'Há 2 horas'
  },
  {
    title: 'Crescimento da Coqueluche em Teresina',
    description:
      'Teresina, Piauí, registra um aumento de casos de Coqueluche, especialmente entre crianças menores de 1 ano.',
    tag: 'COQUELUCHE',
    time: 'Há 1 hora'
  },
  {
    title: 'Surto de Sarampo em São Luís',
    description:
      'São Luís, Maranhão, declara estado de emergência devido a um surto de Sarampo, com alta taxa de contágio.',
    tag: 'SARAMPO',
    time: 'Há 5 horas'
  },
  {
    title: 'Leptospirose atinge Salvador',
    description:
      'Salvador, Bahia, enfrenta surto de Leptospirose após fortes chuvas, com chance de contaminação elevada.',
    tag: 'LEPTOSPIROSE',
    time: 'Há 5 horas'
  },
  {
    title: 'Aumento da Dengue em Fortaleza',
    description:
      'Fortaleza, Ceará, registra um aumento significativo nos casos de Dengue, com hospitais em alerta máximo.',
    tag: 'DENGUE',
    time: 'Há 5 horas'
  }
]
</script>

<template>
  <div class="flex flex-col">
    <RelatoriosTitleBar
      :number="report.number"
      :region="report.region"
      :diseases="report.diseases"
    />

    <RelatoriosOptionsBar :epi-week="report.epiWeek" :date-range="report.dateRange" />

    <RelatoriosHero v-model="activeTab" :title="report.title" :subtitle="report.subtitle" />

    <RelatoriosResumo />

    <RelatoriosDiagnosisBar :regions="diagnosisRegions" />

    <!-- Artigo -->
    <article class="flex flex-col items-center px-4 pb-16 pt-10 sm:px-6 sm:pb-32 sm:pt-16">
      <RelatoriosArticleSection
        section-label="Resumo Técnico"
        section-title="Movimento elevado em estabelecimentos de saúde de todo o Brasil"
        chart-title="Lotação Semanal vs. Média Histórica"
        chart-subtitle="Confira quando a lotação está acima da média histórica."
      />

      <RelatoriosArticleSection
        section-label="Resumo Técnico"
        section-title="Movimento elevado em estabelecimentos de saúde de todo o Brasil"
        chart-title="Lotação Semanal vs. Média Histórica"
        chart-subtitle="Confira quando a lotação está acima da média histórica."
      />
    </article>

    <RelatoriosDestaque />

    <RelatoriosRumoresEFontes :sources="reportSources" :rumors="trendingRumors" />

    <RelatoriosCreditos />
  </div>
</template>
