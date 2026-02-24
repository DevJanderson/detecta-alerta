import type { Noticia, Doenca, Sintoma, Regiao, RumoresListParams } from './types'

export const useRumoresStore = defineStore(
  'rumores',
  () => {
    const api = useRumoresApi()

    // === Estado do feed ===
    const items = shallowRef<Noticia[]>([])
    const cursor = ref<string | null>(null)
    const hasMore = ref(true)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // === Filtros ===
    const filtros = ref<RumoresListParams>({})
    const filtrosAtivos = computed(() => {
      return Object.entries(filtros.value).filter(([_, v]) => {
        if (v === undefined || v === null || v === '') return false
        if (Array.isArray(v) && v.length === 0) return false
        return true
      }).length
    })

    // === Lookups (cacheados) ===
    const doencas = shallowRef<Doenca[]>([])
    const sintomas = shallowRef<Sintoma[]>([])
    const localizacoes = shallowRef<Regiao[]>([])
    const lookupsLoaded = ref(false)

    // === Noticia atual (detalhe) ===
    const rumoreAtual = ref<Noticia | null>(null)

    // === Actions ===

    async function fetchRumores(reset = false) {
      if (reset) {
        items.value = []
        cursor.value = null
        hasMore.value = true
      }

      if (!hasMore.value || isLoading.value) return

      isLoading.value = true
      error.value = null

      try {
        const params: RumoresListParams = {
          ...filtros.value,
          limit: 20,
          ...(cursor.value ? { cursor: cursor.value } : {})
        }

        const response = await api.listar(params)
        items.value = reset ? response.data : [...items.value, ...response.data]
        cursor.value = response.pagination?.next_cursor ?? null
        hasMore.value = response.pagination?.has_next ?? false
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Erro ao carregar rumores'
      } finally {
        isLoading.value = false
      }
    }

    async function fetchRumore(uniqueId: string) {
      isLoading.value = true
      error.value = null

      try {
        rumoreAtual.value = await api.obter(uniqueId)
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Erro ao carregar rumor'
      } finally {
        isLoading.value = false
      }
    }

    async function fetchLookups() {
      if (lookupsLoaded.value) return

      try {
        const [d, s, l] = await Promise.all([
          api.listarDoencas(),
          api.listarSintomas(),
          api.listarLocalizacoes()
        ])
        doencas.value = d
        sintomas.value = s
        localizacoes.value = l
        lookupsLoaded.value = true
      } catch {
        // Lookups sao opcionais - nao bloqueia o feed
      }
    }

    function aplicarFiltros(novosFiltros: Partial<RumoresListParams>) {
      filtros.value = { ...filtros.value, ...novosFiltros }
      fetchRumores(true)
    }

    function limparFiltros() {
      filtros.value = {}
      fetchRumores(true)
    }

    return {
      // Estado
      items,
      cursor,
      hasMore,
      isLoading,
      error,
      filtros,
      filtrosAtivos,
      rumoreAtual,
      // Lookups
      doencas,
      sintomas,
      localizacoes,
      lookupsLoaded,
      // Actions
      fetchRumores,
      fetchRumore,
      fetchLookups,
      aplicarFiltros,
      limparFiltros
    }
  },
  {
    persist: {
      pick: ['filtros']
    }
  }
)
