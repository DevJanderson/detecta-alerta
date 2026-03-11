/**
 * Composable — Tabela de Unidades
 *
 * Gerencia filtros locais, busca, paginação e seleção para a tabela.
 * Consome dados do store principal (mock por enquanto).
 */
import type { TipoUnidade } from './types'

const ITEMS_PER_PAGE = 20

export function useTabelaUnidades() {
  const store = useLugaresMonitoradosStore()

  // Filtros locais da tabela
  const searchTerm = ref('')
  const selectedEstado = ref('')
  const selectedMonitoramento = ref<'' | 'ativo' | 'inativo'>('')
  const selectedDados = ref<'' | 'tempo-real' | 'atualizado' | 'sem-dados'>('')
  const selectedTipos = ref(new Set<TipoUnidade>())
  const currentPage = ref(1)

  // Seleção
  const selectedItems = ref(new Set<string>())

  // Filtragem
  const unidadesFiltradas = computed(() => {
    let resultado = store.unidades

    // Busca por nome ou endereço
    if (searchTerm.value.trim()) {
      const termo = searchTerm.value.toLowerCase().trim()
      resultado = resultado.filter(
        u =>
          u.titulo.toLowerCase().includes(termo) ||
          u.endereco?.toLowerCase().includes(termo) ||
          u.bairro?.toLowerCase().includes(termo) ||
          u.cidade.toLowerCase().includes(termo)
      )
    }

    // Estado
    if (selectedEstado.value) {
      resultado = resultado.filter(u => u.estado === selectedEstado.value)
    }

    // Monitoramento (ativo/inativo)
    if (selectedMonitoramento.value === 'ativo') {
      resultado = resultado.filter(u => u.ativa)
    } else if (selectedMonitoramento.value === 'inativo') {
      resultado = resultado.filter(u => !u.ativa)
    }

    // Dados de lotação
    if (selectedDados.value === 'tempo-real') {
      resultado = resultado.filter(u => u.tempoReal === 1)
    } else if (selectedDados.value === 'atualizado') {
      resultado = resultado.filter(u => u.tempoReal === 2)
    } else if (selectedDados.value === 'sem-dados') {
      resultado = resultado.filter(u => u.tempoReal === 0)
    }

    // Chips de tipo (multi-select)
    if (selectedTipos.value.size > 0) {
      resultado = resultado.filter(u => selectedTipos.value.has(u.tipoUnidade))
    }

    return resultado
  })

  // Paginação
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(unidadesFiltradas.value.length / ITEMS_PER_PAGE))
  )

  const unidadesPaginadas = computed(() => {
    const start = (currentPage.value - 1) * ITEMS_PER_PAGE
    return unidadesFiltradas.value.slice(start, start + ITEMS_PER_PAGE)
  })

  // Reseta página ao mudar filtros
  watch(
    [searchTerm, selectedEstado, selectedMonitoramento, selectedDados, selectedTipos],
    () => {
      currentPage.value = 1
      selectedItems.value = new Set()
    },
    { deep: true }
  )

  // Seleção
  const isAllSelected = computed(() => {
    if (unidadesPaginadas.value.length === 0) return false
    return unidadesPaginadas.value.every(u => selectedItems.value.has(u.placeId))
  })

  const isSomeSelected = computed(() => {
    if (isAllSelected.value) return false
    return unidadesPaginadas.value.some(u => selectedItems.value.has(u.placeId))
  })

  function toggleSelectAll() {
    if (isAllSelected.value) {
      for (const u of unidadesPaginadas.value) {
        selectedItems.value.delete(u.placeId)
      }
    } else {
      for (const u of unidadesPaginadas.value) {
        selectedItems.value.add(u.placeId)
      }
    }
    // Trigger reactivity
    selectedItems.value = new Set(selectedItems.value)
  }

  function toggleSelectItem(placeId: string) {
    if (selectedItems.value.has(placeId)) {
      selectedItems.value.delete(placeId)
    } else {
      selectedItems.value.add(placeId)
    }
    selectedItems.value = new Set(selectedItems.value)
  }

  function toggleTipoFilter(tipo: TipoUnidade) {
    if (selectedTipos.value.has(tipo)) {
      selectedTipos.value.delete(tipo)
    } else {
      selectedTipos.value.add(tipo)
    }
    selectedTipos.value = new Set(selectedTipos.value)
  }

  function clearFilters() {
    searchTerm.value = ''
    selectedEstado.value = ''
    selectedMonitoramento.value = ''
    selectedDados.value = ''
    selectedTipos.value = new Set()
    selectedItems.value = new Set()
    currentPage.value = 1
  }

  const hasActiveFilters = computed(
    () =>
      !!(
        searchTerm.value ||
        selectedEstado.value ||
        selectedMonitoramento.value ||
        selectedDados.value ||
        selectedTipos.value.size > 0
      )
  )

  return {
    // Filtros
    searchTerm,
    selectedEstado,
    selectedMonitoramento,
    selectedDados,
    selectedTipos,
    hasActiveFilters,
    clearFilters,
    toggleTipoFilter,
    // Dados
    unidadesFiltradas,
    unidadesPaginadas,
    // Paginação
    currentPage,
    totalPages,
    // Seleção
    selectedItems,
    isAllSelected,
    isSomeSelected,
    toggleSelectAll,
    toggleSelectItem,
    // Store
    isLoading: computed(() => store.isLoading),
    fetchUnidades: store.fetchUnidades
  }
}
