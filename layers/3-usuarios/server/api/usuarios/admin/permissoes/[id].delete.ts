/**
 * DELETE /api/usuarios/admin/permissoes/:id
 *
 * Remove uma permissao. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/permissoes/${id}`, { method: 'DELETE', accessToken }),
    errorContext: 'Erro ao remover permissao'
  })

  return { message: 'Permissao removida' }
})
