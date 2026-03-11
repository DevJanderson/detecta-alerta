<script setup lang="ts">
const store = useMeuMunicipioStore()
const isOpen = ref(false)

const tabs = [
  { id: 'resumo', label: 'resumo', icon: 'lucide:file-text' },
  { id: 'rumores', label: 'rumores', icon: 'lucide:megaphone' }
] as const

function toggleMobileAside() {
  isOpen.value = !isOpen.value
}

defineExpose({ toggleMobileAside })
</script>

<template>
  <!-- Mobile toggle button (floating) -->
  <button
    type="button"
    class="absolute right-3 bottom-14 z-1000 flex size-12 items-center justify-center rounded-full border border-secondary-200 bg-secondary-900 text-base-0 shadow-lg transition-colors hover:bg-secondary-800 sm:bottom-6 lg:hidden"
    :aria-expanded="isOpen"
    aria-label="Ver dados do município"
    @click="toggleMobileAside"
  >
    <Icon :name="isOpen ? 'lucide:x' : 'lucide:file-text'" class="size-5" />
  </button>

  <!-- Mobile overlay -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="absolute inset-0 z-[1400] bg-black/40 lg:hidden"
      @click="isOpen = false"
    />
  </Transition>

  <!-- Aside panel -->
  <aside
    :class="[
      'z-[1500] flex h-full w-full shrink-0 flex-col overflow-hidden border-l border-base-100 bg-base-0 transition-transform duration-300 sm:w-96 lg:static lg:w-130 lg:translate-x-0',
      isOpen ? 'absolute right-0 translate-x-0' : 'absolute right-0 translate-x-full lg:relative'
    ]"
  >
    <!-- HEADER -->
    <header class="bg-secondary-50">
      <div class="flex items-start justify-between px-4 pt-4 pb-3 sm:px-6 sm:pt-5">
        <div class="flex min-w-0 flex-1 flex-col gap-1 pr-3 sm:pr-4">
          <h2
            class="truncate font-heading text-xl font-semibold leading-[1.4] text-base-950 sm:text-2xl lg:text-[28px]"
          >
            {{ store.municipioDisplay?.nome ?? 'Selecione um município' }}
          </h2>
          <p class="text-xs text-base-600 sm:text-sm">
            {{ store.municipioDisplay?.subtitulo ?? '' }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            class="flex size-8 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-primary-500 transition-colors hover:bg-secondary-100 sm:size-10"
            title="Compartilhar"
          >
            <Icon name="lucide:share-2" class="size-3.5 sm:size-4" />
          </button>
          <button
            class="flex size-8 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-primary-500 transition-colors hover:bg-secondary-100 sm:size-10"
            title="Imprimir"
          >
            <Icon name="lucide:printer" class="size-3.5 sm:size-4" />
          </button>
          <button
            class="flex size-8 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-secondary-100 lg:hidden"
            title="Fechar painel"
            @click="isOpen = false"
          >
            <Icon name="lucide:x" class="size-4" />
          </button>
          <button
            class="hidden size-10 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-secondary-100 lg:flex"
            title="Colapsar menu"
          >
            <Icon name="lucide:arrow-right-to-line" class="size-4" />
          </button>
        </div>
      </div>

      <!-- TABS -->
      <nav class="no-scrollbar flex gap-1 overflow-x-auto pl-2" role="tablist">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          role="tab"
          :aria-selected="store.activeTab === tab.id"
          :class="[
            'flex items-center gap-2 whitespace-nowrap rounded-t-xl px-4 py-2 text-xs font-semibold transition-colors',
            store.activeTab === tab.id
              ? 'border border-b-0 border-secondary-100 bg-base-0 text-primary-900'
              : 'text-base-500 hover:text-base-700'
          ]"
          @click="store.setActiveTab(tab.id)"
        >
          <Icon :name="tab.icon" class="size-4" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>
    </header>

    <!-- CONTENT -->
    <div class="flex-1 overflow-y-auto bg-base-0 scroll-smooth">
      <MeuMunicipioAsideResumo v-if="store.activeTab === 'resumo'" />
      <MeuMunicipioAsideRumores v-else-if="store.activeTab === 'rumores'" />
    </div>
  </aside>
</template>
