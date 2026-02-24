/**
 * GET /api/usuarios/admin
 *
 * Lista usuarios paginados (somente admin).
 * Query params: page, size, nome, email, admin, ativo, cidade, estado, search
 */

import { usuariosPaginadosSchemaSchema } from '~/generated/sinapse/zod/usuariosPaginadosSchemaSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
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
    errorContext: 'Erro ao listar usuarios',
    schema: usuariosPaginadosSchemaSchema
  })
})
