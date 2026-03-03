<script setup lang="ts">
const store = useMeuMunicipioStore()
</script>

<template>
  <div class="absolute bottom-3 left-3 z-20 flex items-center gap-3 sm:bottom-4 sm:left-4">
    <!-- Dados via Sinapse -->
    <div
      class="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs shadow-sm backdrop-blur-sm"
    >
      <Icon name="lucide:sparkles" class="size-4 text-primary-500" />
      <span class="text-base-600">Dados via Sinapse, há 3 minutos.</span>
      <span class="size-2 rounded-full bg-success-500" />
    </div>

    <!-- Trocar local -->
    <button
      v-if="store.municipioSelecionado"
      class="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs text-base-600 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
    >
      <Icon name="lucide:repeat" class="size-3.5 text-primary-500" />
      <span>Trocar local</span>
    </button>
  </div>
</template>
