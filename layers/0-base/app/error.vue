<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

const title = computed(() => {
  if (is404.value) return 'Página não encontrada!'
  return 'Ocorreu um erro!'
})

const description = computed(() => {
  if (is404.value)
    return 'Nossa equipe foi avisada para investigar este surto. Enquanto isso, lave as mãos e'
  return props.error.message || 'Algo deu errado. Tente novamente mais tarde.'
})

const errorCode = computed(() => {
  if (is404.value) return 'Código do erro: Erro 404'
  return `Código do erro: Erro ${props.error.statusCode}`
})

useSeoPage({
  title: is404.value ? 'Página não encontrada - Detecta Alerta' : 'Erro - Detecta Alerta'
})

function handleGoHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-brand-secondary-50 px-6">
    <div class="flex flex-col items-center gap-12">
      <!-- Info -->
      <div class="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 class="text-3xl font-semibold text-brand-primary-950">
          {{ title }}
        </h1>

        <p class="text-base leading-relaxed text-brand-secondary-900">
          {{ description }}
          <template v-if="is404">
            <a href="/" class="text-brand-primary-950 underline" @click.prevent="handleGoHome"
              >vá para a home</a
            >.
          </template>
        </p>

        <p class="text-xs text-brand-secondary-900">
          {{ errorCode }}
        </p>
      </div>

      <!-- Ilustração: robô + losango -->
      <div class="relative flex h-[368px] w-full max-w-[496px] items-center justify-center">
        <!-- Losango (quadrado rotacionado) -->
        <div class="size-[240px] rotate-[-45deg] rounded-[48px] bg-brand-primary-900" />

        <!-- Robô -->
        <NuxtImg
          src="/illustrations/error-robot.png"
          alt="Robô de erro"
          class="absolute bottom-0 h-[318px] w-auto drop-shadow-[0_4px_0_rgba(0,0,0,0.1)]"
        />
      </div>

      <!-- Botão CTA -->
      <Button variant="brand-outline" size="brand-xl" @click="handleGoHome">
        ir para home
        <Icon name="lucide:arrow-right" class="size-6" />
      </Button>
    </div>
  </div>
</template>
