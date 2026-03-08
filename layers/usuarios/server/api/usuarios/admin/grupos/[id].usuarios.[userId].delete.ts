/**
 * DELETE /api/usuarios/admin/grupos/:id/usuarios/:userId
 *
 * Remove usuario de um grupo. Requer admin.
 */

import { GruposErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')
  const userId = validateRouteParam(event, 'userId')

  await handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/grupos/${id}/usuarios/${userId}`, {
        method: 'DELETE',
        accessToken
      }),
    errorContext: GruposErrors.REMOVE_USER_FAILED
  })

  return { message: 'Usuario removido do grupo' }
})
