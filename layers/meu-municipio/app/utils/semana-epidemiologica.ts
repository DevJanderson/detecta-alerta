/**
 * Value Object — Semana Epidemiológica
 *
 * Padrão brasileiro: semana começa no domingo, vai de 1 a 53.
 * Encapsula ano + número da semana + período (início/fim).
 *
 * Imutável após criação. Valida ranges no factory.
 */

const MIN_YEAR = 2000
const MAX_WEEK = 53
const MIN_WEEK = 1

export interface SemanaEpidemiologica {
  readonly ano: number
  readonly semana: number
  readonly inicio: Date
  readonly fim: Date
}

export function createSemanaEpidemiologica(ano: number, semana: number): SemanaEpidemiologica {
  if (!Number.isInteger(ano) || ano < MIN_YEAR) {
    throw new Error(`Ano inválido: ${ano}. Deve ser inteiro >= ${MIN_YEAR}.`)
  }

  if (!Number.isInteger(semana) || semana < MIN_WEEK || semana > MAX_WEEK) {
    throw new Error(`Semana inválida: ${semana}. Deve ser inteiro entre ${MIN_WEEK} e ${MAX_WEEK}.`)
  }

  const inicio = calcularInicioSemana(ano, semana)
  const fim = new Date(inicio)
  fim.setDate(inicio.getDate() + 6)
  fim.setHours(23, 59, 59, 999)

  return Object.freeze({ ano, semana, inicio, fim })
}

export function semanaEpidemiologicaFromDate(date: Date): SemanaEpidemiologica {
  const year = date.getFullYear()
  const firstDayOfYear = new Date(year, 0, 1)

  const firstSunday = new Date(firstDayOfYear)
  const dayOfWeek = firstDayOfYear.getDay()
  if (dayOfWeek !== 0) {
    firstSunday.setDate(firstDayOfYear.getDate() + (7 - dayOfWeek))
  }

  if (date < firstSunday) {
    return semanaEpidemiologicaFromDate(new Date(year - 1, 11, 31))
  }

  const diffTime = date.getTime() - firstSunday.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const semana = Math.min(Math.floor(diffDays / 7) + 1, MAX_WEEK)

  return createSemanaEpidemiologica(year, semana)
}

export function formatSemanaEpidemiologica(se: SemanaEpidemiologica): string {
  return `SE ${se.semana}/${se.ano}`
}

export function formatSemanaEpidemiologicaCurta(se: SemanaEpidemiologica): string {
  return `SE ${se.semana}`
}

export function semanaEpidemiologicaEquals(
  a: SemanaEpidemiologica,
  b: SemanaEpidemiologica
): boolean {
  return a.ano === b.ano && a.semana === b.semana
}

/** Calcula a data de início (domingo) da semana epidemiológica N de um ano */
function calcularInicioSemana(ano: number, semana: number): Date {
  const firstDayOfYear = new Date(ano, 0, 1)
  const dayOfWeek = firstDayOfYear.getDay()

  const firstSunday = new Date(firstDayOfYear)
  if (dayOfWeek !== 0) {
    firstSunday.setDate(firstDayOfYear.getDate() + (7 - dayOfWeek))
  }

  const inicio = new Date(firstSunday)
  inicio.setDate(firstSunday.getDate() + (semana - 1) * 7)
  inicio.setHours(0, 0, 0, 0)

  return inicio
}
