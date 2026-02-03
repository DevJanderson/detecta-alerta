<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

// Links de navegação
const navLinks = [
  { label: 'home', to: '/' },
  { label: 'meu município', to: '/municipio' },
  { label: 'mapa de risco', to: '/mapa-risco' },
  { label: 'rumores', to: '/rumores' },
  { label: 'relatórios', to: '/relatorios' }
]

// Verifica se o link está ativo
function isActive(to: string) {
  if (to === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(to)
}
</script>

<template>
  <header class="border-b border-base-100 bg-white px-6 py-3 lg:px-20">
    <div class="mx-auto flex items-center gap-10">
      <!-- Logo -->
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="flex items-center gap-4">
          <!-- TODO: Substituir por SVG do logo ITpS + Detecta Alerta -->
          <div class="flex h-8 items-center">
            <!-- Placeholder: barras coloridas do logo ITpS -->
            <div class="flex">
              <div class="h-6 w-4 bg-brand-primary-300" />
              <div class="h-6 w-4 -ml-2 bg-brand-primary-700" />
              <div class="h-6 w-4 -ml-2 bg-brand-primary-400" />
              <div class="h-6 w-4 -ml-2 bg-brand-primary-600" />
              <div class="h-6 w-4 -ml-2 bg-brand-secondary-200" />
              <div class="h-6 w-4 -ml-2 bg-brand-secondary-600" />
            </div>
          </div>
          <!-- Separador vertical -->
          <div class="h-8 w-px bg-brand-primary-100" />
          <!-- Placeholder: texto Detecta Alerta -->
          <span class="text-sm font-semibold text-brand-secondary-600"> Detecta Alerta </span>
        </NuxtLink>
      </div>

      <!-- Navegação Central -->
      <nav class="hidden flex-1 items-center justify-center gap-6 lg:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-1.5 text-sm transition-colors"
          :class="[
            isActive(link.to)
              ? 'font-semibold text-brand-primary-700'
              : 'font-normal text-brand-secondary-500 hover:text-brand-secondary-700'
          ]"
        >
          <span v-if="isActive(link.to)" class="size-2 bg-brand-primary-600" />
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Ações (Login/Usuário) -->
      <div class="flex items-center gap-4">
        <!-- Menu Mobile -->
        <Button variant="ghost" size="icon" class="lg:hidden" aria-label="Menu">
          <Icon name="lucide:menu" class="size-5" />
        </Button>

        <!-- Auth: Aguarda inicialização para evitar hydration mismatch -->
        <template v-if="authStore.isInitialized">
          <!-- Logado: Menu do Usuário -->
          <AuthUserMenu v-if="authStore.isAuthenticated" />

          <!-- Não Logado: Botão Login -->
          <NuxtLink v-else to="/auth/login">
            <Button variant="brand-outline" size="brand-md">
              <Icon name="lucide:user" class="size-4" />
              Fazer Login
            </Button>
          </NuxtLink>
        </template>

        <!-- Placeholder enquanto carrega -->
        <div v-else class="h-9 w-28 animate-pulse rounded-full bg-base-100" />
      </div>
    </div>
  </header>
</template>
