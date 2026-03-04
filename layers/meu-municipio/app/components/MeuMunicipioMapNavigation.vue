<script setup lang="ts">
const buttons = [
  { id: 'center', icon: 'lucide:locate', label: 'Centralizar' },
  { id: 'locate', icon: 'lucide:map-pin', label: 'Mostrar meu Local' },
  { id: 'fullscreen', icon: 'lucide:maximize-2', label: 'Tela cheia' },
  { id: 'changeMap', icon: 'lucide:map', label: 'Trocar Mapa' }
]
</script>

<template>
  <div class="flex flex-row items-center gap-2 lg:flex-col lg:items-start">
    <div v-for="button in buttons" :key="button.id" class="group relative">
      <button
        type="button"
        :aria-label="button.label"
        class="flex size-9 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 shadow-md transition-all duration-200 hover:border-secondary-200 hover:bg-secondary-100 lg:size-10"
      >
        <Icon :name="button.icon" class="size-4 text-primary-500" aria-hidden="true" />
      </button>

      <div
        class="absolute left-12 top-1/2 z-10 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-secondary-900 px-4 py-2 opacity-0 invisible transition-all duration-200 group-hover:visible group-hover:opacity-100 lg:block"
      >
        <span class="text-sm font-semibold text-base-0">{{ button.label }}</span>
      </div>
    </div>
  </div>
</template>
