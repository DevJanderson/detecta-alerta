<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Rumores Epidemiológicos - Detecta Alerta',
  description:
    'Acompanhe rumores e notícias epidemiológicas do Brasil em tempo real. Monitore surtos, tendências e alertas de saúde pública.'
})
</script>

<template>
  <div
    class="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center"
  >
    <Icon name="lucide:newspaper" class="size-16 text-base-300" />
    <h1 class="mt-6 text-2xl font-bold text-foreground">Rumores Epidemiológicos</h1>
    <p class="mt-2 max-w-md text-base-500">
      Notícias e rumores sobre eventos de saúde pública no Brasil. Em breve você poderá acompanhar
      tudo por aqui.
    </p>
  </div>
</template>
