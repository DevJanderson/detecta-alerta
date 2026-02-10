/**
 * POST /api/usuarios/admin/grupos/:id/usuarios/:userId
 *
 * Adiciona usuario a um grupo. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')
  const userId = getRouterParam(event, 'userId')

  try {
    await fetchSinapse(`/usuarios/grupos/${id}/usuarios/${userId}`, {
      method: 'POST',
      accessToken
    })

    return { message: 'Usuario adicionado ao grupo' }
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao adicionar usuario ao grupo'
      })
    }

    logAuthError('Erro ao adicionar usuario ao grupo', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao adicionar usuario ao grupo'
    })
  }
})
