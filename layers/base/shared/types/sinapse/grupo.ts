import { z } from 'zod'
import type { PermissaoAcessoSchemaList } from './permissao'
import { permissaoAcessoSchemaListSchema } from './permissao'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type GrupoSchemaList = {
  nome: string
  descricao?: string | null
  ativo?: boolean
  id: number
  created_at: string
  updated_at?: string | null
}

export type GrupoSchemaDetalhes = {
  nome: string
  descricao?: string | null
  ativo?: boolean
  id: number
  created_at: string
  updated_at?: string | null
  permissoes: PermissaoAcessoSchemaList[]
  total_usuarios?: number | null
}

export type GrupoSchemaCreate = {
  nome: string
  descricao?: string | null
  ativo?: boolean
  permissoes_ids?: number[] | null
}

export type GrupoSchemaUpdate = {
  nome?: string | null
  descricao?: string | null
  ativo?: boolean | null
  permissoes_ids?: number[] | null
}

export type GruposPaginadosSchema = {
  total: number
  page: number
  size: number
  pages: number
  grupos: GrupoSchemaList[]
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

export const grupoSchemaListSchema = z.object({
  nome: z.string(),
  descricao: z.optional(z.union([z.string(), z.null()])),
  ativo: z.optional(z.boolean().default(true)),
  id: z.number().int(),
  created_at: z.string().datetime(),
  updated_at: z.optional(z.union([z.string().datetime(), z.null()]))
})

export const grupoSchemaDetalhesSchema = z.object({
  nome: z.string(),
  descricao: z.optional(z.union([z.string(), z.null()])),
  ativo: z.optional(z.boolean().default(true)),
  id: z.number().int(),
  created_at: z.string().datetime(),
  updated_at: z.optional(z.union([z.string().datetime(), z.null()])),
  permissoes: z.array(permissaoAcessoSchemaListSchema),
  total_usuarios: z.optional(z.union([z.number().int(), z.null()]).default(0))
})

export const grupoSchemaCreateSchema = z.object({
  nome: z.string(),
  descricao: z.optional(z.union([z.string(), z.null()])),
  ativo: z.optional(z.boolean().default(true)),
  permissoes_ids: z.optional(z.union([z.array(z.number().int()), z.null()]))
})

export const grupoSchemaUpdateSchema = z.object({
  nome: z.optional(z.union([z.string(), z.null()])),
  descricao: z.optional(z.union([z.string(), z.null()])),
  ativo: z.optional(z.union([z.boolean(), z.null()])),
  permissoes_ids: z.optional(z.union([z.array(z.number().int()), z.null()]))
})

export const gruposPaginadosSchemaSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  size: z.number().int(),
  pages: z.number().int(),
  grupos: z.array(grupoSchemaListSchema)
})
