<script setup lang="ts">
import type { MunicipioOption } from '../composables/types'

const store = useMeuMunicipioStore()

const searchQuery = ref('')
const suggestions = shallowRef<MunicipioOption[]>([])
const showSuggestions = ref(false)
const api = useMeuMunicipioApi()

watchEffect(() => {
  if (store.filtros.municipio) {
    searchQuery.value = `${store.filtros.municipio.nome}, ${store.filtros.municipio.uf}`
  }
})

async function onSearch() {
  if (searchQuery.value.length < 2) {
    suggestions.value = []
    showSuggestions.value = false
    return
  }
  suggestions.value = await api.searchMunicipios(searchQuery.value)
  showSuggestions.value = true
}

async function selectMunicipio(option: MunicipioOption) {
  searchQuery.value = `${option.nome}, ${option.uf}`
  showSuggestions.value = false
  await store.setMunicipio(option)
}

function clearSearch() {
  searchQuery.value = ''
  suggestions.value = []
  showSuggestions.value = false
  store.setMunicipio(null)
}

function onSemanaClick() {
  // TODO: abrir dropdown de semanas
}
</script>

<template>
  <div class="absolute left-3 top-3 z-30 flex items-center gap-2 sm:left-4 sm:top-4">
    <!-- Busca de município -->
    <div class="relative">
      <div class="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-md">
        <Icon name="lucide:search" class="size-4 shrink-0 text-base-400" />
        <span
          v-if="!store.municipioSelecionado"
          class="hidden text-xs font-medium text-base-500 sm:inline"
        >
          meu município:
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Digite um município..."
          class="w-36 border-none bg-transparent text-sm text-base-900 outline-none placeholder:text-base-400 sm:w-44"
          @input="onSearch"
          @focus="showSuggestions = suggestions.length > 0"
        />
        <button
          v-if="store.municipioSelecionado"
          class="rounded-full p-0.5 text-base-400 hover:text-base-600"
          @click="clearSearch"
        >
          <Icon name="lucide:x" class="size-4" />
        </button>
        <kbd
          v-else
          class="hidden rounded bg-base-100 px-1.5 py-0.5 text-[10px] font-medium text-base-400 sm:inline"
        >
          Ctrl+K
        </kbd>
      </div>

      <!-- Sugestões dropdown -->
      <ul
        v-if="showSuggestions && suggestions.length > 0"
        class="absolute left-0 top-full z-50 mt-1 max-h-60 w-72 overflow-y-auto rounded-lg border border-base-200 bg-white shadow-lg"
      >
        <li
          v-for="option in suggestions"
          :key="option.ibgeCode"
          class="flex cursor-pointer items-center gap-3 px-4 py-2.5 hover:bg-secondary-50"
          @click="selectMunicipio(option)"
        >
          <Icon name="lucide:map-pin" class="size-4 shrink-0 text-secondary-500" />
          <div>
            <p class="text-sm font-medium text-base-900">{{ option.nome }}</p>
            <p class="text-xs text-base-500">{{ option.uf }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- Semana epidemiológica (botão dropdown) -->
    <button
      class="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm text-base-700 shadow-md hover:bg-base-50"
      @click="onSemanaClick"
    >
      <Icon name="lucide:calendar" class="size-4 text-primary-500" />
      <span class="hidden sm:inline">
        {{ store.semanas.find(s => s.value === store.filtros.semana)?.label ?? 'Semana' }}
      </span>
      <Icon name="lucide:chevron-down" class="size-3.5 text-base-400" />
    </button>
  </div>
</template>
