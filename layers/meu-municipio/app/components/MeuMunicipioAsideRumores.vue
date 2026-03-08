<script setup lang="ts">
const store = useMeuMunicipioStore()
const noticias = mockNoticias
</script>

<template>
  <div class="flex flex-col gap-6 p-6 pb-8">
    <div>
      <h3 class="font-heading text-base font-semibold text-base-950">Rumores Recentes</h3>
      <p class="mt-0.5 text-xs text-base-600">{{ store.municipioDisplay?.nome ?? '' }}</p>
    </div>

    <div class="flex flex-col gap-3">
      <MeuMunicipioRumorCard
        v-for="noticia in noticias"
        :key="noticia.id"
        :noticia="noticia"
        show-tags
        clickable
      />
    </div>
  </div>
</template>
