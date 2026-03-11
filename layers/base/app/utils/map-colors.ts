/**
 * Cores do mapa — centralizadas para evitar duplicação
 *
 * Todas as cores hex usadas no MapLibre ficam aqui.
 * Componentes Vue usam classes Tailwind do design system.
 *
 * Usado por: home (mapa de regiões), meu-municipio (mapa de alertas)
 */
import type { ExpressionSpecification } from 'maplibre-gl'

/** Cores por nível de alerta */
export const LEVEL_COLORS = {
  alto: '#e53e3e',
  medio: '#eab308',
  baixo: '#22c55e'
} as const

/** Labels por nível de alerta */
export const LEVEL_LABELS = {
  alto: 'Alto',
  medio: 'Moderado',
  baixo: 'Baixo'
} as const

/**
 * Cores por nível de movimento (Figma design)
 * Normal = azul claro, Moderado = amarelo/laranja, Elevado = vermelho
 */
export const MOVEMENT_COLORS = {
  normal: '#3b82f6',
  moderado: '#f59e0b',
  elevado: '#e53e3e'
} as const

/** Cor fallback para região desconhecida */
export const DEFAULT_REGION_COLOR = '#94a3b8'

/** Expressão MapLibre para cor por nível de alerta */
export const LEVEL_COLOR_EXPRESSION: ExpressionSpecification = [
  'case',
  ['==', ['get', 'level'], 'alto'],
  LEVEL_COLORS.alto,
  ['==', ['get', 'level'], 'medio'],
  LEVEL_COLORS.medio,
  LEVEL_COLORS.baixo
]
