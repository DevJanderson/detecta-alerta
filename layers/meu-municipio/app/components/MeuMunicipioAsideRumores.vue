<script setup lang="ts">
const store = useMeuMunicipioStore()
const noticias = mockNoticias
</script>

<template>
  <div class="flex flex-col gap-5 p-4 pb-8 sm:gap-6 sm:p-6">
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
