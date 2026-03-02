/**
 * Wrapper para chamadas à API Sinapse nos endpoints BFF
 * Centraliza o padrão try/catch + isSinapseError + logAuthError
 */

import type { ZodType } from 'zod'

interface HandleSinapseRequestOptions<T> {
  /** Função que executa a chamada fetchSinapse */
  fn: () => Promise<T>
  /** Contexto para log de erro (ex: 'Erro ao buscar usuario') */
  errorContext: string
  /** Schema Zod para validar a resposta (opcional) */
  schema?: ZodType<T>
}

export async function handleSinapseRequest<T>(options: HandleSinapseRequestOptions<T>): Promise<T> {
  const { fn, errorContext, schema } = options

  try {
    const result = await fn()
    return schema ? schema.parse(result) : result
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || errorContext
      })
    }

    logAuthError(errorContext, error)

    throw createError({
      statusCode: 500,
      statusMessage: errorContext
    })
  }
}
