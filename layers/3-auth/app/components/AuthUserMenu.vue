<script setup lang="ts">
import { User, LogOut, Settings, ChevronDown } from 'lucide-vue-next'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <DropdownMenu v-if="authStore.isAuthenticated">
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="flex items-center gap-2 px-2">
        <Avatar class="h-8 w-8">
          <AvatarFallback class="bg-brand-primary-100 text-brand-primary-700 text-xs font-medium">
            {{ authStore.userInitials }}
          </AvatarFallback>
        </Avatar>
        <span class="hidden text-sm font-medium md:inline-block">
          {{ authStore.userName }}
        </span>
        <ChevronDown class="h-4 w-4 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="w-56">
      <DropdownMenuLabel>
        <div class="flex flex-col space-y-1">
          <p class="text-sm font-medium">{{ authStore.userName }}</p>
          <p class="text-xs text-muted-foreground">{{ authStore.userEmail }}</p>
        </div>
      </DropdownMenuLabel>

      <DropdownMenuSeparator />

      <DropdownMenuItem as-child>
        <NuxtLink to="/perfil" class="flex cursor-pointer items-center">
          <User class="mr-2 h-4 w-4" />
          <span>Meu perfil</span>
        </NuxtLink>
      </DropdownMenuItem>

      <DropdownMenuItem as-child>
        <NuxtLink to="/configuracoes" class="flex cursor-pointer items-center">
          <Settings class="mr-2 h-4 w-4" />
          <span>Configurações</span>
        </NuxtLink>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        class="cursor-pointer text-danger-600 focus:bg-danger-50 focus:text-danger-600"
        @click="handleLogout"
      >
        <LogOut class="mr-2 h-4 w-4" />
        <span>Sair</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Botão de login se não autenticado -->
  <NuxtLink v-else to="/auth/login">
    <Button variant="outline" size="sm">
      <User class="mr-2 h-4 w-4" />
      Entrar
    </Button>
  </NuxtLink>
</template>
