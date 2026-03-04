import type {
  LotacaoData,
  MeuMunicipioFilters,
  MunicipioOption,
  PanelView,
  RumorDestaque,
  RumorItem,
  SelectOption,
  UnidadeSaude,
  UnitType,
  UnitTypeSummary
} from './types'

export const useMeuMunicipioStore = defineStore(
  'meuMunicipio',
  () => {
    const api = useMeuMunicipioApi()

    // === Estado principal ===
    const unidades = shallowRef<UnidadeSaude[]>([])
    const lotacao = ref<LotacaoData | null>(null)
    const unitTypeSummaries = shallowRef<UnitTypeSummary[]>([])
    const rumorDestaque = ref<RumorDestaque | null>(null)
    const rumores = shallowRef<RumorItem[]>([])
    const unidadeSelecionada = ref<UnidadeSaude | null>(null)
    const unidadeLotacao = ref<LotacaoData | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // === Filtros ===
    const filtros = ref<MeuMunicipioFilters>({
      municipio: null,
      semana: '8',
      tipoUnidade: null
    })

    // === Lookups ===
    const semanas = shallowRef<SelectOption[]>([])
    const lookupsLoaded = ref(false)

    // === Computed ===
    const municipioLabel = computed(() => {
      const m = filtros.value.municipio
      return m ? `${m.nome}, ${m.uf}` : ''
    })

    const municipioSelecionado = computed(() => filtros.value.municipio !== null)

    const unidadesFiltradas = computed(() => {
      const tipo = filtros.value.tipoUnidade
      if (!tipo) return unidades.value
      return unidades.value.filter(u => u.tipo === tipo)
    })

    const panelView = computed<PanelView>(() =>
      unidadeSelecionada.value ? 'unidade' : 'municipio'
    )

    // === Actions ===
    async function fetchLookups() {
      if (lookupsLoaded.value) return
      try {
        semanas.value = await api.getSemanas()
        lookupsLoaded.value = true
      } catch {
        // Lookups são opcionais — não bloqueia a página
      }
    }

    async function fetchAll() {
      const ibgeCode = filtros.value.municipio?.ibgeCode
      const uf = filtros.value.municipio?.uf
      if (!ibgeCode || !uf) return

      return withStoreAction(
        { isLoading, error },
        'Erro ao carregar dados do município',
        async () => {
          const [summaries, unis, lot, rumoresData] = await Promise.all([
            api.getUnitTypeSummaries(ibgeCode),
            api.getUnidades(ibgeCode),
            api.getLotacao(ibgeCode),
            api.getRumores(uf, 5)
          ])
          unitTypeSummaries.value = summaries
          unidades.value = unis
          lotacao.value = lot
          rumorDestaque.value = rumoresData.destaque
          rumores.value = rumoresData.items
        }
      )
    }

    async function fetchMunicipioData() {
      const ibgeCode = filtros.value.municipio?.ibgeCode
      if (!ibgeCode) return

      return withStoreAction(
        { isLoading, error },
        'Erro ao carregar dados do município',
        async () => {
          const [summaries, unis, lot] = await Promise.all([
            api.getUnitTypeSummaries(ibgeCode),
            api.getUnidades(ibgeCode),
            api.getLotacao(ibgeCode)
          ])
          unitTypeSummaries.value = summaries
          unidades.value = unis
          lotacao.value = lot
        }
      )
    }

    async function fetchUnidadeDetalhe(placeId: string) {
      return withStoreAction(
        { isLoading, error },
        'Erro ao carregar detalhes da unidade',
        async () => {
          const [detalhe, lot] = await Promise.all([
            api.getUnidadeDetalhe(placeId),
            api.getUnidadeLotacao(placeId)
          ])
          unidadeSelecionada.value = detalhe
          unidadeLotacao.value = lot
        }
      )
    }

    // === Setters ===
    async function setMunicipio(option: MunicipioOption | null) {
      filtros.value.municipio = option
      unidadeSelecionada.value = null
      unidadeLotacao.value = null
      if (option) {
        await fetchAll()
      } else {
        unidades.value = []
        lotacao.value = null
        unitTypeSummaries.value = []
        rumorDestaque.value = null
        rumores.value = []
      }
    }

    async function setSemana(value: string) {
      filtros.value.semana = value
      if (municipioSelecionado.value) {
        await fetchMunicipioData()
      }
    }

    function setTipoUnidade(type: UnitType | null) {
      filtros.value.tipoUnidade = type
    }

    async function selectUnidade(placeId: string) {
      await fetchUnidadeDetalhe(placeId)
    }

    function voltarParaMunicipio() {
      unidadeSelecionada.value = null
      unidadeLotacao.value = null
    }

    return {
      // Estado
      unidades,
      lotacao,
      unitTypeSummaries,
      rumorDestaque,
      rumores,
      unidadeSelecionada,
      unidadeLotacao,
      isLoading,
      error,
      filtros,
      // Lookups
      semanas,
      lookupsLoaded,
      // Computed
      municipioLabel,
      municipioSelecionado,
      unidadesFiltradas,
      panelView,
      // Actions
      fetchLookups,
      fetchAll,
      fetchMunicipioData,
      fetchUnidadeDetalhe,
      // Setters
      setMunicipio,
      setSemana,
      setTipoUnidade,
      selectUnidade,
      voltarParaMunicipio
    }
  },
  {
    persist: {
      pick: ['filtros']
    }
  }
)
