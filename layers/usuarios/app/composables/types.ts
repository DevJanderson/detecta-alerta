/**
 * Types do modulo Usuarios
 *
 * Usa tipos do Kubb (gerados do OpenAPI) como base,
 * com extensoes especificas para o BFF.
 */

// ============================================================================
// RE-EXPORT DOS TIPOS KUBB
// Tipos gerados automaticamente da API Sinapse
// ============================================================================

// Usuarios
export type { UsuarioSchemaDetalhes } from '~/generated/sinapse/types/UsuarioSchemaDetalhes'
export type { UsuarioSchemaList } from '~/generated/sinapse/types/UsuarioSchemaList'
export type { UsuarioSchemaCreate } from '~/generated/sinapse/types/UsuarioSchemaCreate'
export type { UsuarioSchemaUpdate } from '~/generated/sinapse/types/UsuarioSchemaUpdate'
export type { UsuarioSchemaSignup } from '~/generated/sinapse/types/UsuarioSchemaSignup'
export type { UsuariosPaginadosSchema } from '~/generated/sinapse/types/UsuariosPaginadosSchema'

// Grupos
export type { GrupoSchemaDetalhes } from '~/generated/sinapse/types/GrupoSchemaDetalhes'
export type { GrupoSchemaList } from '~/generated/sinapse/types/GrupoSchemaList'
export type { GrupoSchemaCreate } from '~/generated/sinapse/types/GrupoSchemaCreate'
export type { GrupoSchemaUpdate } from '~/generated/sinapse/types/GrupoSchemaUpdate'
export type { GruposPaginadosSchema } from '~/generated/sinapse/types/GruposPaginadosSchema'

// Permissoes
export type { PermissaoAcessoSchemaList } from '~/generated/sinapse/types/PermissaoAcessoSchemaList'
export type { PermissaoAcessoSchemaCreate } from '~/generated/sinapse/types/PermissaoAcessoSchemaCreate'
export type { PermissaoAcessoSchemaUpdate } from '~/generated/sinapse/types/PermissaoAcessoSchemaUpdate'

// ============================================================================
// TIPOS ESPECIFICOS DO BFF
// ============================================================================

/**
 * Parametros de listagem de usuarios (paginacao + filtros)
 */
export interface ListarUsuariosParams {
  page?: number
  size?: number
  nome?: string
  email?: string
  admin?: boolean
  ativo?: boolean
  cidade?: string
  estado?: string
  search?: string
}

/**
 * Parametros de listagem de grupos (paginacao + filtros)
 */
export interface ListarGruposParams {
  page?: number
  size?: number
  search?: string
  ativo?: boolean
}

/**
 * Resposta generica de mensagem
 */
export interface MensagemResponse {
  message: string
}
