/**
 * Composable do mapa — Lugares Monitorados
 *
 * Instancia MapLibre com marcadores de unidades de saúde.
 */
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { Unidade } from './types'
import { TIPO_UNIDADE_CORES } from './types'

export function useLugaresMonitoradosMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<maplibregl.Map | null>(null)
  const isReady = ref(false)
  let markers: maplibregl.Marker[] = []
  let lastUnidades: Unidade[] = []

  onMounted(() => {
    if (!container.value) return

    const m = new maplibregl.Map({
      container: container.value,
      style: VECTOR_STYLE,
      center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
      zoom: BRAZIL_ZOOM,
      minZoom: 3,
      maxZoom: 18,
      attributionControl: false
    })

    map.value = m

    m.on('load', () => {
      isReady.value = true
    })
  })

  onUnmounted(() => {
    clearMarkers()
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  })

  function clearMarkers() {
    for (const marker of markers) {
      marker.remove()
    }
    markers = []
  }

  function renderMarkers(unidades: Unidade[]) {
    if (!map.value) return
    lastUnidades = unidades
    clearMarkers()

    for (const unidade of unidades) {
      if (!unidade.latitude || !unidade.longitude) continue

      const color = TIPO_UNIDADE_CORES[unidade.tipoUnidade]

      const el = document.createElement('div')
      el.className = 'lugares-marker'
      el.style.cssText = `
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        transition: transform 0.15s ease;
      `
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })

      const popup = new maplibregl.Popup({
        offset: 20,
        closeButton: false,
        maxWidth: '260px'
      }).setHTML(`
        <div style="font-family: system-ui, sans-serif; padding: 4px 0;">
          <p style="font-weight: 600; font-size: 14px; margin: 0 0 4px;">${unidade.titulo}</p>
          <p style="color: #64748b; font-size: 12px; margin: 0 0 4px;">${unidade.endereco || ''}</p>
          <p style="color: #64748b; font-size: 12px; margin: 0;">${unidade.bairro ? unidade.bairro + ' — ' : ''}${unidade.cidade}, ${unidade.estado}</p>
        </div>
      `)

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([unidade.longitude, unidade.latitude])
        .setPopup(popup)
        .addTo(map.value!)

      markers.push(marker)
    }
  }

  function flyToUnidade(unidade: Unidade) {
    if (!map.value || !unidade.latitude || !unidade.longitude) return
    map.value.flyTo({
      center: [unidade.longitude, unidade.latitude],
      zoom: 14,
      duration: 1500,
      essential: true
    })
  }

  function resetView() {
    map.value?.flyTo({
      center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
      zoom: BRAZIL_ZOOM,
      duration: 1500,
      essential: true
    })
  }

  function zoomIn() {
    map.value?.zoomIn()
  }

  function zoomOut() {
    map.value?.zoomOut()
  }

  function setStyle(url: string) {
    if (!map.value) return
    map.value.setStyle(url)
    map.value.once('styledata', () => {
      renderMarkers(lastUnidades)
    })
  }

  return { map, isReady, renderMarkers, flyToUnidade, resetView, zoomIn, zoomOut, setStyle }
}
