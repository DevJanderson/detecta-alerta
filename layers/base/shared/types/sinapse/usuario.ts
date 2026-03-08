import { z } from 'zod'
import type { GrupoSchemaList } from './grupo'
import type { PermissaoAcessoSchemaList } from './permissao'
import { grupoSchemaListSchema } from './grupo'
import { permissaoAcessoSchemaListSchema } from './permissao'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UsuarioSchemaDetalhes = {
  id: number
  nome: string
  email: string
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  desativado_em?: string | null
  ultimo_login?: string | null
  criado_por_id?: number | null
  atualizado_por_id?: number | null
  created_at?: string | null
  updated_at?: string | null
  permissoes?: PermissaoAcessoSchemaList[]
  grupos?: GrupoSchemaList[]
}

export type UsuarioSchemaList = {
  id: number
  nome: string
  email: string
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  desativado_em?: string | null
  permissoes?: PermissaoAcessoSchemaList[]
  grupos?: GrupoSchemaList[]
}

export type UsuarioSchemaCreate = {
  nome: string
  email: string
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  senha: string
  permissoes_ids?: number[] | null
}

export type UsuarioSchemaUpdate = {
  nome: string
  email: string
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  senha?: string | null
  permissoes_ids?: number[] | null
  grupos_ids?: number[] | null
}

export type UsuarioSchemaSignup = {
  nome: string
  email: string
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  senha: string
  permissoes_ids?: number[] | null
  master_key?: string | null
}

export type UsuarioSchemaSignupResponse = {
  nome: string
  email: string
  ativo?: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
}

export type UsuariosPaginadosSchema = {
  total: number
  page: number
  size: number
  pages: number
  usuarios: UsuarioSchemaList[]
}

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const nullableString = z.optional(z.union([z.string(), z.null()]))

export const usuarioSchemaDetalhesSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  email: z.string().email(),
  ativo: z.optional(z.boolean().default(true)),
  telefone: nullableString,
  estado: nullableString,
  cidade: nullableString,
  funcao: nullableString,
  instituicao: nullableString,
  desativado_em: z.optional(z.union([z.string().datetime(), z.null()])),
  ultimo_login: z.optional(z.union([z.string().datetime(), z.null()])),
  criado_por_id: z.optional(z.union([z.number().int(), z.null()])),
  atualizado_por_id: z.optional(z.union([z.number().int(), z.null()])),
  created_at: z.optional(z.union([z.string().datetime(), z.null()])),
  updated_at: z.optional(z.union([z.string().datetime(), z.null()])),
  permissoes: z.optional(z.array(permissaoAcessoSchemaListSchema)),
  grupos: z.optional(z.array(grupoSchemaListSchema))
})

export const usuarioSchemaListSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  email: z.string().email(),
  ativo: z.optional(z.boolean().default(true)),
  telefone: nullableString,
  estado: nullableString,
  cidade: nullableString,
  funcao: nullableString,
  instituicao: nullableString,
  desativado_em: z.optional(z.union([z.string().datetime(), z.null()])),
  permissoes: z.optional(z.array(permissaoAcessoSchemaListSchema)),
  grupos: z.optional(z.array(grupoSchemaListSchema))
})

export const usuarioSchemaCreateSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  ativo: z.optional(z.boolean().default(true)),
  telefone: nullableString,
  estado: nullableString,
  cidade: nullableString,
  funcao: nullableString,
  instituicao: nullableString,
  senha: z.string(),
  permissoes_ids: z.optional(z.union([z.array(z.number().int()), z.null()]))
})

export const usuarioSchemaUpdateSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  ativo: z.optional(z.boolean().default(true)),
  telefone: nullableString,
  estado: nullableString,
  cidade: nullableString,
  funcao: nullableString,
  instituicao: nullableString,
  senha: z.optional(z.union([z.string(), z.null()])),
  permissoes_ids: z.optional(z.union([z.array(z.number().int()), z.null()])),
  grupos_ids: z.optional(z.union([z.array(z.number().int()), z.null()]))
})

export const usuarioSchemaSignupSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  ativo: z.optional(z.boolean().default(true)),
  telefone: nullableString,
  estado: nullableString,
  cidade: nullableString,
  funcao: nullableString,
  instituicao: nullableString,
  senha: z.string(),
  permissoes_ids: z.optional(z.union([z.array(z.number().int()), z.null()])),
  master_key: z.optional(z.union([z.string(), z.null()]))
})

export const usuarioSchemaSignupResponseSchema = z.object({
  nome: z.string(),
  email: z.string().email(),
  ativo: z.optional(z.boolean().default(true)),
  telefone: nullableString,
  estado: nullableString,
  cidade: nullableString,
  funcao: nullableString,
  instituicao: nullableString
})

export const usuariosPaginadosSchemaSchema = z.object({
  total: z.number().int(),
  page: z.number().int(),
  size: z.number().int(),
  pages: z.number().int(),
  usuarios: z.array(usuarioSchemaListSchema)
})
