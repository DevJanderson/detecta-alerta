<script setup lang="ts">
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent])

const props = defineProps<{
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

// --- Dados mock ---
type PointStatus = 'normal' | 'alert' | 'danger'

const weeks = [
  'SE 39',
  'SE 40',
  'SE 41',
  'SE 42',
  'SE 43',
  'SE 44',
  'SE 45',
  'SE 46',
  'SE 47',
  'SE 48'
]
const weekDates = [
  '(21 a 27/09)',
  '(28/09 a 04/10)',
  '(05 a 11/10)',
  '(12 a 18/10)',
  '(19 a 25/10)',
  '(26/10 a 01/11)',
  '(02 a 08/11)',
  '(09 a 15/11)',
  '(26 a 22/11)',
  '(23 a 29/11)'
]

const mainData = [41.3, 41.3, 40.5, 38.6, 37.8, 38.3, 41.0, 41.3, 40.3, 40.6]
const averageData = [40.3, 40.3, 40.2, 39.9, 39.6, 39.7, 40.1, 40.3, 40.3, 40.3]

const pointStatus: PointStatus[] = [
  'normal',
  'normal',
  'normal',
  'normal',
  'normal',
  'alert',
  'danger',
  'alert',
  'normal',
  'alert'
]

// Barras de variação (período atual vs anterior)
const barCurrentData = [24.5, 24.5, 26.4, 24.5, 24.5, 9.6, 24.5, 25.7, 21.4, 22.1]
const barPreviousData = [22.8, 22.8, 22.8, 22.8, 28.4, 22.8, 28.0, 22.8, 22.8, 23.8]
const barStatus: PointStatus[] = [
  'normal',
  'normal',
  'normal',
  'normal',
  'normal',
  'alert',
  'danger',
  'alert',
  'normal',
  'alert'
]

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

function getStatus(i: number): PointStatus {
  return pointStatus[i] ?? 'normal'
}

function getBarStatus(i: number): PointStatus {
  return barStatus[i] ?? 'normal'
}

// --- ECharts option ---
const option = computed(() => {
  const series: unknown[] = [
    // Linha principal com área
    {
      type: 'line',
      data: mainData.map((val, i) => ({
        value: val,
        itemStyle: {
          color: STATUS_COLORS[getStatus(i)],
          borderColor: STATUS_COLORS[getStatus(i)],
          borderWidth: 2
        },
        symbolSize: getStatus(i) === 'normal' ? 10 : 14
      })),
      smooth: 0.4,
      symbol: 'circle',
      symbolSize: 10,
      lineStyle: {
        color: COLORS.secondary900,
        width: 3
      },
      areaStyle: {
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(25, 97, 172, 0.25)' },
          { offset: 1, color: 'rgba(25, 97, 172, 0.02)' }
        ])
      },
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
    series.push(
      // Barra período atual
      {
        type: 'bar',
        data: barCurrentData.map((val, i) => ({
          value: val,
          itemStyle: { color: STATUS_BAR_CURRENT[getBarStatus(i)] }
        })),
        barWidth: 16,
        barGap: '0%',
        z: 1
      },
      // Barra período anterior
      {
        type: 'bar',
        data: barPreviousData.map((val, i) => ({
          value: val,
          itemStyle: { color: STATUS_BAR_PREVIOUS[getBarStatus(i)] }
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
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: COLORS.secondary900,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'Open Sans, sans-serif',
        margin: 8,
        interval: 0,
        formatter: (value: string, index: number) => {
          return `{semana|${value}}\n{data|${weekDates[index] ?? ''}}`
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
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: 37,
      max: 43,
      interval: 1,
      axisLine: {
        show: true,
        lineStyle: {
          color: COLORS.secondary100,
          width: 1
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: COLORS.secondary900,
        fontSize: 12,
        fontFamily: 'Open Sans, sans-serif',
        formatter: '{value}%'
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: COLORS.secondary100,
          type: 'dashed',
          width: 1
        }
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
        const status = getStatus(idx)
        const statusLabel =
          status === 'normal' ? 'Normal' : status === 'alert' ? 'Alerta' : 'Elevado'
        return `<div style="font-weight:600">${weeks[idx] ?? ''} ${weekDates[idx] ?? ''}</div>
          <div style="margin-top:4px">Lotação: <b>${main}%</b></div>
          <div>Média: ${avg}%</div>
          <div style="color:${STATUS_COLORS[status]}">Status: ${statusLabel}</div>`
      }
    },
    series
  }
})
</script>

<template>
  <div class="h-64 w-full sm:h-80 lg:h-96">
    <VChart :option="option" autoresize style="width: 100%; height: 100%" />
  </div>
</template>
