/**
 * DELETE /api/usuarios/admin/permissoes/:id
 *
 * Remove uma permissao. Requer admin.
 */

import { PermissoesErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/permissoes/${id}`, { method: 'DELETE', accessToken }),
    errorContext: PermissoesErrors.DELETE_FAILED
  })

  return { message: 'Permissao removida' }
})
