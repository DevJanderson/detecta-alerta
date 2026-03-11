<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Lugares Monitorados - Detecta Alerta',
  description:
    'Visualize e gerencie unidades de saúde monitoradas. Acompanhe UBS, UPAs e drogarias em tempo real.'
})

const store = useLugaresMonitoradosStore()
const mapRef = useTemplateRef('lugaresMap')

// Carrega unidades ao montar
onMounted(() => {
  store.fetchUnidades()
})
</script>

<template>
  <div class="flex h-[calc(100vh-5.5rem)] w-full">
    <!-- Mapa (área principal) -->
    <div class="relative flex-1 min-w-0">
      <LugaresMap ref="lugaresMap" />

      <!-- Controles do mapa -->
      <div class="absolute bottom-6 left-4 z-10 flex items-end gap-2">
        <LugaresMapStyleSwitcher @change="mapRef?.setStyle($event)" />
        <button
          class="flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-base-50"
          title="Centralizar no Brasil"
          @click="mapRef?.resetView()"
        >
          <Icon name="lucide:locate" class="size-5 text-base-700" />
        </button>
      </div>

      <!-- Zoom controls -->
      <div class="absolute bottom-6 right-4 z-10 flex flex-col gap-1">
        <button
          class="flex size-10 items-center justify-center rounded-t-lg bg-white shadow-md transition-colors hover:bg-base-50"
          title="Aproximar"
          @click="mapRef?.zoomIn()"
        >
          <Icon name="lucide:plus" class="size-5 text-base-700" />
        </button>
        <button
          class="flex size-10 items-center justify-center rounded-b-lg bg-white shadow-md transition-colors hover:bg-base-50"
          title="Afastar"
          @click="mapRef?.zoomOut()"
        >
          <Icon name="lucide:minus" class="size-5 text-base-700" />
        </button>
      </div>

      <!-- Toggle painel -->
      <button
        class="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white shadow-md transition-colors hover:bg-base-50"
        :title="store.isPanelOpen ? 'Fechar painel' : 'Abrir painel'"
        @click="store.togglePanel()"
      >
        <Icon
          :name="store.isPanelOpen ? 'lucide:panel-right-close' : 'lucide:panel-right-open'"
          class="size-5 text-base-700"
        />
      </button>
    </div>

    <!-- Aside (painel lateral) -->
    <LugaresAside />
  </div>
</template>
