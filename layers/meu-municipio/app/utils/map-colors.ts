/**
 * Cores do mapa — centralizadas para evitar duplicação
 *
 * Todas as cores hex usadas no MapLibre ficam aqui.
 * Componentes Vue usam classes Tailwind do design system.
 */

/** Cores por nível de alerta */
export const LEVEL_COLORS: Record<string, string> = {
  alto: '#e53e3e',
  medio: '#eab308',
  baixo: '#22c55e'
}

/** Labels por nível de alerta */
export const LEVEL_LABELS: Record<string, string> = {
  alto: 'Alto',
  medio: 'Moderado',
  baixo: 'Baixo'
}

/** Cores por região do Brasil */
export const REGION_COLORS: Record<string, string> = {
  Norte: '#22c55e',
  Nordeste: '#eab308',
  'Centro-Oeste': '#f97316',
  Sudeste: '#3b82f6',
  Sul: '#8b5cf6'
}

/** Cor fallback para região desconhecida */
export const DEFAULT_REGION_COLOR = '#94a3b8'

/** Expressão MapLibre para cor por nível de alerta */
export const LEVEL_COLOR_EXPRESSION = [
  'case',
  ['==', ['get', 'level'], 'alto'],
  LEVEL_COLORS.alto,
  ['==', ['get', 'level'], 'medio'],
  LEVEL_COLORS.medio,
  LEVEL_COLORS.baixo
] as const

/** Expressão MapLibre para cor de preenchimento por região */
export const REGION_FILL_EXPRESSION = [
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
] as const
