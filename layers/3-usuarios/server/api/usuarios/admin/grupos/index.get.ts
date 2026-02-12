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

  try {
    // Construir query string manualmente (fetchSinapse nao suporta query)
    const params = new URLSearchParams()
    if (query.page) params.set('page', String(query.page))
    if (query.size) params.set('size', String(query.size))
    if (query.search) params.set('search', String(query.search))
    if (query.ativo !== undefined) params.set('ativo', String(query.ativo))
    const qs = params.toString()
    const endpoint = `/usuarios/grupos/${qs ? `?${qs}` : ''}`

    const raw = await fetchSinapse(endpoint, {
      accessToken
    })

    return gruposPaginadosSchemaSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar grupos'
      })
    }

    logAuthError('Erro ao listar grupos', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar grupos'
    })
  }
})
