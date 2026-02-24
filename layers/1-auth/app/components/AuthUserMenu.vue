<script setup lang="ts">
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="brand-secondary-soft" size="brand-md" class="gap-2 pl-1 pr-2">
        <Avatar class="size-7 bg-brand-primary-100">
          <AvatarFallback class="text-brand-primary-950 text-xs font-semibold">
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
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-900"
        @click="navigateTo('/perfil')"
      >
        <Icon name="lucide:user" class="size-4" />
        <span>Meu perfil</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        v-if="authStore.hasGroup('administradores')"
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-900"
        @click="navigateTo('/admin/usuarios')"
      >
        <Icon name="lucide:users" class="size-4" />
        <span>Administração</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-900"
      >
        <Icon name="lucide:bell" class="size-4" />
        <span>Notificações</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-900"
        @click="navigateTo('/design-system')"
      >
        <Icon name="lucide:palette" class="size-4" />
        <span>Design System</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        class="cursor-pointer gap-2 py-2 focus:bg-brand-secondary-50 focus:text-brand-secondary-900"
        @click="navigateTo('/docs')"
      >
        <Icon name="lucide:book-open" class="size-4" />
        <span>Documentação</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

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
