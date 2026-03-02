/**
 * GET /api/rumores/operacoes/sintomas
 *
 * Lista sintomas cadastrados para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

import { z } from 'zod'
import { sintomaSchema } from '~/generated/sinapse/zod/sintomaSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/noticias/operacoes/sintomas', { accessToken }),
    errorContext: 'Erro ao listar sintomas',
    schema: z.array(sintomaSchema)
  })
})
