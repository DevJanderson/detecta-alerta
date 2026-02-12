/**
 * GET /api/usuarios/admin/permissoes
 *
 * Lista todas as permissoes. Requer admin.
 */

import { permissaoAcessoSchemaListSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaListSchema'
import { z } from 'zod'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = event.context.auth!.accessToken!

  try {
    const raw = await fetchSinapse('/usuarios/permissoes/', {
      accessToken
    })

    return z.array(permissaoAcessoSchemaListSchema).parse(raw)
  } catch (error: unknown) {
    if (isSinapseError(error)) {
      throw createError({
        statusCode: error.statusCode,
        statusMessage: error.statusMessage || 'Erro ao listar permissoes'
      })
    }

    logAuthError('Erro ao listar permissoes', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao listar permissoes'
    })
  }
})
