/**
 * GET /api/usuarios/admin/:id
 *
 * Retorna detalhes de um usuario especifico (somente admin).
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  return handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { accessToken }),
    errorContext: 'Erro ao buscar usuario',
    schema: usuarioSchemaDetalhesSchema
  })
})
