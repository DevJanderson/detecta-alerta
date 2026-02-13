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

  const params = new URLSearchParams()
  for (const key of ALLOWED_PARAMS) {
    const value = query[key]
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        for (const v of value) {
          params.append(key, String(v))
        }
      } else {
        params.append(key, String(value))
      }
    }
  }

  const queryString = params.toString()
  const endpoint = `/noticias/${queryString ? `?${queryString}` : ''}`

  try {
    return await fetchSinapse(endpoint, { accessToken })
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar rumores'
      })
    }

    logAuthError('Erro ao listar rumores', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar rumores'
    })
  }
})
