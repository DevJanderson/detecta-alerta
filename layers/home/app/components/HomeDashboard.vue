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

      <!-- Titulo da seção -->
      <header
        class="flex flex-col gap-3 px-4 pt-8 sm:px-6 sm:pt-10 md:flex-row md:items-center md:justify-between lg:pt-20"
      >
        <h2 class="text-2xl font-semibold leading-[1.4] text-base-950 sm:text-[28px]">
          Panorama &bull; {{ store.regionLabel }}
        </h2>
        <NuxtLink
          to="/meu-municipio"
          class="flex items-center gap-1 text-sm font-semibold text-secondary-900 hover:text-secondary-950"
        >
          ir para Meu Município
          <Icon name="lucide:arrow-right" class="size-4 text-primary-700" />
        </NuxtLink>
      </header>

      <!-- Overview Box (Panorama) -->
      <div class="px-4 pt-6 sm:px-6">
        <HomePanorama />
      </div>

      <!-- Source box -->
      <div
        class="flex flex-col gap-2 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
      >
        <p class="flex flex-wrap items-center gap-3 text-xs text-base-600">
          <span>
            <span class="font-semibold">Fontes</span>: <span class="underline">Google Maps</span>,
            <span class="underline">Sinapse</span>,
            <span class="underline">Ministério da Saúde</span> e
            <span class="underline">Radim</span>, 2026
          </span>
          <span class="inline-block h-3 w-px bg-base-300" />
          <span class="flex items-center gap-1.5 text-success-900">
            <Icon name="lucide:lock" class="size-2.5" />
            Padrão de confiança ITpS
          </span>
        </p>
        <NuxtLink
          to="#"
          class="flex items-center gap-1 text-xs font-semibold text-secondary-900 hover:text-secondary-950"
        >
          como são feitos os cálculos
          <Icon name="lucide:circle-help" class="size-4 text-primary-700" />
        </NuxtLink>
      </div>

      <!-- Seção: Lotação vs. Média Histórica (Gráfico) -->
      <div class="px-4 pt-10 sm:px-6 sm:pt-14 lg:pt-20">
        <HomeChart />
      </div>

      <!-- Seção: Lotação por estabelecimento (Tabela) -->
      <div class="pt-10 pb-10 sm:pt-14 sm:pb-14 lg:pt-20 lg:pb-20">
        <HomeTable />
      </div>
    </div>
  </section>
</template>
