/**
 * PUT /api/usuarios/admin/:id
 *
 * Atualiza um usuario especifico (somente admin).
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'
import { usuarioSchemaUpdateSchema } from '~/generated/sinapse/zod/usuarioSchemaUpdateSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do usuario e obrigatorio'
    })
  }

  const data = await validateBody(event, usuarioSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/${id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      }),
    errorContext: 'Erro ao atualizar usuario',
    schema: usuarioSchemaDetalhesSchema
  })
})
