/**
 * POST /api/usuarios/admin/permissoes
 *
 * Cria uma nova permissao. Requer admin.
 */

import { PermissoesErrors } from '#shared/domain/errors'
import { permissaoAcessoSchemaCreateSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaCreateSchema'
import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)
  const data = await validateBody(event, permissaoAcessoSchemaCreateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/usuarios/permissoes/', {
        method: 'POST',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: PermissoesErrors.CREATE_FAILED,
    schema: permissaoAcessoSchemaListSchema
  })
})
