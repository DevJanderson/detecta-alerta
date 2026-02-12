/**
 * Middleware Global de Autenticação
 *
 * Inicializa o estado de autenticação no cliente.
 * Executa em todas as rotas para manter o estado do usuário sincronizado.
 */

export default defineNuxtRouteMiddleware(async () => {
  // Apenas no cliente (no servidor o estado vem do cookie)
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Se já inicializou, não precisa buscar novamente
  if (authStore.isInitialized) return

  // Buscar dados do usuário (se autenticado)
  await authStore.fetchUser()
})
