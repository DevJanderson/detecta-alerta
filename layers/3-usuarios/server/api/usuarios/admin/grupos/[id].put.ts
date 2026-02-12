/**
 * PUT /api/usuarios/admin/grupos/:id
 *
 * Atualiza um grupo. Requer admin.
 */

import { grupoSchemaUpdateSchema } from '~/generated/sinapse/zod/grupoSchemaUpdateSchema'
import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  const body = await readBody(event)
  const result = grupoSchemaUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const raw = await fetchSinapse(`/usuarios/grupos/${id}`, {
      method: 'PUT',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return grupoSchemaDetalhesSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao atualizar grupo'
      })
    }

    logAuthError('Erro ao atualizar grupo', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar grupo'
    })
  }
})
