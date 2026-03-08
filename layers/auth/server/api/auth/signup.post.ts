/**
 * POST /api/auth/signup
 *
 * Cadastro publico de usuario (signup).
 * Nao requer autenticacao.
 */

import { AuthErrors } from '#shared/domain/errors'
import { usuarioSchemaSignupResponseSchema } from '~/generated/sinapse/zod/usuarioSchemaSignupResponseSchema'
import { usuarioSchemaSignupSchema } from '~/generated/sinapse/zod/usuarioSchemaSignupSchema'

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
