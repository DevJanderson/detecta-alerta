<script setup lang="ts">
defineProps<{
  number: number
  dateRange: string
  region: string
  isNew?: boolean
  editedBy?: string
  editedAgo?: string
}>()
</script>

<template>
  <NuxtLink
    to="#"
    class="relative flex h-101 flex-col items-center gap-8 overflow-hidden rounded-xl bg-secondary-50 px-6 pb-6 pt-8 transition-shadow hover:shadow-lg"
    :class="isNew ? 'border border-secondary-200' : ''"
  >
    <!-- Fundo colorido inferior -->
    <div
      class="absolute inset-x-0 bottom-0 h-49"
      :class="isNew ? 'bg-success-600' : 'bg-secondary-600'"
    />
    <!-- Overlay curva -->
    <div
      class="absolute inset-x-0 bottom-0 h-49 mix-blend-luminosity"
      :class="isNew ? 'bg-secondary-600' : 'bg-secondary-700'"
    />

    <!-- Tag "novo!" (canto superior direito) -->
    <span
      v-if="isNew"
      class="absolute right-2 top-2 z-10 rounded-full border border-success-200 bg-success-50 px-4 py-1 text-sm font-semibold text-success-700"
    >
      novo!
    </span>

    <!-- Título + data -->
    <div class="relative z-10 flex w-full flex-col items-center gap-2 text-center">
      <h3
        class="text-xl font-semibold leading-tight"
        :class="isNew ? 'text-success-700' : 'text-primary-600'"
      >
        Relatório {{ number }}
      </h3>
      <p class="text-xs text-secondary-600">
        {{ dateRange }} &bull;
        <span class="font-semibold">{{ region }}</span>
      </p>
    </div>

    <!-- Capa do relatório (livro com lombada) -->
    <div class="relative z-10 flex shrink-0 overflow-hidden rounded-sm shadow-xl">
      <!-- Lombada -->
      <div class="w-1.5 shrink-0 self-stretch border-r border-tertiary-300 bg-tertiary-200" />
      <!-- Capa (imagem real) -->
      <NuxtImg
        src="/img/relatorio-capa.png"
        class="h-85 w-60 object-cover object-top"
        loading="lazy"
        alt="Capa do relatório"
      />
    </div>

    <!-- Barra "editado por" -->
    <div
      v-if="editedBy"
      class="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 bg-secondary-950/95 px-4 py-2 backdrop-blur-sm"
    >
      <div class="size-5 shrink-0 rounded-full bg-secondary-400" />
      <p class="text-xs text-white">
        Editado por <span class="font-semibold">{{ editedBy }}</span
        >, {{ editedAgo }}
      </p>
    </div>
  </NuxtLink>
</template>
