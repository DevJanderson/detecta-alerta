/**
 * POST /api/auth/signup
 *
 * Cadastro publico de usuario (signup).
 * Nao requer autenticacao.
 */

import { AuthErrors } from '#shared/domain/errors'
import {
  usuarioSchemaSignupSchema,
  usuarioSchemaSignupResponseSchema
} from '#shared/types/sinapse/usuario'

export default defineEventHandler(async event => {
  const data = await validateBody(event, usuarioSchemaSignupSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/usuarios/signup', {
        method: 'POST',
        body: data as Record<string, unknown>
      }),
    errorContext: AuthErrors.SIGNUP_FAILED,
    schema: usuarioSchemaSignupResponseSchema
  })
})
