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
          class="relative flex items-center gap-1.5 rounded-sm text-base transition-colors outline-none after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 after:ease-out"
          :class="[
            isActive(link.to)
              ? 'font-semibold text-primary-950 hover:after:scale-x-100'
              : 'font-normal text-secondary-800 hover:text-secondary-950 hover:after:scale-x-100'
          ]"
        >
          <svg
            v-if="isActive(link.to)"
            class="size-3 shrink-0 text-primary-700"
            viewBox="0 0 11 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.621338 6.62134C-0.207089 5.79291 -0.207089 4.44976 0.621338 3.62134L3.62134 0.621338C4.44977 -0.207089 5.79291 -0.207089 6.62134 0.621338L9.62134 3.62134C10.4498 4.44976 10.4498 5.79291 9.62134 6.62134L6.62134 9.62134C5.79291 10.4498 4.44977 10.4498 3.62134 9.62134L0.621338 6.62134Z"
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
              class="absolute top-5 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20 outline-hidden"
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
                class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium transition-colors outline-none"
                :class="[
                  isActive(link.to)
                    ? 'bg-primary-50 text-primary-950'
                    : 'text-base-700 hover:bg-base-50 hover:text-base-900'
                ]"
              >
                <!-- Container do ícone -->
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-lg border"
                  :class="[
                    isActive(link.to)
                      ? 'border-primary-200 bg-white text-primary-950'
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
                    class="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary-100 text-sm font-semibold text-secondary-900"
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
                <div v-else class="rounded-lg bg-secondary-50 px-4 py-4">
                  <p class="mb-3 text-sm text-secondary-800">
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
