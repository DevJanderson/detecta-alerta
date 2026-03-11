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

const diagnosisRegions = [
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
] as const

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
    <!-- Title bar -->
    <div class="z-20 flex items-center gap-6 bg-tertiary-300 px-40 py-3">
      <!-- Esquerda: voltar + título + compartilhar/imprimir -->
      <div class="flex min-h-px min-w-px flex-1 items-center gap-4">
        <NuxtLink
          to="/relatorios"
          class="flex size-10 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-tertiary-400"
          aria-label="Voltar para relatórios"
        >
          <Icon name="lucide:arrow-left" class="size-4" />
        </NuxtLink>

        <h1 class="whitespace-nowrap text-[28px] font-semibold leading-tight text-base-950">
          Relatório {{ report.number }}
        </h1>

        <div class="flex items-center gap-2">
          <button
            class="flex size-12 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-tertiary-400"
            aria-label="Compartilhar"
          >
            <Icon name="lucide:share-2" class="size-5" />
          </button>
          <button
            class="flex size-12 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-tertiary-400"
            aria-label="Imprimir"
          >
            <Icon name="lucide:printer" class="size-5" />
          </button>
        </div>
      </div>

      <!-- Centro: região e doenças -->
      <p class="shrink-0 text-base font-semibold text-base-950">
        {{ report.region }} &bull; {{ report.diseases }}
      </p>

      <!-- Direita: baixar + receber por e-mail -->
      <div class="flex min-h-px min-w-px flex-1 items-center justify-end gap-2">
        <button
          class="flex h-12 items-center gap-2 rounded-full px-5 font-semibold transition-colors hover:bg-tertiary-400"
        >
          <Icon name="lucide:arrow-down" class="size-5 text-primary-600" />
          <span class="text-secondary-600">baixar</span>
        </button>
        <button
          class="flex h-12 items-center gap-2 rounded-full border border-primary-500 px-5 font-semibold transition-colors hover:bg-tertiary-400"
        >
          <Icon name="lucide:at-sign" class="size-5 text-primary-600" />
          <span class="text-secondary-600">receber por e-mail</span>
        </button>
      </div>
    </div>

    <!-- Options bar -->
    <div class="z-10 flex items-center gap-6 border-b border-base-100 bg-tertiary-100 px-40 py-4">
      <!-- Dropdown semana epidemiológica -->
      <div class="flex-1">
        <button
          class="flex h-10 items-center gap-1 rounded-full border border-base-100 bg-base-0 px-4"
        >
          <Icon name="lucide:calendar-days" class="size-4 text-primary-900" />
          <span class="pl-1">
            <span class="text-sm text-base-950">Semana Epidemiológica {{ report.epiWeek }}</span>
            <span class="text-xs text-base-950"> ({{ report.dateRange }})</span>
          </span>
          <Icon name="lucide:chevron-down" class="size-4 text-base-400" />
        </button>
      </div>

      <!-- Busca de município -->
      <button
        class="flex h-10 w-113 items-center gap-3 overflow-hidden rounded-full border border-base-100 bg-base-0 px-5 py-2"
      >
        <Icon name="lucide:search" class="size-4 shrink-0 text-primary-900" />
        <div class="flex items-baseline gap-2">
          <span class="text-sm font-semibold text-base-600">meu município:</span>
          <span class="text-sm text-secondary-700">Digite um município...</span>
        </div>
      </button>

      <!-- Editar relatório -->
      <div class="flex flex-1 justify-end">
        <button
          class="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-secondary-600 transition-colors hover:bg-tertiary-200"
        >
          editar relatório da equipe
          <Icon name="lucide:pencil" class="size-4 text-primary-900" />
        </button>
      </div>
    </div>

    <!-- Hero -->
    <section class="relative bg-tertiary-100 pb-64 pt-24 lg:pb-80">
      <!-- Conteúdo -->
      <div class="relative z-10 flex flex-col items-center gap-12 px-6 lg:px-40">
        <!-- Content switcher -->
        <div
          class="relative flex h-14 w-197 items-center gap-2 rounded-full border border-secondary-200 bg-white p-1"
        >
          <!-- Pill de fundo animada -->
          <div
            class="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-secondary-900 transition-transform duration-300"
            :class="activeTab === 'tecnico' ? 'translate-x-full' : 'translate-x-0'"
          />
          <button
            class="relative z-10 flex flex-1 items-center justify-center gap-2 self-stretch rounded-full px-6"
            @click="activeTab = 'boletim'"
          >
            <Icon
              name="lucide:heart"
              class="size-4"
              :class="activeTab === 'boletim' ? 'text-white' : 'text-primary-600'"
            />
            <span
              class="text-base"
              :class="activeTab === 'boletim' ? 'font-semibold text-white' : 'text-secondary-700'"
            >
              boletim 5 minutos
            </span>
          </button>
          <button
            class="relative z-10 flex flex-1 items-center justify-center gap-2 self-stretch rounded-full px-6"
            @click="activeTab = 'tecnico'"
          >
            <Icon
              name="lucide:clipboard-plus"
              class="size-4"
              :class="activeTab === 'tecnico' ? 'text-white' : 'text-primary-600'"
            />
            <span
              class="text-base"
              :class="activeTab === 'tecnico' ? 'font-semibold text-white' : 'text-secondary-700'"
            >
              relatório técnico
            </span>
          </button>
        </div>

        <!-- Título e subtítulo -->
        <div class="flex max-w-264 flex-col items-center gap-6 text-center">
          <h2 class="text-6xl font-bold leading-tight text-primary-950">
            {{ report.title }}
          </h2>
          <p class="text-xl leading-relaxed text-secondary-900">
            {{ report.subtitle }}
          </p>
        </div>
      </div>

      <!-- Círculos decorativos — metade dentro, metade fora -->
      <div class="absolute bottom-0 left-1/2 z-0 -translate-x-1/2 translate-y-1/2">
        <div class="relative size-125">
          <!-- Círculo externo (tertiary) -->
          <div class="absolute inset-0 rounded-full bg-tertiary-300" />
          <!-- Círculo médio (primary-700) -->
          <div class="absolute inset-[18%] rounded-full bg-primary-700" />
          <!-- Círculo interno (primary-900) -->
          <div class="absolute inset-[36%] rounded-full bg-primary-900" />
        </div>
      </div>

      <!-- Imagem do mosquito — separada para ficar na frente -->
      <div class="absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2">
        <div class="relative flex size-125 items-center justify-center">
          <NuxtImg
            src="/img/relatorio-mosquito.png"
            class="h-auto w-[85%] object-contain drop-shadow-lg"
            alt="Ilustração de mosquito Aedes aegypti"
            loading="eager"
          />
        </div>
      </div>
    </section>

    <!-- Resumo -->
    <div
      class="relative z-10 flex items-center justify-between border-b border-secondary-200 bg-secondary-100 px-40 py-20"
    >
      <!-- Coluna esquerda -->
      <div class="flex flex-col items-start gap-6">
        <div class="flex flex-col items-start gap-3">
          <h3 class="text-4xl font-semibold leading-normal text-secondary-900">
            Movimento Elevado
          </h3>
          <p class="text-base text-base-950">
            Movimento em estabelecimentos<br />
            de saúde maior que a semana anterior.
          </p>
        </div>
        <div class="flex h-10 items-center gap-2 rounded-full bg-alert-900 px-5">
          <Icon name="lucide:arrow-up" class="size-5 text-base-950" />
          <span class="text-base font-semibold text-base-950">23% mais elevado que o normal</span>
        </div>
      </div>

      <!-- Coluna direita -->
      <div class="flex flex-col items-start gap-4">
        <p class="w-111 text-base leading-normal text-secondary-900">
          Dados de movimento indicam semana com aumento de 23% em estabelecimentos de saúde nas
          regiões Nordeste e Sul. Rumores indicam maior número de
          <a href="#" class="underline">notícias sobre Dengue no Nordeste</a>
          e
          <a href="#" class="underline">Influenza A na Região Sul</a>.
        </p>
        <div class="flex items-center gap-3 text-xs">
          <p class="text-base-800">
            <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>,
            2026.
          </p>
          <div class="h-3 w-px bg-base-300" />
          <div class="flex items-center gap-1.5">
            <Icon name="lucide:lock" class="size-2.5 text-success-900" />
            <span class="text-success-900">Padrão de confiança ITpS</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Barra de diagnóstico regional -->
    <div
      class="relative z-10 flex items-center justify-between border-b border-base-100 bg-base-0 px-40 py-3"
    >
      <!-- Título -->
      <div class="flex items-baseline gap-2 text-xs">
        <span class="font-semibold text-base-950">Movimento em estabelecimentos de saúde</span>
        <span class="text-base-400">(comparado à semana anterior)</span>
      </div>

      <!-- Indicadores regionais -->
      <div class="flex items-start gap-4">
        <div
          v-for="region in diagnosisRegions"
          :key="region.name"
          class="flex items-baseline gap-1 text-xs"
        >
          <span class="text-base-950">{{ region.name }}:</span>
          <span
            class="font-semibold"
            :class="{
              'text-secondary-600': region.color === 'secondary',
              'text-alert-900': region.color === 'alert',
              'text-danger-600': region.color === 'danger'
            }"
          >
            {{ region.severity }}
          </span>
          <span
            :class="{
              'text-secondary-600': region.color === 'secondary',
              'text-alert-900': region.color === 'alert',
              'text-danger-600': region.color === 'danger'
            }"
          >
            &bull; {{ region.percent }}
          </span>
          <Icon
            :name="region.direction === 'up' ? 'lucide:arrow-up' : 'lucide:arrow-down'"
            class="size-3"
            :class="{
              'text-secondary-600': region.color === 'secondary',
              'text-alert-900': region.color === 'alert',
              'text-danger-600': region.color === 'danger'
            }"
          />
        </div>
      </div>
    </div>

    <!-- Artigo: Resumo Técnico -->
    <article class="flex flex-col items-center pb-32 pt-16">
      <!-- Seção 1: Resumo Técnico -->
      <section class="flex w-264 flex-col gap-16">
        <!-- Título + texto -->
        <div class="flex flex-col gap-8">
          <!-- Título -->
          <div class="flex flex-col gap-3">
            <p class="text-base font-semibold leading-tight text-secondary-600">Resumo Técnico</p>
            <h3 class="text-4xl font-semibold leading-snug text-base-950">
              Movimento elevado em estabelecimentos<br />
              de saúde de todo o Brasil
            </h3>
          </div>

          <!-- Texto descritivo -->
          <div class="pr-32 text-xl leading-[1.7] text-secondary-600">
            <p class="mb-6">
              Dados sobre movimento em estabelecimentos de saúde indicam tendência de crescimento no
              movimento no Nordeste e Sul nesta semana. O movimento atípico nas farmácias do
              Nordeste chama a atenção. Rumores indicam
              <a href="#" class="text-danger-600 underline"
                >aumento no número de notícias sobre Dengue no Nordeste</a
              >.
            </p>
            <p>
              Em contrapartida,
              <a href="#" class="text-danger-600 underline"
                >a região Centro-Oeste demonstra estabilidade</a
              ><sup class="text-[13px] text-danger-600">(1)</sup>, enquanto o Sudeste apresenta
              ligeira melhora nos indicadores de movimento de saúde, conforme
              <a href="#" class="text-danger-600 underline">dados da Fundação Vidas</a
              ><sup class="text-[13px] text-danger-600">(2)</sup>.
            </p>
          </div>
        </div>

        <!-- Gráfico -->
        <div class="flex flex-col gap-4 self-center">
          <!-- Chart box -->
          <div class="flex w-332 flex-col gap-3 rounded-xl bg-secondary-50 px-4 pb-4 pt-5">
            <!-- Chart header -->
            <div class="flex w-264 items-center justify-between self-center px-6 py-2">
              <div class="flex flex-col gap-2">
                <h4 class="text-xl font-semibold leading-tight text-base-950">
                  Lotação Semanal vs. Média Histórica
                </h4>
                <p class="text-sm text-base-950">
                  Confira quando a lotação está acima da média histórica.
                </p>
              </div>
              <button
                class="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-secondary-600"
              >
                como é feito o cálculo
                <Icon name="lucide:circle-help" class="size-4" />
              </button>
            </div>

            <!-- Chart content -->
            <div class="flex flex-col gap-4 rounded-xl border border-secondary-100 bg-white p-6">
              <!-- Content switcher -->
              <div
                class="flex h-12 items-center rounded-full border border-secondary-100 bg-white p-1"
              >
                <div
                  class="flex flex-1 items-center justify-center gap-2 self-stretch rounded-full bg-secondary-600 px-6"
                >
                  <Icon name="lucide:chart-line" class="size-4 text-white" />
                  <span class="text-sm font-semibold text-white">gráfico de linha</span>
                </div>
                <button
                  class="flex flex-1 items-center justify-center gap-2 self-stretch rounded-full px-6"
                >
                  <Icon name="lucide:chart-no-axes-gantt" class="size-4 text-secondary-400" />
                  <span class="text-sm text-secondary-400">gráfico de faixa</span>
                </button>
                <button
                  class="flex flex-1 items-center justify-center gap-2 self-stretch rounded-full px-6"
                >
                  <Icon name="lucide:user" class="size-4 text-secondary-400" />
                  <span class="text-sm text-secondary-400">tabela</span>
                </button>
              </div>

              <!-- Options: checkboxes + filter chips -->
              <div class="flex h-10 items-center justify-between px-6">
                <div class="flex items-center gap-5">
                  <!-- Checkbox média (selected) -->
                  <label class="flex cursor-pointer items-center gap-2">
                    <div
                      class="flex size-6 items-center justify-center rounded-sm bg-secondary-950"
                    >
                      <Icon name="lucide:check" class="size-4 text-white" />
                    </div>
                    <span class="text-base text-secondary-600">média</span>
                    <span class="inline-block w-5 border-t-2 border-dashed border-secondary-600" />
                  </label>
                  <!-- Checkbox variação (unchecked) -->
                  <label class="flex cursor-pointer items-center gap-2">
                    <div class="size-6 rounded-sm border border-base-100 bg-white" />
                    <span class="text-base text-base-950">variação</span>
                    <span class="flex items-end gap-0.5">
                      <span class="h-5.5 w-1.5 rounded-sm bg-tertiary-100" />
                      <span class="h-4.5 w-1.5 rounded-sm bg-tertiary-500" />
                    </span>
                  </label>
                </div>
                <div class="flex flex-1 items-center justify-end gap-2">
                  <span class="text-xs font-semibold text-base-950">Filtrar por:</span>
                  <span
                    class="flex h-8 items-center justify-center rounded-full bg-secondary-50 px-4 text-xs font-semibold text-secondary-600"
                    >drogaria</span
                  >
                  <span
                    class="flex h-8 items-center justify-center rounded-full bg-secondary-50 px-4 text-xs font-semibold text-secondary-600"
                    >UPA</span
                  >
                  <span
                    class="flex h-8 items-center justify-center rounded-full bg-secondary-50 px-4 text-xs font-semibold text-secondary-600"
                    >UBS</span
                  >
                </div>
              </div>

              <!-- Chart placeholder -->
              <div class="flex h-104 items-center justify-center rounded-lg bg-secondary-50/50">
                <p class="text-sm text-base-400">Gráfico será implementado com ECharts</p>
              </div>

              <!-- Date axis -->
              <div class="flex border-t border-secondary-100 pt-2">
                <div class="w-10 shrink-0" />
                <div
                  class="flex flex-1 items-center justify-between text-center text-secondary-600"
                >
                  <div
                    v-for="se in [
                      'SE 39|(21 a 27/09)',
                      'SE 40|(28/09 a 04/10)',
                      'SE 41|(05 a 11/10)',
                      'SE 42|(12 a 18/10)',
                      'SE 43|(19 a 25/10)',
                      'SE 44|(26/10 a 01/11)',
                      'SE 45|(02 a 08/11)',
                      'SE 46|(09 a 15/11)',
                      'SE 47|(26 a 22/11)',
                      'SE 48|(23 a 29/11)'
                    ]"
                    :key="se"
                    class="flex flex-1 flex-col gap-0.5"
                  >
                    <span class="text-xs font-semibold">{{ se.split('|')[0] }}</span>
                    <span class="text-[10px]">{{ se.split('|')[1] }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Callout: Análise dos Especialistas -->
            <div
              class="flex items-start justify-between rounded-xl border border-secondary-100 bg-secondary-50 p-4"
            >
              <div class="flex max-w-200 flex-1 items-start gap-3">
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary-100 bg-white"
                >
                  <Icon name="lucide:user" class="size-4 text-secondary-600" />
                </div>
                <div class="flex flex-col gap-2 pr-10">
                  <p class="text-base font-semibold leading-tight text-secondary-600">
                    Análise dos Especialistas
                  </p>
                  <p class="text-sm leading-normal text-base-950">
                    Após 3 semanas com elevado movimento, em 18 de outubro iniciou tendência de
                    estabilidade. Rumores indicam
                    <a href="#" class="text-danger-600 underline"
                      >possível surto de dengue em 4 estados</a
                    >
                    e
                    <a href="#" class="text-danger-600 underline"
                      >surto de influenza na Região Sul</a
                    >
                    iniciando em 20 de outubro.
                  </p>
                </div>
              </div>
              <NuxtLink
                to="/rumores"
                class="flex shrink-0 items-center gap-1 px-0.5 py-px text-sm font-semibold text-secondary-600"
              >
                ir para rumores
                <Icon name="lucide:arrow-right" class="size-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Source + action buttons -->
          <div class="flex w-264 items-center justify-between self-center">
            <div class="flex items-center gap-3 text-xs">
              <p class="text-base-400">
                <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>,
                2026.
              </p>
              <div class="h-3 w-px bg-base-300" />
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:lock" class="size-2.5 text-success-900" />
                <span class="text-success-900">Padrão de confiança ITpS</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-600 transition-colors hover:bg-secondary-100"
                aria-label="Compartilhar"
              >
                <Icon name="lucide:share-2" class="size-4" />
              </button>
              <button
                class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-600 transition-colors hover:bg-secondary-100"
                aria-label="Imprimir"
              >
                <Icon name="lucide:printer" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Separador -->
        <div class="h-px w-264 self-center bg-secondary-100" />
      </section>

      <!-- Seção 2: Lotação por região -->
      <section class="flex w-264 flex-col gap-16">
        <!-- Título + texto -->
        <div class="flex flex-col gap-8">
          <div class="flex flex-col gap-3">
            <p class="text-base font-semibold leading-tight text-secondary-600">Resumo Técnico</p>
            <h3 class="text-4xl font-semibold leading-snug text-base-950">
              Movimento elevado em estabelecimentos<br />
              de saúde de todo o Brasil
            </h3>
          </div>

          <div class="pr-32 text-xl leading-[1.7] text-secondary-600">
            <p class="mb-6">
              Dados sobre movimento em estabelecimentos de saúde indicam tendência de crescimento no
              movimento no Nordeste e Sul nesta semana. O movimento atípico nas farmácias do
              Nordeste chama a atenção. Rumores indicam
              <a href="#" class="text-danger-600 underline"
                >aumento no número de notícias sobre Dengue no Nordeste</a
              >.
            </p>
            <p>
              Em contrapartida,
              <a href="#" class="text-danger-600 underline"
                >a região Centro-Oeste demonstra estabilidade</a
              ><sup class="text-[13px] text-danger-600">(1)</sup>, enquanto o Sudeste apresenta
              ligeira melhora nos indicadores de movimento de saúde, conforme
              <a href="#" class="text-danger-600 underline">dados da Fundação Vidas</a
              ><sup class="text-[13px] text-danger-600">(2)</sup>.
            </p>
          </div>
        </div>

        <!-- Gráfico -->
        <div class="flex flex-col gap-4 self-center">
          <div class="flex w-332 flex-col gap-3 rounded-xl bg-secondary-50 px-4 pb-4 pt-5">
            <div class="flex w-264 items-center justify-between self-center px-6 py-2">
              <div class="flex flex-col gap-2">
                <h4 class="text-xl font-semibold leading-tight text-base-950">
                  Lotação Semanal vs. Média Histórica
                </h4>
                <p class="text-sm text-base-950">
                  Confira quando a lotação está acima da média histórica.
                </p>
              </div>
              <button
                class="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-secondary-600"
              >
                como é feito o cálculo
                <Icon name="lucide:circle-help" class="size-4" />
              </button>
            </div>

            <div class="flex flex-col gap-4 rounded-xl border border-secondary-100 bg-white p-6">
              <div
                class="flex h-12 items-center rounded-full border border-secondary-100 bg-white p-1"
              >
                <div
                  class="flex flex-1 items-center justify-center gap-2 self-stretch rounded-full bg-secondary-600 px-6"
                >
                  <Icon name="lucide:chart-line" class="size-4 text-white" />
                  <span class="text-sm font-semibold text-white">gráfico de linha</span>
                </div>
                <button
                  class="flex flex-1 items-center justify-center gap-2 self-stretch rounded-full px-6"
                >
                  <Icon name="lucide:chart-no-axes-gantt" class="size-4 text-secondary-400" />
                  <span class="text-sm text-secondary-400">gráfico de faixa</span>
                </button>
                <button
                  class="flex flex-1 items-center justify-center gap-2 self-stretch rounded-full px-6"
                >
                  <Icon name="lucide:user" class="size-4 text-secondary-400" />
                  <span class="text-sm text-secondary-400">tabela</span>
                </button>
              </div>

              <div class="flex h-10 items-center justify-between px-6">
                <div class="flex items-center gap-5">
                  <label class="flex cursor-pointer items-center gap-2">
                    <div
                      class="flex size-6 items-center justify-center rounded-sm bg-secondary-950"
                    >
                      <Icon name="lucide:check" class="size-4 text-white" />
                    </div>
                    <span class="text-base text-secondary-600">média</span>
                    <span class="inline-block w-5 border-t-2 border-dashed border-secondary-600" />
                  </label>
                  <label class="flex cursor-pointer items-center gap-2">
                    <div class="size-6 rounded-sm border border-base-100 bg-white" />
                    <span class="text-base text-base-950">variação</span>
                    <span class="flex items-end gap-0.5">
                      <span class="h-5.5 w-1.5 rounded-sm bg-tertiary-100" />
                      <span class="h-4.5 w-1.5 rounded-sm bg-tertiary-500" />
                    </span>
                  </label>
                </div>
                <div class="flex flex-1 items-center justify-end gap-2">
                  <span class="text-xs font-semibold text-base-950">Filtrar por:</span>
                  <span
                    class="flex h-8 items-center justify-center rounded-full bg-secondary-50 px-4 text-xs font-semibold text-secondary-600"
                    >drogaria</span
                  >
                  <span
                    class="flex h-8 items-center justify-center rounded-full bg-secondary-50 px-4 text-xs font-semibold text-secondary-600"
                    >UPA</span
                  >
                  <span
                    class="flex h-8 items-center justify-center rounded-full bg-secondary-50 px-4 text-xs font-semibold text-secondary-600"
                    >UBS</span
                  >
                </div>
              </div>

              <div class="flex h-104 items-center justify-center rounded-lg bg-secondary-50/50">
                <p class="text-sm text-base-400">Gráfico será implementado com ECharts</p>
              </div>

              <div class="flex border-t border-secondary-100 pt-2">
                <div class="w-10 shrink-0" />
                <div
                  class="flex flex-1 items-center justify-between text-center text-secondary-600"
                >
                  <div
                    v-for="se in [
                      'SE 39|(21 a 27/09)',
                      'SE 40|(28/09 a 04/10)',
                      'SE 41|(05 a 11/10)',
                      'SE 42|(12 a 18/10)',
                      'SE 43|(19 a 25/10)',
                      'SE 44|(26/10 a 01/11)',
                      'SE 45|(02 a 08/11)',
                      'SE 46|(09 a 15/11)',
                      'SE 47|(26 a 22/11)',
                      'SE 48|(23 a 29/11)'
                    ]"
                    :key="se"
                    class="flex flex-1 flex-col gap-0.5"
                  >
                    <span class="text-xs font-semibold">{{ se.split('|')[0] }}</span>
                    <span class="text-[10px]">{{ se.split('|')[1] }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="flex items-start justify-between rounded-xl border border-secondary-100 bg-secondary-50 p-4"
            >
              <div class="flex max-w-200 flex-1 items-start gap-3">
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-full border border-secondary-100 bg-white"
                >
                  <Icon name="lucide:user" class="size-4 text-secondary-600" />
                </div>
                <div class="flex flex-col gap-2 pr-10">
                  <p class="text-base font-semibold leading-tight text-secondary-600">
                    Análise dos Especialistas
                  </p>
                  <p class="text-sm leading-normal text-base-950">
                    Após 3 semanas com elevado movimento, em 18 de outubro iniciou tendência de
                    estabilidade. Rumores indicam
                    <a href="#" class="text-danger-600 underline"
                      >possível surto de dengue em 4 estados</a
                    >
                    e
                    <a href="#" class="text-danger-600 underline"
                      >surto de influenza na Região Sul</a
                    >
                    iniciando em 20 de outubro.
                  </p>
                </div>
              </div>
              <NuxtLink
                to="/rumores"
                class="flex shrink-0 items-center gap-1 px-0.5 py-px text-sm font-semibold text-secondary-600"
              >
                ir para rumores
                <Icon name="lucide:arrow-right" class="size-4" />
              </NuxtLink>
            </div>
          </div>

          <div class="flex w-264 items-center justify-between self-center">
            <div class="flex items-center gap-3 text-xs">
              <p class="text-base-400">
                <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>,
                2026.
              </p>
              <div class="h-3 w-px bg-base-300" />
              <div class="flex items-center gap-1.5">
                <Icon name="lucide:lock" class="size-2.5 text-success-900" />
                <span class="text-success-900">Padrão de confiança ITpS</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-600 transition-colors hover:bg-secondary-100"
                aria-label="Compartilhar"
              >
                <Icon name="lucide:share-2" class="size-4" />
              </button>
              <button
                class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-secondary-600 transition-colors hover:bg-secondary-100"
                aria-label="Imprimir"
              >
                <Icon name="lucide:printer" class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </article>

    <!-- Destaque numérico -->
    <section
      class="relative flex items-center justify-center border-b border-secondary-200 bg-secondary-50 py-32"
    >
      <!-- Dot pattern overlay -->
      <div
        class="pointer-events-none absolute inset-0 opacity-30"
        style="
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
          color: var(--color-secondary-200);
        "
      />

      <div class="relative flex w-332 items-start gap-20">
        <!-- Número grande + ornamento -->
        <div class="flex flex-1 flex-col gap-20">
          <p class="text-[60px] font-bold leading-[1.25] text-secondary-600">
            57% de algum número grande e legal de ser citado.
          </p>
          <div class="flex h-4 items-start gap-2">
            <div class="h-full flex-1 bg-primary-900" />
            <div class="h-full w-[17.5px] bg-primary-950" />
            <div class="h-full w-14 bg-secondary-900" />
          </div>
        </div>

        <!-- Texto descritivo + fonte -->
        <div class="flex flex-1 flex-col gap-6">
          <div class="text-xl leading-[1.7] text-secondary-600">
            <p class="mb-6">
              Este número reflete uma análise aprofundada das taxas de incidência da dengue em áreas
              urbanas e rurais. A pesquisa foi conduzida pela Fundação Saúde Plena, que coletou
              dados de mais de 5.000 postos de saúde em todo o país. Os resultados indicam um
              aumento preocupante nos casos de dengue, especialmente entre crianças e idosos.
            </p>
            <p>
              Em resumo, o aumento de 57% nos casos de dengue é um sinal de alerta para a saúde
              pública. É importante que todos façam a sua parte para prevenir a doença, eliminando
              focos de água parada, usando repelente e procurando atendimento médico em caso de
              sintomas.
            </p>
          </div>
          <div class="flex items-center gap-3 text-xs">
            <p class="text-base-800">
              <span class="font-semibold">Fonte</span>: <a href="#" class="underline">Sinapse</a>,
              2026.
            </p>
            <div class="h-3 w-px bg-base-300" />
            <div class="flex items-center gap-1.5">
              <Icon name="lucide:lock" class="size-2.5 text-success-900" />
              <span class="text-success-900">Padrão de confiança ITpS</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Rumores & fontes -->
    <section class="flex flex-col items-center gap-16 bg-secondary-50 py-32">
      <!-- Parte superior: título + lista numerada -->
      <div class="flex w-332 items-start gap-20">
        <!-- Esquerda: título grande + ornamento + crédito -->
        <div class="flex flex-1 flex-col gap-10">
          <p class="text-[60px] font-bold leading-[1.25] text-secondary-600">
            Rumores<br />
            &amp; fontes
          </p>
          <div class="flex h-3 w-60 items-start gap-2">
            <div class="h-full flex-1 bg-primary-900" />
            <div class="h-full w-[17.5px] bg-primary-950" />
            <div class="h-full w-14 bg-secondary-900" />
          </div>

          <!-- Crédito do relatório -->
          <p class="mt-auto text-sm leading-normal text-secondary-600">
            Relatório automático<br />
            criado em <a href="#" class="text-danger-600 underline">Detecta Alerta</a>,<br />
            utilizando dados do <a href="#" class="text-danger-600 underline">Sinapse</a>.
          </p>
        </div>

        <!-- Direita: lista numerada de fontes -->
        <div class="flex flex-1 flex-col">
          <ol class="list-decimal space-y-3 pl-6 text-base leading-normal text-secondary-600">
            <li v-for="(source, i) in reportSources" :key="i">
              <a href="#" class="text-danger-600 underline">{{ source.name }}</a
              >, {{ source.portal }}, {{ source.year }}.
            </li>
          </ol>
        </div>
      </div>

      <!-- Separador -->
      <div class="h-px w-332 bg-secondary-200" />

      <!-- Rumores em alta -->
      <div class="flex w-332 flex-col gap-6">
        <h3 class="text-[28px] font-semibold leading-[1.4] text-secondary-600">Rumores em alta!</h3>

        <!-- Grid de cards -->
        <div class="grid grid-cols-2 gap-6">
          <RumoresCardSmall
            v-for="rumor in trendingRumors"
            :key="rumor.title"
            :title="rumor.title"
            :description="rumor.description"
            :highlight-label="rumor.highlight"
            :highlight-count="rumor.highlightExtra"
            :disease-tag="rumor.tag"
            :time-ago="rumor.time"
            class="shadow-md"
          />
        </div>
      </div>
    </section>

    <!-- Créditos do relatório -->
    <section class="flex items-center justify-center bg-secondary-200 py-16">
      <div class="flex w-332 items-center gap-16">
        <!-- Criado por -->
        <div class="flex flex-1 flex-col gap-3">
          <p class="text-sm font-semibold leading-tight text-secondary-600">Criado por:</p>
          <p class="text-sm leading-normal text-base-950">
            Relatório automático criado em
            <a href="#" class="text-danger-600 underline">Detecta Alerta</a>,<br />
            utilizando dados do
            <a href="#" class="text-danger-600 underline">Sinapse</a>.
          </p>
        </div>

        <!-- Separador vertical -->
        <div class="h-18 w-px bg-secondary-300" />

        <!-- Última edição por -->
        <div class="flex flex-1 flex-col gap-3">
          <p class="text-sm font-semibold leading-tight text-secondary-600">Última edição por:</p>
          <div class="flex items-center gap-3">
            <!-- Avatar placeholder -->
            <div class="size-14 shrink-0 rounded-full bg-secondary-300" />
            <div class="flex flex-col gap-2">
              <p class="text-sm font-semibold leading-tight text-base-950">
                Dra. Clarisse Lispector
              </p>
              <p class="text-xs text-base-950">Pesquisadora-chefe em ITpS</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
