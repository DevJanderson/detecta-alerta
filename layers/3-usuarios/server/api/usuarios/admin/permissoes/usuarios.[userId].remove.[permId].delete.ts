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

  await handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/permissoes/usuarios/${userId}/remove/${permId}`, {
        method: 'DELETE',
        accessToken
      }),
    errorContext: 'Erro ao remover permissao'
  })

  return { message: 'Permissao removida' }
})
