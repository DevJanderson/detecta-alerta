<script setup lang="ts">
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
        <Icon name="lucide:chevron-down" class="size-4 text-muted-foreground" />
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

      <DropdownMenuItem
        class="cursor-pointer text-danger-600 focus:bg-danger-50 focus:text-danger-600"
        @click="handleLogout"
      >
        <Icon name="lucide:log-out" class="mr-2 size-4" />
        <span>Sair</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- Botão de login se não autenticado -->
  <NuxtLink v-else to="/auth/login">
    <Button variant="outline" size="sm">
      <Icon name="lucide:user" class="mr-2 size-4" />
      Entrar
    </Button>
  </NuxtLink>
</template>
