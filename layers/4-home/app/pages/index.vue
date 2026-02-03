<script setup lang="ts">
/**
 * Página inicial - Detecta Alerta
 */
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}

useSeoMeta({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description:
    'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-bold tracking-tight">Detecta Alerta</h1>
      <p class="text-muted-foreground">
        Plataforma de vigilância e monitoramento epidemiológico em tempo real
      </p>
    </div>

    <!-- Logado -->
    <div v-if="authStore.isAuthenticated" class="flex flex-col items-center gap-4">
      <p class="text-lg">
        Olá, <span class="font-semibold">{{ authStore.userName }}</span>
      </p>
      <Button variant="outline" @click="handleLogout"> Sair </Button>
    </div>

    <!-- Não logado -->
    <div v-else class="flex gap-4">
      <NuxtLink to="/auth/login">
        <Button>Entrar</Button>
      </NuxtLink>
    </div>
  </div>
</template>
