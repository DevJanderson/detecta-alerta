/**
 * POST /api/usuarios/admin/grupos
 *
 * Cria um novo grupo. Requer admin.
 */

import { grupoSchemaCreateSchema } from '~/generated/sinapse/zod/grupoSchemaCreateSchema'
import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

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
    errorContext: 'Erro ao criar grupo',
    schema: grupoSchemaDetalhesSchema
  })
})
