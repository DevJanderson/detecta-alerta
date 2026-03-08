import type {
  GrupoSchemaDetalhes,
  GrupoSchemaList,
  GrupoSchemaCreate,
  GrupoSchemaUpdate,
  ListarGruposParams
} from './types'
import { GruposErrors } from '#shared/domain/errors'

export const useGruposStore = defineStore('grupos', () => {
  // Estado
  const items = shallowRef<GrupoSchemaList[]>([])
  const selectedGrupo = ref<GrupoSchemaDetalhes | null>(null)
  const total = ref(0)
  const page = ref(1)
  const size = ref(20)
  const pages = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useGruposApi()
  const refs = { isLoading, error }

  // Getters
  const hasNextPage = computed(() => page.value < pages.value)
  const hasPrevPage = computed(() => page.value > 1)

  // Actions

  async function fetchAll(params?: ListarGruposParams): Promise<void> {
    return withStoreAction(refs, GruposErrors.LIST_FAILED, async () => {
      const response = await api.listar(params)
      items.value = response.grupos
      total.value = response.total
      page.value = response.page
      size.value = response.size
      pages.value = response.pages
    })
  }

  async function criar(data: GrupoSchemaCreate): Promise<boolean> {
    return withStoreAction(
      refs,
      GruposErrors.CREATE_FAILED,
      async () => {
        await api.criar(data)
        return true
      },
      false
    )
  }

  async function obter(id: number): Promise<void> {
    return withStoreAction(refs, GruposErrors.GET_FAILED, async () => {
      selectedGrupo.value = await api.obter(id)
    })
  }

  async function atualizar(id: number, data: GrupoSchemaUpdate): Promise<boolean> {
    return withStoreAction(
      refs,
      GruposErrors.UPDATE_FAILED,
      async () => {
        selectedGrupo.value = await api.atualizar(id, data)
        return true
      },
      false
    )
  }

  async function remover(id: number): Promise<boolean> {
    return withStoreAction(
      refs,
      GruposErrors.DELETE_FAILED,
      async () => {
        await api.remover(id)
        return true
      },
      false
    )
  }

  async function addUsuario(grupoId: number, usuarioId: number): Promise<boolean> {
    return withStoreAction(
      refs,
      GruposErrors.ADD_USER_FAILED,
      async () => {
        await api.addUsuario(grupoId, usuarioId)
        return true
      },
      false
    )
  }

  async function removeUsuario(grupoId: number, usuarioId: number): Promise<boolean> {
    return withStoreAction(
      refs,
      GruposErrors.REMOVE_USER_FAILED,
      async () => {
        await api.removeUsuario(grupoId, usuarioId)
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
    items,
    selectedGrupo,
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
    fetchAll,
    criar,
    obter,
    atualizar,
    remover,
    addUsuario,
    removeUsuario,
    clearError
  }
})
