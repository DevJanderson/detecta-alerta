/**
 * Funções para adicionar camadas ao mapa MapLibre
 *
 * Cada função recebe a instância do mapa e adiciona sources + layers.
 * Funções puras (sem estado) — todo estado fica no composable.
 */
import maplibregl from 'maplibre-gl'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import type { AlertCity, CityConnection } from '../composables/types'
// LEVEL_COLORS, LEVEL_LABELS, LEVEL_COLOR_EXPRESSION, DEFAULT_REGION_COLOR
// vêm auto-importados de layers/base/app/utils/map-colors.ts
import { REGION_COLORS, REGION_FILL_EXPRESSION } from './map-colors'
import { buildConnectionLines } from './map-connections'

// ============================================================================
// STATE LAYERS (estados do Brasil)
// ============================================================================

interface StateHoverHandler {
  hoveredStateId: string | number | null
}

export async function addStateLayers(m: maplibregl.Map, hover: StateHoverHandler) {
  const response = await fetch('/geo/brazil_states.topojson')
  const topo = await response.json()
  const geojson = feature(
    topo as Topology,
    topo.objects.states
  ) as unknown as GeoJSON.FeatureCollection

  geojson.features.forEach((f, i) => {
    f.id = i
  })

  m.addSource('states', { type: 'geojson', data: geojson, promoteId: undefined })

  m.addLayer({
    id: 'states-fill',
    type: 'fill',
    source: 'states',
    paint: {
      'fill-color': REGION_FILL_EXPRESSION,
      'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.25, 0.08]
    }
  })

  m.addLayer({
    id: 'states-border',
    type: 'line',
    source: 'states',
    paint: {
      'line-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#1e293b', '#94a3b8'],
      'line-width': ['case', ['boolean', ['feature-state', 'hover'], false], 2.5, 1],
      'line-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.8, 0.4]
    }
  })

  m.addLayer({
    id: 'states-label',
    type: 'symbol',
    source: 'states',
    layout: {
      'text-field': ['get', 'abbrev_state'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 3, 8, 6, 12],
      'text-font': ['Noto Sans Bold'],
      'text-allow-overlap': false,
      'text-ignore-placement': false
    },
    paint: {
      'text-color': '#475569',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5,
      'text-opacity': ['interpolate', ['linear'], ['zoom'], 3, 0.6, 5, 1]
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

  // Click popup
  m.on('click', 'states-fill', e => {
    const feat = e.features?.[0]
    if (!feat) return

    const { name_state, abbrev_state, name_region } = feat.properties as Record<string, string>
    const regionColor =
      (name_region && REGION_COLORS[name_region as keyof typeof REGION_COLORS]) ||
      DEFAULT_REGION_COLOR

    new maplibregl.Popup({ offset: 10, closeButton: false, maxWidth: '220px' })
      .setLngLat(e.lngLat)
      .setHTML(
        `<div style="font-family: system-ui; padding: 6px 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap: 8px;">
            <strong style="font-size: 15px;">${name_state}</strong>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 99px; background: ${regionColor}18; color: ${regionColor}; font-weight: 600;">${abbrev_state}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 8px 0;" />
          <div style="font-size: 12px; color: #64748b;">
            <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${regionColor}; margin-right: 6px;"></span>
            Região ${name_region}
          </div>
        </div>`
      )
      .addTo(m)
  })
}

// ============================================================================
// CONNECTION LAYERS (linhas entre cidades)
// ============================================================================

export function addConnectionLayers(
  m: maplibregl.Map,
  cities: AlertCity[],
  connections: CityConnection[]
) {
  m.addSource('connections', { type: 'geojson', data: buildConnectionLines(cities, connections) })

  m.addLayer(
    {
      id: 'connections-line',
      type: 'line',
      source: 'connections',
      paint: {
        'line-color': '#94a3b8',
        'line-width': 1.5,
        'line-opacity': 0.4,
        'line-dasharray': [4, 4]
      }
    },
    'alerts-halo'
  )
}

// ============================================================================
// HEATMAP LAYER
// ============================================================================

export function addHeatmapLayer(m: maplibregl.Map, cities: AlertCity[], maxCases: number) {
  m.addSource('heatmap', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: cities.map(city => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [city.coords.lng, city.coords.lat] },
        properties: { weight: city.cases / maxCases }
      }))
    }
  })

  m.addLayer(
    {
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'heatmap',
      maxzoom: 9,
      paint: {
        'heatmap-weight': ['get', 'weight'],
        'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 3, 0.8, 9, 3],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(0,0,0,0)',
          0.1,
          'rgba(34,197,94,0.2)',
          0.3,
          'rgba(234,179,8,0.3)',
          0.5,
          'rgba(234,179,8,0.5)',
          0.7,
          'rgba(229,62,62,0.5)',
          1,
          'rgba(229,62,62,0.7)'
        ],
        'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 3, 40, 9, 80],
        'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 0.8, 9, 0]
      }
    },
    'connections-line'
  )
}

// ============================================================================
// ALERT LAYERS (pontos de alerta)
// ============================================================================

