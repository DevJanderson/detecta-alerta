export interface TocItem {
  id: string
  text: string
  depth: number
}

export function useDesignSystemToc() {
  const items = ref<TocItem[]>([])
  const activeId = ref('')

  let observer: IntersectionObserver | null = null

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  function scan(container: HTMLElement) {
    const headings = container.querySelectorAll('h1, h2, h3')
    const tocItems: TocItem[] = []

    headings.forEach(heading => {
      const el = heading as HTMLElement
      const depth = Number(el.tagName[1])
      if (depth === 1) return

      if (!el.id) {
        el.id = slugify(el.textContent || '')
      }

      tocItems.push({
        id: el.id,
        text: el.textContent || '',
        depth
      })
    })

    items.value = tocItems

    if (!tocItems.length) return

    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    )

    tocItems.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer!.observe(el)
    })
  }

  function cleanup() {
    observer?.disconnect()
    observer = null
    items.value = []
    activeId.value = ''
  }

  onBeforeUnmount(cleanup)

  return {
    items,
    activeId,
    scan,
    cleanup
  }
}
