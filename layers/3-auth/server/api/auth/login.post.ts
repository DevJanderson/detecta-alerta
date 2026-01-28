import { z } from 'zod'

/**
 * POST /api/auth/login
 *
 * Realiza login via API Sinapse e armazena tokens em cookies httpOnly.
 * Retorna apenas os dados do usuário (nunca expõe tokens ao cliente).
 */

const loginSchema = z.object({
  username: z.string().min(1, 'Email ou username é obrigatório').max(255),
  password: z.string().min(1, 'Senha é obrigatória').max(128)
})

export default defineEventHandler(async event => {
  // Validar body
  const body = await readBody(event)
  const result = loginSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Dados inválidos',
      data: result.error.flatten()
    })
  }

  const { username, password } = result.data

  try {
    // Login na API Sinapse
    const tokenResponse = await fetchSinapse<TokenResponse>('/auth/login', {
      method: 'POST',
      body: { username, password }
    })

    // Armazenar tokens em cookies httpOnly
    setAuthCookies(event, tokenResponse.access_token, tokenResponse.refresh_token)

    // Buscar dados do usuário
    const user = await fetchSinapse('/usuarios/me', {
      accessToken: tokenResponse.access_token
    })

    return { user }
  } catch (error: unknown) {
    // Limpar cookies em caso de erro
    clearAuthCookies(event)

    // Tratar erros da API Sinapse
    if (isSinapseError(error)) {
      if (error.statusCode === 401 || error.statusCode === 422) {
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
