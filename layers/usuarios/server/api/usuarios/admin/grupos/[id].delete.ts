/**
 * DELETE /api/usuarios/admin/grupos/:id
 *
 * Remove um grupo. Requer admin.
 */

import { GruposErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/grupos/${id}`, { method: 'DELETE', accessToken }),
    errorContext: GruposErrors.DELETE_FAILED
  })

  return { message: 'Grupo removido' }
})
