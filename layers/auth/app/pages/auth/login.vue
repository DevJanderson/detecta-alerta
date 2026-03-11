<script setup lang="ts">
definePageMeta({
  layout: false
})

useSeoPage({
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
  <main class="relative flex min-h-screen items-center justify-center px-4 py-6 sm:py-12">
    <!-- Background image -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/home-bg.png')"
    />
    <div class="absolute inset-0 bg-base-950/60" />

    <Card class="relative z-10 w-full max-w-md">
      <!-- Logo/Título -->
      <CardHeader class="space-y-1 text-center">
        <h1 class="text-2xl font-bold text-primary-950">Detecta Alerta</h1>
        <p class="mt-2 text-sm text-muted-foreground">Plataforma de vigilância epidemiológica</p>
      </CardHeader>

      <CardContent>
        <AuthLoginForm :redirect-to="redirectTo" />
      </CardContent>

      <!-- Footer -->
      <CardFooter class="justify-center">
        <p class="text-xs text-muted-foreground">
          &copy; {{ new Date().getFullYear() }} ITpS - Instituto Todos pela Saúde
        </p>
      </CardFooter>
    </Card>
  </main>
</template>
