<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

const route = useRoute()

// --- Mock data (será substituído por dados da API) ---
const article = {
  id: route.params.id,
  title: 'Dengue avança em 5 cidades no Pernambuco e Rio Grande do Norte',
  subtitle: 'Confira os números da dengue divulgados no último Boletim do Ministério da saúde',
  highlightLabel: 'Virou assunto!',
  highlightCount: '3 novos rumores',
  timeAgo: 'Há 4 horas',
  dateFormatted: '26 nov. 2025, 16h42',
  sources: [{ name: 'UOL' }, { name: 'United Health' }, { name: 'G1' }],
  diseases: [
    { name: 'dengue', slug: 'dengue' },
    { name: 'leptospirose', slug: 'leptospirose' },
    { name: 'chikungunya', slug: 'chikungunya' },
    { name: 'zika', slug: 'zika' }
  ],
  symptoms: [
    'febre',
    'dor de cabeça',
    'rigidez na nuca',
    'confusão mental',
    'falta de ar',
    'olhos vermelhos'
  ],
  content: `As cidades de Recife, Olinda, Jaboatão dos Guararapes, Natal e Mossoró registraram aumento significativo nos casos de dengue nas últimas duas semanas. A situação preocupa autoridades sanitárias locais que pedem reforço nas ações de combate ao mosquito Aedes aegypti.

De acordo com o Boletim Epidemiológico publicado pelo Ministério da Saúde nesta terça-feira, foram registrados 2.847 novos casos confirmados de dengue nos cinco municípios apenas nos últimos 14 dias, representando um aumento de 34% em relação ao período anterior.

A Secretaria de Saúde de Pernambuco emitiu um alerta para que a população reforce os cuidados com a eliminação de criadouros do mosquito, especialmente em áreas urbanas com maior incidência. O Recife concentra o maior número de casos, com 1.203 notificações confirmadas.

No Rio Grande do Norte, Natal e Mossoró lideram as estatísticas. O governo estadual anunciou a mobilização de agentes de endemias para intensificar as visitas domiciliares e ações de nebulização nos bairros mais afetados.

Especialistas alertam que o período chuvoso, combinado com temperaturas elevadas, cria condições ideais para a proliferação do Aedes aegypti. A recomendação é que a população não acumule água parada em recipientes como pneus, vasos de plantas e caixas d'água sem tampa.`,
  highlightQuote:
    'A situação preocupa autoridades sanitárias locais que pedem reforço nas ações de combate ao mosquito Aedes aegypti.',
  relatedNews: [
    {
      title: 'Recife intensifica combate ao Aedes após alta de casos',
      description:
        'Prefeitura mobiliza agentes de saúde para ações emergenciais em bairros com maior incidência.',
      diseaseTag: 'DENGUE',
      timeAgo: 'Há 6 horas'
    },
    {
      title: 'Natal registra recorde de internações por dengue',
      description: 'Hospital referência opera acima da capacidade com aumento de casos graves.',
      diseaseTag: 'DENGUE',
      timeAgo: 'Há 8 horas'
    },
    {
      title: 'Ministério da Saúde amplia vacinação contra dengue',
      description: 'Nova etapa da campanha inclui municípios do Nordeste com alta incidência.',
      diseaseTag: 'DENGUE',
      timeAgo: 'Há 12 horas'
    },
    {
      title: 'Olinda decreta estado de alerta sanitário',
      description: 'Medida visa mobilizar recursos para conter avanço da dengue na cidade.',
      diseaseTag: 'DENGUE',
      timeAgo: 'Há 1 dia'
    }
  ]
}

useSeoPage({
  title: `${article.title} - Rumores - Detecta Alerta`,
  description: article.subtitle
})

const sections = [
  { id: 'resumo', label: 'Resumo' },
  { id: 'doencas', label: 'Doenças Relacionadas' },
  { id: 'sintomas', label: 'Sintomas' },
  { id: 'noticias', label: 'Notícias' }
]

const activeSection = ref('resumo')

