/**
 * GET /api/usuarios/admin/permissoes/:id
 *
 * Retorna detalhes de uma permissao. Requer admin.
 */

import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/permissoes/${id}`, { accessToken }),
    errorContext: 'Erro ao buscar permissao',
    schema: permissaoAcessoSchemaListSchema
  })
})
