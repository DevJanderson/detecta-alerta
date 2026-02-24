/**
 * POST /api/usuarios/admin/signup
 *
 * Cadastro publico de usuario (signup).
 * Nao requer autenticacao.
 */

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
    errorContext: 'Erro ao realizar cadastro',
    schema: usuarioSchemaSignupResponseSchema
  })
})
