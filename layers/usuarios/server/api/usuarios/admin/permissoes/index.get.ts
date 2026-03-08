/**
 * GET /api/usuarios/admin/permissoes
 *
 * Lista todas as permissoes. Requer admin.
 */

import { PermissoesErrors } from '#shared/domain/errors'
import { permissaoAcessoSchemaListSchema } from '#shared/types/sinapse/permissao'
import { z } from 'zod'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/usuarios/permissoes/', { accessToken }),
    errorContext: PermissoesErrors.LIST_FAILED,
    schema: z.array(permissaoAcessoSchemaListSchema)
  })
})
