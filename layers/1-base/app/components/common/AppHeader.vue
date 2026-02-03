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
      <!-- Logos (esquerda): ITpS + Detecta Alerta -->
      <div class="flex shrink-0 items-center gap-4">
        <NuxtImg
          src="/brand/itps-horizontal-default.svg"
          alt="Instituto Todos pela Saúde"
          class="hidden h-8 lg:block"
        />
        <div class="hidden h-6 w-px bg-base-200 lg:block" />
        <NuxtLink to="/">
          <NuxtImg src="/brand/detecta-default.svg" alt="Detecta Alerta" class="h-8" />
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

      <!-- Logos parceiros + Ações (direita) -->
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
