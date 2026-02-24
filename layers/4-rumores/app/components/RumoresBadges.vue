<script setup lang="ts">
import type { Doenca, Regiao } from '../composables/types'

defineProps<{
  doencas?: Doenca[]
  doencaPrincipal?: string | null
  localizacoes?: Regiao[]
  classificacaoOnehealth?: string | null
}>()
</script>

<template>
  <div class="flex flex-wrap gap-1.5">
    <!-- Doenca principal ou primeira da lista -->
    <Badge
      v-if="doencaPrincipal || (doencas && doencas.length > 0)"
      variant="secondary"
      class="bg-danger-50 text-danger-700 hover:bg-danger-100"
    >
      {{ doencaPrincipal || doencas?.[0]?.name }}
    </Badge>

    <!-- Localizacao principal -->
    <Badge
      v-if="localizacoes && localizacoes.length > 0"
      variant="secondary"
      class="bg-brand-secondary-50 text-brand-secondary-900 hover:bg-brand-secondary-100"
    >
      {{
        localizacoes?.[0]?.state
          ? `${localizacoes[0].name}, ${localizacoes[0].state}`
          : localizacoes?.[0]?.name
      }}
    </Badge>

    <!-- Classificacao One Health -->
    <Badge v-if="classificacaoOnehealth" variant="outline">
      {{ classificacaoOnehealth }}
    </Badge>
  </div>
</template>
