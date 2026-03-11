<script setup lang="ts">
import type { Unidade } from '../composables/types'
import { TIPO_UNIDADE_LABELS, TIPO_UNIDADE_CORES, TIPO_UNIDADE_ICONES } from '../composables/types'

const props = defineProps<{
  unidade: Unidade
  selected?: boolean
}>()

const emit = defineEmits<{
  click: [unidade: Unidade]
}>()

const tipoLabel = computed(() => TIPO_UNIDADE_LABELS[props.unidade.tipoUnidade])
const tipoCor = computed(() => TIPO_UNIDADE_CORES[props.unidade.tipoUnidade])
const tipoIcone = computed(() => TIPO_UNIDADE_ICONES[props.unidade.tipoUnidade])

const statusLabel = computed(() => {
  if (props.unidade.tempoReal === 1) return 'Tempo real'
  if (props.unidade.tempoReal === 2) return 'Histórico'
  return 'Sem dados'
})

const statusColor = computed(() => {
  if (props.unidade.tempoReal === 1) return 'bg-success-500'
  if (props.unidade.tempoReal === 2) return 'bg-alert-500'
  return 'bg-base-300'
})
</script>

<template>
  <button
    class="w-full rounded-lg border p-4 text-left transition-all hover:shadow-md hover:border-base-200"
    :class="[
      selected
        ? 'ring-2 ring-primary-500 border-primary-500 bg-primary-50/30'
        : 'border-base-100 bg-white'
    ]"
    @click="emit('click', unidade)"
  >
    <!-- Header: título + status -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="text-sm font-semibold text-base-900 line-clamp-2">
        {{ unidade.titulo }}
      </h3>
      <span class="flex shrink-0 items-center gap-1.5 text-xs text-base-500">
        <span class="size-2 rounded-full" :class="statusColor" />
        {{ statusLabel }}
      </span>
    </div>

    <!-- Tipo badge -->
    <div class="mt-2 flex items-center gap-2">
      <span
        class="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
        :style="{ backgroundColor: tipoCor + '15', color: tipoCor }"
      >
        <Icon :name="tipoIcone" class="size-3.5" />
        {{ tipoLabel }}
      </span>
    </div>

    <!-- Localização -->
    <div class="mt-2 flex items-center gap-1.5 text-xs text-base-500">
      <Icon name="lucide:map-pin" class="size-3.5 shrink-0" />
      <span class="truncate">
        {{ unidade.bairro ? `${unidade.bairro} — ` : '' }}{{ unidade.cidade }}, {{ unidade.estado }}
      </span>
    </div>

    <!-- Avaliação -->
    <div v-if="unidade.notaTotal" class="mt-2 flex items-center gap-1.5 text-xs text-base-500">
      <Icon name="lucide:star" class="size-3.5 shrink-0 text-alert-500" />
      <span>{{ unidade.notaTotal.toFixed(1) }}</span>
      <span v-if="unidade.totalAvaliacoes" class="text-base-400">
        ({{ unidade.totalAvaliacoes }})
      </span>
    </div>
  </button>
</template>
