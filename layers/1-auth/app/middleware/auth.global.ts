/**
 * Middleware Global de Autenticação
 *
 * Inicializa o estado de autenticação no SSR e no cliente.
 * No SSR, busca dados do usuário para que o Pinia hidrate o estado
 * corretamente, evitando flash de skeleton no header.
 * No cliente, o estado já vem hidratado do SSR (via @pinia/nuxt).
 */

export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()

  // Se já inicializou (SSR ou navegação anterior), não busca novamente
  if (authStore.isInitialized) return

  // Buscar dados do usuário (SSR e cliente)
  // SSR: useAuthApi().getMe() encaminha cookies via useRequestHeaders()
  // Cliente: $fetch envia cookies automaticamente
  await authStore.fetchUser()
})
