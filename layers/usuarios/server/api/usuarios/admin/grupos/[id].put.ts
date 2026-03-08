/**
 * PUT /api/usuarios/admin/grupos/:id
 *
 * Atualiza um grupo. Requer admin.
 */

import { GruposErrors } from '#shared/domain/errors'
import { grupoSchemaUpdateSchema } from '~/generated/sinapse/zod/grupoSchemaUpdateSchema'
import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')
  const data = await validateBody(event, grupoSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/grupos/${id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: GruposErrors.UPDATE_FAILED,
    schema: grupoSchemaDetalhesSchema
  })
})
