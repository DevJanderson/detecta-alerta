import type {
  EpidemiologicalAggregation,
  EpidemiologicalAggregationsResponse,
  AlertStatus,
  TrendType
} from '#shared/types/sinapse'
import type {
  PanoramaData,
  RegionRow,
  SelectOption,
  CellData,
  Level,
  ChartPointData,
  ChartSeriesData,
  ChartUnitType
} from './types'

// === Constantes ===

const REGION_KEY_TO_NAME: Record<string, string> = {
  N: 'Norte',
  NE: 'Nordeste',
  CO: 'Centro-Oeste',
  SE: 'Sudeste',
  S: 'Sul'
}

const REGION_DISPLAY_ORDER = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

/** Mapeia ID do switcher UI (lowercase) para UFs que pertencem à região */
const REGION_TO_STATES: Record<string, string[]> = {
  norte: ['AC', 'AM', 'AP', 'PA', 'RO', 'RR', 'TO'],
  nordeste: ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
  'centro-oeste': ['DF', 'GO', 'MS', 'MT'],
  sudeste: ['ES', 'MG', 'RJ', 'SP'],
  sul: ['PR', 'RS', 'SC']
}

/** Mapeia UF para nome do estado (lookup rápido, populado após ESTADOS_BRASIL) */
const UF_TO_STATE_NAME: Record<string, string> = {}

const ALERT_TO_LEVEL: Record<AlertStatus, Level> = {
  green: 'Normal',
  yellow: 'Moderado',
  red: 'Elevado'
}

const ESTADOS_BRASIL: SelectOption[] = [
  { value: '', label: 'Todos os Estados' },
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

// Popular lookup UF → nome
for (const e of ESTADOS_BRASIL) {
  if (e.value) UF_TO_STATE_NAME[e.value] = e.label
}

// === Helpers ===

function formatWeekLabel(epiWeek: string, weekEndingDate: string): string {
  const weekNum = epiWeek.split('-W')[1]
  const endDate = new Date(weekEndingDate + 'T12:00:00')
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 6)

  const fmt = (d: Date) => {
    const day = d.getDate()
    const months = [
      'jan',
      'fev',
      'mar',
      'abr',
      'mai',
      'jun',
      'jul',
      'ago',
      'set',
      'out',
      'nov',
      'dez'
    ]
    return `${day} ${months[d.getMonth()]}`
  }

  const year = endDate.getFullYear()
  return `Semana ${weekNum} (${fmt(startDate)} a ${fmt(endDate)}. ${year})`
}

function formatDateRange(weekEndingDate: string): string {
  const endDate = new Date(weekEndingDate + 'T12:00:00')
  const startDate = new Date(endDate)
  startDate.setDate(startDate.getDate() - 6)

  const fmt = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    return `${day}/${month}`
  }

  return `(${fmt(startDate)} a ${fmt(endDate)})`
}

function findByType(
  items: EpidemiologicalAggregation[],
  unitType: string
): EpidemiologicalAggregation | undefined {
  return items.find(d => d.unit_type === unitType)
}

function buildUnitTypeStats(item: EpidemiologicalAggregation | undefined) {
  if (!item)
    return {
      count: 0,
      variation: 0,
      trend: 'stable' as TrendType,
      alertStatus: 'green' as AlertStatus
    }
  return {
    count: item.units_count,
    variation: item.metrics.vs_previous_week_weekday,
    trend: item.metrics.trend_weekday,
    alertStatus: item.metrics.alert_status
  }
}

function buildCellData(item: EpidemiologicalAggregation | undefined): CellData {
  if (!item) return { level: 'Normal', value: '--%', trend: 'stable' }
  return {
    level: ALERT_TO_LEVEL[item.metrics.alert_status],
    value: `${Math.round(Math.abs(item.metrics.vs_previous_week_weekday))}%`,
    trend: item.metrics.trend_weekday
  }
}

// === API Service ===

