/**
 * Utilitários de validação para endpoints BFF
 * Centraliza o padrão readBody + safeParse e validação de route params
 */

import type { H3Event } from 'h3'
import type { ZodType } from 'zod'

export async function validateBody<T>(event: H3Event, schema: ZodType<T>): Promise<T> {
  const body = await readBody(event)
  const result = schema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  return result.data
}

/**
 * Valida e retorna um route param numérico.
 * Lança 400 se ausente ou não-numérico (previne path traversal).
 */
export function validateRouteParam(event: H3Event, name: string): string {
  const value = getRouterParam(event, name)

  if (!value || !/^\d+$/.test(value)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Parametro '${name}' invalido`
    })
  }

  return value
}
