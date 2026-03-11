<script setup lang="ts">
import type { TipoUnidade } from '../composables/types'
import { TIPO_UNIDADE_LABELS, TIPO_UNIDADE_ICONES } from '../composables/types'

const store = useLugaresMonitoradosStore()

const tiposFiltro: TipoUnidade[] = ['ubs', 'upa', 'drogarias', 'pet_shop', 'pet_atend']

function toggleTipo(tipo: TipoUnidade) {
  store.setTipoUnidade(store.filtros.tipoUnidade === tipo ? undefined : tipo)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Estado e Cidade -->
    <div class="flex gap-2">
      <div class="w-24">
        <label class="mb-1 ml-1 block text-xs font-medium text-base-600">UF</label>
        <select
          :value="store.filtros.estado || ''"
          class="w-full rounded-lg border border-base-100 px-2 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
          @change="store.setEstado(($event.target as HTMLSelectElement).value)"
        >
          <option value="">Todos</option>
          <option v-for="uf in ESTADOS_BR" :key="uf" :value="uf">{{ uf }}</option>
        </select>
      </div>
      <div class="flex-1">
        <label class="mb-1 ml-1 block text-xs font-medium text-base-600">Cidade</label>
        <select
          :value="store.filtros.cidade || ''"
          :disabled="!store.filtros.estado || store.cidadesDisponiveis.length === 0"
          class="w-full rounded-lg border border-base-100 px-2 py-2 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-base-100"
          @change="store.setCidade(($event.target as HTMLSelectElement).value)"
        >
          <option value="">---</option>
          <option v-for="cidade in store.cidadesDisponiveis" :key="cidade" :value="cidade">
            {{ cidade }}
          </option>
        </select>
      </div>
    </div>

    <!-- Tipo de Unidade -->
    <div>
      <label class="mb-2 block text-xs font-semibold text-base-950">Tipo de Unidade</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tipo in tiposFiltro"
          :key="tipo"
          type="button"
          class="flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-all duration-200"
          :class="[
            store.filtros.tipoUnidade === tipo
              ? 'border-secondary-300 bg-secondary-100 hover:bg-secondary-200'
              : store.filtros.tipoUnidade
                ? 'border-transparent bg-secondary-50 opacity-50 hover:opacity-75'
                : 'border-transparent bg-secondary-50 hover:bg-secondary-100'
          ]"
          @click="toggleTipo(tipo)"
        >
          <Icon :name="TIPO_UNIDADE_ICONES[tipo]" class="size-3.5 text-primary-500" />
          <span class="text-xs font-semibold text-secondary-700">
            {{ TIPO_UNIDADE_LABELS[tipo] }}
          </span>
        </button>
      </div>
    </div>

    <!-- Checkboxes + Limpar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <label class="flex cursor-pointer items-center gap-1.5 text-xs text-base-600">
          <input
            type="checkbox"
            :checked="store.filtros.apenasAtivas || false"
            class="rounded border-base-300 text-primary-600 focus:ring-primary-500"
            @change="store.toggleApenasAtivas()"
          />
          Apenas ativas
        </label>
        <label class="flex cursor-pointer items-center gap-1.5 text-xs text-base-600">
          <input
            type="checkbox"
            :checked="store.filtros.apenasTempoReal || false"
            class="rounded border-base-300 text-primary-600 focus:ring-primary-500"
            @change="store.toggleApenasTempoReal()"
          />
          Tempo real
        </label>
      </div>
      <button
        v-if="store.hasActiveFilters"
        class="shrink-0 text-xs text-danger-600 hover:text-danger-700"
        @click="store.clearFilters()"
      >
        Limpar
      </button>
    </div>
  </div>
</template>
