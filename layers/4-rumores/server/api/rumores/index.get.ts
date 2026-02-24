/**
 * GET /api/rumores/
 *
 * Lista rumores epidemiologicos (paginacao cursor-based).
 * Requer autenticacao (API Sinapse exige token).
 */

const ALLOWED_PARAMS = [
  'cursor',
  'limit',
  'search_term',
  'doencas',
  'sintomas',
  'localizacoes',
  'states',
  'fonte',
  'status',
  'relevancia_minima',
  'tipo_evento',
  'categoria',
  'classificacao_onehealth',
  'data_coleta_de',
  'data_coleta_ate',
  'data_evento_de',
  'data_evento_ate'
]

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const query = getQuery(event)

  const queryString = buildQueryString(query as Record<string, unknown>, ALLOWED_PARAMS)
  const endpoint = `/noticias/${queryString ? `?${queryString}` : ''}`

  return handleSinapseRequest({
    fn: () => fetchSinapse(endpoint, { accessToken }),
    errorContext: 'Erro ao listar rumores'
  })
})
