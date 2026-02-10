/**
 * Server Middleware - Admin Check
 *
 * EXECUCAO: Antes de cada request no servidor (apos 01.auth.ts)
 *
 * RESPONSABILIDADES:
 * 1. Verifica se o usuario autenticado e admin
 * 2. Injeta event.context.isAdmin no contexto
 *
 * O prefixo "02." garante execucao apos o middleware de auth.
 */

export default defineEventHandler(async event => {
  const path = getRequestURL(event).pathname

  // Apenas verificar em rotas de admin
  if (!path.startsWith('/api/usuarios/admin')) {
    return
  }

  const auth = event.context.auth
  if (!auth?.isAuthenticated || !auth.accessToken) {
    event.context.isAdmin = false
    return
  }

  try {
    const rawUser = await fetchSinapse<{
      grupos?: Array<{ nome: string }>
    }>('/usuarios/me', {
      accessToken: auth.accessToken
    })

    event.context.isAdmin = rawUser.grupos?.some(g => g.nome === 'administradores') ?? false
  } catch {
    event.context.isAdmin = false
  }
})

// Tipos para o contexto
declare module 'h3' {
  interface H3EventContext {
    isAdmin?: boolean
  }
}
