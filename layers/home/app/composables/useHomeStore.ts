import type {
  PanoramaData,
  RegionRow,
  HomeFilters,
  SelectOption,
  ChartSeriesData,
  ChartUnitType
} from './types'
import { HOME_REGIONS } from './types'
import { HomeErrors } from '#shared/domain/errors'

export const useHomeStore = defineStore(
  'home',
  () => {
    const api = useHomeApi()

    // === Estado principal ===
    const panorama = ref<PanoramaData | null>(null)
    const regionRows = shallowRef<RegionRow[]>([])
    const chartData = ref<ChartSeriesData | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Controle de versão para evitar race condition entre fetches concorrentes
    const fetchVersion = ref(0)

    // === Filtros centralizados ===
    const filtros = ref<HomeFilters>({
      region: 'brasil',
      estado: '',
      semana: ''
    })

    // === Filtro local do gráfico ===
    const chartUnitType = ref<ChartUnitType>('all')

    // === Lookups ===
    const estados = shallowRef<SelectOption[]>(api.getEstados())
    const semanas = shallowRef<SelectOption[]>([])
    const regions = HOME_REGIONS
    const lookupsLoaded = ref(false)

    // === Computed ===
    const regionLabel = computed(() => {
      const found = regions.find(r => r.id === filtros.value.region)
      return found?.label ?? 'Brasil'
    })

    const filteredEstados = computed(() => {
      return api.getEstadosByRegion(filtros.value.region)
    })

    // === Actions ===

    async function fetchLookups() {
      if (lookupsLoaded.value) return

      try {
        const s = await api.getSemanas()
        semanas.value = s

        // Sempre resetar para a semana mais recente ao carregar
        // (semana persistida pode estar desatualizada após dias sem uso)
        if (s.length > 0 && s[0]) {
          filtros.value.semana = s[0].value
        }
        lookupsLoaded.value = true
      } catch {
        // Lookups são opcionais — não bloqueia a página
      }
    }

    async function fetchPanorama() {
      return withStoreAction({ isLoading, error }, HomeErrors.PANORAMA_FAILED, async () => {
        panorama.value = await api.getPanorama({
          region: filtros.value.region,
          estado: filtros.value.estado,
          semana: filtros.value.semana
        })
      })
    }

    async function fetchRegionTable() {
      return withStoreAction({ isLoading, error }, HomeErrors.TABLE_FAILED, async () => {
        regionRows.value = await api.getRegionTable({
          region: filtros.value.region,
          estado: filtros.value.estado,
          semana: filtros.value.semana
        })
      })
    }

    async function fetchChartData() {
      return withStoreAction({ isLoading, error }, HomeErrors.CHART_FAILED, async () => {
        chartData.value = await api.getChartSeries({
          region: filtros.value.region,
          estado: filtros.value.estado,
          unitType: chartUnitType.value
        })
      })
    }

    async function fetchAll() {
      const version = ++fetchVersion.value

      return withStoreAction({ isLoading, error }, HomeErrors.DATA_FAILED, async () => {
        // Panorama e tabela são críticos; gráfico é independente (falha não bloqueia)
        const [p, r] = await Promise.all([
          api.getPanorama({
            region: filtros.value.region,
            estado: filtros.value.estado,
            semana: filtros.value.semana
          }),
          api.getRegionTable({
            region: filtros.value.region,
            estado: filtros.value.estado,
            semana: filtros.value.semana
          })
        ])

        // Descartar resultado se outra chamada mais recente já foi disparada
        if (fetchVersion.value !== version) return

        panorama.value = p
        regionRows.value = r

        // Gráfico: falha isolada não impede panorama/tabela
        try {
          chartData.value = await api.getChartSeries({
            region: filtros.value.region,
            estado: filtros.value.estado,
            unitType: chartUnitType.value
          })
        } catch {
          if (fetchVersion.value === version) {
            chartData.value = null
          }
        }
      })
    }

    // === Setters com re-fetch ===

    async function setRegion(region: string) {
      filtros.value.region = region
      // Resetar estado se não pertence à nova região
      if (filtros.value.estado) {
        const validEstados = api.getEstadosByRegion(region)
        if (!validEstados.some(e => e.value === filtros.value.estado)) {
          filtros.value.estado = ''
        }
      }
      await fetchAll()
    }

    async function setEstado(estado: string) {
      filtros.value.estado = estado
      await fetchAll()
    }

    async function setSemana(semana: string) {
      filtros.value.semana = semana
      await fetchAll()
    }

    async function setChartUnitType(unitType: ChartUnitType) {
      chartUnitType.value = unitType
      await fetchChartData()
    }

    return {
      // Estado
      panorama,
      regionRows,
      chartData,
      isLoading,
      error,
      filtros,
      // Filtro local gráfico
      chartUnitType,
      // Lookups
      estados,
      semanas,
      regions,
      lookupsLoaded,
      // Computed
      regionLabel,
      filteredEstados,
      // Actions
      fetchLookups,
      fetchPanorama,
      fetchRegionTable,
      fetchChartData,
      fetchAll,
      setRegion,
      setEstado,
      setSemana,
      setChartUnitType
    }
  },
  {
    persist: {
      pick: ['filtros']
    }
  }
)
