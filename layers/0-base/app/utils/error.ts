/**
 * Utilitários de erro compartilhados (client-side)
 * Extrai mensagens de erro de forma consistente em todos os stores
 */

export interface FetchError {
  statusCode?: number
  statusMessage?: string
  data?: { message?: string }
}

export function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error && typeof error === 'object') {
    const fetchError = error as FetchError
    if (fetchError.data?.message) return fetchError.data.message
    if (fetchError.statusMessage) return fetchError.statusMessage
  }
  return defaultMessage
}
