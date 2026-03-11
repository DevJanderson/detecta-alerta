<script setup lang="ts">
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import type { ChartSeriesData } from '../composables/types'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
  chartData: ChartSeriesData | null
  chartType: string
  showAverage: boolean
  showVariation: boolean
}>()

// --- Cores do design system (main.css) ---
const COLORS = {
  secondary900: '#1961ac',
  secondary400: '#88b1dd',
  secondary200: '#d8e3ee',
  secondary100: '#e6edf4',
  secondary50: '#f8fafc',
  alert900: '#f0c653',
  alert200: '#faebc2',
  danger800: '#ee736d',
  danger200: '#fbdcdb',
  primary950: '#d3242d',
  tertiary100: '#dfe7e7',
  tertiary500: '#c4ceca',
  base800: '#333333',
  base100: '#f0f0f0'
}

type PointStatus = 'normal' | 'alert' | 'danger'

const ALERT_TO_STATUS: Record<string, PointStatus> = {
  green: 'normal',
  yellow: 'alert',
  red: 'danger'
}

const STATUS_COLORS: Record<PointStatus, string> = {
  normal: COLORS.secondary900,
  alert: COLORS.alert900,
  danger: COLORS.primary950
}

const STATUS_BAR_CURRENT: Record<PointStatus, string> = {
  normal: COLORS.secondary400,
  alert: COLORS.alert900,
  danger: COLORS.danger800
}

const STATUS_BAR_PREVIOUS: Record<PointStatus, string> = {
  normal: COLORS.secondary200,
  alert: COLORS.alert200,
  danger: COLORS.danger200
}

// --- ECharts option ---
const option = computed(() => {
  const points = props.chartData?.points ?? []
  if (!points.length) return {}

  const weeks = points.map(p => p.week)
  const dateRanges = points.map(p => p.dateRange)
  const mainData = points.map(p => p.occupancy)
  const averageData = points.map(p => p.movingAvg)
  const statuses = points.map(p => ALERT_TO_STATUS[p.alertStatus] ?? 'normal')

  // Calcular eixo Y dinâmico com margem
  const allValues = [...mainData, ...averageData]
  const dataMin = Math.min(...allValues)
  const dataMax = Math.max(...allValues)
  const margin = Math.max((dataMax - dataMin) * 0.3, 1)
  const yMin = Math.floor(dataMin - margin)
  const yMax = Math.ceil(dataMax + margin)

  const isArea = props.chartType === 'area'

  const series: unknown[] = [
    // Linha principal com área
    {
      type: 'line',
      data: mainData.map((val, i) => ({
        value: val,
        itemStyle: {
          color: STATUS_COLORS[statuses[i]!],
          borderColor: STATUS_COLORS[statuses[i]!],
          borderWidth: 2
        },
        symbolSize: statuses[i] === 'normal' ? 10 : 14
      })),
      smooth: 0.4,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        color: COLORS.secondary900,
        width: 3
      },
      areaStyle: isArea
        ? {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(25, 97, 172, 0.25)' },
              { offset: 1, color: 'rgba(25, 97, 172, 0.02)' }
            ])
          }
        : undefined,
      z: 4
    }
  ]

  // Linha de média (tracejada)
  if (props.showAverage) {
    series.push({
      type: 'line',
      data: averageData,
      smooth: 0.4,
      symbol: 'none',
      lineStyle: {
        color: COLORS.secondary400,
        width: 1.5,
        type: 'dashed',
        opacity: 0.6
      },
      z: 3
    })
  }

  // Barras de variação
  if (props.showVariation) {
    const variationData = points.map(p => Math.abs(p.variation))
    // Barra de variação com cor por status
    series.push(
      {
        type: 'bar',
        data: variationData.map((val, i) => ({
          value: val,
          itemStyle: { color: STATUS_BAR_CURRENT[statuses[i]!] }
        })),
        barWidth: 16,
        barGap: '0%',
        z: 1
      },
      {
        type: 'bar',
        data: variationData.map((val, i) => ({
          value: val * 0.85,
          itemStyle: { color: STATUS_BAR_PREVIOUS[statuses[i]!] }
        })),
        barWidth: 16,
        z: 1
      }
    )
  }

  return {
    grid: {
      left: 44,
      right: 8,
      top: 12,
      bottom: 52,
      containLabel: false
    },
    xAxis: {
      type: 'category',
      data: weeks,
      boundaryGap: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.secondary900,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'Open Sans, sans-serif',
        margin: 8,
        interval: 0,
        formatter: (value: string, index: number) => {
          return `{semana|${value}}\n{data|${dateRanges[index] ?? ''}}`
        },
        rich: {
          semana: {
            color: COLORS.secondary900,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: 16
          },
          data: {
            color: COLORS.secondary900,
            fontSize: 9,
            fontWeight: 400,
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: 14
          }
        }
      },
      splitLine: { show: false }
    },
    yAxis: {
      type: 'value',
      min: yMin,
      max: yMax,
      axisLine: {
        show: true,
        lineStyle: { color: COLORS.secondary100, width: 1 }
      },
      axisTick: { show: false },
      axisLabel: {
        color: COLORS.secondary900,
        fontSize: 12,
        fontFamily: 'Open Sans, sans-serif',
        formatter: '{value}%'
      },
      splitLine: {
        show: true,
        lineStyle: { color: COLORS.secondary100, type: 'dashed', width: 1 }
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: COLORS.secondary100,
      borderWidth: 1,
      textStyle: {
        color: COLORS.base800,
        fontSize: 12,
        fontFamily: 'Open Sans, sans-serif'
      },
      formatter: (params: { dataIndex: number; value: number; seriesIndex: number }[]) => {
        const first = params[0]
        if (!first) return ''
        const idx = first.dataIndex
        const main = mainData[idx] ?? 0
        const avg = averageData[idx] ?? 0
        const status = statuses[idx] ?? 'normal'
        const statusLabel =
          status === 'normal' ? 'Normal' : status === 'alert' ? 'Alerta' : 'Elevado'
        return `<div style="font-weight:600">${weeks[idx] ?? ''} ${dateRanges[idx] ?? ''}</div>
          <div style="margin-top:4px">Lotação: <b>${main.toFixed(1)}%</b></div>
          <div>Média: ${avg.toFixed(1)}%</div>
          <div style="color:${STATUS_COLORS[status]}">Status: ${statusLabel}</div>`
      }
    },
    series
  }
})
</script>

<template>
  <div class="h-64 w-full sm:h-80 lg:h-96">
    <VChart
      v-if="chartData?.points.length"
      :option="option"
      autoresize
      style="width: 100%; height: 100%"
    />
    <div v-else-if="!chartData" class="flex h-full items-center justify-center">
      <Icon name="lucide:loader-2" class="size-6 animate-spin text-base-400" />
    </div>
    <div v-else class="flex h-full items-center justify-center text-sm text-base-400">
      Sem dados para o período selecionado
    </div>
  </div>
</template>
