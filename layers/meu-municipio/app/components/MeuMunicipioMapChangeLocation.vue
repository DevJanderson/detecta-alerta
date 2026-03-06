<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    title="Trocar localização"
    class="hidden items-center gap-3 rounded-full border border-base-200 bg-base-0 px-3 py-2 transition-colors hover:border-primary-300 hover:bg-base-50 lg:flex"
    @click="emit('click')"
  >
    <Icon name="lucide:map-pinned" class="size-4 shrink-0 text-primary-500" />
    <span class="whitespace-nowrap text-xs font-normal text-base-700"> Trocar local </span>
  </button>
</template>
