<script setup lang="ts">
interface DiagnosisRegion {
  name: string
  severity: string
  percent: string
  direction: 'up' | 'down'
  color: 'secondary' | 'alert' | 'danger'
}

defineProps<{
  regions: DiagnosisRegion[]
}>()
</script>

<template>
  <div
    class="relative z-10 flex flex-col gap-2 border-b border-base-100 bg-base-0 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-40"
  >
    <!-- Título -->
    <div class="flex items-baseline gap-2 text-xs">
      <span class="font-semibold text-base-950">Movimento em estabelecimentos de saúde</span>
      <span class="hidden text-base-400 sm:inline">(comparado à semana anterior)</span>
    </div>

    <!-- Indicadores regionais -->
    <div class="flex flex-wrap items-start gap-x-4 gap-y-1">
      <div v-for="region in regions" :key="region.name" class="flex items-baseline gap-1 text-xs">
        <span class="text-base-950">{{ region.name }}:</span>
        <span
          class="font-semibold"
          :class="{
            'text-secondary-600': region.color === 'secondary',
            'text-alert-900': region.color === 'alert',
            'text-danger-600': region.color === 'danger'
          }"
        >
          {{ region.severity }}
        </span>
        <span
          :class="{
            'text-secondary-600': region.color === 'secondary',
            'text-alert-900': region.color === 'alert',
            'text-danger-600': region.color === 'danger'
          }"
        >
          &bull; {{ region.percent }}
        </span>
        <Icon
          :name="region.direction === 'up' ? 'lucide:arrow-up' : 'lucide:arrow-down'"
          class="size-3"
          :class="{
            'text-secondary-600': region.color === 'secondary',
            'text-alert-900': region.color === 'alert',
            'text-danger-600': region.color === 'danger'
          }"
        />
      </div>
    </div>
  </div>
</template>
