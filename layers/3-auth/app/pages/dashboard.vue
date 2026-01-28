<script setup lang="ts">
/**
 * Página de Dashboard (protegida)
 * Mostra mensagem de boas-vindas ao usuário logado
 */

definePageMeta({
  middleware: 'auth-guard'
})

const authStore = useAuthStore()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-50 px-4">
    <Card class="w-full max-w-lg">
      <CardHeader class="text-center">
        <div
          class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-100"
        >
          <span class="text-2xl">👋</span>
        </div>
        <CardTitle class="text-2xl"> Bem-vindo, {{ authStore.userName }}! </CardTitle>
        <CardDescription> Você está autenticado com sucesso. </CardDescription>
      </CardHeader>

      <CardContent class="space-y-4">
        <!-- Informações do usuário -->
        <div class="rounded-lg bg-base-100 p-4 space-y-2">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Email:</span>
            <span class="font-medium">{{ authStore.userEmail }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Iniciais:</span>
            <span class="font-medium">{{ authStore.userInitials }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Permissões:</span>
            <span class="font-medium">{{ authStore.permissions.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Grupos:</span>
            <span class="font-medium">{{ authStore.groups.join(', ') || 'Nenhum' }}</span>
          </div>
        </div>

        <!-- Botão de logout -->
        <NuxtLink to="/auth/logout" class="block">
          <Button variant="outline" class="w-full"> Sair da conta </Button>
        </NuxtLink>
      </CardContent>
    </Card>
  </div>
</template>
