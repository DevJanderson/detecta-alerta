<script setup lang="ts">
const { loadingText = 'Carregando', percentage } = defineProps<{
  loadingText?: string
  percentage?: number
}>()
</script>

<template>
  <div class="flex items-center justify-center">
    <!-- Losango central sólido com texto -->
    <div class="relative size-60">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="-rotate-45">
          <div class="size-44 rounded-[40px] bg-primary-900 loader-pulse" />
        </div>
      </div>

      <!-- Texto sobre o losango (limitado à área inscrita do diamante) -->
      <div class="absolute inset-0 flex items-center justify-center text-white">
        <div class="flex max-w-28 flex-col items-center gap-1 text-center">
          <p class="text-lg font-semibold leading-tight">
            {{ loadingText }}
          </p>
          <div v-if="percentage !== undefined" class="flex items-baseline gap-1">
            <span class="text-4xl font-semibold leading-snug">{{ percentage }}</span>
            <span class="text-xl font-semibold">%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader-pulse {
  animation: pulse-scale 2.5s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
