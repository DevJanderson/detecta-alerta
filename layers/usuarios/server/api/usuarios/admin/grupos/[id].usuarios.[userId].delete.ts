/**
 * DELETE /api/usuarios/admin/grupos/:id/usuarios/:userId
 *
 * Remove usuario de um grupo. Requer admin.
 */

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')
  const userId = validateRouteParam(event, 'userId')

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
