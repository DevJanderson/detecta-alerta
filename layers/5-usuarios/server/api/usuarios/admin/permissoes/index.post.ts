/**
 * POST /api/usuarios/admin/permissoes
 *
 * Cria uma nova permissao. Requer admin.
 */

import { permissaoAcessoSchemaCreateSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaCreateSchema'
import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  const body = await readBody(event)
  const result = permissaoAcessoSchemaCreateSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados invalidos'
    })
  }

  try {
    const raw = await fetchSinapse('/usuarios/permissoes/', {
      method: 'POST',
      body: result.data as Record<string, unknown>,
      accessToken
    })

    return permissaoAcessoSchemaListSchema.parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao criar permissao'
      })
    }

    logAuthError('Erro ao criar permissao', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar permissao'
    })
  }
})
