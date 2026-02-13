/**
 * GET /api/rumores/operacoes/localizacoes
 *
 * Lista localizacoes cadastradas para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  try {
    return await fetchSinapse('/noticias/operacoes/localizacoes', { accessToken })
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar localizacoes'
      })
    }

    logAuthError('Erro ao listar localizacoes', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar localizacoes'
    })
  }
})
