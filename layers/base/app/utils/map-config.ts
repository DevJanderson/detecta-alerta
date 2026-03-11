/**
 * Configuração compartilhada do mapa — constantes de posição e estilo
 *
 * Usado por: home (mapa de regiões), meu-municipio (mapa de alertas)
 */

/** Centro geográfico do Brasil */
export const BRAZIL_CENTER: Coordenadas = Object.freeze({ lng: -51.9253, lat: -14.235 })

/** Zoom padrão para visão nacional */
export const BRAZIL_ZOOM = 4

/**
 * Bounding box do Brasil (SW → NE) com margem para caber na viewport.
 * Usado no mapa da home para restringir a visualização ao território nacional.
 */
export const BRAZIL_BOUNDS: [[number, number], [number, number]] = [
  [-85.0, -45.0], // SW (lng, lat) — margem ampla ao redor do Brasil
  [-18.0, 15.0] // NE (lng, lat)
]

/** Estilo vetorial gratuito (OpenFreeMap — sem API key) */
export const VECTOR_STYLE = 'https://tiles.openfreemap.org/styles/positron'

/** Estilos de mapa disponíveis (OpenFreeMap — sem API key) */
export const MAP_STYLES = [
  { id: 'liberty', label: 'Padrão', url: 'https://tiles.openfreemap.org/styles/liberty' },
  { id: 'bright', label: 'Claro', url: 'https://tiles.openfreemap.org/styles/bright' },
  { id: 'positron', label: 'Minimalista', url: 'https://tiles.openfreemap.org/styles/positron' }
] as const

export type MapStyleId = (typeof MAP_STYLES)[number]['id']

/** Coordenadas centrais aproximadas de cada macro-região */
export const REGION_CENTERS: Record<string, Coordenadas> = {
  Norte: Object.freeze({ lng: -62.5, lat: -3.5 }),
  Nordeste: Object.freeze({ lng: -38.5, lat: -10.0 }),
  'Centro-Oeste': Object.freeze({ lng: -52.0, lat: -15.5 }),
  Sudeste: Object.freeze({ lng: -45.0, lat: -21.5 }),
  Sul: Object.freeze({ lng: -50.5, lat: -27.5 })
}
