/**
 * DELETE /api/usuarios/admin/permissoes/:id
 *
 * Remove uma permissao. Requer admin.
 */

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/permissoes/${id}`, { method: 'DELETE', accessToken }),
    errorContext: 'Erro ao remover permissao'
  })

  return { message: 'Permissao removida' }
})
