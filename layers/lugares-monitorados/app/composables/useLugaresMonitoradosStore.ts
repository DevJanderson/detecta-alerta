/**
 * Store — Lugares Monitorados
 *
 * Gerencia estado de filtros, unidades e seleção.
 */
import type { Unidade, FiltrosUnidades, TipoUnidade, EstatisticasPorTipo } from './types'
import { MOCK_UNIDADES } from '../utils/lugares-mock-data'

export const useLugaresMonitoradosStore = defineStore('lugares-monitorados', () => {
  // Estado
  const unidades = ref<Unidade[]>([])
  const filtros = ref<FiltrosUnidades>({})
  const selectedUnidade = ref<Unidade | null>(null)
  const isPanelOpen = ref(true)
  const isLoading = ref(false)

  // Unidades filtradas
  const unidadesFiltradas = computed(() => {
    let resultado = unidades.value

    if (filtros.value.estado) {
      resultado = resultado.filter(u => u.estado === filtros.value.estado)
    }

    if (filtros.value.cidade) {
      resultado = resultado.filter(u => u.cidade === filtros.value.cidade)
    }

    if (filtros.value.tipoUnidade) {
      resultado = resultado.filter(u => u.tipoUnidade === filtros.value.tipoUnidade)
    }

    if (filtros.value.apenasAtivas) {
      resultado = resultado.filter(u => u.ativa)
    }

    if (filtros.value.apenasTempoReal) {
      resultado = resultado.filter(u => u.tempoReal === 1)
    }

    return resultado
  })

  // Estatísticas
  const estatisticas = computed<EstatisticasPorTipo>(() => {
    const lista = unidadesFiltradas.value
    return {
      total: lista.length,
      ubs: lista.filter(u => u.tipoUnidade === 'ubs').length,
      upa: lista.filter(u => u.tipoUnidade === 'upa').length,
      drogarias: lista.filter(u => u.tipoUnidade === 'drogarias').length,
      petShop: lista.filter(u => u.tipoUnidade === 'pet_shop').length,
      petAtend: lista.filter(u => u.tipoUnidade === 'pet_atend').length
    }
  })

  const hasActiveFilters = computed(() => {
    const f = filtros.value
    return !!(f.estado || f.cidade || f.tipoUnidade || f.apenasAtivas || f.apenasTempoReal)
  })

  // Cidades disponíveis para o estado selecionado
  const cidadesDisponiveis = computed(() => {
    if (!filtros.value.estado) return []
    const cidades = unidades.value.filter(u => u.estado === filtros.value.estado).map(u => u.cidade)
    return [...new Set(cidades)].sort()
  })

  // Ações
  function setEstado(estado: string) {
    filtros.value.estado = estado || undefined
    filtros.value.cidade = undefined
  }

  function setCidade(cidade: string) {
    filtros.value.cidade = cidade || undefined
  }

  function setTipoUnidade(tipo: TipoUnidade | undefined) {
    filtros.value.tipoUnidade = tipo
  }

  function toggleApenasAtivas() {
    filtros.value.apenasAtivas = !filtros.value.apenasAtivas
  }

  function toggleApenasTempoReal() {
    filtros.value.apenasTempoReal = !filtros.value.apenasTempoReal
  }

  function clearFilters() {
    filtros.value = {}
  }

  function selectUnidade(unidade: Unidade | null) {
    selectedUnidade.value = unidade
  }

  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value
  }

  async function fetchUnidades() {
    isLoading.value = true
    try {
      // TODO: substituir por chamada real à API
      await new Promise(resolve => setTimeout(resolve, 500))
      unidades.value = MOCK_UNIDADES
    } finally {
      isLoading.value = false
    }
  }

  return {
    // Estado
    unidades,
    filtros,
    selectedUnidade,
    isPanelOpen,
    isLoading,
    // Computed
    unidadesFiltradas,
    estatisticas,
    hasActiveFilters,
    cidadesDisponiveis,
    // Ações
    setEstado,
    setCidade,
    setTipoUnidade,
    toggleApenasAtivas,
    toggleApenasTempoReal,
    clearFilters,
    selectUnidade,
    togglePanel,
    fetchUnidades
  }
})
