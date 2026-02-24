/**
 * GET /api/usuarios/admin/permissoes
 *
 * Lista todas as permissoes. Requer admin.
 */

import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'
import { z } from 'zod'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  return handleSinapseRequest({
    fn: () => fetchSinapse('/usuarios/permissoes/', { accessToken }),
    errorContext: 'Erro ao listar permissoes',
    schema: z.array(permissaoAcessoSchemaListSchema)
  })
})
