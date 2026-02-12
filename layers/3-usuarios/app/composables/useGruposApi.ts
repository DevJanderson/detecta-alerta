import type {
  GrupoSchemaDetalhes,
  GrupoSchemaCreate,
  GrupoSchemaUpdate,
  GruposPaginadosSchema,
  ListarGruposParams,
  MensagemResponse
} from './types'

export function useGruposApi() {
  async function listar(params?: ListarGruposParams): Promise<GruposPaginadosSchema> {
    return $fetch<GruposPaginadosSchema>('/api/usuarios/admin/grupos', { params })
  }

  async function criar(data: GrupoSchemaCreate): Promise<GrupoSchemaDetalhes> {
    return $fetch<GrupoSchemaDetalhes>('/api/usuarios/admin/grupos', {
      method: 'POST',
      body: data
    })
  }

  async function obter(id: number): Promise<GrupoSchemaDetalhes> {
    return $fetch<GrupoSchemaDetalhes>(`/api/usuarios/admin/grupos/${id}`)
  }

  async function atualizar(id: number, data: GrupoSchemaUpdate): Promise<GrupoSchemaDetalhes> {
    return $fetch<GrupoSchemaDetalhes>(`/api/usuarios/admin/grupos/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function remover(id: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(`/api/usuarios/admin/grupos/${id}`, {
      method: 'DELETE'
    })
  }

  async function addUsuario(grupoId: number, usuarioId: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(`/api/usuarios/admin/grupos/${grupoId}/usuarios/${usuarioId}`, {
      method: 'POST'
    })
  }

  async function removeUsuario(grupoId: number, usuarioId: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(`/api/usuarios/admin/grupos/${grupoId}/usuarios/${usuarioId}`, {
      method: 'DELETE'
    })
  }

  return { listar, criar, obter, atualizar, remover, addUsuario, removeUsuario }
}
