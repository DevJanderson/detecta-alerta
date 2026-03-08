/**
 * DELETE /api/usuarios/admin/permissoes/usuarios/:userId/remove/:permId
 *
 * Remove permissao de um usuario. Requer admin.
 */

import { PermissoesErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const userId = validateRouteParam(event, 'userId')
  const permId = validateRouteParam(event, 'permId')

  await handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/permissoes/usuarios/${userId}/remove/${permId}`, {
        method: 'DELETE',
        accessToken
      }),
    errorContext: PermissoesErrors.REMOVE_FROM_USER_FAILED
  })

  return { message: 'Permissao removida' }
})
