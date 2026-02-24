/**
 * GET /api/rumores/operacoes/localizacoes
 *
 * Lista localizacoes cadastradas para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/noticias/operacoes/localizacoes', { accessToken }),
    errorContext: 'Erro ao listar localizacoes'
  })
})
