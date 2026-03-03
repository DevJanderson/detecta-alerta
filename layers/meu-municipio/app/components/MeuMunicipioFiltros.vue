<script setup lang="ts">
import type { Trend, UnitType } from '../composables/types'

const store = useMeuMunicipioStore()

const trendArrows: Record<Trend, string> = {
  up: '↑',
  down: '↓',
  stable: '→'
}

const trendColors: Record<Trend, string> = {
  up: 'text-primary-500',
  down: 'text-primary-500',
  stable: 'text-primary-500'
}

const typeLabels: Record<UnitType, string> = {
  drogaria: 'Drogaria',
  ubs: 'UBS',
  upa: 'UPA'
}

const typeIcons: Record<UnitType, string> = {
  drogaria: 'lucide:pill',
  ubs: 'lucide:heart-pulse',
  upa: 'lucide:hospital'
}

function toggleType(type: UnitType) {
  const current = store.filtros.tipoUnidade
  store.setTipoUnidade(current === type ? null : type)
}
</script>

<template>
  <div>
    <span class="text-xs font-medium text-base-500">Filtrar:</span>
    <div class="mt-2 flex flex-wrap items-center gap-3">
      <button
        v-for="summary in store.unitTypeSummaries"
        :key="summary.type"
        class="flex items-center gap-1.5 text-sm transition-opacity"
        :class="
          store.filtros.tipoUnidade && store.filtros.tipoUnidade !== summary.type
            ? 'opacity-40'
            : 'opacity-100'
        "
        @click="toggleType(summary.type)"
      >
        <Icon :name="typeIcons[summary.type]" class="size-4 text-secondary-500" />
        <span class="font-medium text-secondary-700">
          {{ typeLabels[summary.type] }} ({{ summary.count }})
        </span>
        <span class="text-xs" :class="trendColors[summary.trend]">
          {{ summary.percentage }}% {{ trendArrows[summary.trend] }}
        </span>
      </button>
    </div>
  </div>
</template>
