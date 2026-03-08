/**
 * PUT /api/usuarios/admin/:id
 *
 * Atualiza um usuario especifico (somente admin).
 */

import { UsuariosErrors } from '#shared/domain/errors'
import {
  usuarioSchemaDetalhesSchema,
  usuarioSchemaUpdateSchema
} from '#shared/types/sinapse/usuario'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  const data = await validateBody(event, usuarioSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/${id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: UsuariosErrors.UPDATE_FAILED,
    schema: usuarioSchemaDetalhesSchema
  })
})
