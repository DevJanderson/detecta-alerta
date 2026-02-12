/**
 * DELETE /api/usuarios/admin/grupos/:id
 *
 * Remove um grupo. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  try {
    await fetchSinapse(`/usuarios/grupos/${id}`, {
      method: 'DELETE',
      accessToken
    })

    return { message: 'Grupo removido' }
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao remover grupo'
      })
    }

    logAuthError('Erro ao remover grupo', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao remover grupo'
    })
  }
})
