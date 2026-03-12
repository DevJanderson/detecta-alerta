/**
 * GET /api/epidemiological/aggregations
 *
 * API Proxy para o endpoint de agregações epidemiológicas da API Sinapse.
 * Retorna dados agregados por região/estado/cidade com métricas de ocupação.
 */

export default defineEventHandler(async event => {
  // Usar token do contexto (já renovado pelo middleware 01.auth),
  // fallback para cookie direto apenas se contexto não disponível
  const accessToken = event.context.auth?.accessToken ?? getAccessToken(event)
  if (!accessToken) {
    throw createError({ statusCode: 401, message: 'Não autenticado' })
  }

  const qs = buildQueryString(getQuery(event), [
    'aggregation_level',
    'aggregation_key',
    'state',
    'region',
    'unit_type',
    'weeks',
    'direction',
    'limit',
    'cursor',
    'order_by'
  ])

  const endpoint = `/detecta_alerta/epidemiological/aggregations${qs ? `?${qs}` : ''}`

  return handleSinapseRequest({
    fn: () => fetchSinapse(endpoint, { accessToken }),
    errorContext: 'Erro ao buscar agregações epidemiológicas'
  })
})
