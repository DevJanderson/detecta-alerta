/**
 * GET /api/usuarios/admin
 *
 * Lista usuarios paginados (somente admin).
 * Query params: page, size, nome, email, admin, ativo, cidade, estado, search
 */

import { usuariosPaginadosSchemaSchema } from '~/generated/sinapse/zod/usuariosPaginadosSchemaSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = requireAuth(event)

  const query = getQuery(event)

  // Montar query string para a API Sinapse
  const params = new URLSearchParams()
  const allowedParams = [
    'page',
    'size',
    'nome',
    'email',
    'admin',
    'ativo',
    'cidade',
    'estado',
    'search'
  ]

  for (const key of allowedParams) {
    const value = query[key]
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value))
    }
  }

  const queryString = params.toString()
  const endpoint = `/usuarios/${queryString ? `?${queryString}` : ''}`

  try {
    const rawResponse = await fetchSinapse(endpoint, {
      accessToken
    })

    const response = usuariosPaginadosSchemaSchema.parse(rawResponse)
    return response
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar usuarios'
      })
    }

    logAuthError('Erro ao listar usuarios', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar usuarios'
    })
  }
})
