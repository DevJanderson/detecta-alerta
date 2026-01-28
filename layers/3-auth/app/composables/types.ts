/**
 * Types do módulo Auth
 * Tipos e interfaces para autenticação
 */

/**
 * Usuário autenticado (dados públicos)
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
 * Permissão de acesso
 */
export interface AuthPermissao {
  id: number
  codigo: string
  nome: string
  descricao?: string | null
}

/**
 * Grupo de usuários
 */
export interface AuthGrupo {
  id: number
  nome: string
  descricao?: string | null
}

/**
 * Estado de autenticação
 */
export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Credenciais de login
 */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * Resposta de login do BFF (sem tokens - ficam em cookies)
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

/**
 * Token JWT decodificado (payload)
 */
export interface JwtPayload {
  sub: string
  exp: number
  iat?: number
  [key: string]: unknown
}
