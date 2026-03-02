/**
 * Utilitarios de administracao (server-side)
 * Helpers para verificar autenticacao e permissao admin
 */

import type { H3Event } from 'h3'

/**
 * Requer que o usuario seja admin.
 * Reutiliza event.context.isAdmin calculado pelo middleware 02.admin.ts
 * para evitar chamada duplicada a API.
 * Lanca 401 se nao autenticado, 403 se nao admin.
 */
export function requireAdmin(event: H3Event): void {
  const auth = event.context.auth

  if (!auth?.isAuthenticated || !auth.accessToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Nao autenticado'
    })
  }

  if (!event.context.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso restrito a administradores'
    })
  }
}

/**
 * Obtem o access token do contexto de auth.
 * Lanca 401 se nao autenticado.
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
