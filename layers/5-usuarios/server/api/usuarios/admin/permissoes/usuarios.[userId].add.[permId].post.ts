/**
 * POST /api/usuarios/admin/permissoes/usuarios/:userId/add/:permId
 *
 * Adiciona permissao a um usuario. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const userId = getRouterParam(event, 'userId')
  const permId = getRouterParam(event, 'permId')

  try {
    await fetchSinapse(`/usuarios/permissoes/usuarios/${userId}/add/${permId}`, {
      method: 'POST',
      accessToken
    })

    return { message: 'Permissao adicionada' }
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao adicionar permissao'
      })
    }

    logAuthError('Erro ao adicionar permissao ao usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao adicionar permissao'
    })
  }
})
