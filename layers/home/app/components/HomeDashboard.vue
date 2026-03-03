<script setup lang="ts">
const store = useHomeStore()

onMounted(async () => {
  await store.fetchLookups()
  await store.fetchAll()
})
</script>

<template>
  <section class="flex flex-col lg:flex-row">
    <!-- Coluna esquerda: Tabs + Mapa (sticky) -->
    <div
      class="relative z-40 w-full lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[45%] lg:max-w-[45%] lg:flex-col lg:self-start"
    >
      <HomeRegionTabs />
      <HomeMap />
    </div>

    <!-- Coluna direita: Conteúdo (scroll natural) -->
    <div class="relative z-20 w-full lg:min-w-0 lg:flex-1">
      <!-- Spacer para alinhar com a altura das tabs no desktop -->
      <div class="hidden lg:block lg:h-[180px]" />

      <HomeFilters />
      <HomePanorama />
      <HomeChart />
      <HomeTable />
    </div>
  </section>
</template>
