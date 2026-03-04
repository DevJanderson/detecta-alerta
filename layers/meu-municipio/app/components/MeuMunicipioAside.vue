<script setup lang="ts">
const activeTab = ref<'resumo' | 'rumores'>('resumo')

const tabs = [
  { id: 'resumo', label: 'resumo', icon: 'lucide:file-text' },
  { id: 'rumores', label: 'rumores', icon: 'lucide:megaphone' }
] as const
</script>

<template>
  <aside
    class="hidden h-full w-[520px] shrink-0 flex-col overflow-hidden border-l border-base-100 bg-base-0 lg:flex"
  >
    <!-- HEADER -->
    <header class="bg-secondary-50">
      <div class="flex items-start justify-between px-6 pt-5 pb-3">
        <div class="flex min-w-0 flex-1 flex-col gap-1 pr-4">
          <h2 class="truncate font-heading text-[28px] font-semibold leading-[1.4] text-base-950">
            São Paulo
          </h2>
          <p class="text-sm text-base-600">São Paulo, SP — Região Sudeste</p>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <button
            class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-primary-500 transition-colors hover:bg-secondary-100"
            title="Compartilhar"
          >
            <Icon name="lucide:share-2" class="size-4" />
          </button>
          <button
            class="flex size-10 items-center justify-center rounded-full border border-secondary-100 bg-secondary-50 text-primary-500 transition-colors hover:bg-secondary-100"
            title="Imprimir"
          >
            <Icon name="lucide:printer" class="size-4" />
          </button>
          <button
            class="flex size-10 items-center justify-center rounded-full text-primary-500 transition-colors hover:bg-secondary-100"
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
          :aria-selected="activeTab === tab.id"
          :class="[
            'flex items-center gap-2 whitespace-nowrap rounded-t-xl px-4 py-2 text-xs font-semibold transition-colors',
            activeTab === tab.id
              ? 'border border-b-0 border-secondary-100 bg-base-0 text-primary-900'
              : 'text-base-500 hover:text-base-700'
          ]"
          @click="activeTab = tab.id"
        >
          <Icon :name="tab.icon" class="size-4" />
          <span>{{ tab.label }}</span>
        </button>
      </nav>
    </header>

    <!-- CONTENT -->
    <div class="flex-1 overflow-y-auto bg-base-0 scroll-smooth">
      <MeuMunicipioAsideResumo v-if="activeTab === 'resumo'" />
      <MeuMunicipioAsideRumores v-else-if="activeTab === 'rumores'" />
    </div>
  </aside>
</template>
