/**
 * DELETE /api/usuarios/admin/permissoes/:id
 *
 * Remove uma permissao. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  try {
    await fetchSinapse(`/usuarios/permissoes/${id}`, {
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

    logAuthError('Erro ao remover permissao', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao remover permissao'
    })
  }
})
