/**
 * DELETE /api/usuarios/admin/grupos/:id
 *
 * Remove um grupo. Requer admin.
 */

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/grupos/${id}`, { method: 'DELETE', accessToken }),
    errorContext: 'Erro ao remover grupo'
  })

  return { message: 'Grupo removido' }
})
