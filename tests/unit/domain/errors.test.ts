import { describe, it, expect } from 'vitest'
import {
  AuthErrors,
  UsuariosErrors,
  GruposErrors,
  PermissoesErrors,
  HomeErrors,
  ValidationErrors
} from '#shared/domain/errors'

describe('Domain Errors', () => {
  describe('AuthErrors', () => {
    it('contém códigos de erro de autenticação', () => {
      expect(AuthErrors.INVALID_CREDENTIALS).toBe('Credenciais inválidas')
      expect(AuthErrors.SESSION_EXPIRED).toContain('Sessão expirada')
      expect(AuthErrors.LOGIN_FAILED).toBe('Erro ao fazer login')
      expect(AuthErrors.FETCH_USER_FAILED).toBe('Erro ao carregar usuário')
    })

    it('tem todos os campos esperados', () => {
      const keys = Object.keys(AuthErrors)
      expect(keys).toContain('INVALID_CREDENTIALS')
      expect(keys).toContain('SESSION_EXPIRED')
      expect(keys).toContain('NOT_AUTHENTICATED')
      expect(keys).toContain('FORBIDDEN')
      expect(keys).toContain('ADMIN_ONLY')
      expect(keys).toContain('LOGIN_FAILED')
      expect(keys).toContain('LOGOUT_FAILED')
      expect(keys).toContain('FETCH_USER_FAILED')
      expect(keys).toContain('RESET_PASSWORD_FAILED')
      expect(keys).toContain('SIGNUP_FAILED')
    })
  })

  describe('UsuariosErrors', () => {
    it('contém erros CRUD', () => {
      expect(UsuariosErrors.LIST_FAILED).toBe('Erro ao listar usuarios')
      expect(UsuariosErrors.CREATE_FAILED).toBe('Erro ao criar usuario')
      expect(UsuariosErrors.DELETE_FAILED).toBe('Erro ao remover usuario')
    })

    it('contém erros de upload', () => {
      expect(UsuariosErrors.PHOTO_NO_FILE).toBe('Nenhum arquivo enviado')
      expect(UsuariosErrors.PHOTO_TOO_LARGE).toContain('5MB')
    })
  })

  describe('GruposErrors', () => {
    it('contém erros de gestão de grupos', () => {
      expect(GruposErrors.ADD_USER_FAILED).toContain('adicionar')
      expect(GruposErrors.REMOVE_USER_FAILED).toContain('remover')
    })
  })

  describe('PermissoesErrors', () => {
    it('contém erros de gestão de permissões', () => {
      expect(PermissoesErrors.ADD_TO_USER_FAILED).toContain('adicionar')
      expect(PermissoesErrors.REMOVE_FROM_USER_FAILED).toContain('remover')
    })
  })

  describe('HomeErrors', () => {
    it('contém erros de carregamento', () => {
      expect(HomeErrors.PANORAMA_FAILED).toContain('panorama')
      expect(HomeErrors.TABLE_FAILED).toContain('tabela')
    })
  })

  describe('ValidationErrors', () => {
    it('gera mensagem de param inválido', () => {
      expect(ValidationErrors.INVALID_BODY).toBe('Dados invalidos')
      expect(ValidationErrors.INVALID_PARAM('id')).toBe("Parametro 'id' invalido")
      expect(ValidationErrors.INVALID_PARAM('userId')).toBe("Parametro 'userId' invalido")
    })
  })
})
