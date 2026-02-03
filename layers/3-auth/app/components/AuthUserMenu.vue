<script setup lang="ts">
const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/auth/login')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="brand-secondary-soft" size="brand-md" class="gap-2 pl-1 pr-2">
        <Avatar class="size-7">
          <AvatarFallback class="bg-brand-primary-100 text-brand-primary-700 text-xs font-semibold">
            {{ authStore.userInitials }}
          </AvatarFallback>
        </Avatar>
        <span class="hidden text-sm font-semibold md:inline-block">
          {{ authStore.userName }}
        </span>
        <Icon name="lucide:chevron-down" class="size-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" class="min-w-44 border border-base-100 shadow-lg">
      <DropdownMenuLabel class="py-2">
        <p class="text-xs font-medium text-foreground">{{ authStore.userEmail }}</p>
      </DropdownMenuLabel>

      <!-- Menu -->
      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-700"
      >
        <Icon name="lucide:user" class="size-4" />
        <span>Meu perfil</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-700"
      >
        <Icon name="lucide:settings" class="size-4" />
        <span>Configurações</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-700"
      >
        <Icon name="lucide:bell" class="size-4" />
        <span>Notificações</span>
      </DropdownMenuItem>

      <!-- Sair -->
      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 text-danger-600 focus:bg-danger-50 focus:text-danger-600"
        @click="handleLogout"
      >
        <Icon name="lucide:log-out" class="size-4" />
        <span>Sair da conta</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
