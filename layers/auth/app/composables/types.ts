/**
 * Types do módulo Auth
 *
 * Usa tipos do Kubb (gerados do OpenAPI) como base,
 * com extensões específicas para o BFF.
 */

// ============================================================================
// RE-EXPORT DOS TIPOS KUBB
// Tipos gerados automaticamente da API Sinapse
// ============================================================================

export type { LoginRequest as LoginCredentials } from '~/generated/sinapse/types/LoginRequest'
export type { Token as TokenResponse } from '~/generated/sinapse/types/Token'
export type { RefreshTokenRequest } from '~/generated/sinapse/types/RefreshTokenRequest'

// ============================================================================
// TIPOS ESPECÍFICOS DO BFF
// Tipos adaptados para uso no cliente (sem expor tokens)
// ============================================================================

/**
 * Permissão de acesso (formato do cliente)
 * Adiciona 'codigo' que é usado internamente para verificações
 */
export interface AuthPermissao {
  id: number
  /** Código único da permissão (ex: 'dashboard.view') */
  codigo: string
  nome: string
  descricao?: string | null
}

/**
 * Grupo de usuários (formato do cliente)
 */
export interface AuthGrupo {
  id: number
  nome: string
  descricao?: string | null
}

/**
 * Usuário autenticado (dados públicos para o cliente)
 * Baseado em UsuarioSchemaDetalhes mas com permissões/grupos simplificados
 */
export interface AuthUser {
  id: number
  nome: string
  email: string
  ativo: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  ultimo_login?: string | null
  permissoes: AuthPermissao[]
  grupos: AuthGrupo[]
}

/**
 * Estado de autenticação (cliente)
 */
export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Resposta de login do BFF (sem tokens - ficam em cookies httpOnly)
 */
export interface LoginResponse {
  user: AuthUser
}

/**
 * Dados para reset de senha
 */
export interface ResetPasswordData {
  email: string
}

/**
 * Resposta de reset de senha
 */
export interface ResetPasswordResponse {
  message: string
}
