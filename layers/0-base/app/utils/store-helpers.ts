import type { Ref } from 'vue'
import { extractErrorMessage } from './error'

interface StoreRefs {
  isLoading: Ref<boolean>
  error: Ref<string | null>
}

/**
 * Wrapper para ações de store que eliminam o boilerplate repetido de
 * isLoading / error / try-catch-finally.
 *
 * @example
 * async function criar(data: CreateData): Promise<boolean> {
 *   return withStoreAction({ isLoading, error }, 'Erro ao criar', async () => {
 *     await api.criar(data)
 *     return true
 *   })
 * }
 */
export async function withStoreAction<T>(
  refs: StoreRefs,
  errorMessage: string,
  fn: () => Promise<T>
): Promise<T> {
  refs.isLoading.value = true
  refs.error.value = null
  try {
    return await fn()
  } catch (e: unknown) {
    refs.error.value = extractErrorMessage(e, errorMessage)
    return undefined as T
  } finally {
    refs.isLoading.value = false
  }
}
