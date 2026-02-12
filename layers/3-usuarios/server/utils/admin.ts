/**
 * Utilitarios de administracao (server-side)
 * Helpers para verificar se o usuario e admin
 */

import type { H3Event } from 'h3'

/**
 * Verifica se o usuario autenticado e admin
 * Usa os dados do contexto de auth (injetado pelo middleware 01.auth.ts)
 */
export async function isAdmin(event: H3Event): Promise<boolean> {
  const auth = event.context.auth
  if (!auth?.isAuthenticated || !auth.accessToken) return false

  try {
    const rawUser = await fetchSinapse<{
      grupos?: Array<{ nome: string }>
    }>('/usuarios/me', {
      accessToken: auth.accessToken
    })

    return rawUser.grupos?.some(g => g.nome === 'administradores') ?? false
  } catch {
    return false
  }
}

/**
 * Requer que o usuario seja admin
 * Lanca erro 403 se nao for admin
 */
export async function requireAdmin(event: H3Event): Promise<void> {
  const auth = event.context.auth

  if (!auth?.isAuthenticated || !auth.accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Nao autenticado'
    })
  }

  const admin = await isAdmin(event)
  if (!admin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso restrito a administradores'
    })
  }
}

/**
 * Obtem o access token do contexto de auth
 * Lanca 401 se nao autenticado
 */
export function requireAuth(event: H3Event): string {
  const auth = event.context.auth

  if (!auth?.isAuthenticated || !auth.accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Nao autenticado'
    })
  }

  return auth.accessToken
}
