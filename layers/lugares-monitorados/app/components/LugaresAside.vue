<script setup lang="ts">
const store = useLugaresMonitoradosStore()
</script>

<template>
  <aside
    v-if="store.isPanelOpen"
    class="absolute inset-y-0 right-0 z-20 flex h-full w-full flex-col overflow-hidden bg-white sm:w-80 md:w-96 lg:static lg:w-[520px] lg:shrink-0"
  >
    <!-- Ações -->
    <div class="flex gap-2 px-3 pb-3 pt-3 sm:px-4 sm:pt-4">
      <NuxtLink
        to="/lugares-monitorados/tabela"
        class="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-base-200 text-sm font-semibold text-secondary-900 transition-colors hover:bg-base-50"
      >
        <Icon name="lucide:table-2" class="size-4" />
        Tabela
      </NuxtLink>
      <NuxtLink
        to="/lugares-monitorados/busca-externa"
        class="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-base-200 text-sm font-semibold text-secondary-900 transition-colors hover:bg-base-50"
      >
        <Icon name="lucide:search" class="size-4" />
        Busca
      </NuxtLink>
      <NuxtLink
        to="/lugares-monitorados/adicionar"
        class="flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary-900 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
      >
        <Icon name="lucide:plus" class="size-4" />
        Novo
      </NuxtLink>
    </div>

    <!-- Filtros -->
    <div class="px-4 py-3">
      <LugaresFiltros />
    </div>

    <!-- Estatísticas -->
    <div v-if="store.estatisticas.total > 0" class="px-4 py-3">
      <LugaresEstatisticas :stats="store.estatisticas" />
    </div>

    <!-- Lista de unidades -->
    <div class="flex-1 overflow-y-auto">
      <!-- Loading -->
      <div v-if="store.isLoading" class="flex h-full flex-col items-center justify-center gap-6">
        <span class="relative flex size-14 items-center justify-center">
          <span
            class="absolute inline-flex size-full animate-ping rotate-45 rounded-xl bg-primary-900 opacity-75"
          />
          <span
            class="relative inline-flex size-14 rotate-45 items-center justify-center rounded-xl bg-primary-900"
          >
            <Icon name="lucide:loader-2" class="size-6 -rotate-45 animate-spin text-white" />
          </span>
        </span>
        <span class="text-sm text-base-500">Carregando unidades...</span>
      </div>

      <!-- Sem estado selecionado -->
      <div
        v-else-if="!store.filtros.estado"
        class="flex h-full flex-col items-center justify-center gap-6 px-8 py-12"
      >
        <span class="relative flex size-20 items-center justify-center">
          <span class="absolute size-20 rotate-45 rounded-xl bg-primary-200" />
          <div
            class="relative flex size-14 rotate-45 items-center justify-center rounded-xl bg-primary-900"
          >
            <Icon name="lucide:map-pin" class="size-6 -rotate-45 text-white" />
          </div>
        </span>
        <p class="text-center text-sm text-base-500">
          Selecione um estado para visualizar as unidades
        </p>
      </div>

      <!-- Sem resultados -->
      <div
        v-else-if="store.unidadesFiltradas.length === 0"
        class="flex h-full flex-col items-center justify-center gap-6 px-8 py-12"
      >
        <span class="relative flex size-20 items-center justify-center">
          <span class="absolute size-20 rotate-45 rounded-xl bg-primary-200" />
          <div
            class="relative flex size-14 rotate-45 items-center justify-center rounded-xl bg-primary-900"
          >
            <Icon name="lucide:filter" class="size-6 -rotate-45 text-white" />
          </div>
        </span>
        <p class="text-center text-sm text-base-500">
          Nenhuma unidade encontrada com os filtros selecionados
        </p>
      </div>

      <!-- Lista -->
      <div v-else class="flex flex-col gap-2 p-3">
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
