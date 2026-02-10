/**
 * GET /api/usuarios/admin/grupos/:id
 *
 * Retorna detalhes de um grupo. Requer admin.
 */

import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  try {
    const raw = await fetchSinapse(`/usuarios/grupos/${id}`, {
      accessToken
    })

    return grupoSchemaDetalhesSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar grupo'
      })
    }

    logAuthError('Erro ao buscar grupo', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar grupo'
    })
  }
})
