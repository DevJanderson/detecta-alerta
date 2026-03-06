<script setup lang="ts">
import type { Map as LeafletMap } from 'leaflet'

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253]
const BRAZIL_ZOOM = 4

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; OpenStreetMap, &copy; CartoDB'

const mapInstance = ref<LeafletMap | null>(null)

function onMapReady(map: LeafletMap) {
  map.zoomControl?.remove()
  map.attributionControl?.remove()
  mapInstance.value = map
}

function zoomIn() {
  mapInstance.value?.zoomIn()
}

function zoomOut() {
  mapInstance.value?.zoomOut()
}

defineExpose({ mapInstance, zoomIn, zoomOut })
</script>

<template>
  <div class="absolute inset-0">
    <LMap
      :zoom="BRAZIL_ZOOM"
      :center="BRAZIL_CENTER"
      :min-zoom="4"
      :max-zoom="18"
      :use-global-leaflet="false"
      :zoom-control="false"
      class="h-full w-full"
      @ready="onMapReady"
    >
      <LTileLayer :url="TILE_URL" :attribution="TILE_ATTRIBUTION" layer-type="base" />
    </LMap>
  </div>
</template>
