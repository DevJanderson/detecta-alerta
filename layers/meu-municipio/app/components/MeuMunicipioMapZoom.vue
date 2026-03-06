<script setup lang="ts">
const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
}>()
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-md shadow-md">
    <button
      type="button"
      aria-label="Zoom in"
      title="Zoom in"
      class="flex size-8 items-center justify-center bg-base-0 text-base text-base-900 transition-colors hover:bg-base-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 lg:size-9"
      @click="emit('zoomIn')"
    >
      <span aria-hidden="true">+</span>
    </button>
    <div class="h-px bg-base-200" />
    <button
      type="button"
      aria-label="Zoom out"
      title="Zoom out"
      class="flex size-8 items-center justify-center bg-base-0 text-base text-base-900 transition-colors hover:bg-base-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 lg:size-9"
      @click="emit('zoomOut')"
    >
      <span aria-hidden="true">&minus;</span>
    </button>
  </div>
</template>
