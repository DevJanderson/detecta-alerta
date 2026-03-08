/**
 * GET /api/usuarios/admin/permissoes/:id
 *
 * Retorna detalhes de uma permissao. Requer admin.
 */

import { PermissoesErrors } from '#shared/domain/errors'
import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/permissoes/${id}`, { accessToken }),
    errorContext: PermissoesErrors.GET_FAILED,
    schema: permissaoAcessoSchemaListSchema
  })
})
