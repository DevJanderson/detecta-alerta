/**
 * GET /api/usuarios/perfil/me
 *
 * Retorna os dados do usuario autenticado.
 */

import { UsuariosErrors } from '#shared/domain/errors'
import { usuarioSchemaDetalhesSchema } from '#shared/types/sinapse/usuario'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/usuarios/me', { accessToken }),
    errorContext: UsuariosErrors.PROFILE_FETCH_FAILED,
    schema: usuarioSchemaDetalhesSchema
  })
})
