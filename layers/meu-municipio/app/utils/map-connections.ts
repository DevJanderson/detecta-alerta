/**
 * Construção de linhas de conexão entre cidades
 */
import type { AlertCity, CityConnection } from '../composables/types'

const ARC_STEPS = 30
const ARC_HEIGHT = 1.5

/** Gera GeoJSON com arcos curvos entre cidades conectadas */
export function buildConnectionLines(
  cities: AlertCity[],
  connections: CityConnection[]
): GeoJSON.FeatureCollection {
  const cityMap = new Map(cities.map(c => [c.name, c]))

  return {
    type: 'FeatureCollection',
    features: connections
      .map(conn => {
        const from = cityMap.get(conn.from)
        const to = cityMap.get(conn.to)
        if (!from || !to) return null

        const points: [number, number][] = []
        for (let i = 0; i <= ARC_STEPS; i++) {
          const t = i / ARC_STEPS
          const lng = from.coords.lng + (to.coords.lng - from.coords.lng) * t
          const lat = from.coords.lat + (to.coords.lat - from.coords.lat) * t
          const arc = Math.sin(t * Math.PI) * ARC_HEIGHT
          points.push([lng, lat + arc])
        }

        return {
          type: 'Feature' as const,
          geometry: { type: 'LineString' as const, coordinates: points },
          properties: { fromLevel: from.level, toLevel: to.level }
        }
      })
      .filter(Boolean) as GeoJSON.Feature[]
  }
}
