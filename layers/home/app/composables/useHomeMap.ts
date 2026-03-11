/**
 * Composable do mapa da home — orquestrador
 *
 * Instancia o MapLibre com estados coloridos por alert status (choropleth dinâmico).
 * Reage ao switcher de região: destaca a região selecionada + contorno externo.
 * Clique no mapa sincroniza com store.setRegion().
 * Hover exibe tooltip com nome do estado + nível de alerta.
 *
 * Usa dois GeoJSON estáticos:
 * - brazil_simplified.geojson: 27 estados (fill + bordas)
 * - brazil_regions.geojson: 5 regiões unidas (contorno externo)
 */
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { AlertStatus } from '#shared/types/sinapse'

/** Normaliza "Centro Oeste" → "Centro-Oeste" */
function normalizeRegionName(name: string): string {
  return name.replace(/\s+/g, '-')
}

/** Mapeia name_region do GeoJSON → id do switcher na store */
const GEOREGION_TO_STORE_ID: Record<string, string> = {
  Norte: 'norte',
  Nordeste: 'nordeste',
  'Centro-Oeste': 'centro-oeste',
  Sudeste: 'sudeste',
  Sul: 'sul'
}

/** Inverso: id do switcher → name_region do GeoJSON */
const STORE_ID_TO_GEOREGION: Record<string, string> = {
  norte: 'Norte',
  nordeste: 'Nordeste',
  'centro-oeste': 'Centro-Oeste',
  sudeste: 'Sudeste',
  sul: 'Sul'
}

/** Cores por alert status (alinhado ao design system) */
const ALERT_FILL_COLORS: Record<AlertStatus, string> = {
  green: '#B3D5A7',
  yellow: '#F0C653',
  red: '#EB5E57'
}

const DEFAULT_FILL_COLOR = '#D8E3EE'

function normalizeFeatures(geojson: GeoJSON.FeatureCollection) {
  for (const f of geojson.features) {
    if (f.properties?.name_region) {
      f.properties.name_region = normalizeRegionName(f.properties.name_region)
    }
  }
}

