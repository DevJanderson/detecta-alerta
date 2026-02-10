/**
 * POST /api/usuarios/admin/signup
 *
 * Cadastro publico de usuario (signup).
 * Nao requer autenticacao.
 */

import { usuarioSchemaSignupResponseSchema } from '~/generated/sinapse/zod/usuarioSchemaSignupResponseSchema'
import { usuarioSchemaSignupSchema } from '~/generated/sinapse/zod/usuarioSchemaSignupSchema'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const result = usuarioSchemaSignupSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const rawResponse = await fetchSinapse('/usuarios/signup', {
      method: 'POST',
      body: result.data as Record<string, unknown>
    })

    return usuarioSchemaSignupResponseSchema.parse(rawResponse)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao realizar cadastro'
      })
    }

    logAuthError('Erro ao realizar signup', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao realizar cadastro'
    })
  }
})
