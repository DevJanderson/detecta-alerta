<script setup lang="ts">
/**
 * Página inicial - Detecta Alerta
 */
const authStore = useAuthStore()

useSeoMeta({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description:
    'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-8 px-6 py-16">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold tracking-tight text-brand-secondary-900">
        Vigilância Epidemiológica em Tempo Real
      </h1>
      <p class="max-w-2xl text-lg text-muted-foreground">
        Plataforma de monitoramento e detecção precoce de surtos epidemiológicos para o Brasil.
      </p>
    </div>

    <template v-if="authStore.isInitialized">
      <!-- Saudação para usuário logado -->
      <div v-if="authStore.isAuthenticated" class="text-center">
        <p class="text-lg">
          Bem-vindo,
          <span class="font-semibold text-brand-primary-600">{{ authStore.userName }}</span>
        </p>
      </div>

      <!-- CTA para não logado -->
      <div v-else class="flex flex-col items-center gap-4">
        <p class="text-muted-foreground">Faça login para acessar todas as funcionalidades</p>
        <NuxtLink to="/auth/login">
          <Button variant="brand-outline" size="brand-md">
            <Icon name="lucide:log-in" class="size-4" />
            Acessar Plataforma
          </Button>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
