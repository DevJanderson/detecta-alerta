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

  await handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/grupos/${id}/usuarios/${userId}`, {
        method: 'DELETE',
        accessToken
      }),
    errorContext: 'Erro ao remover usuario do grupo'
  })

  return { message: 'Usuario removido do grupo' }
})