function scrollToSection(sectionId: string) {
  activeSection.value = sectionId
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
</script>

<template>
  <div class="px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-40">
    <!-- Breadcrumb -->
    <nav
      class="flex flex-wrap items-center gap-1.5 pb-6 text-xs text-base-400 sm:gap-2 sm:pb-10 sm:text-sm"
    >
      <NuxtLink to="/" class="transition-colors hover:text-base-600"> Home </NuxtLink>
      <Icon name="lucide:chevron-right" class="size-4" />
      <NuxtLink to="/rumores" class="transition-colors hover:text-base-600"> Rumores </NuxtLink>
      <Icon name="lucide:chevron-right" class="size-4" />
      <span class="text-base-600">{{ article.title }}</span>
    </nav>

    <!-- Conteúdo + Sidebar -->
    <div class="flex gap-10 lg:gap-16">
      <!-- Conteúdo principal -->
      <div class="flex flex-1 flex-col">
        <!-- Header -->
        <div class="flex flex-col gap-4 pb-6 sm:gap-6 sm:pb-10">
          <!-- Título -->
          <h1
            class="max-w-4xl text-2xl font-semibold leading-snug text-primary-600 sm:text-3xl lg:text-4xl"
          >
            {{ article.title }}
          </h1>

          <!-- Subtítulo -->
          <p class="max-w-3xl text-sm text-base-600 sm:text-base lg:text-lg">
            {{ article.subtitle }}
          </p>

          <!-- Meta: fontes + doença + highlight + data -->
          <div class="flex flex-wrap items-center gap-4">
            <!-- Fontes -->
            <div class="flex items-center gap-2">
              <div class="flex -space-x-1.5">
                <div
                  v-for="(_source, i) in article.sources"
                  :key="i"
                  class="size-6 rounded-full border-2 border-white bg-secondary-200"
                />
              </div>
              <span class="text-sm text-secondary-600">
                {{ article.sources.map(s => s.name).join(', ') }}
              </span>
            </div>

            <span class="inline-block h-3 w-px bg-base-200" />

            <!-- Doença -->
            <span class="text-sm font-semibold text-secondary-600">DENGUE e +3</span>

            <span class="inline-block h-3 w-px bg-base-200" />

            <!-- Highlight -->
            <div v-if="article.highlightLabel" class="flex items-center gap-2">
              <span class="text-sm font-semibold text-primary-600">{{
                article.highlightLabel
              }}</span>
              <span class="text-sm text-primary-600">{{ article.highlightCount }}</span>
              <Icon name="lucide:trending-up" class="size-4 text-primary-600" />
            </div>

            <span class="inline-block h-3 w-px bg-base-200" />

            <!-- Data -->
            <span class="text-sm text-base-400">
              {{ article.timeAgo }} &bull; {{ article.dateFormatted }}
            </span>
          </div>

          <!-- Ações: compartilhar + imprimir -->
          <div class="flex items-center gap-3">
            <button
              class="flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2 text-sm font-semibold text-secondary-600 transition-colors hover:bg-secondary-100"
            >
              <Icon name="lucide:share-2" class="size-4" />
              compartilhar
            </button>
            <button
              class="flex items-center gap-2 rounded-full border border-secondary-200 bg-secondary-50 px-4 py-2 text-sm font-semibold text-secondary-600 transition-colors hover:bg-secondary-100"
            >
              <Icon name="lucide:printer" class="size-4" />
              imprimir
            </button>
          </div>
        </div>

        <!-- Imagem hero -->
        <div class="h-52 w-full overflow-hidden rounded-xl sm:h-80 lg:h-135 lg:rounded-2xl">
          <div class="flex size-full items-center justify-center bg-secondary-200">
            <div
              class="flex size-80 -rotate-45 items-center justify-center rounded-[40px] bg-secondary-300/40"
            >
              <div
                class="flex size-40 items-center justify-center rounded-4xl bg-secondary-50 shadow-xl"
              >
                <Icon name="lucide:megaphone" size="64" class="rotate-45 text-secondary-400" />
              </div>
            </div>
          </div>
        </div>

        <!-- Seções do artigo -->
        <div class="flex flex-col gap-10 pt-10 sm:gap-16 sm:pt-16">
          <!-- Resumo -->
          <section id="resumo" class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
              <svg class="size-4 text-primary-950" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L16 8L8 16L0 8Z" />
              </svg>
              <h2 class="text-2xl font-semibold text-secondary-600">Resumo</h2>
            </div>

            <div
              class="flex flex-col gap-6 text-base leading-[1.7] text-base-700 sm:gap-8 sm:text-xl"
            >
              <p v-for="(paragraph, i) in article.content.split('\n\n')" :key="i">
                {{ paragraph }}
              </p>

              <!-- Citação destacada -->
              <blockquote
                class="rounded-xl bg-primary-50 px-5 py-4 text-base font-medium leading-relaxed text-primary-800 sm:rounded-2xl sm:px-8 sm:py-6 sm:text-lg"
              >
                "{{ article.highlightQuote }}"
              </blockquote>
            </div>
          </section>

          <!-- Doenças Relacionadas -->
          <section id="doencas" class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
              <svg class="size-4 text-primary-950" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L16 8L8 16L0 8Z" />
              </svg>
              <h2 class="text-2xl font-semibold text-secondary-600">Doenças Relacionadas</h2>
            </div>

            <div class="flex flex-wrap gap-3 sm:gap-4">
              <NuxtLink
                v-for="disease in article.diseases"
                :key="disease.slug"
                to="#"
                class="flex items-center gap-2 text-base font-semibold text-secondary-600 transition-colors hover:text-secondary-800 sm:text-lg"
              >
                {{ disease.name }}
                <Icon name="lucide:external-link" class="size-5" />
              </NuxtLink>
            </div>
          </section>

          <!-- Sintomas -->
          <section id="sintomas" class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
              <svg class="size-4 text-primary-950" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L16 8L8 16L0 8Z" />
              </svg>
              <h2 class="text-2xl font-semibold text-secondary-600">Sintomas</h2>
            </div>

            <div class="flex flex-wrap gap-3">
              <span
                v-for="symptom in article.symptoms"
                :key="symptom"
                class="flex items-center gap-2 rounded-full border border-secondary-100 bg-secondary-50 px-4 py-2 text-sm font-semibold text-secondary-600 sm:px-6 sm:py-3 sm:text-base"
              >
                <Icon name="lucide:cross" class="size-4 text-secondary-500" />
                {{ symptom }}
              </span>
            </div>
          </section>

          <!-- Notícias Relacionadas -->
          <section id="noticias" class="flex flex-col gap-8">
            <div class="flex items-center gap-4">
              <svg class="size-4 text-primary-950" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0L16 8L8 16L0 8Z" />
              </svg>
              <h2 class="text-2xl font-semibold text-secondary-600">Notícias</h2>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              <NuxtLink
                v-for="news in article.relatedNews"
                :key="news.title"
                to="#"
                class="group flex items-start gap-4 rounded-xl bg-white p-3 transition-shadow hover:shadow-md sm:gap-5"
              >
                <!-- Imagem losango -->
                <div class="relative hidden size-28 shrink-0 items-center justify-center sm:flex">
                  <div
                    class="absolute inset-3 rotate-45 overflow-hidden rounded-2xl bg-secondary-200"
                  >
                    <div class="flex size-full -rotate-45 scale-150 items-center justify-center">
                      <Icon name="lucide:newspaper" size="24" class="text-secondary-400" />
                    </div>
                  </div>
                </div>

                <!-- Conteúdo -->
                <div class="flex flex-1 flex-col gap-2 py-1">
                  <h4
                    class="text-base font-semibold leading-tight text-base-950 group-hover:text-secondary-700"
                  >
                    {{ news.title }}
                  </h4>
                  <p class="line-clamp-2 text-sm leading-normal text-base-500">
                    {{ news.description }}
                  </p>
                  <div class="mt-auto flex items-center gap-2 pt-2">
                    <span class="text-xs font-semibold text-secondary-600">{{
                      news.diseaseTag
                    }}</span>
                    <span class="inline-block h-3 w-px bg-base-200" />
                    <span class="text-xs text-base-400">{{ news.timeAgo }}</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>
      </div>

      <!-- Sidebar (sticky) -->
      <aside class="hidden w-56 shrink-0 lg:block">
        <nav class="sticky top-10 flex flex-col gap-1">
          <button
            v-for="section in sections"
            :key="section.id"
            class="rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors"
            :class="
              activeSection === section.id
                ? 'bg-secondary-50 text-secondary-700 font-semibold'
                : 'text-base-400 hover:text-base-600'
            "
            @click="scrollToSection(section.id)"
          >
            {{ section.label }}
          </button>
        </nav>
      </aside>
    </div>
  </div>
</template>
