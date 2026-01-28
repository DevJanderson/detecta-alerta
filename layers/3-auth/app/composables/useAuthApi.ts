/**
 * Auth API Service
 * Composable para comunicação com o BFF de autenticação
 */

import type {
  LoginCredentials,
  LoginResponse,
  ResetPasswordData,
  ResetPasswordResponse,
  AuthUser
} from './types'

export function useAuthApi() {
  /**
   * Realiza login com credenciais
   */
  async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    return $fetch<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  /**
   * Realiza logout
   */
  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', {
      method: 'POST'
    })
  }

  /**
   * Obtém dados do usuário autenticado
   */
  async function getMe(): Promise<{ user: AuthUser }> {
    return $fetch<{ user: AuthUser }>('/api/auth/me')
  }

  /**
   * Solicita reset de senha
   */
  async function resetPassword(data: ResetPasswordData): Promise<ResetPasswordResponse> {
    return $fetch<ResetPasswordResponse>('/api/auth/reset-password', {
      method: 'POST',
      body: data
    })
  }

  /**
   * Renova o token de acesso
   */
  async function refresh(): Promise<void> {
    await $fetch('/api/auth/refresh', {
      method: 'POST'
    })
  }

  return {
    login,
    logout,
    getMe,
    resetPassword,
    refresh
  }
}
