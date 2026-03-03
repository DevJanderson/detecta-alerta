import type { PanoramaData, RegionRow, HomeFilters, SelectOption, RegionOption } from './types'

export const useHomeStore = defineStore(
  'home',
  () => {
    const api = useHomeApi()

    // === Estado principal ===
    const panorama = ref<PanoramaData | null>(null)
    const regionRows = shallowRef<RegionRow[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // === Filtros centralizados ===
    const filtros = ref<HomeFilters>({
      region: 'brasil',
      estado: '',
      semana: '4'
    })

    // === Lookups (carregados uma vez) ===
    const estados = shallowRef<SelectOption[]>([])
    const semanas = shallowRef<SelectOption[]>([])
    const regions = shallowRef<RegionOption[]>([])
    const lookupsLoaded = ref(false)

    // === Computed ===
    const regionLabel = computed(() => {
      const found = regions.value.find(r => r.id === filtros.value.region)
      return found?.label ?? 'Brasil'
    })

    // === Actions ===

    async function fetchLookups() {
      if (lookupsLoaded.value) return

      try {
        const [e, s] = await Promise.all([api.getEstados(), api.getSemanas()])
        estados.value = e
        semanas.value = s
        regions.value = api.getRegions()
        lookupsLoaded.value = true
      } catch {
        // Lookups sao opcionais — nao bloqueia a pagina
      }
    }

    async function fetchPanorama() {
      return withStoreAction({ isLoading, error }, 'Erro ao carregar panorama', async () => {
        panorama.value = await api.getPanorama({
          region: filtros.value.region,
          estado: filtros.value.estado,
          semana: filtros.value.semana
        })
      })
    }

    async function fetchRegionTable() {
      return withStoreAction({ isLoading, error }, 'Erro ao carregar tabela', async () => {
        regionRows.value = await api.getRegionTable({
          estado: filtros.value.estado,
          semana: filtros.value.semana
        })
      })
    }

    async function fetchAll() {
      return withStoreAction({ isLoading, error }, 'Erro ao carregar dados', async () => {
        const [p, r] = await Promise.all([
          api.getPanorama({
            region: filtros.value.region,
            estado: filtros.value.estado,
            semana: filtros.value.semana
          }),
          api.getRegionTable({
            estado: filtros.value.estado,
            semana: filtros.value.semana
          })
        ])
        panorama.value = p
        regionRows.value = r
      })
    }

    // === Setters com re-fetch ===

    async function setRegion(region: string) {
      filtros.value.region = region
      await fetchPanorama()
    }

    async function setEstado(estado: string) {
      filtros.value.estado = estado
      await fetchAll()
    }

    async function setSemana(semana: string) {
      filtros.value.semana = semana
      await fetchAll()
    }

    return {
      // Estado
      panorama,
      regionRows,
      isLoading,
      error,
      filtros,
      // Lookups
      estados,
      semanas,
      regions,
      lookupsLoaded,
      // Computed
      regionLabel,
      // Actions
      fetchLookups,
      fetchPanorama,
      fetchRegionTable,
      fetchAll,
      setRegion,
      setEstado,
      setSemana
    }
  },
  {
    persist: {
      pick: ['filtros']
    }
  }
)
