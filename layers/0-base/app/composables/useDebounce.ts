export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timeout: NodeJS.Timeout

  watch(value, newValue => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  onScopeDispose(() => clearTimeout(timeout))

  return debouncedValue
}
