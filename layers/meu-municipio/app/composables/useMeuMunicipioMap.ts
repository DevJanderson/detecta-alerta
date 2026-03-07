import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { feature } from 'topojson-client'
import type { Topology } from 'topojson-specification'
import {
  ALERT_CITIES,
  BRAZIL_CENTER,
  BRAZIL_ZOOM,
  CONNECTIONS,
  LEVEL_COLORS,
  LEVEL_LABELS,
  REGION_COLORS,
  VECTOR_STYLE
} from './meu-municipio-map-data'

let hoveredStateId: string | number | null = null

function buildConnectionLines(): GeoJSON.FeatureCollection {
  const cityMap = new Map(ALERT_CITIES.map(c => [c.name, c]))

  return {
    type: 'FeatureCollection',
    features: CONNECTIONS.map(conn => {
      const from = cityMap.get(conn.from)
      const to = cityMap.get(conn.to)
      if (!from || !to) return null

      const points: [number, number][] = []
      const steps = 30
      for (let i = 0; i <= steps; i++) {
        const t = i / steps
        const lng = from.coords[0] + (to.coords[0] - from.coords[0]) * t
        const lat = from.coords[1] + (to.coords[1] - from.coords[1]) * t
        const arc = Math.sin(t * Math.PI) * 1.5
        points.push([lng, lat + arc])
      }

      return {
        type: 'Feature' as const,
        geometry: { type: 'LineString' as const, coordinates: points },
        properties: { fromLevel: from.level, toLevel: to.level }
      }
    }).filter(Boolean) as GeoJSON.Feature[]
  }
}

async function addStateLayers(m: maplibregl.Map) {
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
      'fill-color': [
        'match',
        ['get', 'name_region'],
        'Norte',
        '#22c55e',
        'Nordeste',
        '#eab308',
        'Centro-Oeste',
        '#f97316',
        'Sudeste',
        '#3b82f6',
        'Sul',
        '#8b5cf6',
        '#94a3b8'
      ],
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
      'text-font': ['Open Sans Semibold'],
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

  m.on('mousemove', 'states-fill', e => {
    if (!e.features?.length) return
    if (hoveredStateId !== null) {
      m.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false })
    }
    hoveredStateId = e.features![0]!.id ?? null
    if (hoveredStateId !== null) {
      m.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: true })
    }
    m.getCanvas().style.cursor = 'pointer'
  })

  m.on('mouseleave', 'states-fill', () => {
    if (hoveredStateId !== null) {
      m.setFeatureState({ source: 'states', id: hoveredStateId }, { hover: false })
      hoveredStateId = null
    }
    m.getCanvas().style.cursor = ''
  })

  m.on('click', 'states-fill', e => {
    const feat = e.features?.[0]
    if (!feat) return

    const { name_state, abbrev_state, name_region } = feat.properties as Record<string, string>
    const regionColor = (name_region && REGION_COLORS[name_region]) || '#94a3b8'

    new maplibregl.Popup({ offset: 10, closeButton: false, maxWidth: '220px' })
      .setLngLat(e.lngLat)
      .setHTML(
        `
        <div style="font-family: system-ui; padding: 6px 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap: 8px;">
            <strong style="font-size: 15px;">${name_state}</strong>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 99px; background: ${regionColor}18; color: ${regionColor}; font-weight: 600;">${abbrev_state}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 8px 0;" />
          <div style="font-size: 12px; color: #64748b;">
            <span style="display:inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${regionColor}; margin-right: 6px;"></span>
            Região ${name_region}
          </div>
        </div>
      `
      )
      .addTo(m)
  })
}

function addConnectionLayers(m: maplibregl.Map) {
  m.addSource('connections', { type: 'geojson', data: buildConnectionLines() })

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

function addHeatmapLayer(m: maplibregl.Map) {
  m.addSource('heatmap', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: ALERT_CITIES.map(city => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: city.coords },
        properties: { weight: city.cases / 1247 }
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

function addAlertLayers(m: maplibregl.Map) {
  m.addSource('alerts', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: ALERT_CITIES.map(city => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: city.coords },
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
      'circle-color': [
        'case',
        ['==', ['get', 'level'], 'alto'],
        '#e53e3e',
        ['==', ['get', 'level'], 'medio'],
        '#eab308',
        '#22c55e'
      ],
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
      'circle-color': [
        'case',
        ['==', ['get', 'level'], 'alto'],
        '#e53e3e',
        ['==', ['get', 'level'], 'medio'],
        '#eab308',
        '#22c55e'
      ],
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
      'text-font': ['Open Sans Bold'],
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
      'text-font': ['Open Sans Semibold']
    },
    paint: {
      'text-color': '#1e293b',
      'text-halo-color': '#ffffff',
      'text-halo-width': 1.5
    }
  })

  m.on('click', 'alerts-circle', e => {
    const f = e.features?.[0]
    if (!f || f.geometry.type !== 'Point') return

    const { name, level, cases, trend } = f.properties
    const color = LEVEL_COLORS[level] || '#666'
    const label = LEVEL_LABELS[level] || level
    const trendColor = trend.startsWith('+') ? '#e53e3e' : '#22c55e'
    const trendIcon = trend.startsWith('+') ? '&#9650;' : '&#9660;'
    const coords = f.geometry.coordinates as [number, number]

    new maplibregl.Popup({ offset: 20, closeButton: false, maxWidth: '260px' })
      .setLngLat(coords)
      .setHTML(
        `
        <div style="font-family: system-ui; padding: 6px 2px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size: 15px;">${name}</strong>
            <span style="font-size: 11px; padding: 2px 8px; border-radius: 99px; background: ${color}18; color: ${color}; font-weight: 600;">${label}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 8px 0;" />
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Casos (SE)</div>
              <div style="font-size: 20px; font-weight: 700; color: #1e293b;">${cases.toLocaleString('pt-BR')}</div>
            </div>
            <div>
              <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Tendência</div>
              <div style="font-size: 20px; font-weight: 700; color: ${trendColor};">${trendIcon} ${trend}</div>
            </div>
          </div>
          <div style="margin-top: 10px; padding: 6px 10px; background: #f8fafc; border-radius: 8px; font-size: 11px; color: #64748b;">
            Clique para voar até a cidade
          </div>
        </div>
      `
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

function startPulseAnimation(m: maplibregl.Map): number {
  let growing = true
  let opacity = 0.15

  const animate = () => {
    if (!m.getLayer('alerts-halo')) return

    if (growing) {
      opacity += 0.003
      if (opacity >= 0.3) growing = false
    } else {
      opacity -= 0.003
      if (opacity <= 0.08) growing = true
    }

    m.setPaintProperty('alerts-halo', 'circle-opacity', opacity)
    requestAnimationFrame(animate)
  }

  return requestAnimationFrame(animate)
}

export function useMeuMunicipioMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<maplibregl.Map | null>(null)
  let pulseAnimation: number | null = null

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
      await addStateLayers(m)
      addAlertLayers(m)
      addConnectionLayers(m)
      addHeatmapLayer(m)

      pulseAnimation = startPulseAnimation(m)

      setTimeout(() => {
        m.flyTo({
          center: BRAZIL_CENTER,
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

    m.on('dblclick', e => {
      const features = m.queryRenderedFeatures(e.point, { layers: ['alerts-circle'] })
      if (features.length > 0) return

      e.preventDefault()
      m.flyTo({
        center: BRAZIL_CENTER,
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
