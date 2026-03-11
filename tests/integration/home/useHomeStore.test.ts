/**
 * Testes de integração para useHomeStore
 * Roda com @nuxt/test-utils (projeto "nuxt") - auto-imports reais disponíveis
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import type { PanoramaData, RegionRow, ChartSeriesData } from '~/layers/home/app/composables/types'

// === Mock do useHomeApi ===

const mockGetPanorama = vi.fn()
const mockGetRegionTable = vi.fn()
const mockGetChartSeries = vi.fn()
const mockGetEstados = vi.fn()
const mockGetSemanas = vi.fn()

vi.mock('~/layers/home/app/composables/useHomeApi', () => ({
  useHomeApi: () => ({
    getPanorama: mockGetPanorama,
    getRegionTable: mockGetRegionTable,
    getChartSeries: mockGetChartSeries,
    getEstados: mockGetEstados,
    getSemanas: mockGetSemanas
  })
}))

const { useHomeStore } = await import('~/layers/home/app/composables/useHomeStore')

// === Fixtures ===

const mockPanorama: PanoramaData = {
  occupancyRate: 45.2,
  alertStatus: 'yellow',
  trend: 'up',
  variation: 12.5,
  totalEstabelecimentos: 171,
  drogarias: { count: 80, variation: 15.3, trend: 'up', alertStatus: 'yellow' },
  ubs: { count: 50, variation: -3.2, trend: 'down', alertStatus: 'green' },
  upas: { count: 41, variation: 8.1, trend: 'up', alertStatus: 'red' },
  epidemiologicalWeek: '2026-W09',
  weekEndingDate: '2026-03-01'
}

const mockRegionRows: RegionRow[] = [
  {
    region: 'Norte',
    todos: { level: 'Normal', value: '5%', trend: 'stable' },
    drogarias: { level: 'Normal', value: '3%', trend: 'down' },
    upa: { level: 'Normal', value: '2%', trend: 'stable' },
    ubs: { level: 'Normal', value: '4%', trend: 'stable' }
  },
  {
    region: 'Sul',
    todos: { level: 'Elevado', value: '42%', trend: 'up' },
    drogarias: { level: 'Elevado', value: '38%', trend: 'up' },
    upa: { level: 'Moderado', value: '25%', trend: 'up' },
    ubs: { level: 'Normal', value: '8%', trend: 'stable' }
  }
]

const mockStateRows: RegionRow[] = [
  {
    region: 'Paraná',
    todos: { level: 'Elevado', value: '40%', trend: 'up' },
    drogarias: { level: 'Elevado', value: '35%', trend: 'up' },
    upa: { level: 'Moderado', value: '20%', trend: 'up' },
    ubs: { level: 'Normal', value: '5%', trend: 'stable' }
  },
  {
    region: 'Santa Catarina',
    todos: { level: 'Moderado', value: '18%', trend: 'up' },
    drogarias: { level: 'Moderado', value: '15%', trend: 'up' },
    upa: { level: 'Normal', value: '10%', trend: 'stable' },
    ubs: { level: 'Normal', value: '3%', trend: 'down' }
  },
  {
    region: 'Rio Grande do Sul',
    todos: { level: 'Elevado', value: '55%', trend: 'up' },
    drogarias: { level: 'Elevado', value: '50%', trend: 'up' },
    upa: { level: 'Elevado', value: '45%', trend: 'up' },
    ubs: { level: 'Moderado', value: '20%', trend: 'up' }
  }
]

const mockChart: ChartSeriesData = {
  points: [
    {
      week: 'SE 08',
      weekLabel: 'SE 08',
      dateRange: '(17/02 a 23/02)',
      occupancy: 42.1,
      movingAvg: 38.5,
      variation: 9.3,
      alertStatus: 'yellow'
    },
    {
      week: 'SE 09',
      weekLabel: 'SE 09',
      dateRange: '(24/02 a 02/03)',
      occupancy: 45.2,
      movingAvg: 39.1,
      variation: 12.5,
      alertStatus: 'yellow'
    }
  ],
  currentWeekVariation: 12.5,
  currentWeekTrend: 'up'
}

const mockSemanas = [
  { value: '2026-W09', label: 'Semana 09 (24 fev a 02 mar. 2026)' },
  { value: '2026-W08', label: 'Semana 08 (17 fev a 23 fev. 2026)' }
]

// === Testes ===

describe('useHomeStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()

    // Defaults
    mockGetEstados.mockReturnValue([
      { value: '', label: 'Todos os Estados' },
      { value: 'SP', label: 'São Paulo' }
    ])
    mockGetPanorama.mockResolvedValue(mockPanorama)
    mockGetRegionTable.mockResolvedValue(mockRegionRows)
    mockGetChartSeries.mockResolvedValue(mockChart)
    mockGetSemanas.mockResolvedValue(mockSemanas)
  })

  describe('estado inicial', () => {
    it('inicia com valores padrão', () => {
      const store = useHomeStore()

      expect(store.panorama).toBeNull()
      expect(store.regionRows).toEqual([])
      expect(store.chartData).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.filtros.region).toBe('brasil')
      expect(store.filtros.estado).toBe('')
      expect(store.filtros.semana).toBe('')
    })

    it('carrega estados como constante', () => {
      const store = useHomeStore()
      expect(store.estados.length).toBeGreaterThan(0)
      expect(mockGetEstados).toHaveBeenCalled()
    })
  })

  describe('fetchLookups', () => {
    it('carrega semanas e define a mais recente como padrão', async () => {
      const store = useHomeStore()
      await store.fetchLookups()

      expect(mockGetSemanas).toHaveBeenCalled()
      expect(store.semanas).toEqual(mockSemanas)
      expect(store.filtros.semana).toBe('2026-W09')
      expect(store.lookupsLoaded).toBe(true)
    })

    it('não recarrega se já carregou', async () => {
      const store = useHomeStore()
      await store.fetchLookups()
      await store.fetchLookups()

      expect(mockGetSemanas).toHaveBeenCalledTimes(1)
    })
  })

  describe('fetchAll', () => {
    it('carrega panorama, tabela e gráfico', async () => {
      const store = useHomeStore()
      await store.fetchAll()

      expect(store.panorama).toEqual(mockPanorama)
      expect(store.regionRows).toEqual(mockRegionRows)
      expect(store.chartData).toEqual(mockChart)
    })

    it('passa filtros para as chamadas de API', async () => {
      const store = useHomeStore()
      store.filtros.region = 'sul'
      store.filtros.estado = 'PR'
      store.filtros.semana = '2026-W09'

      await store.fetchAll()

      expect(mockGetPanorama).toHaveBeenCalledWith({
        region: 'sul',
        estado: 'PR',
        semana: '2026-W09'
      })
      expect(mockGetRegionTable).toHaveBeenCalledWith({
        region: 'sul',
        estado: 'PR',
        semana: '2026-W09'
      })
    })

    it('isola falha do gráfico — panorama e tabela continuam', async () => {
      mockGetChartSeries.mockRejectedValue(new Error('chart failed'))

      const store = useHomeStore()
      await store.fetchAll()

      expect(store.panorama).toEqual(mockPanorama)
      expect(store.regionRows).toEqual(mockRegionRows)
      expect(store.chartData).toBeNull()
    })
  })

  describe('setRegion', () => {
    it('atualiza filtro e recarrega todos os dados', async () => {
      const store = useHomeStore()
      mockGetRegionTable.mockResolvedValue(mockStateRows)

      await store.setRegion('sul')

      expect(store.filtros.region).toBe('sul')
      expect(mockGetPanorama).toHaveBeenCalledWith(expect.objectContaining({ region: 'sul' }))
      expect(mockGetRegionTable).toHaveBeenCalledWith(expect.objectContaining({ region: 'sul' }))
      expect(store.regionRows).toEqual(mockStateRows)
    })

    it('voltar para brasil carrega regiões', async () => {
      const store = useHomeStore()

      await store.setRegion('sul')
      mockGetRegionTable.mockResolvedValue(mockRegionRows)
      await store.setRegion('brasil')

      expect(store.filtros.region).toBe('brasil')
      expect(store.regionRows).toEqual(mockRegionRows)
    })
  })

  describe('setEstado', () => {
    it('atualiza filtro de estado e recarrega', async () => {
      const store = useHomeStore()
      await store.setEstado('SP')

      expect(store.filtros.estado).toBe('SP')
      expect(mockGetPanorama).toHaveBeenCalledWith(expect.objectContaining({ estado: 'SP' }))
    })
  })

  describe('setSemana', () => {
    it('atualiza filtro de semana e recarrega', async () => {
      const store = useHomeStore()
      await store.setSemana('2026-W08')

      expect(store.filtros.semana).toBe('2026-W08')
      expect(mockGetPanorama).toHaveBeenCalledWith(expect.objectContaining({ semana: '2026-W08' }))
    })
  })

  describe('setChartUnitType', () => {
    it('recarrega apenas o gráfico, não panorama/tabela', async () => {
      const store = useHomeStore()
      await store.fetchAll()
      vi.clearAllMocks()

      await store.setChartUnitType('drogarias')

      expect(store.chartUnitType).toBe('drogarias')
      expect(mockGetChartSeries).toHaveBeenCalledWith(
        expect.objectContaining({ unitType: 'drogarias' })
      )
      // Panorama e tabela NÃO devem ser chamados
      expect(mockGetPanorama).not.toHaveBeenCalled()
      expect(mockGetRegionTable).not.toHaveBeenCalled()
    })
  })

  describe('regionLabel', () => {
    it('retorna "Brasil" para região brasil', () => {
      const store = useHomeStore()
      expect(store.regionLabel).toBe('Brasil')
    })

    it('retorna nome da região selecionada', async () => {
      const store = useHomeStore()
      store.filtros.region = 'sul'
      expect(store.regionLabel).toBe('Sul')
    })
  })
})
