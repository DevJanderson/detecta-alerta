/**
 * POST /api/usuarios/admin/grupos
 *
 * Cria um novo grupo. Requer admin.
 */

import { grupoSchemaCreateSchema } from '~/generated/sinapse/zod/grupoSchemaCreateSchema'
import { grupoSchemaDetalhesSchema } from '~/generated/sinapse/zod/grupoSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const body = await readBody(event)
  const result = grupoSchemaCreateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const raw = await fetchSinapse('/usuarios/grupos/', {
      method: 'POST',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return grupoSchemaDetalhesSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao criar grupo'
      })
    }

    logAuthError('Erro ao criar grupo', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar grupo'
    })
  }
})
