/**
 * POST /api/usuarios/admin
 *
 * Cria um novo usuario (somente admin).
 */

import { usuarioSchemaCreateSchema } from '~/generated/sinapse/zod/usuarioSchemaCreateSchema'
import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = requireAuth(event)

  const body = await readBody(event)
  const result = usuarioSchemaCreateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const rawUser = await fetchSinapse('/usuarios/', {
      method: 'POST',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return usuarioSchemaDetalhesSchema.parse(rawUser)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao criar usuario'
      })
    }

    logAuthError('Erro ao criar usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar usuario'
    })
  }
})
