/**
 * GET /api/rumores/:uniqueId
 *
 * Retorna detalhes completos de um rumor.
 * Requer autenticacao.
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const uniqueId = validateUniqueId(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/noticias/${uniqueId}`, { accessToken }),
    errorContext: 'Erro ao buscar rumor'
  })
})
