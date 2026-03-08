import { z } from 'zod'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PermissaoAcessoSchemaList = {
  nome: string
  descricao?: string | null
  id: number
}

export type PermissaoAcessoSchemaCreate = {
  nome: string
  descricao?: string | null
}

export type PermissaoAcessoSchemaUpdate = {
  nome: string
  descricao?: string | null
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const permissaoAcessoSchemaListSchema = z.object({
  nome: z.string(),
  descricao: z.optional(z.union([z.string(), z.null()])),
  id: z.number().int()
})

export const permissaoAcessoSchemaCreateSchema = z.object({
  nome: z.string(),
  descricao: z.optional(z.union([z.string(), z.null()]))
})

export const permissaoAcessoSchemaUpdateSchema = z.object({
  nome: z.string(),
  descricao: z.optional(z.union([z.string(), z.null()]))
})
