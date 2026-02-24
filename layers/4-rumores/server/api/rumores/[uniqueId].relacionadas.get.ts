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

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/noticias/${uniqueId}/relacionadas${limit}`, { accessToken }),
    errorContext: 'Erro ao buscar relacionadas'
  })
})
