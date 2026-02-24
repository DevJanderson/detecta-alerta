/**
 * DELETE /api/usuarios/admin/grupos/:id
 *
 * Remove um grupo. Requer admin.
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/grupos/${id}`, { method: 'DELETE', accessToken }),
    errorContext: 'Erro ao remover grupo'
  })

  return { message: 'Grupo removido' }
})
