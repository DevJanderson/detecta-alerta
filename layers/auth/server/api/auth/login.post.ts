/**
 * POST /api/auth/login
 *
 * Realiza login via API Sinapse e armazena tokens em cookies httpOnly.
 * Retorna apenas os dados do usuário (nunca expõe tokens ao cliente).
 */

// Schemas Zod do Kubb (gerados do OpenAPI)
import { loginRequestSchema } from '~/generated/sinapse/zod/loginRequestSchema'
import { tokenSchema } from '~/generated/sinapse/zod/tokenSchema'
import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'

export default defineEventHandler(async event => {
  // Validar body com schema Kubb (via validateBody centralizado)
  const { username, password } = await validateBody(event, loginRequestSchema)

  try {
    // Login na API Sinapse
    const rawTokenResponse = await fetchSinapse('/auth/login', {
      method: 'POST',
      body: { username, password }
    })

    // Validar resposta com schema Kubb (garante que API não mudou)
    const tokenResponse = tokenSchema.parse(rawTokenResponse)

    // Armazenar tokens em cookies httpOnly
    setAuthCookies(event, tokenResponse.access_token, tokenResponse.refresh_token)

    // Buscar e validar dados do usuário
    const rawUser = await fetchSinapse('/usuarios/me', {
      accessToken: tokenResponse.access_token
    })
    const user = usuarioSchemaDetalhesSchema.parse(rawUser)

    logger.info('Login bem-sucedido', { username, userId: user.id })

    return { user }
  } catch (error: unknown) {
    // Limpar cookies em caso de erro
    clearAuthCookies(event)

    // Tratar erros da API Sinapse
    if (isSinapseError(error)) {
      if (error.statusCode === 401 || error.statusCode === 422) {
        logger.warn('Login falhou: credenciais inválidas', { username })
        throw createError({
          statusCode: 401,
          statusMessage: 'Credenciais inválidas'
        })
      }
    }

    logAuthError('Erro ao realizar login', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao realizar login'
    })
  }
})
