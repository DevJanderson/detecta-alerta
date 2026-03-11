<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)
const localValue = ref('')
const showDropdown = ref(false)
const selectedIndex = ref(-1)

const isMac = computed(() => {
  if (import.meta.client && typeof navigator !== 'undefined') {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }
  return false
})

const hasText = computed(() => localValue.value.length > 0)

// Mock de resultados
const mockResults = [
  { ibgeCode: '3550308', name: 'São Paulo', state: 'SP', stateName: 'São Paulo' },
  { ibgeCode: '3548708', name: 'Santos', state: 'SP', stateName: 'São Paulo' },
  { ibgeCode: '3548500', name: "Santa Bárbara d'Oeste", state: 'SP', stateName: 'São Paulo' },
  { ibgeCode: '3547809', name: 'Santo André', state: 'SP', stateName: 'São Paulo' }
]

const results = computed(() => {
  if (localValue.value.length < 2) return []
  return mockResults.filter(m => m.name.toLowerCase().includes(localValue.value.toLowerCase()))
})

const hasResults = computed(() => results.value.length > 0)

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  localValue.value = value
  showDropdown.value = value.length >= 2
  selectedIndex.value = -1
}

function handleClear() {
  localValue.value = ''
  showDropdown.value = false
  inputRef.value?.focus()
}

function handleSelectResult(index: number) {
  const selected = results.value[index]
  if (selected) {
    localValue.value = `${selected.name}, ${selected.state}`
    showDropdown.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (!showDropdown.value || !hasResults.value) {
    if (event.key === 'Escape' && hasText.value) handleClear()
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0) handleSelectResult(selectedIndex.value)
      else if (results.value.length > 0) handleSelectResult(0)
      break
    case 'Escape':
      showDropdown.value = false
      break
  }
}

function handleBlur() {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

function handleFocus() {
  if (localValue.value.length >= 2 && hasResults.value) {
    showDropdown.value = true
  }
}

// Atalho Ctrl+K / Cmd+K
function handleGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    inputRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <div class="relative w-full sm:max-w-md">
    <!-- Search Input -->
    <div
      class="flex items-center gap-2 rounded-full border border-base-200 bg-base-0 px-3 py-2 shadow-sm transition-colors hover:border-primary-300 hover:bg-base-50 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20"
    >
      <Icon
        v-if="false"
        :name="'lucide:loader-2'"
        class="size-4 shrink-0 animate-spin text-primary-500"
        aria-hidden="true"
      />
      <Icon
        v-else
        name="lucide:search"
        class="size-4 shrink-0 text-primary-500"
        aria-hidden="true"
      />

      <span v-if="!hasText" class="hidden shrink-0 text-sm font-medium text-base-700 lg:block">
        meu município:
      </span>

      <input
        ref="inputRef"
        type="text"
        :value="localValue"
        placeholder="Digite um município..."
        autocomplete="off"
        aria-label="Buscar município"
        class="search-input min-w-0 flex-1 border-none bg-transparent text-sm font-medium text-base-700 outline-none placeholder:text-base-400"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <button
        v-if="hasText"
        type="button"
        class="flex size-7 shrink-0 items-center justify-center rounded-full text-base-400 transition-colors hover:bg-base-100 hover:text-base-700"
        aria-label="Limpar busca"
        @mousedown.prevent="handleClear"
      >
        <Icon name="lucide:x" class="size-4" />
      </button>

      <kbd
        v-if="!hasText"
        class="hidden shrink-0 items-center gap-0.5 rounded border border-base-200 bg-base-50 px-1.5 py-0.5 text-[11px] font-medium text-base-500 lg:flex"
        title="Pressione para buscar"
      >
        <template v-if="isMac"> <Icon name="lucide:command" class="size-3" />K </template>
        <template v-else>Ctrl+K</template>
      </kbd>
    </div>

    <!-- Dropdown Results -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showDropdown && hasResults"
        class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-base-100 bg-base-0 shadow-lg"
      >
        <ul class="max-h-80 overflow-y-auto py-2" role="listbox">
          <li
            v-for="(result, index) in results"
            :key="result.ibgeCode"
            role="option"
            :aria-selected="selectedIndex === index"
            :class="[
              'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
              selectedIndex === index ? 'bg-primary-50 text-primary-900' : 'hover:bg-secondary-50'
            ]"
            @mousedown.prevent="handleSelectResult(index)"
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
              <p class="truncate text-sm font-medium">{{ result.name }}</p>
              <p class="truncate text-xs text-secondary-500">{{ result.stateName }}</p>
            </div>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.search-input:focus,
.search-input:focus-visible {
  outline: none;
  box-shadow: none;
  --tw-ring-shadow: 0 0 #0000;
  --tw-ring-offset-shadow: 0 0 #0000;
}
</style>
