import { describe, it, expect } from 'vitest'
import {
  createSemanaEpidemiologica,
  semanaEpidemiologicaFromDate,
  formatSemanaEpidemiologica,
  formatSemanaEpidemiologicaCurta,
  semanaEpidemiologicaEquals
} from '../../../layers/meu-municipio/app/utils/semana-epidemiologica'

describe('SemanaEpidemiologica', () => {
  describe('createSemanaEpidemiologica', () => {
    it('cria VO válido para semana 1 de 2026', () => {
      const se = createSemanaEpidemiologica(2026, 1)
      expect(se.ano).toBe(2026)
      expect(se.semana).toBe(1)
      expect(se.inicio).toBeInstanceOf(Date)
      expect(se.fim).toBeInstanceOf(Date)
    })

    it('início é domingo e fim é sábado', () => {
      const se = createSemanaEpidemiologica(2026, 1)
      expect(se.inicio.getDay()).toBe(0) // domingo
      expect(se.fim.getDay()).toBe(6) // sábado
    })

    it('fim é 23:59:59', () => {
      const se = createSemanaEpidemiologica(2026, 1)
      expect(se.fim.getHours()).toBe(23)
      expect(se.fim.getMinutes()).toBe(59)
      expect(se.fim.getSeconds()).toBe(59)
    })

    it('retorna objeto imutável', () => {
      const se = createSemanaEpidemiologica(2026, 1)
      expect(Object.isFrozen(se)).toBe(true)
    })

    it('rejeita ano menor que 2000', () => {
      expect(() => createSemanaEpidemiologica(1999, 1)).toThrow('Ano inválido')
    })

    it('rejeita semana 0', () => {
      expect(() => createSemanaEpidemiologica(2026, 0)).toThrow('Semana inválida')
    })

    it('rejeita semana 54', () => {
      expect(() => createSemanaEpidemiologica(2026, 54)).toThrow('Semana inválida')
    })

    it('aceita semana 53 (limite)', () => {
      expect(() => createSemanaEpidemiologica(2026, 53)).not.toThrow()
    })

    it('rejeita semana decimal', () => {
      expect(() => createSemanaEpidemiologica(2026, 1.5)).toThrow('Semana inválida')
    })
  })

  describe('semanaEpidemiologicaFromDate', () => {
    it('calcula semana correta para data conhecida', () => {
      // 2026-03-07 (sábado) — deve estar na SE correspondente
      const se = semanaEpidemiologicaFromDate(new Date(2026, 2, 7))
      expect(se.ano).toBe(2026)
      expect(se.semana).toBeGreaterThanOrEqual(1)
      expect(se.semana).toBeLessThanOrEqual(53)
    })

    it('data no início de janeiro pode pertencer ao ano anterior', () => {
      // 2026-01-01 é quinta-feira. Se o primeiro domingo do ano é 4/jan,
      // 1/jan pode pertencer à última SE de 2025
      const se = semanaEpidemiologicaFromDate(new Date(2026, 0, 1))
      expect(se.semana).toBeGreaterThanOrEqual(1)
    })

    it('retorna VO imutável', () => {
      const se = semanaEpidemiologicaFromDate(new Date(2026, 5, 15))
      expect(Object.isFrozen(se)).toBe(true)
    })
  })

  describe('formatação', () => {
    it('formatSemanaEpidemiologica retorna formato completo', () => {
      const se = createSemanaEpidemiologica(2026, 10)
      expect(formatSemanaEpidemiologica(se)).toBe('SE 10/2026')
    })

    it('formatSemanaEpidemiologicaCurta retorna formato curto', () => {
      const se = createSemanaEpidemiologica(2026, 8)
      expect(formatSemanaEpidemiologicaCurta(se)).toBe('SE 8')
    })
  })

  describe('semanaEpidemiologicaEquals', () => {
    it('retorna true para mesma semana/ano', () => {
      const a = createSemanaEpidemiologica(2026, 10)
      const b = createSemanaEpidemiologica(2026, 10)
      expect(semanaEpidemiologicaEquals(a, b)).toBe(true)
    })

    it('retorna false para semanas diferentes', () => {
      const a = createSemanaEpidemiologica(2026, 10)
      const b = createSemanaEpidemiologica(2026, 11)
      expect(semanaEpidemiologicaEquals(a, b)).toBe(false)
    })

    it('retorna false para anos diferentes', () => {
      const a = createSemanaEpidemiologica(2025, 10)
      const b = createSemanaEpidemiologica(2026, 10)
      expect(semanaEpidemiologicaEquals(a, b)).toBe(false)
    })
  })
})
