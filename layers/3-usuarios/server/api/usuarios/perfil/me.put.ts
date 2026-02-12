/**
 * PUT /api/usuarios/perfil/me
 *
 * Atualiza os dados do usuario autenticado.
 * Busca o ID do usuario via /usuarios/me e depois atualiza.
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'
import { usuarioSchemaUpdateSchema } from '~/generated/sinapse/zod/usuarioSchemaUpdateSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  const body = await readBody(event)
  const result = usuarioSchemaUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    // Buscar ID do usuario autenticado
    const rawMe = await fetchSinapse<{ id: number }>('/usuarios/me', {
      accessToken
    })

    // Atualizar perfil com objeto completo
    const rawUser = await fetchSinapse(`/usuarios/${rawMe.id}`, {
      method: 'PUT',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return usuarioSchemaDetalhesSchema.parse(rawUser)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao atualizar perfil'
      })
    }

    logAuthError('Erro ao atualizar perfil do usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar perfil'
    })
  }
})
