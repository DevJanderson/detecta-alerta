import type {
  PermissaoAcessoSchemaList,
  PermissaoAcessoSchemaCreate,
  PermissaoAcessoSchemaUpdate
} from './types'
import { extractErrorMessage } from '~/layers/0-base/app/utils/error'

export const usePermissoesStore = defineStore('permissoes', () => {
  // Estado
  const items = shallowRef<PermissaoAcessoSchemaList[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const api = usePermissoesApi()

  // Actions

  async function fetchAll(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      items.value = await api.listar()
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao listar permissoes')
    } finally {
      isLoading.value = false
    }
  }

  async function criar(data: PermissaoAcessoSchemaCreate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.criar(data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao criar permissao')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function obter(id: number): Promise<PermissaoAcessoSchemaList | null> {
    isLoading.value = true
    error.value = null
    try {
      return await api.obter(id)
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao obter permissao')
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function atualizar(id: number, data: PermissaoAcessoSchemaUpdate): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.atualizar(id, data)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao atualizar permissao')
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
      error.value = extractErrorMessage(e, 'Erro ao remover permissao')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function addToUser(userId: number, permId: number): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.addToUser(userId, permId)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao adicionar permissao ao usuario')
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function removeFromUser(userId: number, permId: number): Promise<boolean> {
    isLoading.value = true
    error.value = null
    try {
      await api.removeFromUser(userId, permId)
      return true
    } catch (e: unknown) {
      error.value = extractErrorMessage(e, 'Erro ao remover permissao do usuario')
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
