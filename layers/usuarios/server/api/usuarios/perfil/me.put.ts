/**
 * PUT /api/usuarios/perfil/me
 *
 * Atualiza os dados do usuario autenticado.
 * Busca o ID do usuario via /usuarios/me e depois atualiza.
 */

import { UsuariosErrors } from '#shared/domain/errors'
import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'
import { usuarioSchemaUpdateSchema } from '~/generated/sinapse/zod/usuarioSchemaUpdateSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const data = await validateBody(event, usuarioSchemaUpdateSchema)

  return handleSinapseRequest({
    fn: async () => {
      // Buscar ID do usuario autenticado
      const rawMe = await fetchSinapse<{ id: number }>('/usuarios/me', {
        accessToken
      })

      // Atualizar perfil com objeto completo
      return fetchSinapse(`/usuarios/${rawMe.id}`, {
        method: 'PUT',
        body: data as Record<string, unknown>,
        accessToken
      })
    },
    errorContext: UsuariosErrors.PROFILE_UPDATE_FAILED,
    schema: usuarioSchemaDetalhesSchema
  })
})
