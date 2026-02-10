/**
 * PUT /api/usuarios/admin/permissoes/:id
 *
 * Atualiza uma permissao. Requer admin.
 */

import { permissaoAcessoSchemaUpdateSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaUpdateSchema'
import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const id = getRouterParam(event, 'id')

  const body = await readBody(event)
  const result = permissaoAcessoSchemaUpdateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const raw = await fetchSinapse(`/usuarios/permissoes/${id}`, {
      method: 'PUT',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return permissaoAcessoSchemaListSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao atualizar permissao'
      })
    }

    logAuthError('Erro ao atualizar permissao', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar permissao'
    })
  }
})
