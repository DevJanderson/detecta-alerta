/**
 * GET /api/rumores/:uniqueId
 *
 * Retorna detalhes completos de um rumor.
 * Requer autenticacao.
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const uniqueId = getRouterParam(event, 'uniqueId')

  if (!uniqueId) {
    throw createError({ statusCode: 400, statusMessage: 'uniqueId obrigatorio' })
  }

  try {
    return await fetchSinapse(`/noticias/${uniqueId}`, { accessToken })
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar rumor'
      })
    }

    logAuthError('Erro ao buscar rumor', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar rumor'
    })
  }
})
