<script setup lang="ts">
import type { Unidade } from '../composables/types'
import { TIPO_UNIDADE_LABELS } from '../composables/types'

const props = defineProps<{
  unidade: Unidade
  selected?: boolean
}>()

const emit = defineEmits<{
  click: [unidade: Unidade]
}>()

const tipoLabel = computed(() => TIPO_UNIDADE_LABELS[props.unidade.tipoUnidade])

const locationText = computed(() => props.unidade.bairro || props.unidade.cidade)

const ratingText = computed(() => {
  if (!props.unidade.notaTotal) return null
  return props.unidade.notaTotal.toFixed(1)
})

const addressText = computed(() => {
  if (!props.unidade.endereco) return null
  return props.unidade.endereco.split(' - ')[0]
})

const tipoBadgeClasses = computed(() => {
  const base = 'text-xs font-medium px-2 py-0.5 rounded-full'
  switch (props.unidade.tipoUnidade) {
    case 'ubs':
      return `${base} bg-secondary-100 text-secondary-700`
    case 'upa':
      return `${base} bg-primary-100 text-primary-700`
    case 'drogarias':
      return `${base} bg-alert-100 text-alert-700`
    case 'pet_shop':
    case 'pet_atend':
      return `${base} bg-success-100 text-success-700`
    default:
      return `${base} bg-base-100 text-base-600`
  }
})
</script>

<template>
  <button
    class="w-full cursor-pointer rounded-lg border bg-white p-4 text-left transition-all hover:border-base-200 hover:shadow-md"
    :class="[selected ? 'ring-2 ring-primary-500 border-primary-500' : 'border-base-100']"
    @click="emit('click', unidade)"
  >
    <!-- Título + badge de status -->
    <div class="mb-2 flex items-start justify-between gap-3">
      <h3 class="text-sm font-semibold leading-tight text-secondary-900 line-clamp-2">
        {{ unidade.titulo }}
      </h3>
      <!-- Tempo real -->
      <div
        v-if="unidade.tempoReal === 1"
        class="flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-success-700"
      >
        <Icon name="lucide:activity" class="size-3" />
        <span class="text-xs font-medium">Tempo real</span>
      </div>
      <!-- Histórico -->
      <div
        v-else-if="unidade.tempoReal === 2"
        class="flex shrink-0 items-center gap-1 rounded-full bg-secondary-50 px-2 py-0.5 text-secondary-600"
      >
        <Icon name="lucide:clock" class="size-3" />
        <span class="text-xs font-medium">Histórico</span>
      </div>
      <!-- Sem dados -->
      <div
        v-else
        class="flex shrink-0 items-center gap-1 rounded-full bg-base-100 px-2 py-0.5 text-base-500"
      >
        <Icon name="lucide:circle-off" class="size-3" />
        <span class="text-xs font-medium">Sem dados</span>
      </div>
    </div>

    <!-- Tipo, localização e rating -->
    <div class="flex flex-wrap items-center gap-2">
      <span :class="tipoBadgeClasses">{{ tipoLabel }}</span>
      <span class="text-xs text-base-500">{{ locationText }}</span>
      <div v-if="ratingText" class="flex items-center gap-0.5 text-xs text-base-600">
        <Icon name="lucide:star" class="size-3 fill-alert-950 text-alert-950" />
        <span>{{ ratingText }}</span>
        <span v-if="unidade.totalAvaliacoes" class="text-base-400">
          ({{ unidade.totalAvaliacoes }})
        </span>
      </div>
    </div>

    <!-- Endereço e link -->
    <div class="mt-2 flex items-center justify-between gap-2">
      <div v-if="addressText" class="flex min-w-0 items-start gap-1">
        <Icon name="lucide:map-pin" class="mt-0.5 size-3 shrink-0 text-base-400" />
        <span class="text-xs text-base-500 line-clamp-1">{{ addressText }}</span>
      </div>
      <button
        type="button"
        class="flex shrink-0 items-center gap-1 text-xs text-base-500 transition-colors hover:text-base-700"
        @click.stop="emit('click', unidade)"
      >
        <Icon name="lucide:navigation" class="size-3" />
        <span>Ver no mapa</span>
      </button>
    </div>
  </button>
</template>
