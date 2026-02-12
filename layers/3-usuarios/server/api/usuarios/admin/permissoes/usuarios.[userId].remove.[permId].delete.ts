/**
 * DELETE /api/usuarios/admin/permissoes/usuarios/:userId/remove/:permId
 *
 * Remove permissao de um usuario. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const userId = getRouterParam(event, 'userId')
  const permId = getRouterParam(event, 'permId')

  try {
    await fetchSinapse(`/usuarios/permissoes/usuarios/${userId}/remove/${permId}`, {
      method: 'DELETE',
      accessToken
    })

    return { message: 'Permissao removida' }
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao remover permissao'
      })
    }

    logAuthError('Erro ao remover permissao do usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao remover permissao'
    })
  }
})
