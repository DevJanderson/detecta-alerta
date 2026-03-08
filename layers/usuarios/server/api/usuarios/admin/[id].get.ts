/**
 * GET /api/usuarios/admin/:id
 *
 * Retorna detalhes de um usuario especifico (somente admin).
 */

import { UsuariosErrors } from '#shared/domain/errors'
import { usuarioSchemaDetalhesSchema } from '#shared/types/sinapse/usuario'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { accessToken }),
    errorContext: UsuariosErrors.GET_FAILED,
    schema: usuarioSchemaDetalhesSchema
  })
})
