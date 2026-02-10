import type {
  GrupoSchemaDetalhes,
  GrupoSchemaList,
  GrupoSchemaCreate,
  GrupoSchemaUpdate,
  ListarGruposParams
} from './types'

interface FetchError {
  statusCode?: number
  statusMessage?: string
  data?: { message?: string }
}

function extractErrorMessage(error: unknown, defaultMessage: string): string {
  if (error && typeof error === 'object') {
    const fetchError = error as FetchError
    if (fetchError.data?.message) return fetchError.data.message
    if (fetchError.statusMessage) return fetchError.statusMessage
  }
  return defaultMessage
}

export const useGruposStore = defineStore('grupos', () => {
  // Estado
  const items = ref<GrupoSchemaList[]>([])
  const selectedGrupo = ref<GrupoSchemaDetalhes | null>(null)
  const total = ref(0)
  const page = ref(1)
  const size = ref(20)
  const pages = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = useGruposApi()

  // Getters
  const hasNextPage = computed(() => page.value < pages.value)
  const hasPrevPage = computed(() => page.value > 1)

  // Actions

  async function fetchAll(params?: ListarGruposParams): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.listar(params)
      items.value = response.grupos
      total.value = response.total
      page.value = response.page
      size.value = response.size
      pages.value = response.pages
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao listar grupos')
    } finally {
      isLoading.value = false
    }
  }

  async function criar(data: GrupoSchemaCreate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.criar(data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao criar grupo')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function obter(id: number): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      selectedGrupo.value = await api.obter(id)
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao obter grupo')
    } finally {
      isLoading.value = false
    }
  }

  async function atualizar(id: number, data: GrupoSchemaUpdate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      selectedGrupo.value = await api.atualizar(id, data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao atualizar grupo')
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
      error.value = extractErrorMessage(e, 'Erro ao remover grupo')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function addUsuario(grupoId: number, usuarioId: number): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.addUsuario(grupoId, usuarioId)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao adicionar usuario ao grupo')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function removeUsuario(grupoId: number, usuarioId: number): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.removeUsuario(grupoId, usuarioId)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao remover usuario do grupo')
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
