import { describe, it, expect } from 'vitest'
import {
  createCodigoIBGE,
  isValidCodigoIBGE,
  codigoIBGEEquals
} from '../../../layers/meu-municipio/app/utils/codigo-ibge'

describe('CodigoIBGE', () => {
  describe('createCodigoIBGE', () => {
    it('cria VO válido para São Paulo', () => {
      const codigo = createCodigoIBGE('3550308')
      expect(codigo.value).toBe('3550308')
      expect(codigo.ufCode).toBe('35')
      expect(codigo.uf).toBe('SP')
      expect(codigo.municipioCode).toBe('50308')
    })

    it('cria VO válido para Rio de Janeiro', () => {
      const codigo = createCodigoIBGE('3304557')
      expect(codigo.uf).toBe('RJ')
    })

    it('cria VO válido para Brasília', () => {
      const codigo = createCodigoIBGE('5300108')
      expect(codigo.uf).toBe('DF')
    })

    it('cria VO válido para Manaus', () => {
      const codigo = createCodigoIBGE('1302603')
      expect(codigo.uf).toBe('AM')
    })

    it('faz trim de espaços', () => {
      const codigo = createCodigoIBGE('  3550308  ')
      expect(codigo.value).toBe('3550308')
    })

    it('rejeita código com menos de 7 dígitos', () => {
      expect(() => createCodigoIBGE('355030')).toThrow('exatamente 7 dígitos')
    })

    it('rejeita código com mais de 7 dígitos', () => {
      expect(() => createCodigoIBGE('35503080')).toThrow('exatamente 7 dígitos')
    })

    it('rejeita código com letras', () => {
      expect(() => createCodigoIBGE('355030A')).toThrow('exatamente 7 dígitos')
    })

    it('rejeita código vazio', () => {
      expect(() => createCodigoIBGE('')).toThrow('exatamente 7 dígitos')
    })

    it('rejeita código UF inexistente', () => {
      expect(() => createCodigoIBGE('9950308')).toThrow('Código UF inválido')
    })

    it('retorna objeto imutável', () => {
      const codigo = createCodigoIBGE('3550308')
      expect(Object.isFrozen(codigo)).toBe(true)
    })
  })

  describe('isValidCodigoIBGE', () => {
    it('retorna true para código válido', () => {
      expect(isValidCodigoIBGE('3550308')).toBe(true)
    })

    it('retorna false para código inválido', () => {
      expect(isValidCodigoIBGE('123')).toBe(false)
    })

    it('retorna false para UF inexistente', () => {
      expect(isValidCodigoIBGE('9950308')).toBe(false)
    })
  })

  describe('codigoIBGEEquals', () => {
    it('retorna true para códigos iguais', () => {
      const a = createCodigoIBGE('3550308')
      const b = createCodigoIBGE('3550308')
      expect(codigoIBGEEquals(a, b)).toBe(true)
    })

    it('retorna false para códigos diferentes', () => {
      const a = createCodigoIBGE('3550308')
      const b = createCodigoIBGE('3304557')
      expect(codigoIBGEEquals(a, b)).toBe(false)
    })
  })
})
