/**
 * GET /api/usuarios/perfil/me
 *
 * Retorna os dados do usuario autenticado.
 */

import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)

  return handleSinapseRequest({
    fn: () => fetchSinapse('/usuarios/me', { accessToken }),
    errorContext: 'Erro ao buscar perfil',
    schema: usuarioSchemaDetalhesSchema
  })
})
