<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-50 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Título -->
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-brand-primary-700">Detecta Alerta</h1>
        <p class="mt-2 text-sm text-muted-foreground">Plataforma de vigilância epidemiológica</p>
      </div>

      <!-- Card de Reset Password -->
      <Card>
        <CardHeader class="space-y-1 text-center">
          <CardTitle class="text-xl">Recuperar senha</CardTitle>
          <CardDescription> Enviaremos instruções para seu email </CardDescription>
        </CardHeader>

        <CardContent>
          <AuthResetPasswordForm />
        </CardContent>
      </Card>

      <!-- Footer -->
      <p class="mt-6 text-center text-xs text-muted-foreground">
        &copy; {{ new Date().getFullYear() }} ITpS - Instituto Todos pela Saúde
      </p>
    </div>
  </div>
</template>
