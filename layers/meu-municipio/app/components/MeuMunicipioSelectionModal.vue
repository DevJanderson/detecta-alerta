<script setup lang="ts">
import type { MunicipioOption } from '../composables/types'

const store = useMeuMunicipioStore()
const api = useMeuMunicipioApi()

const searchQuery = ref('')
const suggestions = shallowRef<MunicipioOption[]>([])
const showSuggestions = ref(false)

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
  searchQuery.value = ''
  showSuggestions.value = false
  await store.setMunicipio(option)
}
</script>

<template>
  <div class="absolute inset-0 z-40 flex items-center justify-center">
    <div class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
      <!-- Header rosa -->
      <div class="bg-primary-100 px-8 py-6">
        <div class="flex items-center gap-3">
          <Icon name="lucide:map-pin" class="size-6 text-primary-600" />
          <h2 class="text-xl font-bold text-primary-900">Meu Município</h2>
        </div>
        <p class="mt-2 text-sm text-primary-700/80">
          Selecione seu município para visualizar os dados epidemiológicos da sua região.
        </p>
      </div>

      <!-- Body -->
      <div class="px-8 py-6">
        <!-- Campo de busca -->
        <label class="mb-2 block text-sm font-medium text-base-700">Buscar município</label>
        <div class="relative">
          <div class="relative">
            <Icon
              name="lucide:search"
              class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-400"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Ex: São Paulo, Recife, Manaus..."
              class="w-full rounded-lg border border-base-200 bg-white py-2.5 pl-9 pr-4 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-400 focus:outline-none focus:ring-1 focus:ring-secondary-400"
              @input="onSearch"
              @focus="showSuggestions = suggestions.length > 0"
            />
          </div>

          <!-- Sugestões -->
          <ul
            v-if="showSuggestions && suggestions.length > 0"
            class="absolute left-0 top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-base-200 bg-white shadow-lg"
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

        <!-- Divisor -->
        <div class="my-5 flex items-center gap-3">
          <div class="h-px flex-1 bg-base-200" />
          <span class="text-xs text-base-400">ou</span>
          <div class="h-px flex-1 bg-base-200" />
        </div>

        <!-- Botão geolocalização -->
        <button
          class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-primary-300 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:border-primary-400 hover:bg-primary-50"
        >
          <Icon name="lucide:navigation" class="size-4" />
          Usar minha localização
        </button>
      </div>
    </div>
  </div>
</template>
