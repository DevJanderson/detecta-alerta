<script setup lang="ts">
import type { ResultadoBusca } from '../composables/useBuscaExterna'
import { TIPO_UNIDADE_LABELS } from '../composables/types'

const props = defineProps<{
  resultados: ResultadoBusca[]
  isSearching: boolean
  hasSearched: boolean
  selectedPlaceId: string | null
}>()

const emit = defineEmits<{
  toggle: [placeId: string]
  toggleAll: []
  select: [placeId: string]
}>()

const novosCount = computed(() => props.resultados.filter(r => !r.jaExiste).length)
const existentesCount = computed(() => props.resultados.filter(r => r.jaExiste).length)
const allNewSelected = computed(() => {
  const novos = props.resultados.filter(r => !r.jaExiste)
  return novos.length > 0 && novos.every(r => r.selecionado)
})
</script>

<template>
  <div class="flex flex-1 flex-col overflow-hidden">
    <!-- Header -->
    <div
      v-if="resultados.length > 0"
      class="flex items-center justify-between border-b border-base-100 px-4 py-2"
    >
      <p class="text-xs text-base-500">
        {{ resultados.length }} encontrado{{ resultados.length !== 1 ? 's' : '' }}
        <span v-if="existentesCount > 0" class="text-alert-600">
          ({{ existentesCount }} já cadastrada{{ existentesCount !== 1 ? 's' : '' }})
        </span>
      </p>
      <button
        v-if="novosCount > 0"
        class="text-xs font-medium text-secondary-700 hover:text-secondary-900"
        @click="emit('toggleAll')"
      >
        {{ allNewSelected ? 'Desmarcar' : 'Selecionar' }} todos
      </button>
    </div>

    <!-- Lista -->
    <div class="flex-1 overflow-y-auto">
      <!-- Placeholder -->
      <div
        v-if="!hasSearched && resultados.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <Icon name="lucide:search" class="size-10 text-base-200" />
        <p class="text-sm text-base-400">Use os filtros acima para buscar unidades.</p>
      </div>

      <!-- Loading -->
      <div v-else-if="isSearching" class="flex flex-col items-center justify-center gap-2 py-16">
        <CommonLoadingSpinner />
        <p class="text-sm text-base-500">Buscando unidades...</p>
      </div>

      <!-- Sem resultados -->
      <div
        v-else-if="hasSearched && resultados.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <Icon name="lucide:search-x" class="size-10 text-base-200" />
        <p class="text-sm text-base-400">Nenhum resultado encontrado.</p>
      </div>

      <!-- Cards -->
      <div v-else class="divide-y divide-base-100">
        <button
          v-for="item in resultados"
          :key="item.placeId"
          class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors"
          :class="{
            'opacity-60': item.jaExiste,
            'bg-secondary-50/50': selectedPlaceId === item.placeId,
            'hover:bg-base-50': !item.jaExiste
          }"
          @click="item.jaExiste ? undefined : emit('select', item.placeId)"
        >
          <!-- Checkbox -->
          <div class="mt-0.5 shrink-0">
            <div
              v-if="item.jaExiste"
              class="flex size-5 items-center justify-center rounded border border-success-300 bg-success-50"
            >
              <Icon name="lucide:check" class="size-3 text-success-600" />
            </div>
            <div
              v-else
              class="flex size-5 cursor-pointer items-center justify-center rounded border transition-colors"
              :class="
                item.selecionado
                  ? 'border-secondary-500 bg-secondary-500'
                  : 'border-base-300 hover:border-secondary-300'
              "
              @click.stop="emit('toggle', item.placeId)"
            >
              <Icon v-if="item.selecionado" name="lucide:check" class="size-3 text-white" />
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <p class="truncate text-sm font-medium text-base-900">{{ item.nome }}</p>
              <span
                class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                :class="{
                  'bg-success-100 text-success-700': item.tipo === 'ubs',
                  'bg-primary-100 text-primary-700': item.tipo === 'upa',
                  'bg-alert-100 text-alert-700': item.tipo === 'drogarias',
                  'bg-secondary-100 text-secondary-700':
                    item.tipo === 'pet_shop' || item.tipo === 'pet_atend'
                }"
              >
                {{ TIPO_UNIDADE_LABELS[item.tipo] }}
              </span>
              <span
                v-if="item.jaExiste"
                class="shrink-0 rounded-full bg-alert-50 px-2 py-0.5 text-[10px] font-medium text-alert-700"
              >
                Cadastrada
              </span>
            </div>
            <p class="mt-0.5 flex items-center gap-1 truncate text-xs text-base-500">
              <Icon name="lucide:map-pin" class="size-3 shrink-0 text-base-400" />
              {{ item.endereco }}, {{ item.bairro }}
            </p>
            <p v-if="item.nota" class="mt-0.5 text-xs text-base-400">
              <Icon name="lucide:star" class="inline-block size-3 text-alert-500" />
              {{ item.nota }} ({{ item.avaliacoes }})
            </p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
