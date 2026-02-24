/**
 * GET /api/rumores/operacoes/doencas
 *
 * Lista doencas cadastradas para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/noticias/operacoes/doencas', { accessToken }),
    errorContext: 'Erro ao listar doencas'
  })
})
