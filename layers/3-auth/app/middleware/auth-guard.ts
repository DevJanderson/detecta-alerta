/**
 * Middleware de Proteção de Rotas (Nomeado)
 *
 * Protege rotas que requerem autenticação.
 * Uso nas páginas: definePageMeta({ middleware: 'auth-guard' })
 *
 * Opções via meta:
 * - requiredPermissions: string[] - Permissões necessárias (qualquer uma)
 * - requiredGroups: string[] - Grupos necessários (qualquer um)
 */

export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuthStore()

  // Garantir que o estado está inicializado
  if (!authStore.isInitialized) {
    await authStore.fetchUser()
  }

  // Se não autenticado, redireciona para login
  if (!authStore.isAuthenticated) {
    // Usa função de validação para prevenir open redirect
    const redirectPath = getSafeRedirectUrl(to.fullPath, '/')

    return navigateTo({
      path: '/auth/login',
      query: { redirect: redirectPath }
    })
  }

  // Verificar permissões se especificadas
  const requiredPermissions = to.meta.requiredPermissions as string[] | undefined
  if (requiredPermissions && requiredPermissions.length > 0) {
    if (!authStore.hasAnyPermission(requiredPermissions)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Você não tem permissão para acessar esta página'
      })
    }
  }

  // Verificar grupos se especificados
  const requiredGroups = to.meta.requiredGroups as string[] | undefined
  if (requiredGroups && requiredGroups.length > 0) {
    if (!authStore.hasAnyGroup(requiredGroups)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Você não tem permissão para acessar esta página'
      })
    }
  }
})
