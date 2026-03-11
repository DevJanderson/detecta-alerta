<script setup lang="ts">
import type { TipoUnidade } from '../composables/types'
import { TIPO_UNIDADE_LABELS, TIPO_UNIDADE_ICONES } from '../composables/types'

defineProps<{
  selected: Set<TipoUnidade>
}>()

const emit = defineEmits<{
  toggle: [tipo: TipoUnidade]
}>()

const chips: { tipo: TipoUnidade; label: string; icon: string }[] = [
  { tipo: 'ubs', label: TIPO_UNIDADE_LABELS.ubs, icon: TIPO_UNIDADE_ICONES.ubs },
  { tipo: 'upa', label: TIPO_UNIDADE_LABELS.upa, icon: TIPO_UNIDADE_ICONES.upa },
  { tipo: 'drogarias', label: TIPO_UNIDADE_LABELS.drogarias, icon: TIPO_UNIDADE_ICONES.drogarias },
  { tipo: 'pet_shop', label: TIPO_UNIDADE_LABELS.pet_shop, icon: TIPO_UNIDADE_ICONES.pet_shop },
  { tipo: 'pet_atend', label: TIPO_UNIDADE_LABELS.pet_atend, icon: TIPO_UNIDADE_ICONES.pet_atend }
]
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="chip in chips"
      :key="chip.tipo"
      class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
      :class="
        selected.has(chip.tipo)
          ? 'bg-secondary-900 text-white'
          : 'bg-secondary-50 text-secondary-900 hover:bg-secondary-100'
      "
      @click="emit('toggle', chip.tipo)"
    >
      <Icon :name="chip.icon" class="size-3.5" />
      {{ chip.label }}
    </button>
  </div>
</template>
