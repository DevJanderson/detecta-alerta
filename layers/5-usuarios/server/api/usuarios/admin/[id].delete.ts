/**
 * DELETE /api/usuarios/admin/:id
 *
 * Remove um usuario especifico (somente admin).
 */

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
    await fetchSinapse(`/usuarios/${id}`, {
      method: 'DELETE',
      accessToken
    })

    return { message: 'Usuario removido' }
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao remover usuario'
      })
    }

    logAuthError('Erro ao remover usuario', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao remover usuario'
    })
  }
})
