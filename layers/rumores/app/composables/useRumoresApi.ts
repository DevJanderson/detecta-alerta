import type {
  Noticia,
  NoticiaListResponse,
  NoticiaUpdate,
  NoticiasRelacionadasResponse,
  Doenca,
  Sintoma,
  Regiao,
  RumoresListParams
} from './types'

export function useRumoresApi() {
  // === Leitura pública ===

  async function listar(params?: RumoresListParams): Promise<NoticiaListResponse> {
    return $fetch<NoticiaListResponse>('/api/rumores/', { query: params })
  }

  async function listarDoencas(): Promise<Doenca[]> {
    return $fetch<Doenca[]>('/api/rumores/operacoes/doencas')
  }

  async function listarSintomas(): Promise<Sintoma[]> {
    return $fetch<Sintoma[]>('/api/rumores/operacoes/sintomas')
  }

  async function listarLocalizacoes(): Promise<Regiao[]> {
    return $fetch<Regiao[]>('/api/rumores/operacoes/localizacoes')
  }

  // === Leitura autenticada ===

  async function obter(uniqueId: string): Promise<Noticia> {
    return $fetch<Noticia>(`/api/rumores/${uniqueId}`)
  }

  async function relacionadas(uniqueId: string, limit = 5): Promise<NoticiasRelacionadasResponse> {
    return $fetch<NoticiasRelacionadasResponse>(`/api/rumores/${uniqueId}/relacionadas`, {
      query: { limit }
    })
  }

  // === Admin ===

  async function atualizar(uniqueId: string, body: NoticiaUpdate): Promise<Noticia> {
    return $fetch<Noticia>(`/api/rumores/admin/${uniqueId}`, { method: 'PUT', body })
  }

  async function remover(uniqueId: string): Promise<undefined> {
    return $fetch<undefined>(`/api/rumores/admin/${uniqueId}`, { method: 'DELETE' })
  }

  return {
    listar,
    obter,
    relacionadas,
    listarDoencas,
    listarSintomas,
    listarLocalizacoes,
    atualizar,
    remover
  }
}
