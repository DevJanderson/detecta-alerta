/**
 * PUT /api/usuarios/admin/permissoes/:id
 *
 * Atualiza uma permissao. Requer admin.
 */

import { PermissoesErrors } from '#shared/domain/errors'
import { permissaoAcessoSchemaUpdateSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaUpdateSchema'
import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')
  const data = await validateBody(event, permissaoAcessoSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/permissoes/${id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: PermissoesErrors.UPDATE_FAILED,
    schema: permissaoAcessoSchemaListSchema
  })
})
