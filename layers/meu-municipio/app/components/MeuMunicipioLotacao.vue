<script setup lang="ts">
import type { Level } from '../composables/types'

const store = useMeuMunicipioStore()

const levelColors: Record<Level, string> = {
  Baixo: 'border-success-200 bg-success-50 text-success-700',
  Médio: 'border-alert-200 bg-alert-50 text-alert-700',
  Alto: 'border-danger-200 bg-danger-50 text-danger-700'
}

const activeChart = ref<'linha' | 'faixa'>('linha')
</script>

<template>
  <div v-if="store.lotacao">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-base font-bold text-base-900">Lotação</h3>
        <p class="text-xs text-base-500">Movimento das últimas semanas</p>
      </div>
      <span
        class="rounded-md border px-2 py-0.5 text-xs font-medium"
        :class="levelColors[store.lotacao.level]"
      >
        {{ store.lotacao.level }}
      </span>
    </div>

    <!-- Tabs linha/faixa -->
    <div class="mt-3 flex overflow-hidden rounded-lg border border-base-200">
      <button
        class="flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors"
        :class="
          activeChart === 'linha'
            ? 'bg-secondary-800 text-white'
            : 'bg-white text-base-500 hover:bg-base-50'
        "
        @click="activeChart = 'linha'"
      >
        <Icon name="lucide:chart-line" class="size-4" />
        linha
      </button>
      <button
        class="flex flex-1 items-center justify-center gap-2 py-2 text-sm font-medium transition-colors"
        :class="
          activeChart === 'faixa'
            ? 'bg-secondary-800 text-white'
            : 'bg-white text-base-500 hover:bg-base-50'
        "
        @click="activeChart = 'faixa'"
      >
        <Icon name="lucide:chart-area" class="size-4" />
        faixa
      </button>
    </div>

    <!-- Placeholder gráfico -->
    <div
      class="mt-3 flex h-52 items-center justify-center rounded-lg border border-dashed border-base-200"
    >
      <div class="text-center">
        <Icon
          :name="activeChart === 'linha' ? 'lucide:chart-line' : 'lucide:chart-area'"
          class="mx-auto size-10 text-base-200"
        />
        <p class="mt-1.5 text-xs text-base-400">Gráfico de lotação semanal</p>
        <p class="text-xs text-base-300">(ApexCharts — integração futura)</p>
      </div>
    </div>
  </div>
</template>
