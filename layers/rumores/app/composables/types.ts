// Re-export dos tipos Kubb (API Sinapse usa "noticias", layer expoe como "rumores")
export type { Noticia } from '~/generated/sinapse/types/Noticia'
export type { NoticiaListResponse } from '~/generated/sinapse/types/NoticiaListResponse'
export type { NoticiaResumida } from '~/generated/sinapse/types/NoticiaResumida'
export type { NoticiaUpdate } from '~/generated/sinapse/types/NoticiaUpdate'
export type { NoticiaStats } from '~/generated/sinapse/types/NoticiaStats'
export type { NoticiaFilterInfo } from '~/generated/sinapse/types/NoticiaFilterInfo'
export type { NoticiasRelacionadasResponse } from '~/generated/sinapse/types/NoticiasRelacionadasResponse'
export type { ModulesNoticiasSchemasPaginationInfo } from '~/generated/sinapse/types/ModulesNoticiasSchemasPaginationInfo'
export type { Doenca } from '~/generated/sinapse/types/Doenca'
export type { Sintoma } from '~/generated/sinapse/types/Sintoma'
export type { Regiao } from '~/generated/sinapse/types/Regiao'

// Tipos BFF para params de query
export interface RumoresListParams {
  cursor?: string
  limit?: number
  search_term?: string
  doencas?: string[]
  sintomas?: string[]
  localizacoes?: string[]
  states?: string[]
  fonte?: string[]
  status?: 'active' | 'archived' | 'flagged'
  relevancia_minima?: number
  tipo_evento?: string
  categoria?: string
  classificacao_onehealth?: string
  data_coleta_de?: string
  data_coleta_ate?: string
  data_evento_de?: string
  data_evento_ate?: string
}
