/**
 * GET /api/usuarios/admin/grupos
 *
 * Lista grupos paginados. Requer admin.
 */

import { GruposErrors } from '#shared/domain/errors'
import { gruposPaginadosSchemaSchema } from '#shared/types/sinapse/grupo'

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const query = getQuery(event)
  const queryString = buildQueryString(query as Record<string, unknown>, [
    'page',
    'size',
    'search',
    'ativo'
  ])
  const endpoint = `/usuarios/grupos/${queryString ? `?${queryString}` : ''}`

  return handleSinapseRequest({
    fn: () => fetchSinapse(endpoint, { accessToken }),
    errorContext: GruposErrors.LIST_FAILED,
    schema: gruposPaginadosSchemaSchema
  })
})
