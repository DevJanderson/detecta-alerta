<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    type="button"
    title="Trocar localização"
    class="flex items-center gap-2 rounded-full border border-base-200 bg-base-0 px-3 py-2 transition-colors hover:border-primary-300 hover:bg-base-50 sm:gap-3"
    @click="emit('click')"
  >
    <Icon name="lucide:map-pinned" class="size-4 shrink-0 text-primary-500" />
    <span class="hidden whitespace-nowrap text-xs font-normal text-base-700 sm:inline">
      Trocar local
    </span>
  </button>
</template>
