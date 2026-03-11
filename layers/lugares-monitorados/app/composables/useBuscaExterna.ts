/**
 * Composable — Busca Externa de Unidades
 *
 * Simula busca em fonte externa (Google Places) usando dados mock.
 * Quando a integração real for implementada, substituir a lógica de busca.
 */
import type { TipoUnidade } from './types'
import { TIPO_UNIDADE_LABELS } from './types'

export interface ResultadoBusca {
  placeId: string
  nome: string
  endereco: string
  bairro: string
  cidade: string
  estado: string
  tipo: TipoUnidade
  latitude: number
  longitude: number
  nota: number | null
  avaliacoes: number | null
  selecionado: boolean
  jaExiste: boolean
}

/** Dados mock simulando resultados de busca externa */
const MOCK_RESULTADOS: Omit<ResultadoBusca, 'selecionado' | 'jaExiste'>[] = [
  {
    placeId: 'ext-001',
    nome: 'UBS Jardim São Luís',
    endereco: 'Rua Carlos Gomes, 453',
    bairro: 'Jardim São Luís',
    cidade: 'São Paulo',
    estado: 'SP',
    tipo: 'ubs',
    latitude: -23.6548,
    longitude: -46.7412,
    nota: 4.1,
    avaliacoes: 87
  },
  {
    placeId: 'ext-002',
    nome: 'UPA 24h Itaquera',
    endereco: 'Av. Itaquera, 2100',
    bairro: 'Itaquera',
    cidade: 'São Paulo',
    estado: 'SP',
    tipo: 'upa',
    latitude: -23.5412,
    longitude: -46.4536,
    nota: 3.6,
    avaliacoes: 142
  },
  {
    placeId: 'ubs-001', // Já existe no banco (mesmo placeId)
    nome: 'UBS Vila Mariana',
    endereco: 'Rua Domingos de Morais, 2187',
    bairro: 'Vila Mariana',
    cidade: 'São Paulo',
    estado: 'SP',
    tipo: 'ubs',
    latitude: -23.5895,
    longitude: -46.6388,
    nota: 4.2,
    avaliacoes: 156
  },
  {
    placeId: 'ext-003',
    nome: 'Drogaria Popular Centro',
    endereco: 'Rua XV de Novembro, 200',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    tipo: 'drogarias',
    latitude: -23.5475,
    longitude: -46.6361,
    nota: 4.4,
    avaliacoes: 310
  },
  {
    placeId: 'ext-004',
    nome: 'Pet Center Marginal',
    endereco: 'Av. das Nações Unidas, 8501',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    estado: 'SP',
    tipo: 'pet_shop',
    latitude: -23.5831,
    longitude: -46.6949,
    nota: 4.7,
    avaliacoes: 520
  },
  {
    placeId: 'ext-005',
    nome: 'UBS Botafogo',
    endereco: 'Rua Voluntários da Pátria, 169',
    bairro: 'Botafogo',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    tipo: 'ubs',
    latitude: -22.9519,
    longitude: -43.1866,
    nota: 3.9,
    avaliacoes: 95
  },
  {
    placeId: 'ext-006',
    nome: 'UPA Tijuca',
    endereco: 'Rua Conde de Bonfim, 1033',
    bairro: 'Tijuca',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    tipo: 'upa',
    latitude: -22.9272,
    longitude: -43.2381,
    nota: 3.2,
    avaliacoes: 67
  }
]

export function useBuscaExterna() {
  const store = useLugaresMonitoradosStore()

  const searchQuery = ref('')
  const selectedEstado = ref('')
  const selectedCidade = ref('')
  const selectedTipo = ref<TipoUnidade | ''>('')
  const resultados = ref<ResultadoBusca[]>([])
  const isSearching = ref(false)
  const hasSearched = ref(false)
  const selectedPlaceId = ref<string | null>(null)
  const showReviewModal = ref(false)

  const canSearch = computed(
    () =>
      selectedEstado.value.length > 0 &&
      selectedCidade.value.length > 0 &&
      searchQuery.value.length >= 3 &&
      !isSearching.value
  )

  const selectedCount = computed(() => resultados.value.filter(r => r.selecionado).length)

  const selectedPlaces = computed(() => resultados.value.filter(r => r.selecionado))

  // Reset cidade ao mudar estado
  watch(selectedEstado, () => {
    selectedCidade.value = ''
  })

  async function doSearch() {
    if (!canSearch.value) return

    isSearching.value = true
    hasSearched.value = true

    // Simula latência de API
    await new Promise(resolve => setTimeout(resolve, 800))

    const existingIds = new Set(store.unidades.map(u => u.placeId))
    const query = searchQuery.value.toLowerCase()

    resultados.value = MOCK_RESULTADOS.filter(r => {
      if (r.estado !== selectedEstado.value) return false
      if (r.cidade.toLowerCase() !== selectedCidade.value.toLowerCase()) return false
      if (selectedTipo.value && r.tipo !== selectedTipo.value) return false
      return (
        r.nome.toLowerCase().includes(query) ||
        r.endereco.toLowerCase().includes(query) ||
        r.bairro.toLowerCase().includes(query)
      )
    }).map(r => ({
      ...r,
      selecionado: false,
      jaExiste: existingIds.has(r.placeId)
    }))

    isSearching.value = false
  }

  function toggleItem(placeId: string) {
    const item = resultados.value.find(r => r.placeId === placeId)
    if (item && !item.jaExiste) {
      item.selecionado = !item.selecionado
    }
  }

  function toggleSelectAll() {
    const novos = resultados.value.filter(r => !r.jaExiste)
    const allSelected = novos.every(r => r.selecionado)
    for (const item of novos) {
      item.selecionado = !allSelected
    }
  }

  function clearResults() {
    resultados.value = []
    hasSearched.value = false
    selectedPlaceId.value = null
  }

  const tipoOptions = Object.entries(TIPO_UNIDADE_LABELS).map(([value, label]) => ({
    value: value as TipoUnidade,
    label
  }))

  return {
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
    toggleSelectAll,
    clearResults
  }
}
