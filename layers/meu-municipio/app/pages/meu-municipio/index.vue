<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Meu Município - Detecta Alerta',
  description:
    'Acompanhe dados epidemiológicos do seu município em tempo real. Monitore unidades de saúde, lotação e alertas.'
})

const store = useMeuMunicipioStore()
const mapRef = useTemplateRef('map')
</script>

<template>
  <div class="flex h-[calc(100vh-5.5rem)] w-full">
    <div class="relative min-w-0 flex-1">
      <MeuMunicipioMap ref="map" />

      <!-- Search field + Epi Week selector -->
      <div
        class="absolute left-3 right-3 top-3 z-1000 flex flex-col items-stretch gap-2 sm:left-4 sm:right-4 sm:top-4 sm:flex-row sm:items-start sm:gap-3"
      >
        <MeuMunicipioSearchField />
        <MeuMunicipioEpiWeekSelector />
      </div>

      <!-- Map controls: navigation + sinapse status + change location -->
      <div
        class="absolute bottom-20 left-3 z-1000 flex flex-col items-start gap-3 sm:bottom-6 sm:left-4 sm:flex-row sm:items-end sm:gap-4 lg:bottom-6"
      >
        <MeuMunicipioMapNavigation />
        <div class="hidden sm:flex sm:items-end sm:gap-4">
          <MeuMunicipioMapSinapseStatus />
          <MeuMunicipioMapChangeLocation @click="store.openOnboarding()" />
        </div>
      </div>

      <!-- Zoom controls -->
      <div class="absolute bottom-20 right-3 z-1000 sm:bottom-6 sm:right-4">
        <MeuMunicipioMapZoom @zoom-in="mapRef?.zoomIn()" @zoom-out="mapRef?.zoomOut()" />
      </div>

      <!-- Mobile: sinapse status (bottom bar) -->
      <div class="absolute right-0 bottom-0 left-0 z-1000 sm:hidden">
        <div
          class="flex items-center justify-between gap-2 bg-base-0/90 px-3 py-2 backdrop-blur-sm"
        >
          <MeuMunicipioMapSinapseStatus />
          <button
            type="button"
            class="flex size-9 items-center justify-center rounded-full border border-base-200 bg-base-0"
            title="Trocar localização"
            @click="store.openOnboarding()"
          >
            <Icon name="lucide:map-pinned" class="size-4 text-primary-500" />
          </button>
        </div>
      </div>

      <!-- Onboarding (seleção inicial de município) -->
      <MeuMunicipioOnboarding v-if="store.showOnboarding" />
    </div>
    <MeuMunicipioAside />
  </div>
</template>
