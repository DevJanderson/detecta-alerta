<script setup lang="ts">
const store = useMeuMunicipioStore()
</script>

<template>
  <div v-if="store.rumorDestaque" class="relative rounded-lg border border-base-200 bg-base-50 p-4">
    <div
      class="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-base-200"
    >
      <Icon name="lucide:globe" class="size-4 text-base-500" />
    </div>
    <p class="pr-10 text-sm font-semibold text-base-900">
      {{ store.rumorDestaque.titulo }}
    </p>
    <p class="mt-2 text-sm leading-relaxed text-base-600">
      {{ store.rumorDestaque.resumo }}
    </p>
    <button
      class="mt-3 flex items-center gap-1 text-sm font-medium text-secondary-600 hover:text-secondary-800"
    >
      ver todos os rumores
      <Icon name="lucide:arrow-right" class="size-4" />
    </button>
  </div>
</template>