export function addAlertLayers(m: maplibregl.Map, cities: AlertCity[]) {
  m.addSource('alerts', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: cities.map(city => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [city.coords.lng, city.coords.lat] },
        properties: { name: city.name, level: city.level, cases: city.cases, trend: city.trend }
      }))
    }
  })

  m.addLayer({
    id: 'alerts-halo',
    type: 'circle',
    source: 'alerts',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        3,
        ['case', ['==', ['get', 'level'], 'alto'], 25, ['==', ['get', 'level'], 'medio'], 18, 12],
        8,
        ['case', ['==', ['get', 'level'], 'alto'], 50, ['==', ['get', 'level'], 'medio'], 35, 25]
      ],
      'circle-color': LEVEL_COLOR_EXPRESSION,
      'circle-opacity': 0.15,
      'circle-stroke-width': 0,
      'circle-blur': 0.8
    }
  })

  m.addLayer({
    id: 'alerts-circle',
    type: 'circle',
    source: 'alerts',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        3,
        ['case', ['==', ['get', 'level'], 'alto'], 10, ['==', ['get', 'level'], 'medio'], 7, 5],
        8,
        ['case', ['==', ['get', 'level'], 'alto'], 20, ['==', ['get', 'level'], 'medio'], 14, 10]
      ],
      'circle-color': LEVEL_COLOR_EXPRESSION,
      'circle-opacity': 0.7,
      'circle-stroke-width': 2.5,
      'circle-stroke-color': '#ffffff'
    }
  })

  m.addLayer({
    id: 'alerts-count',
    type: 'symbol',
    source: 'alerts',
    layout: {
      'text-field': [
        'case',
        ['>=', ['get', 'cases'], 1000],
        ['concat', ['to-string', ['/', ['round', ['/', ['get', 'cases'], 100]], 10]], 'k'],
        ['to-string', ['get', 'cases']]
      ],
      'text-size': ['interpolate', ['linear'], ['zoom'], 3, 9, 8, 13],
      'text-font': ['Noto Sans Bold'],
      'text-allow-overlap': true
    },
    paint: {
      'text-color': '#ffffff',
      'text-halo-color': 'rgba(0,0,0,0.3)',
      'text-halo-width': 0.5
    }
  })

  m.addLayer({
    id: 'alerts-label',
    type: 'symbol',
    source: 'alerts',
    layout: {
      'text-field': ['get', 'name'],
      'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 8, 13],
      'text-offset': [0, 1.8],
      'text-anchor': 'top',
      'text-font': ['Noto Sans Bold']
    },
    paint: {
      'text-color': '#1e293b',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5
    }
  })

  // Click popup + flyTo
  m.on('click', 'alerts-circle', e => {
    const f = e.features?.[0]
    if (!f || f.geometry.type !== 'Point') return

    const props = f.properties as { name: string; level: string; cases: number; trend: string }
    const color = LEVEL_COLORS[props.level as keyof typeof LEVEL_COLORS] || '#666'
    const label = LEVEL_LABELS[props.level as keyof typeof LEVEL_LABELS] || props.level
    const trendColor = props.trend.startsWith('+') ? LEVEL_COLORS.alto : LEVEL_COLORS.baixo
    const trendIcon = props.trend.startsWith('+') ? '&#9650;' : '&#9660;'
    const coords = f.geometry.coordinates as [number, number]

    new maplibregl.Popup({ offset: 20, closeButton: false, maxWidth: '260px' })
      .setLngLat(coords)
      .setHTML(
        `<div style="font-family: system-ui; padding: 6px 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size: 15px;">${props.name}</strong>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 99px; background: ${color}18; color: ${color}; font-weight: 600;">${label}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 8px 0;" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Casos (SE)</div>
              <div style="font-size: 20px; font-weight: 700; color: #1e293b;">${props.cases.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Tendência</div>
              <div style="font-size: 20px; font-weight: 700; color: ${trendColor};">${trendIcon} ${props.trend}</div>
            </div>
          </div>
          <div style="margin-top: 10px; padding: 6px 10px; background: #f8fafc; border-radius: 8px; font-size: 11px; color: #64748b;">
            Clique para voar até a cidade
          </div>
        </div>`
      )
      .addTo(m)

    m.flyTo({
      center: coords,
      zoom: 10,
      pitch: 55,
      bearing: Math.random() * 40 - 20,
      duration: 2500,
      essential: true
    })
  })

  m.on('mouseenter', 'alerts-circle', () => {
    m.getCanvas().style.cursor = 'pointer'
    m.setPaintProperty('alerts-circle', 'circle-stroke-width', 4)
  })
  m.on('mouseleave', 'alerts-circle', () => {
    m.getCanvas().style.cursor = ''
    m.setPaintProperty('alerts-circle', 'circle-stroke-width', 2.5)
  })
}

// ============================================================================
// PULSE ANIMATION
// ============================================================================

const PULSE_MIN = 0.08
const PULSE_MAX = 0.3
const PULSE_STEP = 0.003

export function startPulseAnimation(m: maplibregl.Map): number {
  let growing = true
  let opacity = 0.15

  const animate = () => {
    if (!m.getLayer('alerts-halo')) return

    if (growing) {
      opacity += PULSE_STEP
      if (opacity >= PULSE_MAX) growing = false
    } else {
      opacity -= PULSE_STEP
      if (opacity <= PULSE_MIN) growing = true
    }

    m.setPaintProperty('alerts-halo', 'circle-opacity', opacity)
    requestAnimationFrame(animate)
  }

  return requestAnimationFrame(animate)
}
