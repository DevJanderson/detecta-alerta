/**
 * POST /api/usuarios/admin
 *
 * Cria um novo usuario (somente admin).
 */

import { usuarioSchemaCreateSchema } from '~/generated/sinapse/zod/usuarioSchemaCreateSchema'
import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)
  const data = await validateBody(event, usuarioSchemaCreateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/usuarios/', {
        method: 'POST',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: 'Erro ao criar usuario',
    schema: usuarioSchemaDetalhesSchema
  })
})
