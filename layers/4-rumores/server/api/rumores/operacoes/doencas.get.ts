/**
 * GET /api/rumores/operacoes/doencas
 *
 * Lista doencas cadastradas para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  try {
    return await fetchSinapse('/noticias/operacoes/doencas', { accessToken })
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar doencas'
      })
    }

    logAuthError('Erro ao listar doencas', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar doencas'
    })
  }
})
