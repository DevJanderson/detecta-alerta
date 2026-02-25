import type {
  PermissaoAcessoSchemaList,
  PermissaoAcessoSchemaCreate,
  PermissaoAcessoSchemaUpdate
} from './types'

export const usePermissoesStore = defineStore('permissoes', () => {
  // Estado
  const items = shallowRef<PermissaoAcessoSchemaList[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = usePermissoesApi()
  const refs = { isLoading, error }

  // Actions

  async function fetchAll(): Promise<void> {
    return withStoreAction(refs, 'Erro ao listar permissoes', async () => {
      items.value = await api.listar()
    })
  }

  async function criar(data: PermissaoAcessoSchemaCreate): Promise<boolean> {
    return withStoreAction(refs, 'Erro ao criar permissao', async () => {
      await api.criar(data)
      return true
    })
  }

  async function obter(id: number): Promise<PermissaoAcessoSchemaList | null> {
    return withStoreAction(refs, 'Erro ao obter permissao', async () => {
      return await api.obter(id)
    })
  }

  async function atualizar(id: number, data: PermissaoAcessoSchemaUpdate): Promise<boolean> {
    return withStoreAction(refs, 'Erro ao atualizar permissao', async () => {
      await api.atualizar(id, data)
      return true
    })
  }

  async function remover(id: number): Promise<boolean> {
    return withStoreAction(refs, 'Erro ao remover permissao', async () => {
      await api.remover(id)
      return true
    })
  }

  async function addToUser(userId: number, permId: number): Promise<boolean> {
    return withStoreAction(refs, 'Erro ao adicionar permissao ao usuario', async () => {
      await api.addToUser(userId, permId)
      return true
    })
  }

  async function removeFromUser(userId: number, permId: number): Promise<boolean> {
    return withStoreAction(refs, 'Erro ao remover permissao do usuario', async () => {
      await api.removeFromUser(userId, permId)
      return true
    })
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // Estado
    items,
    isLoading,
    error,

    // Actions
    fetchAll,
    criar,
    obter,
    atualizar,
    remover,
    addToUser,
    removeFromUser,
    clearError
  }
})
