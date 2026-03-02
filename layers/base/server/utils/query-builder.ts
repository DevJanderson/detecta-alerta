/**
 * Utilitário para construir query strings a partir de parâmetros permitidos
 * Centraliza o padrão URLSearchParams usado nos endpoints GET com filtros
 */

export function buildQueryString(query: Record<string, unknown>, allowedParams: string[]): string {
  const params = new URLSearchParams()

  for (const key of allowedParams) {
    const value = query[key]
    if (value === undefined || value === null || value === '') continue

    if (Array.isArray(value)) {
      for (const v of value) {
        params.append(key, String(v))
      }
    } else {
      params.append(key, String(value))
    }
  }

  return params.toString()
}
