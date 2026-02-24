/**
 * GET /api/usuarios/admin/:id
 *
 * Retorna detalhes de um usuario especifico (somente admin).
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

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

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { accessToken }),
    errorContext: 'Erro ao buscar usuario',
    schema: usuarioSchemaDetalhesSchema
  })
})
