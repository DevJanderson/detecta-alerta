<script setup lang="ts">
import type { EstatisticasPorTipo } from '../composables/types'
import { TIPO_UNIDADE_CORES } from '../composables/types'

defineProps<{
  stats: EstatisticasPorTipo
}>()

const items = [
  { key: 'ubs' as const, label: 'UBS', cor: TIPO_UNIDADE_CORES.ubs },
  { key: 'upa' as const, label: 'UPA', cor: TIPO_UNIDADE_CORES.upa },
  { key: 'drogarias' as const, label: 'Drog.', cor: TIPO_UNIDADE_CORES.drogarias },
  { key: 'petShop' as const, label: 'Pet S.', cor: TIPO_UNIDADE_CORES.pet_shop },
  { key: 'petAtend' as const, label: 'Pet C.', cor: TIPO_UNIDADE_CORES.pet_atend }
]
</script>

<template>
  <div class="flex items-center gap-3 text-xs text-base-600">
    <span class="font-semibold text-base-900"> {{ stats.total }} unidades </span>
    <span class="text-base-300">|</span>
    <span v-for="item in items" :key="item.key" class="flex items-center gap-1">
      <span class="size-2 rounded-full" :style="{ backgroundColor: item.cor }" />
      {{ item.label }}: {{ stats[item.key] }}
    </span>
  </div>
</template>
