/**
 * GET /api/rumores/operacoes/sintomas
 *
 * Lista sintomas cadastrados para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  try {
    return await fetchSinapse('/noticias/operacoes/sintomas', { accessToken })
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar sintomas'
      })
    }

    logAuthError('Erro ao listar sintomas', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar sintomas'
    })
  }
})
