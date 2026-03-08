/**
 * GET /api/usuarios/admin
 *
 * Lista usuarios paginados (somente admin).
 * Query params: page, size, nome, email, admin, ativo, cidade, estado, search
 */

import { UsuariosErrors } from '#shared/domain/errors'
import { usuariosPaginadosSchemaSchema } from '#shared/types/sinapse/usuario'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const query = getQuery(event)
  const allowedParams = [
    'page',
    'size',
    'nome',
    'email',
    'admin',
    'ativo',
    'cidade',
    'estado',
    'search'
  ]
  const queryString = buildQueryString(query as Record<string, unknown>, allowedParams)
  const endpoint = `/usuarios/${queryString ? `?${queryString}` : ''}`

  return handleSinapseRequest({
    fn: () => fetchSinapse(endpoint, { accessToken }),
    errorContext: UsuariosErrors.LIST_FAILED,
    schema: usuariosPaginadosSchemaSchema
  })
})
