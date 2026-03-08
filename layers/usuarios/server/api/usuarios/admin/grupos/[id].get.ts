/**
 * GET /api/usuarios/admin/grupos/:id
 *
 * Retorna detalhes de um grupo. Requer admin.
 */

import { GruposErrors } from '#shared/domain/errors'
import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/grupos/${id}`, { accessToken }),
    errorContext: GruposErrors.GET_FAILED,
    schema: grupoSchemaDetalhesSchema
  })
})
