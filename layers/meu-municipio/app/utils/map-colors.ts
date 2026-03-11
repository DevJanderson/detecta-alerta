/**
 * Cores específicas do mapa meu-município
 *
 * Cores compartilhadas (LEVEL_COLORS, LEVEL_LABELS, etc.) vêm de
 * layers/base/app/utils/map-colors.ts (auto-importadas pelo Nuxt).
 *
 * Aqui ficam apenas as cores específicas desta feature.
 */
import type { ExpressionSpecification } from 'maplibre-gl'

/** Cores por região do Brasil (meu-município usa cores distintas por região nos alertas) */
export const REGION_COLORS = {
  Norte: '#22c55e',
  Nordeste: '#eab308',
  'Centro-Oeste': '#f97316',
  Sudeste: '#3b82f6',
  Sul: '#8b5cf6'
} as const

/** Expressão MapLibre para cor de preenchimento por região (meu-município) */
export const REGION_FILL_EXPRESSION: ExpressionSpecification = [
  'match',
  ['get', 'name_region'],
  'Norte',
  REGION_COLORS.Norte,
  'Nordeste',
  REGION_COLORS.Nordeste,
  'Centro-Oeste',
  REGION_COLORS['Centro-Oeste'],
  'Sudeste',
  REGION_COLORS.Sudeste,
  'Sul',
  REGION_COLORS.Sul,
  DEFAULT_REGION_COLOR
]
