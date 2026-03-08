/**
 * DELETE /api/usuarios/admin/:id
 *
 * Remove um usuario especifico (somente admin).
 */

import { UsuariosErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { method: 'DELETE', accessToken }),
    errorContext: UsuariosErrors.DELETE_FAILED
  })

  return { message: 'Usuario removido' }
})
