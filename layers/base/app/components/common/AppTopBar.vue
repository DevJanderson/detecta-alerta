<script setup lang="ts">
const { regions, isLoading, error } = useRegionStats()

const levelClasses: Record<string, string> = {
  Baixo: 'text-success-400',
  Médio: 'text-alert-600',
  Alto: 'text-primary-400'
}

const trendClasses: Record<string, string> = {
  up: 'text-primary-400',
  down: 'text-success-400',
  stable: 'text-white/60'
}

const trendIcons: Record<string, string> = {
  up: 'lucide:trending-up',
  down: 'lucide:trending-down'
}
</script>

<template>
  <div class="bg-secondary-950 text-xs text-white">
    <div class="flex items-center gap-4 px-4 py-2 sm:px-6 lg:px-20">
      <span class="shrink-0 font-medium">
        Movimento em estabelecimentos de saúde
        <span class="font-normal text-white/60">(comparado à semana anterior)</span>
      </span>

      <!-- Loading -->
      <div v-if="isLoading" class="ml-auto flex items-center gap-2">
        <Icon name="lucide:loader-2" class="size-3 animate-spin text-base-400" />
        <span class="text-base-400">Carregando...</span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="ml-auto">
        <span class="text-danger-400">{{ error }}</span>
      </div>

      <!-- Regiões -->
      <div v-else class="ml-auto flex items-center gap-4 overflow-x-auto sm:gap-6">
        <div
          v-for="region in regions"
          :key="region.name"
          class="flex shrink-0 items-center gap-1.5"
        >
          <span class="font-medium">{{ region.name }}:</span>
          <span :class="levelClasses[region.level]" class="font-semibold">
            {{ region.level }}
          </span>
          <span :class="trendClasses[region.trend]" class="font-medium">
            {{ region.variation }}
          </span>
          <Icon
            v-if="trendIcons[region.trend]"
            :name="trendIcons[region.trend]!"
            :class="trendClasses[region.trend]"
            class="size-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>
