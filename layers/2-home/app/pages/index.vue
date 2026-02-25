<script setup lang="ts">
/**
 * Página inicial - Detecta Alerta
 */
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description:
    'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'
})

const config = useRuntimeConfig()

useSchemaOrg([
  defineWebSite({
    name: 'Detecta Alerta',
    url: config.public.siteUrl as string,
    description:
      'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.',
    inLanguage: 'pt-BR'
  })
])
</script>

<template>
  <div>
    <HomeHero />
  </div>
</template>
