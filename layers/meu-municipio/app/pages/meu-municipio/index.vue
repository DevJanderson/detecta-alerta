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
    <div class="relative flex-1 min-w-0">
      <MeuMunicipioMap ref="map" />

      <!-- Search field + Epi Week selector -->
      <div class="absolute left-4 right-4 top-4 z-1000 flex items-start gap-3">
        <MeuMunicipioSearchField />
        <MeuMunicipioEpiWeekSelector />
      </div>

      <!-- Map controls: navigation + sinapse status + change location -->
      <div class="absolute bottom-6 left-4 z-1000 flex items-end gap-4">
        <MeuMunicipioMapNavigation />
        <MeuMunicipioMapSinapseStatus />
        <MeuMunicipioMapChangeLocation @click="store.openOnboarding()" />
      </div>

      <!-- Zoom controls -->
      <div class="absolute bottom-6 right-4 z-1000">
        <MeuMunicipioMapZoom @zoom-in="mapRef?.zoomIn()" @zoom-out="mapRef?.zoomOut()" />
      </div>

      <!-- Onboarding (seleção inicial de município) -->
      <MeuMunicipioOnboarding v-if="store.showOnboarding" />
    </div>
    <MeuMunicipioAside />
  </div>
</template>
