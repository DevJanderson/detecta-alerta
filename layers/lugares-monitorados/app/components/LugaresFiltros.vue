<script setup lang="ts">
import type { TipoUnidade } from '../composables/types'
import { TIPO_UNIDADE_LABELS, TIPO_UNIDADE_ICONES } from '../composables/types'
const store = useLugaresMonitoradosStore()

const tiposFiltro: TipoUnidade[] = ['ubs', 'upa', 'drogarias', 'pet_shop', 'pet_atend']

function toggleTipo(tipo: TipoUnidade) {
  if (store.filtros.tipoUnidade === tipo) {
    store.setTipoUnidade(undefined)
  } else {
    store.setTipoUnidade(tipo)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Estado e Cidade -->
    <div class="flex gap-2">
      <div class="relative w-24">
        <select
          :value="store.filtros.estado || ''"
          class="h-10 w-full rounded-full border border-base-200 bg-white pl-3 pr-8 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          @change="store.setEstado(($event.target as HTMLSelectElement).value)"
        >
          <option value="">UF</option>
          <option v-for="uf in ESTADOS_BR" :key="uf" :value="uf">{{ uf }}</option>
        </select>
        <Icon
          name="lucide:chevron-down"
          class="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-base-400"
        />
      </div>
      <div class="relative flex-1">
        <select
          :value="store.filtros.cidade || ''"
          :disabled="!store.filtros.estado"
          class="h-10 w-full rounded-full border border-base-200 bg-white pl-3 pr-8 text-sm appearance-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          @change="store.setCidade(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Todas as cidades</option>
          <option v-for="cidade in store.cidadesDisponiveis" :key="cidade" :value="cidade">
            {{ cidade }}
          </option>
        </select>
        <Icon
          name="lucide:chevron-down"
          class="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-base-400"
        />
      </div>
    </div>

    <!-- Tipo de unidade -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="tipo in tiposFiltro"
        :key="tipo"
        class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
        :class="[
          store.filtros.tipoUnidade === tipo
            ? 'bg-secondary-900 text-white'
            : 'bg-base-50 text-base-600 hover:bg-base-100'
        ]"
        @click="toggleTipo(tipo)"
      >
        <Icon :name="TIPO_UNIDADE_ICONES[tipo]" class="size-3.5" />
        {{ TIPO_UNIDADE_LABELS[tipo] }}
      </button>
    </div>

    <!-- Checkboxes + Limpar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <label class="flex items-center gap-1.5 text-xs text-base-600 cursor-pointer">
          <Checkbox
            :checked="store.filtros.apenasAtivas || false"
            @update:checked="store.toggleApenasAtivas()"
          />
          Apenas ativas
        </label>
        <label class="flex items-center gap-1.5 text-xs text-base-600 cursor-pointer">
          <Checkbox
            :checked="store.filtros.apenasTempoReal || false"
            @update:checked="store.toggleApenasTempoReal()"
          />
          Tempo real
        </label>
      </div>
      <button
        v-if="store.hasActiveFilters"
        class="text-xs font-medium text-primary-700 hover:text-primary-900 transition-colors"
        @click="store.clearFilters()"
      >
        Limpar
      </button>
    </div>
  </div>
</template>
