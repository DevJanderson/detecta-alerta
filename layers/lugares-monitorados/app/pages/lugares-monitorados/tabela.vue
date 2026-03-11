<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Tabela de Unidades - Detecta Alerta',
  description:
    'Visualize unidades de saúde monitoradas em formato de tabela com filtros e ações em lote.'
})

const {
  searchTerm,
  selectedEstado,
  selectedMonitoramento,
  selectedDados,
  selectedTipos,
  hasActiveFilters,
  clearFilters,
  toggleTipoFilter,
  unidadesFiltradas,
  unidadesPaginadas,
  currentPage,
  totalPages,
  selectedItems,
  isAllSelected,
  isSomeSelected,
  toggleSelectAll,
  toggleSelectItem,
  isLoading,
  fetchUnidades
} = useTabelaUnidades()

onMounted(() => {
  fetchUnidades()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
    <!-- Header -->
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-semibold text-base-900 sm:text-2xl">Locais Monitorados</h1>
        <p class="mt-1 text-sm text-base-500">Adicione ou edite locais monitorados.</p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/lugares-monitorados"
          class="inline-flex items-center gap-1.5 rounded-full border border-base-200 px-3 py-1.5 text-sm font-medium text-secondary-900 transition-colors hover:bg-base-50 sm:px-4 sm:py-2"
        >
          <Icon name="lucide:map" class="size-4" />
          <span class="hidden sm:inline">Ver no</span> mapa
        </NuxtLink>
        <NuxtLink
          to="/lugares-monitorados/adicionar"
          class="inline-flex items-center gap-1.5 rounded-full bg-primary-900 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-primary-800 sm:px-4 sm:py-2"
        >
          <Icon name="lucide:plus" class="size-4" />
          Novo
        </NuxtLink>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mb-4 space-y-3">
      <!-- Linha de filtros -->
      <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <!-- Busca -->
        <div class="relative w-full sm:min-w-[200px] sm:max-w-sm sm:flex-1">
          <Icon
            name="lucide:search"
            class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-400"
          />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Nome ou endereço..."
            class="h-9 w-full rounded-lg border border-base-200 bg-white pl-9 pr-3 text-sm text-base-900 placeholder:text-base-400 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <!-- Estado -->
          <select
            v-model="selectedEstado"
            class="h-9 flex-1 rounded-lg border border-base-200 bg-white px-3 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300 sm:flex-none"
          >
            <option value="">Estado</option>
            <option v-for="uf in ESTADOS_BR" :key="uf" :value="uf">{{ uf }}</option>
          </select>

          <!-- Monitoramento -->
          <select
            v-model="selectedMonitoramento"
            class="h-9 flex-1 rounded-lg border border-base-200 bg-white px-3 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300 sm:flex-none"
          >
            <option value="">Monitoramento</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
          </select>

          <!-- Dados de lotação -->
          <select
            v-model="selectedDados"
            class="h-9 flex-1 rounded-lg border border-base-200 bg-white px-3 text-sm text-base-700 focus:border-secondary-300 focus:outline-none focus:ring-1 focus:ring-secondary-300 sm:flex-none"
          >
            <option value="">Dados</option>
            <option value="tempo-real">Tempo real</option>
            <option value="atualizado">Atualizado</option>
            <option value="sem-dados">Sem dados</option>
          </select>

          <!-- Limpar filtros -->
          <button
            v-if="hasActiveFilters"
            class="inline-flex items-center gap-1 text-sm text-secondary-700 hover:text-secondary-900"
            @click="clearFilters"
          >
            <Icon name="lucide:x" class="size-3.5" />
            Limpar
          </button>
        </div>
      </div>

      <!-- Chips de tipo -->
      <LugaresTabelaFilterChips :selected="selectedTipos" @toggle="toggleTipoFilter" />
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center gap-2 py-20">
      <CommonLoadingSpinner />
      <p class="text-sm text-base-500">Carregando unidades...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="overflow-hidden rounded-lg border border-base-200">
      <div class="overflow-x-auto">
        <Table>
          <colgroup>
            <col class="w-10" />
            <col class="w-[18%]" />
            <col class="w-[30%]" />
            <col class="w-[14%]" />
            <col class="w-[10%]" />
            <col class="w-[14%]" />
            <col class="w-12" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead class="pl-4">
                <Checkbox
                  :checked="isAllSelected"
                  :indeterminate="isSomeSelected"
                  @update:checked="toggleSelectAll"
                />
              </TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Local</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Monitoramento</TableHead>
              <TableHead>Dados</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableEmpty v-if="unidadesPaginadas.length === 0" :colspan="7">
              <div class="flex flex-col items-center gap-2 py-8">
                <Icon name="lucide:filter-x" class="size-10 text-base-300" />
                <p class="text-sm text-base-500">Nenhuma unidade encontrada.</p>
              </div>
            </TableEmpty>
            <TableRow
              v-for="u in unidadesPaginadas"
              :key="u.placeId"
              class="cursor-pointer"
              :class="selectedItems.has(u.placeId) ? 'bg-secondary-50/50' : ''"
            >
              <TableCell class="pl-4">
                <Checkbox
                  :checked="selectedItems.has(u.placeId)"
                  @update:checked="toggleSelectItem(u.placeId)"
                />
              </TableCell>
              <TableCell class="font-medium text-base-900">
                {{ u.titulo }}
              </TableCell>
              <TableCell>
                <div class="text-sm text-base-600">
                  <p v-if="u.endereco">{{ u.endereco }}</p>
                  <p class="text-base-400">
                    {{ u.bairro ? u.bairro + ' — ' : '' }}{{ u.cidade }}, {{ u.estado }}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <LugaresTipoBadge :tipo="u.tipoUnidade" />
              </TableCell>
              <TableCell>
                <LugaresStatusBadge mode="active" :value="u.ativa" />
              </TableCell>
              <TableCell>
                <LugaresStatusBadge mode="realtime" :value="u.tempoReal" />
              </TableCell>
              <TableCell>
                <NuxtLink
                  :to="`/lugares-monitorados/adicionar?edit=${u.placeId}`"
                  class="inline-flex size-8 items-center justify-center rounded-md text-base-400 transition-colors hover:bg-base-100 hover:text-base-700"
                  title="Editar"
                >
                  <Icon name="lucide:pencil" class="size-4" />
                </NuxtLink>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Footer da tabela -->
      <div
        class="flex flex-col gap-2 border-t border-base-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-sm text-base-500">
          <span v-if="selectedItems.size > 0">
            {{ selectedItems.size }} selecionada{{ selectedItems.size > 1 ? 's' : '' }}.
          </span>
          {{ unidadesFiltradas.length }} ite{{ unidadesFiltradas.length === 1 ? 'm' : 'ns' }} no
          total
        </div>
        <div v-if="totalPages > 1" class="flex items-center gap-1">
          <button
            class="inline-flex size-8 items-center justify-center rounded-md text-base-500 transition-colors hover:bg-base-100 disabled:opacity-40 disabled:pointer-events-none"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            <Icon name="lucide:chevron-left" class="size-4" />
          </button>
          <span class="px-2 text-sm text-base-600"> {{ currentPage }} / {{ totalPages }} </span>
          <button
            class="inline-flex size-8 items-center justify-center rounded-md text-base-500 transition-colors hover:bg-base-100 disabled:opacity-40 disabled:pointer-events-none"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            <Icon name="lucide:chevron-right" class="size-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
