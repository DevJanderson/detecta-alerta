import { z } from 'zod'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LoginRequest = {
  username: string
  password: string
}

export type Token = {
  access_token: string
  refresh_token: string
  token_type?: string
}

export type RefreshTokenRequest = {
  refresh_token: string
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const loginRequestSchema = z.object({
  username: z.string(),
  password: z.string()
})

export const tokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.optional(z.string().default('bearer'))
})
