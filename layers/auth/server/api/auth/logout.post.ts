/**
 * POST /api/auth/logout
 *
 * Realiza logout: notifica a API Sinapse e limpa os cookies.
 */

export default defineEventHandler(async event => {
  const accessToken = getAccessToken(event)

  // Tentar notificar a API Sinapse (não bloqueia se falhar)
  if (accessToken) {
    try {
      await fetchSinapse('/auth/logout', {
        method: 'POST',
        accessToken
      })
    } catch (error) {
      // Log seguro - não bloqueia logout local
      logAuthError('Erro ao notificar logout na API', error)
    }
  }

  // Limpar cookies de autenticação (sempre executa)
  clearAuthCookies(event)

  return { success: true, message: 'Logout realizado com sucesso' }
})
