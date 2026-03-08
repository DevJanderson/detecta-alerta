/**
 * POST /api/usuarios/admin/grupos
 *
 * Cria um novo grupo. Requer admin.
 */

import { GruposErrors } from '#shared/domain/errors'
import { grupoSchemaCreateSchema, grupoSchemaDetalhesSchema } from '#shared/types/sinapse/grupo'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)
  const data = await validateBody(event, grupoSchemaCreateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/usuarios/grupos/', {
        method: 'POST',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: GruposErrors.CREATE_FAILED,
    schema: grupoSchemaDetalhesSchema
  })
})
