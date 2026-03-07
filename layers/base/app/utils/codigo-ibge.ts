/**
 * Value Object — Código IBGE de município
 *
 * Formato: 7 dígitos numéricos
 * - 2 primeiros: código da UF
 * - 5 restantes: código do município dentro da UF
 *
 * Imutável após criação. Valida formato no factory.
 */

const IBGE_REGEX = /^\d{7}$/

/** Mapeamento código UF → sigla */
const UF_MAP: Record<string, string> = {
  '11': 'RO',
  '12': 'AC',
  '13': 'AM',
  '14': 'RR',
  '15': 'PA',
  '16': 'AP',
  '17': 'TO',
  '21': 'MA',
  '22': 'PI',
  '23': 'CE',
  '24': 'RN',
  '25': 'PB',
  '26': 'PE',
  '27': 'AL',
  '28': 'SE',
  '29': 'BA',
  '31': 'MG',
  '32': 'ES',
  '33': 'RJ',
  '35': 'SP',
  '41': 'PR',
  '42': 'SC',
  '43': 'RS',
  '50': 'MS',
  '51': 'MT',
  '52': 'GO',
  '53': 'DF'
}

export interface CodigoIBGE {
  readonly value: string
  readonly ufCode: string
  readonly uf: string
  readonly municipioCode: string
}

export function createCodigoIBGE(code: string): CodigoIBGE {
  const trimmed = code.trim()
  if (!IBGE_REGEX.test(trimmed)) {
    throw new Error(`Código IBGE inválido: "${code}". Deve conter exatamente 7 dígitos numéricos.`)
  }

  const ufCode = trimmed.slice(0, 2)
  const uf = UF_MAP[ufCode]
  if (!uf) {
    throw new Error(`Código UF inválido: "${ufCode}". Não corresponde a nenhum estado brasileiro.`)
  }

  return Object.freeze({
    value: trimmed,
    ufCode,
    uf,
    municipioCode: trimmed.slice(2)
  })
}

export function isValidCodigoIBGE(code: string): boolean {
  try {
    createCodigoIBGE(code)
    return true
  } catch {
    return false
  }
}

export function codigoIBGEEquals(a: CodigoIBGE, b: CodigoIBGE): boolean {
  return a.value === b.value
}
