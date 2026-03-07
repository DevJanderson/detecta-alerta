/**
 * Composable para cálculo de semana epidemiológica
 * Padrão brasileiro: semana começa no domingo
 */

export interface EpidemiologicalWeekData {
  /** Número da semana epidemiológica (1-53) */
  week: number
  /** Texto formatado (ex: "SE 8") */
  weekText: string
  /** Período formatado (ex: "22 fev. a 28 fev.") */
  periodText: string
  /** Data de início da semana (domingo) */
  startDate: Date
  /** Data de fim da semana (sábado) */
  endDate: Date
  /** Ano da semana epidemiológica */
  year: number
}

export const MONTHS_FULL = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

export const WEEKDAYS_SHORT = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const MONTHS_SHORT = [
  'jan.',
  'fev.',
  'mar.',
  'abr.',
  'mai.',
  'jun.',
  'jul.',
  'ago.',
  'set.',
  'out.',
  'nov.',
  'dez.'
]

/** Formata uma data no padrão "DD mmm." */
export function formatShortDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0')
  return `${day} ${MONTHS_SHORT[date.getMonth()]}`
}

/** Calcula a semana epidemiológica de uma data (padrão brasileiro, semana começa no domingo) */
export function getEpidemiologicalWeek(date: Date): number {
  const year = date.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)

  const firstSunday = new Date(firstDayOfYear)
  const dayOfWeek = firstDayOfYear.getDay()
  if (dayOfWeek !== 0) {
    firstSunday.setDate(firstDayOfYear.getDate() + (7 - dayOfWeek))
  }

  if (date < firstSunday) {
    return getEpidemiologicalWeek(new Date(year - 1, 11, 31))
  }

  const diffTime = date.getTime() - firstSunday.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return Math.min(Math.floor(diffDays / 7) + 1, 53)
}

/** Retorna o intervalo (domingo–sábado) da semana epidemiológica de uma data */
export function getCurrentWeekRange(date: Date): { start: Date; end: Date } {
  const dayOfWeek = date.getDay()
  const start = new Date(date)
  start.setDate(date.getDate() - dayOfWeek)
  start.setHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}

/** Composable reativo com dados da semana epidemiológica atual */
export function useEpidemiologicalWeek() {
  const currentDate = ref(new Date())

  const weekData = computed<EpidemiologicalWeekData>(() => {
    const date = currentDate.value
    const week = getEpidemiologicalWeek(date)
    const { start, end } = getCurrentWeekRange(date)

    return {
      week,
      weekText: `SE ${week}`,
      periodText: `${formatShortDate(start)} a ${formatShortDate(end)}`,
      startDate: start,
      endDate: end,
      year: date.getFullYear()
    }
  })

  const setDate = (date: Date) => {
    currentDate.value = date
  }

  return { weekData, setDate }
}
