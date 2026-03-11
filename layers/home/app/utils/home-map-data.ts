/**
 * Dados mock do mapa da home — movimento por região
 *
 * TODO: substituir por dados reais da API Sinapse
 */

export type MovementLevel = 'normal' | 'moderado' | 'elevado'
export type MovementTrend = 'up' | 'down'

export interface RegionMovement {
  region: string
  level: MovementLevel
  trend: MovementTrend
  label: string
  detail?: string
}

/** Dados mock de movimento por região (baseados no Figma) */
export const REGION_MOVEMENTS: RegionMovement[] = [
  {
    region: 'Norte',
    level: 'normal',
    trend: 'up',
    label: '+34 visitas à UBS, UPA ou Drogarias'
  },
  {
    region: 'Nordeste',
    level: 'moderado',
    trend: 'up',
    label: '+2.4 mil visitas'
  },
  {
    region: 'Centro-Oeste',
    level: 'normal',
    trend: 'down',
    label: '-245 visitas'
  },
  {
    region: 'Sudeste',
    level: 'normal',
    trend: 'down',
    label: '-1.1 mil visitas'
  },
  {
    region: 'Sul',
    level: 'elevado',
    trend: 'up',
    label: '+8 mil visitas'
  }
]

/** Total nacional */
export const NATIONAL_MOVEMENT = {
  trend: 'up' as MovementTrend,
  label: '+9 mil visitas'
}
