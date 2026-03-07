/**
 * Value Object — Coordenadas geográficas (longitude, latitude)
 *
 * Segue convenção [lng, lat] usada por GeoJSON e MapLibre.
 * Bounds opcionais para Brasil continental.
 *
 * Imutável após criação. Valida ranges no factory.
 */

/** Bounds do Brasil continental (com margem) */
const BRASIL_BOUNDS = {
  minLng: -74.0,
  maxLng: -34.0,
  minLat: -34.0,
  maxLat: 6.0
} as const

export interface Coordenadas {
  readonly lng: number
  readonly lat: number
}

export interface CoordenadaOptions {
  /** Se true, valida que está dentro dos bounds do Brasil */
  validarBrasil?: boolean
}

export function createCoordenadas(
  lng: number,
  lat: number,
  options: CoordenadaOptions = {}
): Coordenadas {
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    throw new Error(
      `Coordenadas inválidas: lng=${lng}, lat=${lat}. Valores devem ser numéricos finitos.`
    )
  }

  if (lng < -180 || lng > 180) {
    throw new Error(`Longitude fora do range: ${lng}. Deve estar entre -180 e 180.`)
  }

  if (lat < -90 || lat > 90) {
    throw new Error(`Latitude fora do range: ${lat}. Deve estar entre -90 e 90.`)
  }

  if (options.validarBrasil) {
    if (
      lng < BRASIL_BOUNDS.minLng ||
      lng > BRASIL_BOUNDS.maxLng ||
      lat < BRASIL_BOUNDS.minLat ||
      lat > BRASIL_BOUNDS.maxLat
    ) {
      throw new Error(
        `Coordenadas fora do Brasil: lng=${lng}, lat=${lat}. ` +
          `Bounds esperados: lng [${BRASIL_BOUNDS.minLng}, ${BRASIL_BOUNDS.maxLng}], ` +
          `lat [${BRASIL_BOUNDS.minLat}, ${BRASIL_BOUNDS.maxLat}].`
      )
    }
  }

  return Object.freeze({ lng, lat })
}

export function coordenadasToTuple(coord: Coordenadas): [number, number] {
  return [coord.lng, coord.lat]
}

export function coordenadasFromTuple(
  tuple: [number, number],
  options?: CoordenadaOptions
): Coordenadas {
  return createCoordenadas(tuple[0], tuple[1], options)
}

export function coordenadasEquals(a: Coordenadas, b: Coordenadas): boolean {
  return a.lng === b.lng && a.lat === b.lat
}

export function coordenadasDistanceKm(a: Coordenadas, b: Coordenadas): number {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const h = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}
