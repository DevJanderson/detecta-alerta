<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Busca Externa - Detecta Alerta',
  description: 'Busque e importe unidades de saúde a partir de fontes externas.'
})

const store = useLugaresMonitoradosStore()

const {
  searchQuery,
  selectedEstado,
  selectedCidade,
  selectedTipo,
  resultados,
  isSearching,
  hasSearched,
  canSearch,
  selectedCount,
  selectedPlaces,
  selectedPlaceId,
  showReviewModal,
  tipoOptions,
  doSearch,
  toggleItem,
  toggleSelectAll
} = useBuscaExterna()

onMounted(() => {
  if (store.unidades.length === 0) store.fetchUnidades()
})

function handleRemoveFromReview(placeId: string) {
  const item = resultados.value.find(r => r.placeId === placeId)
  if (item) item.selecionado = false
  if (selectedPlaces.value.length === 0) showReviewModal.value = false
}
</script>

<template>
  <div class="flex h-[calc(100vh-5.5rem)] w-full flex-col-reverse sm:flex-row">
    <!-- Mapa (placeholder — integração futura com marcadores) -->
    <div class="relative hidden min-w-0 flex-1 sm:block">
      <div class="flex h-full items-center justify-center bg-base-50">
        <div class="text-center">
          <Icon name="lucide:map" class="mx-auto size-16 text-base-200" />
          <p class="mt-3 text-sm text-base-400">
            {{
              resultados.length > 0
                ? `${resultados.length} resultados no mapa`
                : 'Mapa de resultados'
            }}
          </p>
          <p class="mt-1 text-xs text-base-300">Integração com marcadores em desenvolvimento</p>
        </div>
      </div>

      <!-- Banner API Key -->
      <div class="absolute inset-x-4 top-4 z-10">
        <div class="rounded-lg border border-alert-200 bg-alert-50 px-4 py-3">
          <div class="flex items-start gap-3">
            <Icon name="lucide:alert-triangle" class="mt-0.5 size-5 shrink-0 text-alert-600" />
            <div class="flex-1">
              <p class="text-sm font-medium text-alert-900">Busca simulada (modo demonstração)</p>
              <p class="mt-1 text-xs text-alert-700">
                Os resultados são dados mock. A integração com Google Places será implementada na
                fase de integração com API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Aside (painel lateral) -->
    <aside
      class="flex h-full w-full shrink-0 flex-col border-l border-base-100 bg-white sm:w-80 md:w-96 lg:w-[420px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-base-100 px-4 py-3">
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/lugares-monitorados"
            class="flex size-8 items-center justify-center rounded-md text-base-400 transition-colors hover:bg-base-100 hover:text-base-600"
          >
            <Icon name="lucide:arrow-left" class="size-4" />
          </NuxtLink>
          <h2 class="text-sm font-semibold text-base-900">Busca Externa</h2>
        </div>
      </div>

      <!-- Filtros -->
      <LugaresBuscaFiltros
        v-model:search-query="searchQuery"
        v-model:selected-estado="selectedEstado"
        v-model:selected-cidade="selectedCidade"
        v-model:selected-tipo="selectedTipo"
        :can-search="canSearch"
        :is-searching="isSearching"
        :tipo-options="tipoOptions"
        @search="doSearch"
      />

      <!-- Resultados -->
      <LugaresBuscaResultados
        :resultados="resultados"
        :is-searching="isSearching"
        :has-searched="hasSearched"
        :selected-place-id="selectedPlaceId"
        @toggle="toggleItem"
        @toggle-all="toggleSelectAll"
        @select="selectedPlaceId = $event"
      />

      <!-- Footer com seleção -->
      <div v-if="resultados.length > 0" class="border-t border-base-100 px-4 py-3">
        <div class="mb-2 flex items-center justify-between">
          <p class="text-xs text-base-500">
            {{ selectedCount }} selecionada{{ selectedCount !== 1 ? 's' : '' }}
          </p>
        </div>
        <button
          class="flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary-900 text-sm font-medium text-white transition-colors hover:bg-primary-800 disabled:opacity-50"
          :disabled="selectedCount === 0"
          @click="showReviewModal = true"
        >
          <Icon name="lucide:file-check" class="size-4" />
          Revisar e Importar ({{ selectedCount }})
        </button>
      </div>
    </aside>

    <!-- Modal de revisão -->
    <LugaresBuscaReviewModal
      v-if="showReviewModal"
      :places="selectedPlaces"
      @close="showReviewModal = false"
      @remove="handleRemoveFromReview"
    />
  </div>
</template>
