/**
 * POST /api/usuarios/admin/permissoes/usuarios/:userId/add/:permId
 *
 * Adiciona permissao a um usuario. Requer admin.
 */

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const userId = validateRouteParam(event, 'userId')
  const permId = validateRouteParam(event, 'permId')

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
