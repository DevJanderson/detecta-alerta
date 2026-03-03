<script setup lang="ts">
const store = useMeuMunicipioStore()

const activeTab = ref<'resumo' | 'rumores'>('resumo')
const collapsed = ref(false)
</script>

<template>
  <aside
    class="absolute right-0 top-0 z-30 h-full w-full overflow-y-auto bg-white shadow-xl transition-transform sm:w-96 lg:w-[420px]"
    :class="collapsed ? 'translate-x-full' : 'translate-x-0'"
  >
    <!-- Loading -->
    <div v-if="store.isLoading" class="flex h-full items-center justify-center">
      <Icon name="lucide:loader-2" class="size-8 animate-spin text-secondary-500" />
    </div>

    <!-- Erro -->
    <div v-else-if="store.error" class="flex h-full flex-col items-center justify-center px-6">
      <Icon name="lucide:alert-triangle" class="size-10 text-danger-400" />
      <p class="mt-3 text-sm text-danger-600">{{ store.error }}</p>
      <button
        class="mt-4 rounded-lg bg-secondary-600 px-4 py-2 text-sm font-medium text-white hover:bg-secondary-700"
        @click="store.fetchAll()"
      >
        Tentar novamente
      </button>
    </div>

    <!-- Conteúdo -->
    <template v-else>
      <!-- View: Unidade selecionada -->
      <MeuMunicipioUnidade v-if="store.panelView === 'unidade'" />

      <!-- View: Município -->
      <template v-else>
        <!-- Header -->
        <MeuMunicipioPanelHeader @collapse="collapsed = true" />

        <!-- Tabs -->
        <div class="flex border-b border-base-200">
          <button
            class="flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition-colors"
            :class="
              activeTab === 'resumo'
                ? 'border-secondary-600 text-secondary-700'
                : 'border-transparent text-base-500 hover:text-base-700'
            "
            @click="activeTab = 'resumo'"
          >
            <Icon name="lucide:file-text" class="size-4" />
            resumo
          </button>
          <button
            class="flex flex-1 items-center justify-center gap-2 border-b-2 py-2.5 text-sm font-medium transition-colors"
            :class="
              activeTab === 'rumores'
                ? 'border-secondary-600 text-secondary-700'
                : 'border-transparent text-base-500 hover:text-base-700'
            "
            @click="activeTab = 'rumores'"
          >
            <Icon name="lucide:newspaper" class="size-4" />
            rumores
          </button>
        </div>

        <!-- Tab: Resumo -->
        <div v-if="activeTab === 'resumo'" class="space-y-5 p-5">
          <MeuMunicipioFiltros />
          <MeuMunicipioLotacao />
          <MeuMunicipioRumorDestaque />
          <MeuMunicipioRumoresList />
        </div>

        <!-- Tab: Rumores (conteúdo expandido) -->
        <div v-if="activeTab === 'rumores'" class="p-5">
          <MeuMunicipioRumorDestaque />
          <div class="mt-5">
            <MeuMunicipioRumoresList />
          </div>
        </div>
      </template>
    </template>
  </aside>

  <!-- Botão reabrir painel (quando colapsado) -->
  <button
    v-if="collapsed"
    class="absolute right-3 top-3 z-30 flex size-10 items-center justify-center rounded-lg bg-white text-base-600 shadow-md hover:bg-base-50"
    @click="collapsed = false"
  >
    <Icon name="lucide:panel-right-open" class="size-5" />
  </button>
</template>
