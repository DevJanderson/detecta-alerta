/**
 * GET /api/rumores/operacoes/doencas
 *
 * Lista doencas cadastradas para filtros.
 * Requer autenticacao (API Sinapse exige token).
 */

import { z } from 'zod'
import { doencaSchema } from '~/generated/sinapse/zod/doencaSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/noticias/operacoes/doencas', { accessToken }),
    errorContext: 'Erro ao listar doencas',
    schema: z.array(doencaSchema)
  })
})
