/**
 * Composable do mapa — orquestrador
 *
 * Instancia o MapLibre e delega adição de camadas para utils/map-layers.
 * Todo estado do mapa fica dentro deste composable (sem variáveis globais).
 */
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// BRAZIL_CENTER, BRAZIL_ZOOM, VECTOR_STYLE auto-importados de base
import { ALERT_CITIES, CONNECTIONS, MAX_CASES } from '../utils/map-mock-data'
import {
  addStateLayers,
  addAlertLayers,
  addConnectionLayers,
  addHeatmapLayer,
  startPulseAnimation
} from '../utils/map-layers'

export function useMeuMunicipioMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<maplibregl.Map | null>(null)
  let pulseAnimation: number | null = null
  const hover = { hoveredStateId: null as string | number | null }

  onMounted(() => {
    if (!container.value) return

    const m = new maplibregl.Map({
      container: container.value,
      style: VECTOR_STYLE,
      center: [-60, 2],
      zoom: 2.5,
      minZoom: 3,
      maxZoom: 18,
      pitch: 0,
      attributionControl: false
    })

    map.value = m

    m.on('load', async () => {
      await addStateLayers(m, hover)
      addAlertLayers(m, ALERT_CITIES)
      addConnectionLayers(m, ALERT_CITIES, CONNECTIONS)
      addHeatmapLayer(m, ALERT_CITIES, MAX_CASES)

      pulseAnimation = startPulseAnimation(m)

      // Animação de entrada: voa até o centro do Brasil
      setTimeout(() => {
        m.flyTo({
          center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
          zoom: BRAZIL_ZOOM,
          pitch: 45,
          bearing: -10,
          duration: 3000,
          essential: true
        })

        setTimeout(() => {
          m.easeTo({ pitch: 0, bearing: 0, duration: 2000 })
        }, 3500)
      }, 500)
    })

    // Double-click: volta à visão nacional
    m.on('dblclick', e => {
      const features = m.queryRenderedFeatures(e.point, { layers: ['alerts-circle'] })
      if (features.length > 0) return

      e.preventDefault()
      m.flyTo({
        center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
        zoom: BRAZIL_ZOOM,
        pitch: 0,
        bearing: 0,
        duration: 2000,
        essential: true
      })
    })
  })

  onUnmounted(() => {
    if (pulseAnimation) cancelAnimationFrame(pulseAnimation)
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

  return { map, zoomIn, zoomOut }
}
