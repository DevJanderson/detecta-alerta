/**
 * GET /api/usuarios/admin/grupos/:id
 *
 * Retorna detalhes de um grupo. Requer admin.
 */

import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/grupos/${id}`, { accessToken }),
    errorContext: 'Erro ao buscar grupo',
    schema: grupoSchemaDetalhesSchema
  })
})
