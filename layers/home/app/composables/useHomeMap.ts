/**
 * Composable do mapa da home — orquestrador
 *
 * Instancia o MapLibre com estados coloridos por região (choropleth).
 * Quando uma região é selecionada: fill nos estados + contorno externo
 * (sem bordas internas entre estados da mesma região).
 *
 * Usa dois GeoJSON estáticos:
 * - brazil_simplified.geojson: 27 estados (fill + bordas brancas)
 * - brazil_regions.geojson: 5 regiões unidas (contorno externo)
 */
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

/** Normaliza "Centro Oeste" → "Centro-Oeste" */
function normalizeRegionName(name: string): string {
  return name.replace(/\s+/g, '-')
}

/** Cores por região (alinhado ao design system) */
const REGION_COLORS: Record<string, string> = {
  Norte: '#BAD0E6',
  Nordeste: '#F0C653',
  Sudeste: '#EB5E57',
  Sul: '#BAD0E6',
  'Centro-Oeste': '#BAD0E6'
}

const UNSELECTED_COLOR = '#D8E3EE'

/** Expressão match MapLibre para colorir estados por região */
function buildColorMatchExpression(): maplibregl.ExpressionSpecification {
  const pairs: (string | maplibregl.ExpressionSpecification)[] = ['match', ['get', 'name_region']]
  for (const [region, color] of Object.entries(REGION_COLORS)) {
    pairs.push(region, color)
  }
  pairs.push(UNSELECTED_COLOR)
  return pairs as unknown as maplibregl.ExpressionSpecification
}

function addStatesLayer(
  m: maplibregl.Map,
  states: GeoJSON.FeatureCollection,
  regions: GeoJSON.FeatureCollection,
  selectedRegion: string
) {
  m.addSource('states', { type: 'geojson', data: states })

  const isBrasil = selectedRegion === 'brasil'
  const regionFilter = ['==', ['get', 'name_region'], selectedRegion]

  // Fill: todos os estados coloridos por região
  m.addLayer({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': buildColorMatchExpression(),
      'fill-opacity': isBrasil ? 0.85 : (['case', regionFilter, 0.95, 0.4] as unknown as number)
    }
  })

  // Bordas entre estados (quase invisíveis)
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

  // Contorno externo da região selecionada (polígono já unido, sem bordas internas)
  if (!isBrasil) {
    m.addSource('region-outline', { type: 'geojson', data: regions })

    m.addLayer({
      id: 'region-outline',
      type: 'line',
      source: 'region-outline',
      filter: ['==', ['get', 'name_region'], selectedRegion],
      paint: {
        'line-color': '#333333',
        'line-width': 2.5,
        'line-opacity': 1
      }
    })
  }
}

function normalizeFeatures(geojson: GeoJSON.FeatureCollection) {
  for (const f of geojson.features) {
    if (f.properties?.name_region) {
      f.properties.name_region = normalizeRegionName(f.properties.name_region)
    }
  }
}

export function useHomeMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<maplibregl.Map | null>(null)

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
      const states = (await statesRes.json()) as GeoJSON.FeatureCollection
      const regions = (await regionsRes.json()) as GeoJSON.FeatureCollection

      normalizeFeatures(states)
      normalizeFeatures(regions)

      addStatesLayer(m, states, regions, 'brasil')
    })
  })

  onUnmounted(() => {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  })

  return { map }
}
