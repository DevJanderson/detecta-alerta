// === Tipos de dados da Home ===

import type { AlertStatus, TrendType } from '#shared/types/sinapse'

export type Level = 'Normal' | 'Moderado' | 'Elevado'
export type Trend = 'up' | 'down' | 'stable'

export interface CellData {
  level: Level
  value: string
  trend: Trend
}

export interface RegionRow {
  region: string
  todos: CellData
  drogarias: CellData
  upa: CellData
  ubs: CellData
}

// === Panorama (dados consolidados da API) ===

export interface UnitTypeStats {
  count: number
  variation: number
  trend: TrendType
  alertStatus: AlertStatus
}

export interface PanoramaData {
  occupancyRate: number
  alertStatus: AlertStatus
  trend: TrendType
  variation: number
  totalEstabelecimentos: number
  drogarias: UnitTypeStats
  ubs: UnitTypeStats
  upas: UnitTypeStats
  epidemiologicalWeek: string
  weekEndingDate: string
}

// === Gráfico (série temporal) ===

export interface ChartPointData {
  week: string
  weekLabel: string
  dateRange: string
  occupancy: number
  movingAvg: number
  variation: number
  alertStatus: AlertStatus
}

export type ChartUnitType = 'all' | 'drogarias' | 'ubs' | 'upa'

export interface ChartSeriesData {
  points: ChartPointData[]
  currentWeekVariation: number
  currentWeekTrend: TrendType
}

// === Filtros ===

export interface HomeFilters {
  region: string
  estado: string
  semana: string
}

// === Opções de select ===

export interface SelectOption {
  value: string
  label: string
}

export interface RegionOption {
  id: string
  label: string
}

export const HOME_REGIONS: RegionOption[] = [
  { id: 'brasil', label: 'Brasil' },
  { id: 'norte', label: 'Norte' },
  { id: 'nordeste', label: 'Nordeste' },
  { id: 'centro-oeste', label: 'Centro-Oeste' },
  { id: 'sudeste', label: 'Sudeste' },
  { id: 'sul', label: 'Sul' }
]
