/**
 * GET /api/rumores/operacoes/sintomas
 *
 * Lista sintomas cadastrados para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/noticias/operacoes/sintomas', { accessToken }),
    errorContext: 'Erro ao listar sintomas'
  })
})
