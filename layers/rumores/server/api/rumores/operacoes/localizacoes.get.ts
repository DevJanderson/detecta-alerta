/**
 * GET /api/rumores/operacoes/localizacoes
 *
 * Lista localizacoes cadastradas para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

import { z } from 'zod'
import { regiaoSchema } from '~/generated/sinapse/zod/regiaoSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/noticias/operacoes/localizacoes', { accessToken }),
    errorContext: 'Erro ao listar localizacoes',
    schema: z.array(regiaoSchema)
  })
})
