<script setup lang="ts">
/**
 * Página inicial - Detecta Alerta
 */
const authStore = useAuthStore()

useSeoPage({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description:
    'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'
})

useSchemaOrg([
  defineWebSite({
    name: 'Detecta Alerta',
    url: 'https://alerta.sinapse.org.br',
    description:
      'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.',
    inLanguage: 'pt-BR'
  })
])
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 px-4 py-10 sm:gap-8 sm:px-6 sm:py-16">
    <div class="text-center space-y-4">
      <h1
        class="text-2xl font-bold tracking-tight text-brand-secondary-900 sm:text-3xl md:text-4xl"
      >
        Vigilância Epidemiológica em Tempo Real
      </h1>
      <p class="max-w-2xl text-base text-muted-foreground sm:text-lg">
        Plataforma de monitoramento e detecção precoce de surtos epidemiológicos para o Brasil.
      </p>
    </div>

    <template v-if="authStore.isInitialized">
      <!-- Saudação para usuário logado -->
      <div v-if="authStore.isAuthenticated" class="text-center">
        <p class="text-base sm:text-lg">
          Bem-vindo,
          <span class="font-semibold text-brand-primary-600">{{ authStore.userName }}</span>
        </p>
      </div>

      <!-- CTA para não logado -->
      <div v-else class="flex flex-col items-center gap-4">
        <p class="text-sm text-muted-foreground sm:text-base">
          Faça login para acessar todas as funcionalidades
        </p>
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
