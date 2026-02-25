/**
 * Plugin de redirecionamento automático quando a sessão expira.
 *
 * Client-only: monitora `isAuthenticated` no auth store.
 * Quando transiciona de `true` → `false` (sessão expirou),
 * redireciona para a página de login.
 */

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const route = useRoute()

  watch(
    () => authStore.isAuthenticated,
    (isAuth, wasAuth) => {
      if (wasAuth && !isAuth) {
        // Não redirecionar se já está em rota de auth
        if (route.path.startsWith('/auth/')) return

        navigateTo('/auth/login')
      }
    }
  )
})
