<script setup lang="ts">
const filters = [
  {
    id: 'ubs',
    label: 'UBS',
    icon: 'lucide:stethoscope',
    units: 124,
    percentage: 42,
    trend: 'up' as const
  },
  {
    id: 'upa',
    label: 'UPA',
    icon: 'lucide:hospital',
    units: 38,
    percentage: 67,
    trend: 'up' as const
  },
  {
    id: 'drogaria',
    label: 'Drogarias',
    icon: 'lucide:pill',
    units: 312,
    percentage: 28,
    trend: 'down' as const
  }
]
</script>

<template>
  <section class="border-b border-secondary-100 pb-4">
    <span class="mb-2 block text-xs font-semibold text-base-950">Filtrar:</span>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.id"
        type="button"
        class="flex h-7 items-center gap-1 rounded-full border border-transparent bg-secondary-50 px-2.5 transition-all duration-200 hover:bg-secondary-100"
      >
        <Icon :name="filter.icon" class="size-3.5 text-primary-500" />
        <span class="text-xs font-semibold text-secondary-700">
          {{ filter.label }} ({{ filter.units }})
        </span>
        <span class="flex items-center gap-0.5 text-xs">
          <span
            :class="[
              filter.percentage > 50
                ? 'text-danger-500'
                : filter.percentage > 30
                  ? 'text-alert-800'
                  : 'text-secondary-500'
            ]"
          >
            {{ filter.percentage }}%
          </span>
          <span
            :class="['text-xs', filter.trend === 'up' ? 'text-danger-500' : 'text-success-600']"
          >
            {{ filter.trend === 'up' ? '↑' : '↓' }}
          </span>
        </span>
      </button>
    </div>
  </section>
</template>
