/**
 * GET /api/usuarios/perfil/me
 *
 * Retorna os dados do usuario autenticado.
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  try {
    const rawUser = await fetchSinapse('/usuarios/me', {
      accessToken
    })

    return usuarioSchemaDetalhesSchema.parse(rawUser)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar perfil'
      })
    }

    logAuthError('Erro ao buscar perfil do usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar perfil'
    })
  }
})
