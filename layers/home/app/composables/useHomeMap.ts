/**
 * Composable do mapa da home — orquestrador
 *
 * Instancia o MapLibre e adiciona as camadas de choropleth por região.
 * Mapa é somente visualização (sem edição de dados).
 */
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { REGION_MOVEMENTS } from '../utils/home-map-data'
import { addHomeStateLayers, addRegionMarkers } from '../utils/home-map-layers'

/** Style vazio — apenas fundo branco, sem tiles. Igual ao Leaflet da versão anterior. */
const BLANK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': 'rgba(0,0,0,0)' } }]
}

export function useHomeMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<maplibregl.Map | null>(null)
  const hover = { hoveredStateId: null as string | number | null }
  let markers: maplibregl.Marker[] = []

  onMounted(() => {
    if (!container.value) return

    const m = new maplibregl.Map({
      container: container.value,
      style: BLANK_STYLE,
      center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
      zoom: 3.2,
      minZoom: 2,
      maxZoom: 7,
      maxBounds: BRAZIL_BOUNDS,
      pitch: 0,
      attributionControl: false,
      dragRotate: false
    })

    map.value = m

    m.on('load', async () => {
      await addHomeStateLayers(m, hover, REGION_MOVEMENTS)
      markers = addRegionMarkers(m, REGION_MOVEMENTS)

      // Zoom afastado para ver o Brasil completo com margem
      m.easeTo({
        center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
        zoom: 1.8,
        duration: 1500
      })
    })
  })

  onUnmounted(() => {
    for (const marker of markers) marker.remove()
    markers = []
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  })

  return { map }
}
