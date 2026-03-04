<script setup lang="ts">
const noticias = [
  {
    id: '1',
    title: 'Aumento de casos de dengue preocupa autoridades em São Paulo',
    source: 'Folha de S.Paulo',
    time: 'Há 2h'
  },
  {
    id: '2',
    title: 'UBS da zona leste registra lotação acima da média',
    source: 'G1',
    time: 'Há 5h'
  },
  {
    id: '3',
    title: 'Campanha de vacinação contra gripe começa na próxima semana',
    source: 'Estadão',
    time: 'Ontem'
  }
]
</script>

<template>
  <section>
    <div class="mb-3">
      <h3 class="font-heading text-base font-semibold text-base-950">Últimos rumores</h3>
      <p class="mt-0.5 text-xs text-base-600">Confira as informações mais recentes.</p>
    </div>

    <div class="flex flex-col gap-3">
      <article
        v-for="noticia in noticias"
        :key="noticia.id"
        class="flex flex-col gap-3 rounded-xl border border-secondary-100 bg-white p-4"
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
          <button
            class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-xs font-semibold text-secondary-700 hover:text-secondary-900"
          >
            ver rumor
            <Icon name="lucide:arrow-right" class="size-4 text-primary-500" />
          </button>
        </div>
      </article>

      <button
        class="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-secondary-200 bg-secondary-50 text-sm font-semibold text-secondary-700 transition-colors hover:bg-secondary-100"
      >
        ir para rumores
        <Icon name="lucide:arrow-right" class="size-4 text-primary-500" />
      </button>
    </div>
  </section>
</template>
