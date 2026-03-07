<script setup lang="ts">
const noticias = mockNoticias.slice(0, 3)
</script>

<template>
  <section>
    <div class="mb-3">
      <h3 class="font-heading text-base font-semibold text-base-950">Últimos rumores</h3>
      <p class="mt-0.5 text-xs text-base-600">Confira as informações mais recentes.</p>
    </div>

    <div class="flex flex-col gap-3">
      <MeuMunicipioRumorCard v-for="noticia in noticias" :key="noticia.id" :noticia="noticia" />

      <button
        class="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-secondary-200 bg-secondary-50 text-sm font-semibold text-secondary-700 transition-colors hover:bg-secondary-100"
      >
        ir para rumores
        <Icon name="lucide:arrow-right" class="size-4 text-primary-500" />
      </button>
    </div>
  </section>
</template>
