import type {
  UsuarioSchemaDetalhes,
  UsuarioSchemaList,
  UsuarioSchemaCreate,
  UsuarioSchemaUpdate,
  UsuarioSchemaSignup,
  ListarUsuariosParams
} from './types'
import { extractErrorMessage } from '~/layers/0-base/app/utils/error'

export const useUsuariosStore = defineStore('usuarios', () => {
  // Estado
  const perfil = ref<UsuarioSchemaDetalhes | null>(null)
  const items = ref<UsuarioSchemaList[]>([])
  const selectedUsuario = ref<UsuarioSchemaDetalhes | null>(null)
  const total = ref(0)
  const page = ref(1)
  const size = ref(20)
  const pages = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useUsuariosApi()

  // Getters
  const hasNextPage = computed(() => page.value < pages.value)
  const hasPrevPage = computed(() => page.value > 1)

  // Perfil (self-service)

  async function fetchPerfil(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      perfil.value = await api.getMe()
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao carregar perfil')
    } finally {
      isLoading.value = false
    }
  }

  async function updatePerfil(data: UsuarioSchemaUpdate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      perfil.value = await api.updateMe(data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao atualizar perfil')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function uploadFoto(file: File): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.uploadFoto(file)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao enviar foto')
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Admin

  async function fetchAll(params?: ListarUsuariosParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.listar(params)
      items.value = response.usuarios
      total.value = response.total
      page.value = response.page
      size.value = response.size
      pages.value = response.pages
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao listar usuarios')
    } finally {
      isLoading.value = false
    }
  }

  async function criar(data: UsuarioSchemaCreate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.criar(data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao criar usuario')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function obter(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      selectedUsuario.value = await api.obter(id)
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao obter usuario')
    } finally {
      isLoading.value = false
    }
  }

  async function atualizar(id: number, data: UsuarioSchemaUpdate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      selectedUsuario.value = await api.atualizar(id, data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao atualizar usuario')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function remover(id: number): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.remover(id)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao remover usuario')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function signup(data: UsuarioSchemaSignup): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.signup(data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao cadastrar usuario')
      return false
    } finally {
      isLoading.value = false
    }
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // Estado
    perfil,
    items,
    selectedUsuario,
    total,
    page,
    size,
    pages,
    isLoading,
    error,

    // Getters
    hasNextPage,
    hasPrevPage,

    // Actions
    fetchPerfil,
    updatePerfil,
    uploadFoto,
    fetchAll,
    criar,
    obter,
    atualizar,
    remover,
    signup,
    clearError
  }
})
