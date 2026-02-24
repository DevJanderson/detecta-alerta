/**
 * Auth Store
 * Pinia store para gerenciamento de estado de autenticação
 * Usa Composition API para garantir contexto Nuxt correto
 */

import type { AuthUser, LoginCredentials, ResetPasswordData } from './types'
import type { FetchError } from '~/layers/0-base/app/utils/error'
import { extractErrorMessage } from '~/layers/0-base/app/utils/error'

/**
 * Verifica se é erro 401 (não autenticado)
 */
function isUnauthorizedError(error: unknown): boolean {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return (error as FetchError).statusCode === 401
  }
  return false
}

// ============================================================================
// STORE
// ============================================================================

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref<AuthUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  // API instanciada no contexto de setup
  const api = useAuthApi()

  // --------------------------------------------------------------------------
  // GETTERS
  // --------------------------------------------------------------------------

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.nome || '')
  const userEmail = computed(() => user.value?.email || '')

  const userInitials = computed(() => {
    if (!user.value?.nome) return ''
    const names = user.value.nome.split(' ')
    if (names.length >= 2) {
      const first = names[0]?.[0] ?? ''
      const last = names[names.length - 1]?.[0] ?? ''
      return `${first}${last}`.toUpperCase()
    }
    return (names[0] ?? '').substring(0, 2).toUpperCase()
  })

  // Permissões e grupos
  const permissions = computed(() => user.value?.permissoes?.map(p => p.codigo) || [])

  const groups = computed(() => user.value?.grupos?.map(g => g.nome) || [])

  // --------------------------------------------------------------------------
  // HELPERS DE PERMISSÃO
  // --------------------------------------------------------------------------

  function hasPermission(codigo: string): boolean {
    return permissions.value.includes(codigo)
  }

  function hasAnyPermission(codigos: string[]): boolean {
    return codigos.some(codigo => permissions.value.includes(codigo))
  }

  function hasGroup(nome: string): boolean {
    return groups.value.includes(nome)
  }

  function hasAnyGroup(nomes: string[]): boolean {
    return nomes.some(nome => groups.value.includes(nome))
  }

  // --------------------------------------------------------------------------
  // ACTIONS
  // --------------------------------------------------------------------------

  /**
   * Realiza login com credenciais
   * @returns true se login foi bem sucedido
   */
  async function login(credentials: LoginCredentials): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.login(credentials)
      user.value = response.user as AuthUser
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao fazer login')
      return false
    } finally {
      isLoading.value = false
    }
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
      console.warn('Erro ao fazer logout no servidor:', e)
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
      user.value = response.user
    } catch (e: unknown) {
      // Se 401, não é erro - apenas não está autenticado
      if (isUnauthorizedError(e)) {
        user.value = null
      } else {
        error.value = extractErrorMessage(e, 'Erro ao carregar usuário')
      }
    } finally {
      isLoading.value = false
      isInitialized.value = true
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
      const message = extractErrorMessage(e, 'Erro ao solicitar reset de senha')
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
