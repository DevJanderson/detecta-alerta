<script setup lang="ts">
import type { TipoUnidade } from '../composables/types'

defineProps<{
  canSearch: boolean
  isSearching: boolean
  tipoOptions: { value: TipoUnidade; label: string }[]
}>()

const searchQuery = defineModel<string>('searchQuery', { required: true })
const selectedEstado = defineModel<string>('selectedEstado', { required: true })
const selectedCidade = defineModel<string>('selectedCidade', { required: true })
const selectedTipo = defineModel<TipoUnidade | ''>('selectedTipo', { required: true })

const emit = defineEmits<{
  search: []
}>()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') emit('search')
}
</script>

<template>
  <div class="space-y-3 border-b border-base-100 px-4 py-4">
    <!-- Query -->
    <div class="relative">
      <Icon
        name="lucide:search"
        class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-400"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar unidades (3+ caracteres)..."
        class="h-9 w-full rounded-lg border border-base-200 bg-white pl-9 pr-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
        @keydown="handleKeydown"
      />
    </div>

    <!-- Tipo + Estado -->
    <div class="grid grid-cols-2 gap-2">
      <select
        v-model="selectedTipo"
        class="h-9 rounded-lg border border-base-200 bg-white px-2 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
      >
        <option value="">Todos os tipos</option>
        <option v-for="opt in tipoOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <select
        v-model="selectedEstado"
        class="h-9 rounded-lg border border-base-200 bg-white px-2 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
      >
        <option value="">UF</option>
        <option v-for="uf in ESTADOS_BR" :key="uf" :value="uf">{{ uf }}</option>
      </select>
    </div>

    <!-- Cidade -->
    <input
      v-model="selectedCidade"
      type="text"
      :disabled="!selectedEstado"
      placeholder="Cidade *"
      class="h-9 w-full rounded-lg border border-base-200 bg-white px-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300 disabled:bg-base-50 disabled:text-base-400"
    />

    <!-- Botão buscar -->
    <button
      class="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-secondary-900 text-sm font-medium text-white transition-colors hover:bg-secondary-800 disabled:opacity-50"
      :disabled="!canSearch"
      @click="emit('search')"
    >
      <Icon v-if="isSearching" name="lucide:loader-2" class="size-4 animate-spin" />
      <Icon v-else name="lucide:search" class="size-4" />
      {{ isSearching ? 'Buscando...' : 'Buscar' }}
    </button>

    <!-- Info -->
    <p class="text-xs text-base-400">Preencha estado, cidade e ao menos 3 caracteres na busca.</p>
  </div>
</template>
