<script setup lang="ts">
defineProps<{
  number: number
  region: string
  diseases: string
}>()
</script>

<template>
  <div
    class="z-20 flex flex-wrap items-center gap-3 bg-tertiary-300 px-4 py-3 sm:gap-6 sm:px-6 lg:px-40"
  >
    <!-- Esquerda: voltar + título + compartilhar/imprimir -->
    <div class="flex items-center gap-2 sm:gap-4">
      <NuxtLink
        to="/relatorios"
        class="flex size-9 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-tertiary-400 sm:size-10"
        aria-label="Voltar para relatórios"
      >
        <Icon name="lucide:arrow-left" class="size-4" />
      </NuxtLink>

      <h1
        class="whitespace-nowrap text-lg font-semibold leading-tight text-base-950 sm:text-2xl lg:text-[28px]"
      >
        Relatório {{ number }}
      </h1>

      <div class="flex items-center gap-1">
        <button
          class="flex size-9 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-tertiary-400 sm:size-12"
          aria-label="Compartilhar"
        >
          <Icon name="lucide:share-2" class="size-4 sm:size-5" />
        </button>
        <button
          class="flex size-9 items-center justify-center rounded-full text-primary-600 transition-colors hover:bg-tertiary-400 sm:size-12"
          aria-label="Imprimir"
        >
          <Icon name="lucide:printer" class="size-4 sm:size-5" />
        </button>
      </div>
    </div>

    <!-- Centro: região e doenças -->
    <p class="hidden shrink-0 text-base font-semibold text-base-950 lg:block">
      {{ region }} &bull; {{ diseases }}
    </p>

    <!-- Direita: baixar + receber por e-mail -->
    <div class="ml-auto flex items-center gap-2">
      <button
        class="flex h-9 items-center gap-2 rounded-full px-3 font-semibold transition-colors hover:bg-tertiary-400 sm:h-12 sm:px-5"
      >
        <Icon name="lucide:arrow-down" class="size-4 text-primary-600 sm:size-5" />
        <span class="text-sm text-secondary-600 sm:text-base">baixar</span>
      </button>
      <button
        class="hidden items-center gap-2 rounded-full border border-primary-500 px-5 font-semibold transition-colors hover:bg-tertiary-400 sm:flex sm:h-12"
      >
        <Icon name="lucide:at-sign" class="size-5 text-primary-600" />
        <span class="text-secondary-600">receber por e-mail</span>
      </button>
    </div>
  </div>
</template>
