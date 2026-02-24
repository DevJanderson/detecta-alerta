/**
 * GET /api/usuarios/admin/grupos
 *
 * Lista grupos paginados. Requer admin.
 */

import { gruposPaginadosSchemaSchema } from '~/generated/sinapse/zod/gruposPaginadosSchemaSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

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
    errorContext: 'Erro ao listar grupos',
    schema: gruposPaginadosSchemaSchema
  })
})
