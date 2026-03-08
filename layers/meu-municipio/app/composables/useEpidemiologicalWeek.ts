/**
 * Composable para cálculo de semana epidemiológica
 *
 * Delega ao Value Object `semanaEpidemiologicaFromDate()` para evitar
 * duplicação de lógica. Este composable adiciona reatividade Vue.
 */
import {
  semanaEpidemiologicaFromDate,
  formatSemanaEpidemiologicaCurta
} from '../utils/semana-epidemiologica'

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

/** Calcula a semana epidemiológica de uma data (delega ao VO) */
export function getEpidemiologicalWeek(date: Date): number {
  return semanaEpidemiologicaFromDate(date).semana
}

/** Retorna o intervalo (domingo–sábado) da semana epidemiológica de uma data (delega ao VO) */
export function getCurrentWeekRange(date: Date): { start: Date; end: Date } {
  const se = semanaEpidemiologicaFromDate(date)
  return { start: se.inicio, end: se.fim }
}

/** Composable reativo com dados da semana epidemiológica atual */
export function useEpidemiologicalWeek() {
  const currentDate = ref(new Date())

  const weekData = computed<EpidemiologicalWeekData>(() => {
    const date = currentDate.value
    const se = semanaEpidemiologicaFromDate(date)

    return {
      week: se.semana,
      weekText: formatSemanaEpidemiologicaCurta(se),
      periodText: `${formatShortDate(se.inicio)} a ${formatShortDate(se.fim)}`,
      startDate: se.inicio,
      endDate: se.fim,
      year: se.ano
    }
  })

  const setDate = (date: Date) => {
    currentDate.value = date
  }

  return { weekData, setDate }
}
