import { describe, it, expect } from 'vitest'
import {
  createCoordenadas,
  coordenadasToTuple,
  coordenadasFromTuple,
  coordenadasEquals,
  coordenadasDistanceKm
} from '../../../layers/base/app/utils/coordenadas'

describe('Coordenadas', () => {
  describe('createCoordenadas', () => {
    it('cria coordenadas válidas para São Paulo', () => {
      const coord = createCoordenadas(-46.6333, -23.5505)
      expect(coord.lng).toBe(-46.6333)
      expect(coord.lat).toBe(-23.5505)
    })

    it('retorna objeto imutável', () => {
      const coord = createCoordenadas(-46.6333, -23.5505)
      expect(Object.isFrozen(coord)).toBe(true)
    })

    it('rejeita longitude fora do range', () => {
      expect(() => createCoordenadas(-181, 0)).toThrow('Longitude fora do range')
      expect(() => createCoordenadas(181, 0)).toThrow('Longitude fora do range')
    })

    it('rejeita latitude fora do range', () => {
      expect(() => createCoordenadas(0, -91)).toThrow('Latitude fora do range')
      expect(() => createCoordenadas(0, 91)).toThrow('Latitude fora do range')
    })

    it('rejeita NaN', () => {
      expect(() => createCoordenadas(NaN, 0)).toThrow('numéricos finitos')
    })

    it('rejeita Infinity', () => {
      expect(() => createCoordenadas(0, Infinity)).toThrow('numéricos finitos')
    })

    it('aceita coordenadas nos limites', () => {
      expect(() => createCoordenadas(-180, -90)).not.toThrow()
      expect(() => createCoordenadas(180, 90)).not.toThrow()
    })
  })

  describe('validarBrasil', () => {
    it('aceita coordenadas dentro do Brasil', () => {
      const coord = createCoordenadas(-46.6333, -23.5505, { validarBrasil: true })
      expect(coord.lng).toBe(-46.6333)
    })

    it('rejeita coordenadas fora do Brasil', () => {
      expect(() => createCoordenadas(-3.7038, 40.4168, { validarBrasil: true })).toThrow(
        'fora do Brasil'
      )
    })

    it('aceita coordenadas fora do Brasil sem flag', () => {
      const coord = createCoordenadas(-3.7038, 40.4168)
      expect(coord.lng).toBe(-3.7038)
    })
  })

  describe('conversão tuple', () => {
    it('converte para tuple [lng, lat]', () => {
      const coord = createCoordenadas(-46.6333, -23.5505)
      expect(coordenadasToTuple(coord)).toEqual([-46.6333, -23.5505])
    })

    it('cria a partir de tuple', () => {
      const coord = coordenadasFromTuple([-46.6333, -23.5505])
      expect(coord.lng).toBe(-46.6333)
      expect(coord.lat).toBe(-23.5505)
    })
  })

  describe('coordenadasEquals', () => {
    it('retorna true para coordenadas iguais', () => {
      const a = createCoordenadas(-46.6333, -23.5505)
      const b = createCoordenadas(-46.6333, -23.5505)
      expect(coordenadasEquals(a, b)).toBe(true)
    })

    it('retorna false para coordenadas diferentes', () => {
      const a = createCoordenadas(-46.6333, -23.5505)
      const b = createCoordenadas(-43.1729, -22.9068)
      expect(coordenadasEquals(a, b)).toBe(false)
    })
  })

  describe('coordenadasDistanceKm', () => {
    it('calcula distância entre São Paulo e Rio de Janeiro (~357km)', () => {
      const sp = createCoordenadas(-46.6333, -23.5505)
      const rj = createCoordenadas(-43.1729, -22.9068)
      const dist = coordenadasDistanceKm(sp, rj)
      expect(dist).toBeGreaterThan(350)
      expect(dist).toBeLessThan(370)
    })

    it('distância entre mesmo ponto é zero', () => {
      const coord = createCoordenadas(-46.6333, -23.5505)
      expect(coordenadasDistanceKm(coord, coord)).toBe(0)
    })
  })
})
