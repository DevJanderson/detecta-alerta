<script setup lang="ts">
const noticias = [
  {
    id: '1',
    title: 'Aumento de casos de dengue preocupa autoridades em São Paulo',
    source: 'Folha de S.Paulo',
    time: 'Há 2h',
    tags: { diseases: ['Dengue'], regions: ['São Paulo'] }
  },
  {
    id: '2',
    title: 'UBS da zona leste registra lotação acima da média nesta semana',
    source: 'G1',
    time: 'Há 5h',
    tags: { diseases: [], regions: ['Sudeste'] }
  },
  {
    id: '3',
    title: 'Campanha de vacinação contra gripe começa na próxima semana',
    source: 'Estadão',
    time: 'Ontem',
    tags: { diseases: ['Gripe'], regions: [] }
  },
  {
    id: '4',
    title: 'Surto de chikungunya atinge bairros da zona norte da capital',
    source: 'UOL',
    time: 'Há 2 dias',
    tags: { diseases: ['Chikungunya'], regions: ['São Paulo'] }
  },
  {
    id: '5',
    title: 'Secretaria de Saúde reforça equipes em UPAs lotadas',
    source: 'R7',
    time: 'Há 3 dias',
    tags: { diseases: [], regions: ['São Paulo'] }
  }
]
</script>

<template>
  <div class="flex flex-col gap-6 p-6 pb-8">
    <div>
      <h3 class="font-heading text-base font-semibold text-base-950">Rumores Recentes</h3>
      <p class="mt-0.5 text-xs text-base-600">São Paulo</p>
    </div>

    <div class="flex flex-col gap-3">
      <article
        v-for="noticia in noticias"
        :key="noticia.id"
        class="flex cursor-pointer flex-col gap-3 rounded-xl border border-secondary-100 bg-white p-4 transition-colors hover:border-secondary-200"
      >
        <h4 class="line-clamp-2 text-sm font-semibold leading-snug text-base-950">
          {{ noticia.title }}
        </h4>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-xs">
            <span class="font-medium text-secondary-700">{{ noticia.source }}</span>
            <span class="h-3 w-px bg-base-300" />
            <span class="text-base-500">{{ noticia.time }}</span>
          </div>
          <span
            class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-secondary-700"
          >
            ver rumor
            <Icon name="lucide:arrow-right" class="size-4 text-primary-500" />
          </span>
        </div>

        <div
          v-if="noticia.tags.diseases.length > 0 || noticia.tags.regions.length > 0"
          class="flex flex-wrap gap-1.5"
        >
          <span
            v-for="disease in noticia.tags.diseases"
            :key="disease"
            class="rounded-full bg-danger-100 px-2 py-0.5 text-xs font-medium text-danger-950"
          >
            {{ disease }}
          </span>
          <span
            v-for="region in noticia.tags.regions"
            :key="region"
            class="rounded-full bg-secondary-100 px-2 py-0.5 text-xs font-medium text-secondary-900"
          >
            {{ region }}
          </span>
        </div>
      </article>
    </div>
  </div>
</template>
