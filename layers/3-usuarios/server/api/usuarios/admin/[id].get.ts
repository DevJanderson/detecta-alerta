/**
 * GET /api/usuarios/admin/:id
 *
 * Retorna detalhes de um usuario especifico (somente admin).
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do usuario e obrigatorio'
    })
  }

  try {
    const rawUser = await fetchSinapse(`/usuarios/${id}`, {
      accessToken
    })

    return usuarioSchemaDetalhesSchema.parse(rawUser)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar usuario'
      })
    }

    logAuthError('Erro ao buscar usuario por ID', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar usuario'
    })
  }
})
