/**
 * Composable para estatísticas de regiões no TopBar
 *
 * Busca dados da API epidemiological/aggregations (unit_type=all)
 * e mapeia direto para exibição no AppTopBar — sem cálculos no frontend.
 */

import type {
  EpidemiologicalAggregation,
  AlertStatus,
  TrendType,
  EpidemiologicalAggregationsResponse
} from '#shared/types/sinapse'

export interface RegionIndicator {
  name: string
  level: 'Baixo' | 'Médio' | 'Alto'
  variation: string
  trend: TrendType
}

const REGION_KEY_TO_NAME: Record<string, string> = {
  N: 'Norte',
  NE: 'Nordeste',
  CO: 'Centro-Oeste',
  SE: 'Sudeste',
  S: 'Sul'
}

const REGION_DISPLAY_ORDER = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

const ALERT_TO_LABEL: Record<AlertStatus, 'Baixo' | 'Médio' | 'Alto'> = {
  green: 'Baixo',
  yellow: 'Médio',
  red: 'Alto'
}

function formatWeekChange(change: number): string {
  const rounded = Math.round(Math.abs(change))
  return `${rounded}%`
}

function mapAggregation(item: EpidemiologicalAggregation): RegionIndicator {
  return {
    name: REGION_KEY_TO_NAME[item.aggregation_key] ?? item.aggregation_key,
    level: ALERT_TO_LABEL[item.metrics.alert_status],
    variation: formatWeekChange(item.metrics.vs_previous_week_weekday),
    trend: item.metrics.trend_weekday
  }
}

function defaultRegions(): RegionIndicator[] {
  return REGION_DISPLAY_ORDER.map(name => ({
    name,
    level: 'Baixo',
    variation: '--%',
    trend: 'stable' as TrendType
  }))
}

export function useRegionStats() {
  const regions = ref<RegionIndicator[]>(defaultRegions())
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const authStore = useAuthStore()

  async function fetchRegionStats() {
    if (!authStore.isAuthenticated) {
      regions.value = defaultRegions()
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<EpidemiologicalAggregationsResponse>(
        '/api/epidemiological/aggregations',
        {
          query: {
            aggregation_level: 'region',
            unit_type: 'all',
            weeks: 1,
            direction: 'desc',
            limit: 10
          }
        }
      )

      // API já retorna dados consolidados (unit_type=all), sem necessidade de cálculo
      const allType = response.data.filter(d => d.unit_type === 'all')
      const mapped = allType.map(mapAggregation)

      // Ordena conforme ordem padrão
      mapped.sort(
        (a, b) => REGION_DISPLAY_ORDER.indexOf(a.name) - REGION_DISPLAY_ORDER.indexOf(b.name)
      )

      regions.value = mapped.length ? mapped : defaultRegions()
    } catch {
      error.value = 'Erro ao carregar dados das regiões'
      if (!regions.value.length) {
        regions.value = defaultRegions()
      }
    } finally {
      isLoading.value = false
    }
  }

  watch(
    () => authStore.isAuthenticated,
    isAuth => {
      if (isAuth) fetchRegionStats()
      else regions.value = defaultRegions()
    },
    { immediate: true }
  )

  return { regions, isLoading, error }
}
