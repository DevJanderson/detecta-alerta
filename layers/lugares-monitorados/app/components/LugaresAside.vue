<script setup lang="ts">
const store = useLugaresMonitoradosStore()
</script>

<template>
  <aside
    v-show="store.isPanelOpen"
    class="hidden h-full w-130 shrink-0 flex-col overflow-hidden border-l border-base-100 bg-white lg:flex"
  >
    <!-- Header: ações rápidas -->
    <div class="flex items-center gap-2 border-b border-base-100 px-4 py-3">
      <NuxtLink
        to="/lugares-monitorados/tabela"
        class="inline-flex items-center gap-1.5 rounded-full border border-base-200 px-3 py-2 text-xs font-medium text-secondary-900 transition-colors hover:bg-base-50"
      >
        <Icon name="lucide:table-2" class="size-4" />
        Tabela
      </NuxtLink>
      <NuxtLink
        to="/lugares-monitorados/busca-externa"
        class="inline-flex items-center gap-1.5 rounded-full border border-base-200 px-3 py-2 text-xs font-medium text-secondary-900 transition-colors hover:bg-base-50"
      >
        <Icon name="lucide:search" class="size-4" />
        Busca
      </NuxtLink>
      <NuxtLink
        to="/lugares-monitorados/adicionar"
        class="inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-primary-800"
      >
        <Icon name="lucide:plus" class="size-4" />
        Novo
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="border-b border-base-100 px-4 py-4">
      <LugaresFiltros />
    </div>

    <!-- Estatísticas -->
    <div class="border-b border-base-100 px-4 py-3">
      <LugaresEstatisticas :stats="store.estatisticas" />
    </div>

    <!-- Lista de unidades -->
    <div class="flex-1 overflow-y-auto px-4 py-3">
      <!-- Loading -->
      <div v-if="store.isLoading" class="flex flex-col items-center justify-center gap-2 py-12">
        <CommonLoadingSpinner />
        <p class="text-sm text-base-500">Carregando unidades...</p>
      </div>

      <!-- Sem estado selecionado -->
      <div
        v-else-if="!store.filtros.estado && store.unidadesFiltradas.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-12 text-center"
      >
        <Icon name="lucide:map" class="size-10 text-base-300" />
        <p class="text-sm text-base-500">
          Selecione um estado para visualizar as unidades monitoradas.
        </p>
      </div>

      <!-- Sem resultados -->
      <div
        v-else-if="store.unidadesFiltradas.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-12 text-center"
      >
        <Icon name="lucide:filter-x" class="size-10 text-base-300" />
        <p class="text-sm text-base-500">Nenhuma unidade encontrada com os filtros aplicados.</p>
      </div>

      <!-- Lista -->
      <div v-else class="flex flex-col gap-2">
        <LugaresCardUnidade
          v-for="unidade in store.unidadesFiltradas"
          :key="unidade.placeId"
          :unidade="unidade"
          :selected="store.selectedUnidade?.placeId === unidade.placeId"
          @click="store.selectUnidade(unidade)"
        />
      </div>
    </div>
  </aside>
</template>
