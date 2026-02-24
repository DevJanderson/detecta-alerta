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

  await handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/grupos/${id}/usuarios/${userId}`, {
        method: 'POST',
        accessToken
      }),
    errorContext: 'Erro ao adicionar usuario ao grupo'
  })

  return { message: 'Usuario adicionado ao grupo' }
})
