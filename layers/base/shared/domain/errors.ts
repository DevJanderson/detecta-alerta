/**
 * Erros tipados do domínio — compartilhados entre client e server
 *
 * Organizado por domínio (auth, usuarios, etc.).
 * Cada erro tem código único (autocomplete) e mensagem padrão para o usuário.
 *
 * Uso no server:
 *   throw createError({ statusCode: 401, statusMessage: AuthErrors.INVALID_CREDENTIALS })
 *
 * Uso no store:
 *   withStoreAction(refs, AuthErrors.LOGIN_FAILED, async () => { ... })
 *
 * Uso no componente (reação a código específico):
 *   if (error.value === AuthErrors.INVALID_CREDENTIALS) { ... }
 */

// ============================================================================
// AUTH
// ============================================================================

export const AuthErrors = {
  INVALID_CREDENTIALS: 'Credenciais inválidas',
  SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.',
  NOT_AUTHENTICATED: 'Não autenticado',
  FORBIDDEN: 'Você não tem permissão para acessar esta página',
  ADMIN_ONLY: 'Acesso restrito a administradores',
  LOGIN_FAILED: 'Erro ao fazer login',
  LOGOUT_FAILED: 'Erro ao fazer logout',
  FETCH_USER_FAILED: 'Erro ao carregar usuário',
  RESET_PASSWORD_FAILED: 'Erro ao solicitar reset de senha',
  SIGNUP_FAILED: 'Erro ao realizar cadastro',
  REFRESH_TOKEN_MISSING: 'Refresh token não encontrado',
  CONFIG_MISSING: 'NUXT_SINAPSE_API_URL não configurada'
} as const

// ============================================================================
// USUARIOS
// ============================================================================

export const UsuariosErrors = {
  LIST_FAILED: 'Erro ao listar usuarios',
  CREATE_FAILED: 'Erro ao criar usuario',
  GET_FAILED: 'Erro ao buscar usuario',
  UPDATE_FAILED: 'Erro ao atualizar usuario',
  DELETE_FAILED: 'Erro ao remover usuario',
  SIGNUP_FAILED: 'Erro ao cadastrar usuario',
  PROFILE_FETCH_FAILED: 'Erro ao carregar perfil',
  PROFILE_UPDATE_FAILED: 'Erro ao atualizar perfil',
  PHOTO_UPLOAD_FAILED: 'Erro ao enviar foto',
  PHOTO_NO_FILE: 'Nenhum arquivo enviado',
  PHOTO_TOO_MANY: 'Envie exatamente um arquivo',
  PHOTO_INVALID_TYPE: 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP',
  PHOTO_TOO_LARGE: 'Arquivo muito grande. Máximo 5MB'
} as const

// ============================================================================
// GRUPOS
// ============================================================================

export const GruposErrors = {
  LIST_FAILED: 'Erro ao listar grupos',
  CREATE_FAILED: 'Erro ao criar grupo',
  GET_FAILED: 'Erro ao buscar grupo',
  UPDATE_FAILED: 'Erro ao atualizar grupo',
  DELETE_FAILED: 'Erro ao remover grupo',
  ADD_USER_FAILED: 'Erro ao adicionar usuario ao grupo',
  REMOVE_USER_FAILED: 'Erro ao remover usuario do grupo'
} as const

// ============================================================================
// PERMISSOES
// ============================================================================

export const PermissoesErrors = {
  LIST_FAILED: 'Erro ao listar permissoes',
  CREATE_FAILED: 'Erro ao criar permissao',
  GET_FAILED: 'Erro ao buscar permissao',
  UPDATE_FAILED: 'Erro ao atualizar permissao',
  DELETE_FAILED: 'Erro ao remover permissao',
  ADD_TO_USER_FAILED: 'Erro ao adicionar permissao ao usuario',
  REMOVE_FROM_USER_FAILED: 'Erro ao remover permissao do usuario'
} as const

// ============================================================================
// HOME
// ============================================================================

export const HomeErrors = {
  PANORAMA_FAILED: 'Erro ao carregar panorama',
  TABLE_FAILED: 'Erro ao carregar tabela',
  DATA_FAILED: 'Erro ao carregar dados'
} as const

// ============================================================================
// VALIDAÇÃO
// ============================================================================

export const ValidationErrors = {
  INVALID_BODY: 'Dados invalidos',
  INVALID_PARAM: (name: string) => `Parametro '${name}' invalido` as const
} as const

// ============================================================================
// TIPOS UTILITÁRIOS
// ============================================================================

/** Tipo union de todos os códigos de erro de auth */
export type AuthErrorCode = (typeof AuthErrors)[keyof typeof AuthErrors]

/** Tipo union de todos os códigos de erro de usuarios */
export type UsuariosErrorCode = (typeof UsuariosErrors)[keyof typeof UsuariosErrors]
