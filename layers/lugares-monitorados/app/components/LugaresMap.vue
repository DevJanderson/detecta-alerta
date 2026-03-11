<script setup lang="ts">
const container = useTemplateRef('mapContainer')
const store = useLugaresMonitoradosStore()
const { isReady, renderMarkers, flyToUnidade, resetView, zoomIn, zoomOut, setStyle } =
  useLugaresMonitoradosMap(container)

// Renderiza marcadores quando o mapa carrega ou as unidades mudam
watch([isReady, () => store.unidadesFiltradas], ([ready, unidades]) => {
  if (ready) renderMarkers(unidades)
})

// Voa até a unidade selecionada
watch(
  () => store.selectedUnidade,
  unidade => {
    if (unidade) flyToUnidade(unidade)
  }
)

defineExpose({ zoomIn, zoomOut, resetView, setStyle })
</script>

<template>
  <div class="absolute inset-0">
    <div ref="mapContainer" class="h-full w-full" />
  </div>
</template>
