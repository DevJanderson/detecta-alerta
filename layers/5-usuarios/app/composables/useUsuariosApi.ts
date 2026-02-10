import type {
  UsuarioSchemaDetalhes,
  UsuarioSchemaCreate,
  UsuarioSchemaUpdate,
  UsuarioSchemaSignup,
  UsuariosPaginadosSchema,
  ListarUsuariosParams,
  MensagemResponse
} from './types'

export function useUsuariosApi() {
  // Perfil (self-service)

  async function getMe(): Promise<UsuarioSchemaDetalhes> {
    return $fetch<UsuarioSchemaDetalhes>('/api/usuarios/perfil/me')
  }

  async function updateMe(data: UsuarioSchemaUpdate): Promise<UsuarioSchemaDetalhes> {
    return $fetch<UsuarioSchemaDetalhes>('/api/usuarios/perfil/me', {
      method: 'PUT',
      body: data
    })
  }

  async function uploadFoto(file: File): Promise<MensagemResponse> {
    const formData = new FormData()
    formData.append('foto', file)
    return $fetch<MensagemResponse>('/api/usuarios/perfil/upload-foto', {
      method: 'POST',
      body: formData
    })
  }

  // Admin

  async function listar(params?: ListarUsuariosParams): Promise<UsuariosPaginadosSchema> {
    return $fetch<UsuariosPaginadosSchema>('/api/usuarios/admin', { params })
  }

  async function criar(data: UsuarioSchemaCreate): Promise<UsuarioSchemaDetalhes> {
    return $fetch<UsuarioSchemaDetalhes>('/api/usuarios/admin', {
      method: 'POST',
      body: data
    })
  }

  async function obter(id: number): Promise<UsuarioSchemaDetalhes> {
    return $fetch<UsuarioSchemaDetalhes>(`/api/usuarios/admin/${id}`)
  }

  async function atualizar(id: number, data: UsuarioSchemaUpdate): Promise<UsuarioSchemaDetalhes> {
    return $fetch<UsuarioSchemaDetalhes>(`/api/usuarios/admin/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  async function remover(id: number): Promise<MensagemResponse> {
    return $fetch<MensagemResponse>(`/api/usuarios/admin/${id}`, {
      method: 'DELETE'
    })
  }

  async function signup(data: UsuarioSchemaSignup): Promise<UsuarioSchemaDetalhes> {
    return $fetch<UsuarioSchemaDetalhes>('/api/usuarios/admin/signup', {
      method: 'POST',
      body: data
    })
  }

  return { getMe, updateMe, uploadFoto, listar, criar, obter, atualizar, remover, signup }
}
