/**
 * DELETE /api/usuarios/admin/:id
 *
 * Remove um usuario especifico (somente admin).
 */

export default defineEventHandler(async event => {
  requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = validateRouteParam(event, 'id')

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { method: 'DELETE', accessToken }),
    errorContext: 'Erro ao remover usuario'
  })

  return { message: 'Usuario removido' }
})
