export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>

  watch(value, newValue => {
    const timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
    onWatcherCleanup(() => clearTimeout(timeout))
  })

  return debouncedValue
}
