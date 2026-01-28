<script setup lang="ts">
/**
 * Página de logout
 * Realiza logout e redireciona para login
 */

definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const router = useRouter()

// Timeout de 10 segundos para logout
const LOGOUT_TIMEOUT = 10000

onMounted(async () => {
  try {
    // Criar promise de timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), LOGOUT_TIMEOUT)
    })

    // Race entre logout e timeout
    await Promise.race([authStore.logout(), timeoutPromise])
  } catch {
    // Timeout ou erro - redireciona mesmo assim
    console.warn('Logout timeout ou erro - redirecionando')
  } finally {
    // Sempre redireciona para login
    router.replace('/auth/login')
  }
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-50">
    <div class="text-center">
      <div
        class="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-primary-200 border-t-brand-primary-600 mx-auto"
      />
      <p class="text-muted-foreground">Saindo...</p>
    </div>
  </div>
</template>
