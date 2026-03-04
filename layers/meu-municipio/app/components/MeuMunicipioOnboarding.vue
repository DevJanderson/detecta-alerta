<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const showDropdown = ref(false)
const selectedIndex = ref(-1)
const isLocating = ref(false)

// Mock de resultados
const mockMunicipalities = [
  { ibgeCode: '3550308', name: 'São Paulo', state: 'SP', stateName: 'São Paulo' },
  { ibgeCode: '3304557', name: 'Rio de Janeiro', state: 'RJ', stateName: 'Rio de Janeiro' },
  { ibgeCode: '2927408', name: 'Salvador', state: 'BA', stateName: 'Bahia' },
  { ibgeCode: '1302603', name: 'Manaus', state: 'AM', stateName: 'Amazonas' },
  { ibgeCode: '2611606', name: 'Recife', state: 'PE', stateName: 'Pernambuco' },
  { ibgeCode: '5300108', name: 'Brasília', state: 'DF', stateName: 'Distrito Federal' }
]

const results = computed(() => {
  if (searchQuery.value.length < 2) return []
  return mockMunicipalities.filter(m =>
    m.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const hasResults = computed(() => results.value.length > 0)

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  selectedIndex.value = -1
  showDropdown.value = value.length >= 2
}

function handleSelect(index: number) {
  const _selected = results.value[index]
  showDropdown.value = false
  searchQuery.value = ''
  // TODO: emit select quando API for integrada
}

function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value || !hasResults.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value =
        selectedIndex.value < results.value.length - 1 ? selectedIndex.value + 1 : 0
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value =
        selectedIndex.value > 0 ? selectedIndex.value - 1 : results.value.length - 1
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) handleSelect(selectedIndex.value)
      else if (results.value.length > 0) handleSelect(0)
      break
    case 'Escape':
      showDropdown.value = false
      break
  }
}

onMounted(() => {
  nextTick(() => {
    inputRef.value?.focus()
  })
})
</script>

<template>
  <div
    class="absolute inset-0 z-[1500] flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
  >
    <div
      class="relative mx-4 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-base-0 shadow-lg"
    >
      <!-- Header -->
      <div class="shrink-0 bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-8 text-base-0">
        <div class="mb-2 flex items-center gap-3">
          <Icon name="lucide:map-pin" class="size-8" />
          <h2 class="text-2xl font-bold">Meu Município</h2>
        </div>
        <p class="text-primary-100">
          Selecione seu município para visualizar os dados epidemiológicos da sua região.
        </p>
      </div>

      <!-- Conteúdo -->
      <div class="space-y-5 overflow-y-auto p-6">
        <!-- Campo de busca -->
        <div>
          <label for="onboarding-search" class="mb-2 block text-sm font-medium text-base-700">
            Buscar município
          </label>
          <div
            class="flex items-center gap-2 rounded-full border border-base-200 bg-base-0 px-3 py-2 shadow-sm transition-colors hover:border-primary-300 hover:bg-base-50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
          >
            <Icon
              name="lucide:search"
              class="size-4 shrink-0 text-primary-500"
              aria-hidden="true"
            />
            <input
              id="onboarding-search"
              ref="inputRef"
              type="text"
              :value="searchQuery"
              placeholder="Ex: São Paulo, Recife, Manaus..."
              autocomplete="off"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="onboarding-results"
              :aria-expanded="showDropdown && hasResults"
              class="onboarding-input min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-base-700 outline-none placeholder:text-base-400"
              @input="handleInput"
              @keydown="handleKeydown"
              @focus="showDropdown = searchQuery.length >= 2"
            />
          </div>

          <!-- Resultados -->
          <div
            v-if="showDropdown && hasResults"
            class="mt-2 overflow-hidden rounded-2xl border border-base-100 bg-base-0"
          >
            <ul id="onboarding-results" role="listbox" class="max-h-64 overflow-y-auto py-2">
              <li
                v-for="(municipality, index) in results"
                :id="`onboarding-result-${index}`"
                :key="municipality.ibgeCode"
                role="option"
                :aria-selected="selectedIndex === index"
                :class="[
                  'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
                  selectedIndex === index
                    ? 'bg-primary-50 text-primary-900'
                    : 'hover:bg-secondary-50'
                ]"
                @click="handleSelect(index)"
                @mouseenter="selectedIndex = index"
              >
                <Icon
                  name="lucide:map-pin"
                  :class="[
                    'size-5 shrink-0',
                    selectedIndex === index ? 'text-primary-900' : 'text-secondary-400'
                  ]"
                />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium">{{ municipality.name }}</p>
                  <p class="truncate text-xs text-secondary-500">
                    {{ municipality.stateName }} ({{ municipality.state }})
                  </p>
                </div>
              </li>
            </ul>

            <div class="border-t border-base-100 px-4 py-2 text-[11px] text-base-400">
              <kbd class="font-mono">↑↓</kbd> para navegar, <kbd class="font-mono">Enter</kbd> para
              selecionar
            </div>
          </div>

          <p
            v-if="showDropdown && !hasResults && searchQuery.length >= 2"
            class="mt-2 text-sm text-secondary-500"
          >
            Nenhum município encontrado. Verifique a ortografia.
          </p>
        </div>

        <!-- Divisor + Geolocalização -->
        <template v-if="!showDropdown || !hasResults">
          <div class="flex items-center gap-3">
            <div class="h-px flex-1 bg-base-200" />
            <span class="text-sm text-base-400">ou</span>
            <div class="h-px flex-1 bg-base-200" />
          </div>

          <button
            type="button"
            :disabled="isLocating"
            class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary-300 px-4 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:border-primary-400 hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Icon
              :name="isLocating ? 'lucide:loader-2' : 'lucide:navigation'"
              :class="['size-5', { 'animate-spin': isLocating }]"
            />
            {{ isLocating ? 'Detectando localização...' : 'Usar minha localização' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.onboarding-input:focus,
.onboarding-input:focus-visible {
  outline: none;
  box-shadow: none;
  --tw-ring-shadow: 0 0 #0000;
  --tw-ring-offset-shadow: 0 0 #0000;
}
</style>
