/**
 * POST /api/usuarios/admin/permissoes/usuarios/:userId/add/:permId
 *
 * Adiciona permissao a um usuario. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const userId = getRouterParam(event, 'userId')
  const permId = getRouterParam(event, 'permId')

  await handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/permissoes/usuarios/${userId}/add/${permId}`, {
        method: 'POST',
        accessToken
      }),
    errorContext: 'Erro ao adicionar permissao'
  })

  return { message: 'Permissao adicionada' }
})
