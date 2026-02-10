/**
 * DELETE /api/usuarios/admin/grupos/:id/usuarios/:userId
 *
 * Remove usuario de um grupo. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')
  const userId = getRouterParam(event, 'userId')

  try {
    await fetchSinapse(`/usuarios/grupos/${id}/usuarios/${userId}`, {
      method: 'DELETE',
      accessToken
    })

    return { message: 'Usuario removido do grupo' }
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao remover usuario do grupo'
      })
    }

    logAuthError('Erro ao remover usuario do grupo', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao remover usuario do grupo'
    })
  }
})
