<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253]
const BRAZIL_ZOOM = 4

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; OpenStreetMap, &copy; CartoDB'

const mapContainer = ref<HTMLElement | null>(null)
const map = shallowRef<L.Map | null>(null)

onMounted(() => {
  if (!mapContainer.value) return

  map.value = L.map(mapContainer.value, {
    center: BRAZIL_CENTER,
    zoom: BRAZIL_ZOOM,
    minZoom: 4,
    maxZoom: 18,
    zoomControl: false,
    attributionControl: false,
    preferCanvas: true
  })

  L.tileLayer(TILE_URL, { attribution: TILE_ATTRIBUTION }).addTo(map.value)
})

onUnmounted(() => {
  if (map.value) {
    map.value.remove()
    map.value = null
  }
})

function zoomIn() {
  map.value?.zoomIn()
}

function zoomOut() {
  map.value?.zoomOut()
}

defineExpose({ map, zoomIn, zoomOut })
</script>

<template>
  <div ref="mapContainer" class="absolute inset-0" />
</template>
