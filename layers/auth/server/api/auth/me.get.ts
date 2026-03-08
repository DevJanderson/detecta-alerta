/**
 * GET /api/auth/me
 *
 * Retorna os dados do usuário autenticado.
 * Usado para inicializar o estado de autenticação no cliente.
 */

import { usuarioSchemaDetalhesSchema } from '#shared/types/sinapse/usuario'

export default defineEventHandler(async event => {
  // Tentar renovar tokens se necessário (lógica centralizada)
  const refreshResult = await tryRefreshTokens(event)

  if (!refreshResult.success) {
    // Tokens expirados/inválidos - retorna null (não é erro)
    return { user: null }
  }

  if (!refreshResult.accessToken) {
    // Sem token - não está autenticado
    return { user: null }
  }

  // Buscar dados do usuário com o token válido
  try {
    const rawUser = await fetchSinapse('/usuarios/me', {
      accessToken: refreshResult.accessToken
    })

    const user = usuarioSchemaDetalhesSchema.parse(rawUser)
    return { user }
  } catch (error: unknown) {
    if (isSinapseError(error) && error.statusCode === 401) {
      // Token inválido na API Sinapse - limpa cookies
      clearAuthCookies(event)
      return { user: null }
    }

    // Outros erros - log seguro e retorna null
    logAuthError('Erro ao buscar dados do usuário', error)
    return { user: null }
  }
})
