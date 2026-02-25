/**
 * GET /api/rumores/:uniqueId/relacionadas
 *
 * Retorna rumores relacionados por cluster semantico ou similaridade.
 * Requer autenticacao.
 */

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const uniqueId = validateUniqueId(event)

  const query = getQuery(event)
  const qs = buildQueryString(query, ['limit'])

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/noticias/${uniqueId}/relacionadas${qs ? `?${qs}` : ''}`, { accessToken }),
    errorContext: 'Erro ao buscar relacionadas'
  })
})
