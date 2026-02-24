/**
 * DELETE /api/usuarios/admin/:id
 *
 * Remove um usuario especifico (somente admin).
 */

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = requireAuth(event)

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do usuario e obrigatorio'
    })
  }

  await handleSinapseRequest({
    fn: () => fetchSinapse(`/usuarios/${id}`, { method: 'DELETE', accessToken }),
    errorContext: 'Erro ao remover usuario'
  })

  return { message: 'Usuario removido' }
})
