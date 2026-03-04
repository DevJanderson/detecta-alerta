<script setup lang="ts">
import type { Map as LeafletMap } from 'leaflet'

const BRAZIL_CENTER: [number, number] = [-14.235, -51.9253]
const BRAZIL_ZOOM = 4

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
const TILE_ATTRIBUTION = '&copy; OpenStreetMap, &copy; CartoDB'

async function onMapReady(map: LeafletMap) {
  // Remove controles padrão que o @nuxtjs/leaflet cria mesmo com props false
  map.zoomControl?.remove()
  map.attributionControl?.remove()

  const L = await import('leaflet')
  L.control.zoom({ position: 'bottomright' }).addTo(map)
}
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
