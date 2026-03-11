/**
 * Tipos da feature lugares-monitorados
 */

/** Tipos de unidade de saúde monitorada */
export type TipoUnidade = 'ubs' | 'upa' | 'drogarias' | 'pet_shop' | 'pet_atend'

/** Regiões do Brasil */
export type RegiaoBrasil = 'N' | 'NE' | 'CO' | 'SE' | 'S'

/** Unidade de saúde monitorada */
export interface Unidade {
  placeId: string
  titulo: string
  tipoUnidade: TipoUnidade
  endereco?: string
  bairro?: string | null
  cidade: string
  estado: string
  regiao: RegiaoBrasil
  codigoIbge?: number | null
  latitude?: number
  longitude?: number
  url?: string
  ativa: boolean
  tempoReal: 0 | 1 | 2 // 0=sem dados, 1=tempo real, 2=histórico
  notaTotal?: number | null
  totalAvaliacoes?: number | null
}

/** Filtros de unidades */
export interface FiltrosUnidades {
  estado?: string
  cidade?: string
  tipoUnidade?: TipoUnidade
  apenasAtivas?: boolean
  apenasTempoReal?: boolean
}

/** Estatísticas por tipo de unidade */
export interface EstatisticasPorTipo {
  total: number
  ubs: number
  upa: number
  drogarias: number
  petShop: number
  petAtend: number
}

/** Labels dos tipos de unidade */
export const TIPO_UNIDADE_LABELS: Record<TipoUnidade, string> = {
  ubs: 'UBS',
  upa: 'UPA',
  drogarias: 'Drogarias',
  pet_shop: 'Pet Shop',
  pet_atend: 'Pet Clínica'
}

/** Cores dos tipos de unidade */
export const TIPO_UNIDADE_CORES: Record<TipoUnidade, string> = {
  ubs: '#10B981',
  upa: '#EF4444',
  drogarias: '#3B82F6',
  pet_shop: '#F59E0B',
  pet_atend: '#8B5CF6'
}

/** Ícones dos tipos de unidade (lucide) */
export const TIPO_UNIDADE_ICONES: Record<TipoUnidade, string> = {
  ubs: 'lucide:stethoscope',
  upa: 'lucide:building-2',
  drogarias: 'lucide:pill',
  pet_shop: 'lucide:dog',
  pet_atend: 'lucide:dog'
}
