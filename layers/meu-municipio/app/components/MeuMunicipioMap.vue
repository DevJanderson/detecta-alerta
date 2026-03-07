<script setup lang="ts">
const mapContainer = ref<HTMLElement | null>(null)
const { map, zoomIn, zoomOut } = useMeuMunicipioMap(mapContainer)

defineExpose({ map, zoomIn, zoomOut })
</script>

<template>
  <div ref="mapContainer" class="h-full w-full" />
</template>