export function useHomeMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<maplibregl.Map | null>(null)
  const store = useHomeStore()

  // GeoJSON carregados (mantidos para rebuild de layers)
  let statesGeo: GeoJSON.FeatureCollection | null = null
  let regionsGeo: GeoJSON.FeatureCollection | null = null

  // Popup para hover
  let popup: maplibregl.Popup | null = null

  /** Constrói expressão match MapLibre para colorir estados por alert status da região */
  function buildAlertColorExpression(): maplibregl.ExpressionSpecification {
    const pairs: (string | maplibregl.ExpressionSpecification)[] = ['match', ['get', 'name_region']]

    if (store.regionRows.length > 0) {
      // Quando temos regionRows, cada row é uma região com alert status
      for (const row of store.regionRows) {
        // row.region pode ser "Norte", "Nordeste", etc. ou nome de estado
        // Aqui usamos quando é visão brasil (linhas = regiões)
        const alertStatus =
          row.todos.level === 'Elevado'
            ? 'red'
            : row.todos.level === 'Moderado'
              ? 'yellow'
              : 'green'
        pairs.push(row.region, ALERT_FILL_COLORS[alertStatus])
      }
    } else if (store.panorama) {
      // Fallback: usar alert status geral para todas as regiões
      const color = ALERT_FILL_COLORS[store.panorama.alertStatus]
      for (const geoName of Object.values(STORE_ID_TO_GEOREGION)) {
        pairs.push(geoName, color)
      }
    }

    pairs.push(DEFAULT_FILL_COLOR)
    return pairs as unknown as maplibregl.ExpressionSpecification
  }

  /** Remove layers e sources existentes para rebuild */
  function clearLayers(m: maplibregl.Map) {
    const layerIds = ['states-fill', 'states-border', 'region-outline']
    for (const id of layerIds) {
      if (m.getLayer(id)) m.removeLayer(id)
    }
    if (m.getSource('states')) m.removeSource('states')
    if (m.getSource('region-outline')) m.removeSource('region-outline')
  }

  /** Monta as layers do mapa com base no estado atual */
  function buildLayers(m: maplibregl.Map) {
    if (!statesGeo || !regionsGeo) return

    clearLayers(m)

    const selectedRegion = store.filtros.region
    const isBrasil = selectedRegion === 'brasil'
    const geoRegionName = STORE_ID_TO_GEOREGION[selectedRegion] ?? ''

    m.addSource('states', { type: 'geojson', data: statesGeo })

    // Fill com cores por alert status
    const regionFilter = ['==', ['get', 'name_region'], geoRegionName]

    m.addLayer({
      id: 'states-fill',
      type: 'fill',
      source: 'states',
      paint: {
        'fill-color': buildAlertColorExpression(),
        'fill-opacity': isBrasil ? 0.85 : (['case', regionFilter, 0.95, 0.3] as unknown as number)
      }
    })

    // Bordas entre estados
    m.addLayer({
      id: 'states-border',
      type: 'line',
      source: 'states',
      paint: {
        'line-color': '#FFFFFF',
        'line-width': 0.5,
        'line-opacity': 0.3
      }
    })

    // Contorno externo da região selecionada
    if (!isBrasil && geoRegionName) {
      m.addSource('region-outline', { type: 'geojson', data: regionsGeo })

      m.addLayer({
        id: 'region-outline',
        type: 'line',
        source: 'region-outline',
        filter: ['==', ['get', 'name_region'], geoRegionName],
        paint: {
          'line-color': '#333333',
          'line-width': 2.5,
          'line-opacity': 1
        }
      })
    }
  }

  /** Retorna info de alerta para um estado/região (para tooltip) */
  function getAlertInfo(regionName: string): { level: string; variation: string } | null {
    // Procurar nos regionRows
    const row = store.regionRows.find(r => r.region === regionName)
    if (row) {
      return { level: row.todos.level, variation: row.todos.value }
    }
    return null
  }

  /** Configura interações: click e hover */
  function setupInteractions(m: maplibregl.Map) {
    // Click → selecionar região
    m.on('click', 'states-fill', e => {
      const feature = e.features?.[0]
      if (!feature?.properties?.name_region) return

      const geoRegionName = feature.properties.name_region as string
      const storeId = GEOREGION_TO_STORE_ID[geoRegionName]
      if (!storeId) return

      // Se já é a região selecionada, volta para brasil
      if (store.filtros.region === storeId) {
        store.setRegion('brasil')
      } else {
        store.setRegion(storeId)
      }
    })

    // Hover → cursor pointer
    m.on('mouseenter', 'states-fill', () => {
      m.getCanvas().style.cursor = 'pointer'
    })

    m.on('mouseleave', 'states-fill', () => {
      m.getCanvas().style.cursor = ''
      if (popup) {
        popup.remove()
        popup = null
      }
    })

    // Hover → tooltip
    m.on('mousemove', 'states-fill', e => {
      const feature = e.features?.[0]
      if (!feature?.properties) return

      const stateName = (feature.properties.name_state as string) ?? ''
      const regionName = (feature.properties.name_region as string) ?? ''
      const alertInfo = getAlertInfo(regionName)

      let html = `<strong>${stateName}</strong>`
      if (alertInfo) {
        html += `<br><span style="font-size:11px">${alertInfo.level} · ${alertInfo.variation}</span>`
      }

      if (popup) {
        popup.setLngLat(e.lngLat).setHTML(html)
      } else {
        popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 8,
          className: 'home-map-tooltip'
        })
          .setLngLat(e.lngLat)
          .setHTML(html)
          .addTo(m)
      }
    })
  }

  onMounted(() => {
    if (!container.value) return

    const m = new maplibregl.Map({
      container: container.value,
      style: VECTOR_STYLE,
      center: [BRAZIL_CENTER.lng, BRAZIL_CENTER.lat],
      zoom: 3.5,
      minZoom: 1,
      maxZoom: 7,
      pitch: 0,
      attributionControl: false,
      dragRotate: false
    })

    map.value = m

    m.on('load', async () => {
      const [statesRes, regionsRes] = await Promise.all([
        fetch('/geo/brazil_simplified.geojson'),
        fetch('/geo/brazil_regions.geojson')
      ])
      statesGeo = (await statesRes.json()) as GeoJSON.FeatureCollection
      regionsGeo = (await regionsRes.json()) as GeoJSON.FeatureCollection

      normalizeFeatures(statesGeo)
      normalizeFeatures(regionsGeo)

      buildLayers(m)
      setupInteractions(m)
    })
  })

  // Reagir a mudanças de região e dados
  watch(
    () => [store.filtros.region, store.regionRows, store.panorama] as const,
    () => {
      if (map.value && statesGeo && regionsGeo) {
        buildLayers(map.value)
      }
    }
  )

  onUnmounted(() => {
    if (popup) {
      popup.remove()
      popup = null
    }
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  })

  return { map }
}
