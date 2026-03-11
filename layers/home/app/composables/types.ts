// === Tipos de dados da Home ===

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

export interface PanoramaData {
  percentage: string
  level: string
  description: string
  insight: string
  totalEstabelecimentos: number
  drogarias: number
  ubs: number
  upas: number
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
