import type {
  UsuarioSchemaDetalhes,
  UsuarioSchemaList,
  UsuarioSchemaCreate,
  UsuarioSchemaUpdate,
  UsuarioSchemaSignup,
  ListarUsuariosParams
} from './types'
import { UsuariosErrors } from '#shared/domain/errors'

export const useUsuariosStore = defineStore('usuarios', () => {
  // Estado
  const perfil = ref<UsuarioSchemaDetalhes | null>(null)
  const items = shallowRef<UsuarioSchemaList[]>([])
  const selectedUsuario = ref<UsuarioSchemaDetalhes | null>(null)
  const total = ref(0)
  const page = ref(1)
  const size = ref(20)
  const pages = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useUsuariosApi()
  const refs = { isLoading, error }

  // Getters
  const hasNextPage = computed(() => page.value < pages.value)
  const hasPrevPage = computed(() => page.value > 1)

  // Perfil (self-service)

  async function fetchPerfil(): Promise<void> {
    return withStoreAction(refs, UsuariosErrors.PROFILE_FETCH_FAILED, async () => {
      perfil.value = await api.getMe()
    })
  }

  async function updatePerfil(data: UsuarioSchemaUpdate): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.PROFILE_UPDATE_FAILED,
      async () => {
        perfil.value = await api.updateMe(data)
        return true
      },
      false
    )
  }

  async function uploadFoto(file: File): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.PHOTO_UPLOAD_FAILED,
      async () => {
        await api.uploadFoto(file)
        return true
      },
      false
    )
  }

  // Admin

  async function fetchAll(params?: ListarUsuariosParams): Promise<void> {
    return withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => {
      const response = await api.listar(params)
      items.value = response.usuarios
      total.value = response.total
      page.value = response.page
      size.value = response.size
      pages.value = response.pages
    })
  }

  async function criar(data: UsuarioSchemaCreate): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.CREATE_FAILED,
      async () => {
        await api.criar(data)
        return true
      },
      false
    )
  }

  async function obter(id: number): Promise<void> {
    return withStoreAction(refs, UsuariosErrors.GET_FAILED, async () => {
      selectedUsuario.value = await api.obter(id)
    })
  }

  async function atualizar(id: number, data: UsuarioSchemaUpdate): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.UPDATE_FAILED,
      async () => {
        selectedUsuario.value = await api.atualizar(id, data)
        return true
      },
      false
    )
  }

  async function remover(id: number): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.DELETE_FAILED,
      async () => {
        await api.remover(id)
        return true
      },
      false
    )
  }

  async function signup(data: UsuarioSchemaSignup): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.SIGNUP_FAILED,
      async () => {
        await api.signup(data)
        return true
      },
      false
    )
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
