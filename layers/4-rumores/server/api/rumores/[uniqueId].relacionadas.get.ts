/**
 * GET /api/rumores/:uniqueId/relacionadas
 *
 * Retorna rumores relacionados por cluster semantico ou similaridade.
 * Requer autenticacao.
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const uniqueId = getRouterParam(event, 'uniqueId')

  if (!uniqueId) {
    throw createError({ statusCode: 400, statusMessage: 'uniqueId obrigatorio' })
  }

  const query = getQuery(event)
  const limit = query.limit ? `?limit=${query.limit}` : ''

  try {
    return await fetchSinapse(`/noticias/${uniqueId}/relacionadas${limit}`, { accessToken })
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar relacionadas'
      })
    }

    logAuthError('Erro ao buscar rumores relacionados', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar relacionadas'
    })
  }
})
