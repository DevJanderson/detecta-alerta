<script setup lang="ts">
import type { EstatisticasPorTipo } from '../composables/types'

defineProps<{
  stats: EstatisticasPorTipo
}>()
</script>

<template>
  <div class="flex items-center justify-between text-sm">
    <span class="text-base-600">
      Total: <strong class="text-base-900">{{ stats.total }}</strong>
    </span>
    <div class="flex items-center gap-3 text-xs text-base-500">
      <span
        ><strong class="text-base-700">{{ stats.ubs }}</strong> UBS</span
      >
      <span
        ><strong class="text-base-700">{{ stats.upa }}</strong> UPA</span
      >
      <span
        ><strong class="text-base-700">{{ stats.drogarias }}</strong> Drogarias</span
      >
      <span
        ><strong class="text-base-700">{{ stats.petShop }}</strong> Pet Shop</span
      >
      <span
        ><strong class="text-base-700">{{ stats.petAtend }}</strong> Pet Clínica</span
      >
    </div>
  </div>
</template>
