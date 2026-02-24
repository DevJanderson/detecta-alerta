/**
 * PUT /api/usuarios/admin/grupos/:id
 *
 * Atualiza um grupo. Requer admin.
 */

import { grupoSchemaUpdateSchema } from '~/generated/sinapse/zod/grupoSchemaUpdateSchema'
import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')
  const data = await validateBody(event, grupoSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/grupos/${id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: 'Erro ao atualizar grupo',
    schema: grupoSchemaDetalhesSchema
  })
})
