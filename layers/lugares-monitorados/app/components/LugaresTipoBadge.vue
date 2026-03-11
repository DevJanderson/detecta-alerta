<script setup lang="ts">
import type { TipoUnidade } from '../composables/types'
import { TIPO_UNIDADE_LABELS, TIPO_UNIDADE_ICONES } from '../composables/types'

defineProps<{
  tipo: TipoUnidade
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border border-secondary-100 bg-secondary-50 px-2.5 py-0.5 text-xs font-medium text-secondary-900"
  >
    <Icon :name="TIPO_UNIDADE_ICONES[tipo]" class="size-3.5" />
    {{ TIPO_UNIDADE_LABELS[tipo] }}
  </span>
</template>
