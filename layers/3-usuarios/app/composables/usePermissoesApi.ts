import type {
  PermissaoAcessoSchemaList,
  PermissaoAcessoSchemaCreate,
  PermissaoAcessoSchemaUpdate,
  MensagemResponse
} from './types'

export function usePermissoesApi() {
  async function listar(): Promise<PermissaoAcessoSchemaList[]> {
    return $fetch<PermissaoAcessoSchemaList[]>('/api/usuarios/admin/permissoes')
  }

  async function criar(data: PermissaoAcessoSchemaCreate): Promise<PermissaoAcessoSchemaList> {
    return $fetch<PermissaoAcessoSchemaList>('/api/usuarios/admin/permissoes', {
      method: 'POST',
      body: data
    })
  }

  async function obter(id: number): Promise<PermissaoAcessoSchemaList> {
    return $fetch<PermissaoAcessoSchemaList>(`/api/usuarios/admin/permissoes/${id}`)
  }

  async function atualizar(
    id: number,
    data: PermissaoAcessoSchemaUpdate
  ): Promise<PermissaoAcessoSchemaList> {
    return $fetch<PermissaoAcessoSchemaList>(`/api/usuarios/admin/permissoes/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function remover(id: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(`/api/usuarios/admin/permissoes/${id}`, {
      method: 'DELETE'
    })
  }

  async function addToUser(userId: number, permId: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(
      `/api/usuarios/admin/permissoes/usuarios/${userId}/add/${permId}`,
      { method: 'POST' }
    )
  }

  async function removeFromUser(userId: number, permId: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(
      `/api/usuarios/admin/permissoes/usuarios/${userId}/remove/${permId}`,
      { method: 'DELETE' }
    )
  }

  return { listar, criar, obter, atualizar, remover, addToUser, removeFromUser }
}
