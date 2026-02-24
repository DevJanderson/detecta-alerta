/**
 * PUT /api/usuarios/admin/permissoes/:id
 *
 * Atualiza uma permissao. Requer admin.
 */

import { permissaoAcessoSchemaUpdateSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaUpdateSchema'
import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')
  const data = await validateBody(event, permissaoAcessoSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/permissoes/${id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: 'Erro ao atualizar permissao',
    schema: permissaoAcessoSchemaListSchema
  })
})
