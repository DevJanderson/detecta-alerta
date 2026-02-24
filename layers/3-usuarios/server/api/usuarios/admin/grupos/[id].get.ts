/**
 * GET /api/usuarios/admin/grupos/:id
 *
 * Retorna detalhes de um grupo. Requer admin.
 */

import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/grupos/${id}`, { accessToken }),
    errorContext: 'Erro ao buscar grupo',
    schema: grupoSchemaDetalhesSchema
  })
})
