<script setup lang="ts">
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Login - Detecta Alerta',
  description: 'Faça login na plataforma de vigilância epidemiológica'
})

const route = useRoute()

// Pegar redirect da query string (com validação de segurança)
const redirectTo = computed(() => {
  const redirect = route.query.redirect as string | undefined
  return getSafeRedirectUrl(redirect, '/')
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-base-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Título -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-brand-primary-700">Detecta Alerta</h1>
        <p class="mt-2 text-sm text-muted-foreground">Plataforma de vigilância epidemiológica</p>
      </div>

      <!-- Card de Login -->
      <Card>
        <CardHeader class="space-y-1 text-center">
          <CardTitle class="text-xl">Entrar na conta</CardTitle>
          <CardDescription> Digite suas credenciais para acessar o sistema </CardDescription>
        </CardHeader>

        <CardContent>
          <AuthLoginForm :redirect-to="redirectTo" />
        </CardContent>
      </Card>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} ITpS - Instituto Todos pela Saúde
      </p>
    </div>
  </main>
</template>
