<script setup lang="ts">
interface RegionIndicator {
  name: string
  level: 'Baixo' | 'Médio' | 'Alto'
  variation: string
  trend: 'up' | 'down' | 'stable'
}

defineProps<{
  regions?: RegionIndicator[]
}>()

// TODO: substituir por dados da API
const mockRegions: RegionIndicator[] = [
  { name: 'Norte', level: 'Médio', variation: '-1%', trend: 'up' },
  { name: 'Nordeste', level: 'Alto', variation: '-1%', trend: 'stable' },
  { name: 'Centro-Oeste', level: 'Médio', variation: '+6%', trend: 'up' },
  { name: 'Sudeste', level: 'Médio', variation: '+4%', trend: 'up' },
  { name: 'Sul', level: 'Médio', variation: '+5%', trend: 'up' }
]

const levelClasses: Record<string, string> = {
  Baixo: 'text-success-400',
  Médio: 'text-alert-600',
  Alto: 'text-primary-400'
}

const trendIcons: Record<RegionIndicator['trend'], string> = {
  up: 'lucide:trending-up',
  down: 'lucide:trending-down',
  stable: 'lucide:minus'
}
</script>

<template>
  <div class="bg-secondary-950 text-xs text-white">
    <div class="flex items-center gap-4 px-4 py-2 sm:px-6 lg:px-20">
      <span class="shrink-0 font-medium">Indicadores Regionais</span>

      <div class="ml-auto flex items-center gap-4 overflow-x-auto sm:gap-6">
        <div
          v-for="region in regions ?? mockRegions"
          :key="region.name"
          class="flex shrink-0 items-center gap-1.5"
        >
          <span class="font-medium">{{ region.name }}:</span>
          <span :class="levelClasses[region.level]" class="font-semibold">
            {{ region.level }}
          </span>
          <span :class="levelClasses[region.level]" class="font-medium">
            {{ region.variation }}
          </span>
          <Icon
            :name="trendIcons[region.trend]"
            :class="levelClasses[region.level]"
            class="size-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>
