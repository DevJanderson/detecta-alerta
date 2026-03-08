/**
 * Auth Store
 * Pinia store para gerenciamento de estado de autenticação
 * Usa Composition API para garantir contexto Nuxt correto
 */

import type { AuthUser, LoginCredentials, ResetPasswordData } from './types'
import type { UserModel } from '../utils/user-model'
import { AuthErrors } from '#shared/domain/errors'
// createUserModel, userHas* são auto-importados de layers/auth/app/utils/
// extractErrorMessage e isUnauthorizedError são auto-importados de layers/base/app/utils/

// ============================================================================
// STORE
// ============================================================================

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<UserModel | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)
  const lastFetchAt = ref(0)

  // API instanciada no contexto de setup
  const api = useAuthApi()

  // --------------------------------------------------------------------------
  // GETTERS
  // --------------------------------------------------------------------------

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.nome ?? '')
  const userEmail = computed(() => user.value?.email ?? '')
  const userInitials = computed(() => user.value?.initials ?? '')
  const permissions = computed(() => user.value?.permissions ?? [])
  const groups = computed(() => user.value?.groups ?? [])

  // --------------------------------------------------------------------------
  // HELPERS DE PERMISSÃO (delegam para o UserModel)
  // --------------------------------------------------------------------------

  function hasPermission(codigo: string): boolean {
    return user.value ? userHasPermission(user.value, codigo) : false
  }

  function hasAnyPermission(codigos: string[]): boolean {
    return user.value ? userHasAnyPermission(user.value, codigos) : false
  }

  function hasGroup(nome: string): boolean {
    return user.value ? userHasGroup(user.value, nome) : false
  }

  function hasAnyGroup(nomes: string[]): boolean {
    return user.value ? userHasAnyGroup(user.value, nomes) : false
  }

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------

  /**
   * Realiza login com credenciais
   * @returns true se login foi bem sucedido
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    return withStoreAction(
      { isLoading, error },
      AuthErrors.LOGIN_FAILED,
      async () => {
        const response = await api.login(credentials)
        user.value = createUserModel(response.user as AuthUser)
        return true
      },
      false
    )
  }

  /**
   * Realiza logout
   * @returns true se logout foi bem sucedido no servidor
   */
  async function logout(): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      await api.logout()
      user.value = null
      return true
    } catch (e: unknown) {
      // Log do erro mas limpa estado local mesmo assim
      // (é mais importante o usuário sair do que manter sessão inconsistente)
      console.warn(AuthErrors.LOGOUT_FAILED, e)
      user.value = null
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Busca dados do usuário autenticado
   */
  async function fetchUser(): Promise<void> {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const response = await api.getMe()
      user.value = response.user ? createUserModel(response.user) : null
    } catch (e: unknown) {
      // Se 401, não é erro - apenas não está autenticado
      if (isUnauthorizedError(e)) {
        user.value = null
      } else {
        error.value = extractErrorMessage(e, AuthErrors.FETCH_USER_FAILED)
      }
    } finally {
      isLoading.value = false
      isInitialized.value = true
      lastFetchAt.value = Date.now()
    }
  }

  /**
   * Solicita reset de senha
   */
  async function resetPassword(
    data: ResetPasswordData
  ): Promise<{ success: boolean; message: string }> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.resetPassword(data)
      return { success: true, message: response.message }
    } catch (e: unknown) {
      const message = extractErrorMessage(e, AuthErrors.RESET_PASSWORD_FAILED)
      error.value = message
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Limpa mensagem de erro
   */
  function clearError(): void {
    error.value = null
  }

  // --------------------------------------------------------------------------
  // EXPORT
  // --------------------------------------------------------------------------

  return {
    // Estado
    user,
    isLoading,
    error,
    isInitialized,
    lastFetchAt,

    // Getters
    isAuthenticated,
    userName,
    userEmail,
    userInitials,
    permissions,
    groups,

    // Helpers de permissão
    hasPermission,
    hasAnyPermission,
    hasGroup,
    hasAnyGroup,

    // Actions
    login,
    logout,
    fetchUser,
    resetPassword,
    clearError
  }
})
