/**
 * Camadas do mapa da home — choropleth por região
 *
 * Visualização simplificada: estados coloridos por nível de movimento da região.
 * Sem alertas por cidade, heatmap ou conexões (esses ficam no meu-município).
 */
import maplibregl from 'maplibre-gl'
import { feature, merge } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { RegionMovement, MovementLevel } from './home-map-data'

// ============================================================================
// HELPERS
// ============================================================================

/** Cor de preenchimento por nível de movimento (tons suaves, alinhado ao Figma) */
const FILL_BY_LEVEL: Record<MovementLevel, string> = {
  normal: '#bad0e6', // secondary-300 (azul suave)
  moderado: '#faebc2', // alert-200 (amarelo suave)
  elevado: '#fbdcdb' // danger-200 (rosa suave)
}

const BADGE_TEXT_BY_LEVEL: Record<MovementLevel, string> = {
  normal: '#1d4ed8',
  moderado: '#a16207',
  elevado: '#be123c'
}

const TREND_ICON_BY_LEVEL: Record<MovementLevel, string> = {
  normal: '#3b82f6',
  moderado: '#f59e0b',
  elevado: '#e53e3e'
}

/**
 * Normaliza nome de região (TopoJSON usa "Centro Oeste", código usa "Centro-Oeste")
 */
function normalizeRegionName(name: string): string {
  return name.replace(/\s+/g, '-')
}

/**
 * Cria lookup de region→level a partir dos dados de movimento
 */
function buildRegionLevelMap(movements: RegionMovement[]): Record<string, MovementLevel> {
  const map: Record<string, MovementLevel> = {}
  for (const m of movements) {
    map[m.region] = m.level
  }
  return map
}

/**
 * Gera expressão MapLibre match para colorir estados baseado na região
 */
function buildFillExpression(
  regionLevels: Record<string, MovementLevel>,
  colorMap: Record<MovementLevel, string>
): maplibregl.ExpressionSpecification {
  const expr: unknown[] = ['match', ['get', 'name_region']]
  for (const [region, level] of Object.entries(regionLevels)) {
    expr.push(region, colorMap[level])
  }
  expr.push('#e2e8f0') // fallback
  return expr as maplibregl.ExpressionSpecification
}

// ============================================================================
// LAYERS
// ============================================================================

interface HomeMapHoverState {
  hoveredStateId: string | number | null
}

/**
 * Adiciona camadas de estados com cores baseadas no nível de movimento por região
 */
export async function addHomeStateLayers(
  m: maplibregl.Map,
  hover: HomeMapHoverState,
  movements: RegionMovement[]
) {
  const response = await fetch('/geo/brazil_states.topojson')
  const topo = await response.json()
  const geojson = feature(
    topo as Topology,
    topo.objects.states
  ) as unknown as GeoJSON.FeatureCollection

  geojson.features.forEach((f, i) => {
    f.id = i
    // Normaliza "Centro Oeste" → "Centro-Oeste" para match com dados mock
    if (f.properties?.name_region) {
      f.properties.name_region = normalizeRegionName(f.properties.name_region)
    }
  })

  const regionLevels = buildRegionLevelMap(movements)
  const fillExpr = buildFillExpression(regionLevels, FILL_BY_LEVEL)

  m.addSource('states', { type: 'geojson', data: geojson })

  // Preenchimento por região (estados da mesma região = mesma cor)
  m.addLayer({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': fillExpr,
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.95, 0.8]
    }
  })

  // Borda azul no contorno de cada região (merge de estados via topojson)
  const regionNames = [...new Set(geojson.features.map(f => f.properties?.name_region as string))]
  const regionFeatures: GeoJSON.Feature[] = regionNames.map(name => {
    const stateGeoms = topo.objects.states.geometries.filter(
      (g: { properties?: { name_region?: string } }) =>
        normalizeRegionName(g.properties?.name_region ?? '') === name
    )
    const merged = merge(topo as Topology, stateGeoms)
    return {
      type: 'Feature' as const,
      properties: { name_region: name },
      geometry: merged
    }
  })

  m.addSource('regions', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: regionFeatures }
  })

  m.addLayer({
    id: 'region-border',
    type: 'line',
    source: 'regions',
    paint: {
      'line-color': '#6c9fd5',
      'line-width': 2,
      'line-opacity': 0.9
    }
  })

  // Hover interaction
  m.on('mousemove', 'states-fill', e => {
    if (!e.features?.length) return
    if (hover.hoveredStateId !== null) {
      m.setFeatureState({ source: 'states', id: hover.hoveredStateId }, { hover: false })
    }
    hover.hoveredStateId = e.features![0]!.id ?? null
    if (hover.hoveredStateId !== null) {
      m.setFeatureState({ source: 'states', id: hover.hoveredStateId }, { hover: true })
    }
    m.getCanvas().style.cursor = 'pointer'
  })

  m.on('mouseleave', 'states-fill', () => {
    if (hover.hoveredStateId !== null) {
      m.setFeatureState({ source: 'states', id: hover.hoveredStateId }, { hover: false })
      hover.hoveredStateId = null
    }
    m.getCanvas().style.cursor = ''
  })
}

/**
 * Adiciona markers HTML com badges de variação por região (conforme Figma)
 */
export function addRegionMarkers(
  m: maplibregl.Map,
  movements: RegionMovement[]
): maplibregl.Marker[] {
  const markers: maplibregl.Marker[] = []

  for (const movement of movements) {
    const center = REGION_CENTERS[movement.region]
    if (!center) continue

    const trendArrow = movement.trend === 'up' ? '↑' : '↓'
    const textColor = BADGE_TEXT_BY_LEVEL[movement.level]
    const iconColor = TREND_ICON_BY_LEVEL[movement.level]

    const el = document.createElement('div')
    el.className = 'home-map-badge'
    el.innerHTML = `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        pointer-events: none;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <span style="color: #6c9fd5; font-size: 11px; font-weight: 600;">${movement.region}</span>
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(0,0,0,0.06);
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          white-space: nowrap;
        ">
          <span style="color: ${iconColor}; font-size: 12px; font-weight: 700;">${trendArrow}</span>
          <span style="color: ${textColor}; font-size: 12px; font-weight: 600;">${movement.label}</span>
        </div>
      </div>
    `

    const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
      .setLngLat([center.lng, center.lat])
      .addTo(m)

    markers.push(marker)
  }

  return markers
}
