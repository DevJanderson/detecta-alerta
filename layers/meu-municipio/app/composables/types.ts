// === Tipos base ===
export type Level = 'Baixo' | 'Médio' | 'Alto'
export type Trend = 'up' | 'down' | 'stable'
export type UnitType = 'drogaria' | 'ubs' | 'upa'
export type ChartType = 'linha' | 'faixa'
export type PanelView = 'municipio' | 'unidade'

// === Município (autocomplete) ===
export interface MunicipioOption {
  ibgeCode: string
  nome: string
  uf: string
}

// === Resumo por tipo de unidade ===
export interface UnitTypeSummary {
  type: UnitType
  count: number
  percentage: number
  trend: Trend
}

// === Lotação (série temporal) ===
export interface LotacaoData {
  level: Level
  series: WeekDataPoint[]
}

export interface WeekDataPoint {
  semana: string
  value: number
  average?: number
}

// === Unidades de Saúde ===
export interface UnidadeSaude {
  placeId: string
  nome: string
  tipo: UnitType
  endereco: string
  cidade: string
  uf: string
  ocupacao: number
  ativa: boolean
  dadosTempoReal: boolean
  coordinates: { lat: number; lng: number }
}

// === Rumores ===
export interface RumorDestaque {
  titulo: string
  resumo: string
  tags: string[]
  link?: string
}

export interface RumorItem {
  id: string
  titulo: string
  fonte: string
  fonteUrl?: string
  data: string
  tags: string[]
}

// === Filtros (estado persistido) ===
export interface MeuMunicipioFilters {
  municipio: MunicipioOption | null
  semana: string
  tipoUnidade: UnitType | null
}

// === Lookups ===
export interface SelectOption {
  value: string
  label: string
}
