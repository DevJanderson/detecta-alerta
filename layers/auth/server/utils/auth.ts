/**
 * Utilitários de autenticação (server-side)
 * Helpers para manipulação de JWT e cookies
 */

import type { H3Event } from 'h3'
import type { JwtPayload } from '../../app/composables/types'
import { AuthErrors } from '#shared/domain/errors'

// Tipos e schemas do Kubb (gerados do OpenAPI da API Sinapse)
import type { Token } from '~/generated/sinapse/types/Token'
import { tokenSchema } from '~/generated/sinapse/zod/tokenSchema'

// ============================================================================
// CONSTANTES
// ============================================================================

const ACCESS_TOKEN_COOKIE = 'access_token'
const REFRESH_TOKEN_COOKIE = 'refresh_token'
const REFRESH_MARGIN_SECONDS = 5 * 60 // 5 minutos antes de expirar
const DEFAULT_FETCH_TIMEOUT = 15000 // 15 segundos

// ============================================================================
// TIPOS
// ============================================================================

/**
 * Erro retornado pela API Sinapse
 */
export interface SinapseError {
  statusCode: number
  statusMessage?: string
  data?: unknown
}

/**
 * Alias para tipo de resposta de tokens (do Kubb)
 */
export type TokenResponse = Token

/**
 * Type guard para verificar se é um erro da API Sinapse
 */
export function isSinapseError(error: unknown): error is SinapseError {
  return (
    error !== null &&
    typeof error === 'object' &&
    'statusCode' in error &&
    typeof (error as SinapseError).statusCode === 'number'
  )
}

/**
 * Log de erro seguro (não expõe detalhes em produção)
 */
export function logAuthError(context: string, error: unknown): void {
  if (process.env.NODE_ENV !== 'production') {
    logger.error(`[Auth] ${context}:`, error)
  } else {
    // Em produção, log apenas contexto sem detalhes sensíveis
    logger.error(`[Auth] ${context}`)
  }
}

/**
 * Decodifica um token JWT (sem verificar assinatura)
 * A verificação é feita pela API Sinapse
 */
export function parseJwt(token: string): JwtPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = parts[1]
    if (!payload) return null

    // Decodifica base64url para base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8')

    return JSON.parse(jsonPayload) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Verifica se o token está expirado ou próximo de expirar
 */
export function isTokenExpired(token: string, marginSeconds: number = 0): boolean {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return true

  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now + marginSeconds
}

/**
 * Verifica se o token precisa ser renovado (expirado ou próximo de expirar)
 */
export function shouldRefreshToken(token: string): boolean {
  return isTokenExpired(token, REFRESH_MARGIN_SECONDS)
}

/**
 * Obtém o access token do cookie
 */
export function getAccessToken(event: H3Event): string | null {
  return getCookie(event, ACCESS_TOKEN_COOKIE) || null
}

/**
 * Obtém o refresh token do cookie
 */
export function getRefreshToken(event: H3Event): string | null {
  return getCookie(event, REFRESH_TOKEN_COOKIE) || null
}

/**
 * Define os cookies de autenticação
 */
export function setAuthCookies(event: H3Event, accessToken: string, refreshToken: string): void {
  const isProduction = process.env.NODE_ENV === 'production'

  // Access token - vida curta
  setCookie(event, ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/'
    // Não definir maxAge - expira com a sessão do navegador
    // A API controla a expiração via JWT
  })

  // Refresh token - vida mais longa
  setCookie(event, REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 dias
  })
}

/**
 * Remove os cookies de autenticação
 */
export function clearAuthCookies(event: H3Event): void {
  deleteCookie(event, ACCESS_TOKEN_COOKIE, { path: '/' })
  deleteCookie(event, REFRESH_TOKEN_COOKIE, { path: '/' })
}

/**
 * Obtém a URL base da API Sinapse
 */
export function getSinapseApiUrl(): string {
  const config = useRuntimeConfig()
  const url = config.sinapseApiUrl as string

  if (!url) {
    throw createError({
      statusCode: 500,
      statusMessage: AuthErrors.CONFIG_MISSING
    })
  }

  return url
}

/**
 * Cria headers de autorização para a API Sinapse
 */
export function createAuthHeaders(accessToken: string): Record<string, string> {
  return {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
}

// ============================================================================
// REFRESH DE TOKENS (centralizado)
// ============================================================================

/**
 * Resultado da tentativa de refresh de tokens
 */
export interface RefreshResult {
  success: boolean
  accessToken?: string
  error?: string
}

/**
 * Tenta renovar os tokens de autenticação.
 * Função centralizada para evitar duplicação de código.
 *
 * @returns RefreshResult com o novo access token ou erro
 */
export async function tryRefreshTokens(event: H3Event): Promise<RefreshResult> {
  const accessToken = getAccessToken(event)

  // Sem token ou token ainda válido
  if (!accessToken || !shouldRefreshToken(accessToken)) {
    return { success: true, accessToken: accessToken || undefined }
  }

  const refreshToken = getRefreshToken(event)

  // Sem refresh token - não conseguimos renovar
  if (!refreshToken) {
    clearAuthCookies(event)
    return { success: false, error: AuthErrors.REFRESH_TOKEN_MISSING }
  }

  try {
    const sinapseApiUrl = getSinapseApiUrl()

    const rawResponse = await $fetch(`${sinapseApiUrl}/auth/refresh`, {
      method: 'POST',
      body: { refresh_token: refreshToken },
      timeout: DEFAULT_FETCH_TIMEOUT
    })

    // Validar resposta com schema Kubb (garante que API não mudou)
    const tokenResponse = tokenSchema.parse(rawResponse)

    // Atualizar cookies com novos tokens
    setAuthCookies(event, tokenResponse.access_token, tokenResponse.refresh_token)

    logger.debug('Token renovado com sucesso')

    return { success: true, accessToken: tokenResponse.access_token }
  } catch (error) {
    logAuthError('Falha ao renovar tokens', error)
    clearAuthCookies(event)
    return { success: false, error: AuthErrors.SESSION_EXPIRED }
  }
}

// ============================================================================
// FETCH COM TIMEOUT
// ============================================================================

/**
 * Opções para fetchSinapse
 */
interface FetchSinapseOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  body?: Record<string, unknown> | FormData
  accessToken?: string
  timeout?: number
}

/**
 * Fetch para API Sinapse com timeout e headers padrão.
 * Suporta JSON (default) e FormData (upload).
 */
export async function fetchSinapse<T = unknown>(
  endpoint: string,
  options: FetchSinapseOptions = {}
): Promise<T> {
  const sinapseApiUrl = getSinapseApiUrl()
  const { method = 'GET', body, accessToken, timeout = DEFAULT_FETCH_TIMEOUT } = options

  const headers: Record<string, string> = {}

  // FormData: browser/runtime define Content-Type com boundary automaticamente
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const response = await $fetch(`${sinapseApiUrl}${endpoint}`, {
    method,
    body,
    headers,
    timeout
  })

  return response as T
}
