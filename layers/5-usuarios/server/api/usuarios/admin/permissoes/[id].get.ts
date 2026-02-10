/**
 * GET /api/usuarios/admin/permissoes/:id
 *
 * Retorna detalhes de uma permissao. Requer admin.
 */

import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  try {
    const raw = await fetchSinapse(`/usuarios/permissoes/${id}`, {
      accessToken
    })

    return permissaoAcessoSchemaListSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao buscar permissao'
      })
    }

    logAuthError('Erro ao buscar permissao', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao buscar permissao'
    })
  }
})
