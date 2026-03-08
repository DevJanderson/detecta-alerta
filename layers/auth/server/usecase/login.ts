/**
 * Use Case — Login
 *
 * Função pura que encapsula a lógica de autenticação.
 * Extraída do server route para ser testável sem HTTP.
 *
 * Responsabilidades:
 * 1. Chamar API Sinapse com credenciais
 * 2. Validar resposta com Zod
 * 3. Buscar dados do usuário
 * 4. Retornar Result tipado (sem throw)
 */

import type { H3Event } from 'h3'
import { ok, fail } from '#shared/domain/result'
import type { Result } from '#shared/domain/result'
import { AuthErrors } from '#shared/domain/errors'
import { tokenSchema } from '~/generated/sinapse/zod/tokenSchema'
import { usuarioSchemaDetalhesSchema } from '~/generated/sinapse/zod/usuarioSchemaDetalhesSchema'
import type { UsuarioSchemaDetalhes } from '~/generated/sinapse/types/UsuarioSchemaDetalhes'

export interface LoginInput {
  username: string
  password: string
}

export interface LoginOutput {
  user: UsuarioSchemaDetalhes
  accessToken: string
  refreshToken: string
}

export async function executeLogin(input: LoginInput): Promise<Result<LoginOutput>> {
  try {
    // 1. Login na API Sinapse
    const rawTokenResponse = await fetchSinapse('/auth/login', {
      method: 'POST',
      body: { username: input.username, password: input.password }
    })

    // 2. Validar resposta de tokens
    const tokenResponse = tokenSchema.parse(rawTokenResponse)

    // 3. Buscar dados do usuário com novo token
    const rawUser = await fetchSinapse('/usuarios/me', {
      accessToken: tokenResponse.access_token
    })
    const user = usuarioSchemaDetalhesSchema.parse(rawUser)

    return ok({
      user,
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token
    })
  } catch (error: unknown) {
    // Credenciais inválidas (401/422 da Sinapse)
    if (isSinapseError(error)) {
      if (error.statusCode === 401 || error.statusCode === 422) {
        return fail(AuthErrors.INVALID_CREDENTIALS)
      }
    }

    // Erro inesperado
    logAuthError(AuthErrors.LOGIN_FAILED, error)
    return fail(AuthErrors.LOGIN_FAILED)
  }
}

/**
 * Adapter HTTP — converte Result do use case em resposta H3
 * Usado pelo server route para separar lógica de transporte
 */
export function handleLoginResult(
  event: H3Event,
  result: Result<LoginOutput>
): { user: UsuarioSchemaDetalhes } {
  if (!result.ok) {
    clearAuthCookies(event)
    const statusCode = result.error === AuthErrors.INVALID_CREDENTIALS ? 401 : 500
    throw createError({ statusCode, statusMessage: result.error })
  }

  setAuthCookies(event, result.value.accessToken, result.value.refreshToken)
  logger.info('Login bem-sucedido', {
    username: result.value.user.email,
    userId: result.value.user.id
  })

  return { user: result.value.user }
}