export function useHomeApi() {
  async function getPanorama(params: {
    region: string
    estado: string
    semana: string
  }): Promise<PanoramaData> {
    const isEstado = !!params.estado
    const isBrasil = params.region === 'brasil'

    // A API não suporta filtro por semana específica — buscar semanas suficientes
    // e filtrar client-side pelo epidemiological_week
    const needsWeekFilter = !!params.semana
    const query: Record<string, string | number> = {
      aggregation_level: isEstado ? 'state' : 'region',
      weeks: needsWeekFilter ? 10 : 1,
      direction: 'desc',
      limit: needsWeekFilter ? 100 : 50
    }

    if (isEstado) {
      query.state = params.estado
    }

    const response = await $fetch<EpidemiologicalAggregationsResponse>(
      '/api/epidemiological/aggregations',
      { query }
    )

    let items = response.data

    // Filtrar pela semana selecionada
    if (needsWeekFilter) {
      items = items.filter(d => d.metrics.epidemiological_week === params.semana)
    } else {
      // Sem filtro de semana: usar apenas a mais recente
      const latestWeek = items.reduce(
        (latest, d) =>
          d.metrics.epidemiological_week > latest ? d.metrics.epidemiological_week : latest,
        ''
      )
      if (latestWeek) {
        items = items.filter(d => d.metrics.epidemiological_week === latestWeek)
      }
    }

    // Filtrar por região se não for "brasil" e não for filtro por estado
    if (!isEstado && !isBrasil) {
      const regionKey = Object.entries(REGION_KEY_TO_NAME).find(
        ([, name]) => name.toLowerCase() === params.region
      )?.[0]
      if (regionKey) {
        items = items.filter(d => d.aggregation_key === regionKey)
      }
    }

    // Para "brasil" sem estado: somar units_count de todas as regiões com unit_type=all
    const allItems = items.filter(d => d.unit_type === 'all')
    const firstAll = allItems[0]

    // Calcular totais
    const totalUnits = allItems.reduce((sum, d) => sum + d.units_count, 0)

    // Encontrar dados por tipo de unidade
    const drogariasItems = items.filter(d => d.unit_type === 'drogarias')
    const ubsItems = items.filter(d => d.unit_type === 'ubs')
    const upaItems = items.filter(d => d.unit_type === 'upa')

    // Para múltiplas regiões (brasil), somar contagens e usar média ponderada da variação
    const sumStats = (arr: EpidemiologicalAggregation[]) => {
      if (!arr.length) return buildUnitTypeStats(undefined)
      const totalCount = arr.reduce((s, d) => s + d.units_count, 0)
      const weightedVariation =
        arr.reduce((s, d) => s + d.metrics.vs_previous_week_weekday * d.units_count, 0) /
        (totalCount || 1)
      // Usar o pior alert status
      const worstAlert = arr.reduce((worst, d) => {
        const order: AlertStatus[] = ['green', 'yellow', 'red']
        return order.indexOf(d.metrics.alert_status) > order.indexOf(worst)
          ? d.metrics.alert_status
          : worst
      }, 'green' as AlertStatus)
      // Usar trend da maioria
      const trendCounts = { up: 0, down: 0, stable: 0 }
      for (const d of arr) trendCounts[d.metrics.trend_weekday]++
      const trend =
        (Object.entries(trendCounts) as [TrendType, number][]).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] ?? 'stable'
      return { count: totalCount, variation: weightedVariation, trend, alertStatus: worstAlert }
    }

    // Para ocupação e variação geral, fazer média ponderada das regiões
    const weightedOccupancy =
      totalUnits > 0
        ? allItems.reduce((s, d) => s + d.metrics.average_occupancy_weekday * d.units_count, 0) /
          totalUnits
        : 0
    const weightedVariation =
      totalUnits > 0
        ? allItems.reduce((s, d) => s + d.metrics.vs_previous_week_weekday * d.units_count, 0) /
          totalUnits
        : 0

    // Alert status e trend: pior/maioria das regiões
    const worstAlert = allItems.reduce((worst, d) => {
      const order: AlertStatus[] = ['green', 'yellow', 'red']
      return order.indexOf(d.metrics.alert_status) > order.indexOf(worst)
        ? d.metrics.alert_status
        : worst
    }, 'green' as AlertStatus)

    let overallTrend: TrendType = 'stable'
    if (allItems.length > 0) {
      const trendCounts = { up: 0, down: 0, stable: 0 }
      for (const d of allItems) trendCounts[d.metrics.trend_weekday]++
      overallTrend =
        (Object.entries(trendCounts) as [TrendType, number][]).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] ?? 'stable'
    }

    return {
      occupancyRate: weightedOccupancy,
      alertStatus: isBrasil ? worstAlert : (firstAll?.metrics.alert_status ?? 'green'),
      trend: isBrasil ? overallTrend : (firstAll?.metrics.trend_weekday ?? 'stable'),
      variation: isBrasil ? weightedVariation : (firstAll?.metrics.vs_previous_week_weekday ?? 0),
      totalEstabelecimentos: totalUnits,
      drogarias:
        isBrasil || isEstado
          ? sumStats(drogariasItems)
          : buildUnitTypeStats(findByType(items, 'drogarias')),
      ubs: isBrasil || isEstado ? sumStats(ubsItems) : buildUnitTypeStats(findByType(items, 'ubs')),
      upas:
        isBrasil || isEstado ? sumStats(upaItems) : buildUnitTypeStats(findByType(items, 'upa')),
      epidemiologicalWeek: firstAll?.metrics.epidemiological_week ?? '',
      weekEndingDate: firstAll?.week_ending_date ?? ''
    }
  }

  async function getRegionTable(params: {
    region: string
    estado: string
    semana: string
  }): Promise<RegionRow[]> {
    const isEstado = !!params.estado
    const isBrasil = params.region === 'brasil'
    const needsWeekFilter = !!params.semana

    const query: Record<string, string | number> = {
      weeks: needsWeekFilter ? 10 : 1,
      direction: 'desc',
      limit: needsWeekFilter ? 100 : 50
    }

    if (isEstado) {
      query.aggregation_level = 'state'
      query.state = params.estado
    } else if (!isBrasil) {
      // Região selecionada: buscar todos os estados e filtrar client-side
      // (a API Sinapse não suporta o param `region` com aggregation_level=state)
      query.aggregation_level = 'state'
    } else {
      query.aggregation_level = 'region'
    }

    const response = await $fetch<EpidemiologicalAggregationsResponse>(
      '/api/epidemiological/aggregations',
      { query }
    )

    let allData = response.data

    // Filtrar pela semana selecionada
    if (needsWeekFilter) {
      allData = allData.filter(d => d.metrics.epidemiological_week === params.semana)
    } else {
      const latestWeek = allData.reduce(
        (latest, d) =>
          d.metrics.epidemiological_week > latest ? d.metrics.epidemiological_week : latest,
        ''
      )
      if (latestWeek) {
        allData = allData.filter(d => d.metrics.epidemiological_week === latestWeek)
      }
    }

    // Filtrar por estados da região selecionada (client-side)
    if (!isEstado && !isBrasil) {
      const regionStates = REGION_TO_STATES[params.region]
      if (regionStates) {
        allData = allData.filter(d => regionStates.includes(d.aggregation_key))
      }
    }

    if (isEstado) {
      const items = allData.filter(d => d.aggregation_key === params.estado)
      const estado = ESTADOS_BRASIL.find(e => e.value === params.estado)
      return [
        {
          region: estado?.label ?? params.estado,
          todos: buildCellData(findByType(items, 'all')),
          drogarias: buildCellData(findByType(items, 'drogarias')),
          upa: buildCellData(findByType(items, 'upa')),
          ubs: buildCellData(findByType(items, 'ubs'))
        }
      ]
    }

    // Região selecionada: agrupar por estado
    if (!isBrasil) {
      const byState = new Map<string, EpidemiologicalAggregation[]>()
      for (const item of allData) {
        const list = byState.get(item.aggregation_key) ?? []
        list.push(item)
        byState.set(item.aggregation_key, list)
      }

      return Array.from(byState.entries())
        .sort(([a], [b]) => {
          const nameA = UF_TO_STATE_NAME[a] ?? a
          const nameB = UF_TO_STATE_NAME[b] ?? b
          return nameA.localeCompare(nameB, 'pt-BR')
        })
        .map(([uf, items]) => ({
          region: UF_TO_STATE_NAME[uf] ?? uf,
          todos: buildCellData(findByType(items, 'all')),
          drogarias: buildCellData(findByType(items, 'drogarias')),
          upa: buildCellData(findByType(items, 'upa')),
          ubs: buildCellData(findByType(items, 'ubs'))
        }))
    }

    // Brasil: agrupar por região
    const byRegion = new Map<string, EpidemiologicalAggregation[]>()
    for (const item of allData) {
      const regionName = REGION_KEY_TO_NAME[item.aggregation_key]
      if (!regionName) continue
      const list = byRegion.get(regionName) ?? []
      list.push(item)
      byRegion.set(regionName, list)
    }

    return REGION_DISPLAY_ORDER.filter(name => byRegion.has(name)).map(name => {
      const items = byRegion.get(name)!
      return {
        region: name,
        todos: buildCellData(findByType(items, 'all')),
        drogarias: buildCellData(findByType(items, 'drogarias')),
        upa: buildCellData(findByType(items, 'upa')),
        ubs: buildCellData(findByType(items, 'ubs'))
      }
    })
  }

  function getEstados(): SelectOption[] {
    return ESTADOS_BRASIL
  }

  function getEstadosByRegion(region: string): SelectOption[] {
    if (region === 'brasil') return ESTADOS_BRASIL
    const allowedUFs = REGION_TO_STATES[region]
    if (!allowedUFs) return ESTADOS_BRASIL
    return [
      { value: '', label: 'Todos os Estados' },
      ...ESTADOS_BRASIL.filter(e => e.value && allowedUFs.includes(e.value))
    ]
  }

  async function getSemanas(): Promise<SelectOption[]> {
    const response = await $fetch<EpidemiologicalAggregationsResponse>(
      '/api/epidemiological/aggregations',
      {
        query: {
          aggregation_level: 'region',
          unit_type: 'all',
          weeks: 10,
          direction: 'desc',
          limit: 100
        }
      }
    )

    // Extrair semanas únicas e ordenar desc
    const weeksMap = new Map<string, string>()
    for (const item of response.data) {
      const week = item.metrics.epidemiological_week
      if (!weeksMap.has(week)) {
        weeksMap.set(week, item.week_ending_date)
      }
    }

    return Array.from(weeksMap.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([epiWeek, endDate]) => ({
        value: epiWeek,
        label: formatWeekLabel(epiWeek, endDate)
      }))
  }

  async function getChartSeries(params: {
    region: string
    estado: string
    unitType: ChartUnitType
  }): Promise<ChartSeriesData> {
    const isEstado = !!params.estado
    const isBrasil = params.region === 'brasil'

    const query: Record<string, string | number> = {
      aggregation_level: isEstado ? 'state' : 'region',
      unit_type: params.unitType,
      weeks: 10,
      direction: 'desc',
      limit: 200
    }

    if (isEstado) {
      query.state = params.estado
    }

    const response = await $fetch<EpidemiologicalAggregationsResponse>(
      '/api/epidemiological/aggregations',
      { query }
    )

    let items = response.data

    // Filtrar por região específica
    if (!isEstado && !isBrasil) {
      const regionKey = Object.entries(REGION_KEY_TO_NAME).find(
        ([, name]) => name.toLowerCase() === params.region
      )?.[0]
      if (regionKey) {
        items = items.filter(d => d.aggregation_key === regionKey)
      }
    }

    // Agrupar por semana epidemiológica
    const byWeek = new Map<string, EpidemiologicalAggregation[]>()
    for (const item of items) {
      const week = item.metrics.epidemiological_week
      const list = byWeek.get(week) ?? []
      list.push(item)
      byWeek.set(week, list)
    }

    // Ordenar semanas asc (mais antiga primeiro)
    const sortedWeeks = Array.from(byWeek.keys()).sort()

    const points: ChartPointData[] = sortedWeeks.map(week => {
      const weekItems = byWeek.get(week)!
      const firstItem = weekItems[0]!

      // Para brasil/multi-região: média ponderada
      if (weekItems.length > 1) {
        const totalUnits = weekItems.reduce((s, d) => s + d.units_count, 0)
        const weightedOccupancy =
          totalUnits > 0
            ? weekItems.reduce(
                (s, d) => s + d.metrics.average_occupancy_weekday * d.units_count,
                0
              ) / totalUnits
            : 0
        const weightedAvg =
          totalUnits > 0
            ? weekItems.reduce((s, d) => s + d.metrics.moving_avg_weekday * d.units_count, 0) /
              totalUnits
            : 0
        const weightedVariation =
          totalUnits > 0
            ? weekItems.reduce(
                (s, d) => s + d.metrics.vs_previous_week_weekday * d.units_count,
                0
              ) / totalUnits
            : 0
        const worstAlert = weekItems.reduce((worst, d) => {
          const order: AlertStatus[] = ['green', 'yellow', 'red']
          return order.indexOf(d.metrics.alert_status) > order.indexOf(worst)
            ? d.metrics.alert_status
            : worst
        }, 'green' as AlertStatus)

        const weekNum = week.split('-W')[1] ?? week
        const endDate = firstItem.week_ending_date

        return {
          week: `SE ${weekNum}`,
          weekLabel: `SE ${weekNum}`,
          dateRange: formatDateRange(endDate),
          occupancy: weightedOccupancy,
          movingAvg: weightedAvg,
          variation: weightedVariation,
          alertStatus: worstAlert
        }
      }

      // Região/estado único
      const weekNum = week.split('-W')[1] ?? week
      return {
        week: `SE ${weekNum}`,
        weekLabel: `SE ${weekNum}`,
        dateRange: formatDateRange(firstItem.week_ending_date),
        occupancy: firstItem.metrics.average_occupancy_weekday,
        movingAvg: firstItem.metrics.moving_avg_weekday,
        variation: firstItem.metrics.vs_previous_week_weekday,
        alertStatus: firstItem.metrics.alert_status
      }
    })

    // Dados da semana mais recente para o header
    const lastPoint = points[points.length - 1]
    const lastWeekItems = byWeek.get(sortedWeeks[sortedWeeks.length - 1] ?? '')

    let currentTrend: TrendType = 'stable'
    if (lastWeekItems && lastWeekItems.length > 0) {
      const trendCounts = { up: 0, down: 0, stable: 0 }
      for (const d of lastWeekItems) trendCounts[d.metrics.trend_weekday]++
      currentTrend =
        (Object.entries(trendCounts) as [TrendType, number][]).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] ?? 'stable'
    }

    return {
      points,
      currentWeekVariation: lastPoint?.variation ?? 0,
      currentWeekTrend: currentTrend
    }
  }

  return { getPanorama, getRegionTable, getChartSeries, getEstados, getEstadosByRegion, getSemanas }
}
