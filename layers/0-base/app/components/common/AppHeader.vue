<script setup lang="ts">
const authStore = useAuthStore()
const route = useRoute()

const mobileMenuOpen = ref(false)

// Fecha menu mobile ao navegar
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false
  }
)

// Links de navegação com ícones para mobile
const navLinks = [
  { label: 'home', to: '/', icon: 'lucide:house' },
  { label: 'meu município', to: '/municipio', icon: 'lucide:map-pin' },
  { label: 'mapa de risco', to: '/mapa-risco', icon: 'lucide:map' },
  { label: 'rumores', to: '/rumores', icon: 'lucide:message-circle' },
  { label: 'relatórios', to: '/relatorios', icon: 'lucide:file-text' }
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
  <header class="border-b border-base-100 bg-white px-4 py-3 sm:px-6 lg:px-20">
    <div class="mx-auto flex items-center gap-4 lg:gap-10">
      <!-- Logos (esquerda): ITpS + Detecta Alerta -->
      <div class="flex shrink-0 items-center gap-2 sm:gap-4">
        <NuxtImg
          src="/brand/itps-horizontal-default.svg"
          alt="Instituto Todos pela Saúde"
          class="h-6 sm:h-8"
        />
        <div class="h-4 w-px bg-base-200 sm:h-6" />
        <NuxtLink to="/">
          <NuxtImg src="/brand/detecta-default.svg" alt="Detecta Alerta" class="h-6 sm:h-8" />
        </NuxtLink>
      </div>

      <!-- Navegação Central (Desktop) -->
      <nav class="hidden flex-1 items-center justify-center gap-6 lg:flex">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="relative flex items-center gap-1.5 rounded-sm text-base transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 after:ease-out"
          :class="[
            isActive(link.to)
              ? 'font-semibold text-brand-primary-700 hover:after:scale-x-100'
              : 'font-normal text-brand-secondary-600 hover:text-brand-secondary-800 hover:after:scale-x-100'
          ]"
        >
          <svg
            v-if="isActive(link.to)"
            class="size-3 shrink-0 text-brand-primary-400"
            viewBox="1.5 6 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.6 8.25H8.25V6.9C8.249 6.662 8.154 6.433 7.986 6.264C7.817 6.096 7.588 6.001 7.35 6H4.65C4.412 6.001 4.183 6.096 4.014 6.264C3.846 6.433 3.751 6.662 3.75 6.9V8.25H2.4C2.162 8.251 1.933 8.346 1.764 8.514C1.596 8.683 1.501 8.912 1.5 9.15V11.85C1.501 12.089 1.596 12.317 1.764 12.486C1.933 12.654 2.162 12.749 2.4 12.75H3.75V14.1C3.751 14.339 3.846 14.567 4.014 14.736C4.183 14.904 4.412 14.999 4.65 15H7.35C7.588 14.999 7.817 14.904 7.986 14.736C8.154 14.567 8.249 14.339 8.25 14.1V12.75H9.6C9.838 12.749 10.067 12.654 10.236 12.486C10.404 12.317 10.499 12.089 10.5 11.85V9.15C10.499 8.912 10.404 8.683 10.236 8.514C10.067 8.346 9.838 8.251 9.6 8.25Z"
              fill="currentColor"
            />
          </svg>
          {{ link.label }}
        </NuxtLink>
      </nav>

      <!-- Ações (direita) -->
      <div class="ml-auto flex items-center gap-2 sm:gap-3">
        <!-- Auth: Aguarda inicialização para evitar hydration mismatch -->
        <template v-if="authStore.isInitialized">
          <!-- Logado: Menu do Usuário -->
          <AuthUserMenu v-if="authStore.isAuthenticated" />

          <!-- Não Logado: Botão Login -->
          <NuxtLink v-else to="/auth/login" aria-label="Fazer Login">
            <Button variant="brand-outline" size="brand-md">
              <Icon name="lucide:user" class="size-4" />
              <span class="hidden sm:inline">Fazer Login</span>
            </Button>
          </NuxtLink>
        </template>

        <!-- Placeholder enquanto carrega -->
        <div v-else class="h-9 w-28 animate-pulse rounded-full bg-base-100" />

        <!-- Mobile: Hamburger menu (direita) -->
        <Sheet v-model:open="mobileMenuOpen">
          <SheetTrigger as-child>
            <Button
              variant="brand-outline"
              size="icon"
              class="rounded-full lg:hidden"
              aria-label="Menu"
            >
              <Icon name="lucide:menu" class="size-4" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" hide-close class="flex w-72 flex-col gap-0 border-r-0 p-0">
            <!-- Botão fechar no overlay -->
            <SheetClose
              class="absolute top-5 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-base-900 focus:outline-hidden"
              :style="{ left: 'calc(100vw - 3.25rem)' }"
              aria-label="Fechar menu"
            >
              <Icon name="lucide:x" class="size-4" />
            </SheetClose>

            <!-- Header: identidade da marca -->
            <SheetHeader class="mb-2 px-5 py-5">
              <SheetTitle class="sr-only">Menu de navegação</SheetTitle>
              <div class="flex items-center gap-3">
                <NuxtImg
                  src="/brand/itps-horizontal-default.svg"
                  alt="Instituto Todos pela Saúde"
                  class="h-8"
                />
                <div class="h-5 w-px bg-base-200" />
                <NuxtImg src="/brand/detecta-default.svg" alt="Detecta Alerta" class="h-8" />
              </div>
            </SheetHeader>

            <!-- Nav links -->
            <nav class="flex flex-1 flex-col gap-1 px-3 py-4">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.to"
                :to="link.to"
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary-500 focus:ring-offset-2"
                :class="[
                  isActive(link.to)
                    ? 'bg-brand-primary-50 text-brand-primary-700'
                    : 'text-base-700 hover:bg-base-50 hover:text-base-900'
                ]"
              >
                <!-- Container do ícone -->
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg border"
                  :class="[
                    isActive(link.to)
                      ? 'border-brand-primary-200 bg-white text-brand-primary-700'
                      : 'border-base-200 text-base-500'
                  ]"
                >
                  <Icon :name="link.icon" class="size-4" />
                </span>
                {{ link.label }}
              </NuxtLink>
            </nav>

            <!-- Footer: Auth -->
            <div class="mt-auto px-3 py-4">
              <template v-if="authStore.isInitialized">
                <!-- Logado: card com avatar -->
                <div
                  v-if="authStore.isAuthenticated"
                  class="flex items-center gap-3 rounded-lg border border-base-200 px-3 py-3"
                >
                  <span
                    class="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-secondary-100 text-sm font-semibold text-brand-secondary-700"
                  >
                    {{ authStore.userInitials }}
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-base-900">
                      {{ authStore.userName }}
                    </p>
                    <p class="text-xs text-base-500">Conectado</p>
                  </div>
                  <NuxtLink
                    to="/configuracoes"
                    class="flex items-center"
                    aria-label="Configurações"
                  >
                    <Icon
                      name="lucide:settings"
                      class="size-4.5 shrink-0 text-base-400 transition-colors hover:text-base-700"
                    />
                  </NuxtLink>
                </div>

                <!-- Não logado: card convite -->
                <div v-else class="rounded-lg bg-brand-secondary-50 px-4 py-4">
                  <p class="mb-3 text-sm text-brand-secondary-800">
                    Acesse sua conta para acompanhar alertas e relatórios.
                  </p>
                  <NuxtLink to="/auth/login">
                    <Button variant="brand-outline" size="brand-md" class="w-full">
                      <Icon name="lucide:log-in" class="size-4" />
                      Fazer Login
                    </Button>
                  </NuxtLink>
                </div>
              </template>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </header>
</template>
