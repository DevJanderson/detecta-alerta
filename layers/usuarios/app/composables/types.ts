/**
 * Types do modulo Usuarios
 *
 * Usa tipos manuais de #shared/types/sinapse como base,
 * com extensoes especificas para o BFF.
 */

// ============================================================================
// RE-EXPORT DOS TIPOS SINAPSE
// Tipos e schemas definidos manualmente em #shared/types/sinapse
// ============================================================================

// Usuarios
export type {
  UsuarioSchemaDetalhes,
  UsuarioSchemaList,
  UsuarioSchemaCreate,
  UsuarioSchemaUpdate,
  UsuarioSchemaSignup,
  UsuariosPaginadosSchema
} from '#shared/types/sinapse/usuario'

// Grupos
export type {
  GrupoSchemaDetalhes,
  GrupoSchemaList,
  GrupoSchemaCreate,
  GrupoSchemaUpdate,
  GruposPaginadosSchema
} from '#shared/types/sinapse/grupo'

// Permissoes
export type {
  PermissaoAcessoSchemaList,
  PermissaoAcessoSchemaCreate,
  PermissaoAcessoSchemaUpdate
} from '#shared/types/sinapse/permissao'

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
