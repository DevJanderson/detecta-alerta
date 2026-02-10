/**
 * PUT /api/usuarios/admin/:id
 *
 * Atualiza um usuario especifico (somente admin).
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'
import { usuarioSchemaUpdateSchema } from '~/generated/sinapse/zod/usuarioSchemaUpdateSchema'

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

  const body = await readBody(event)
  const result = usuarioSchemaUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const rawUser = await fetchSinapse(`/usuarios/${id}`, {
      method: 'PUT',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return usuarioSchemaDetalhesSchema.parse(rawUser)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao atualizar usuario'
      })
    }

    logAuthError('Erro ao atualizar usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar usuario'
    })
  }
})
