export interface DesignSystemNavItem {
  title: string
  path: string
}

export interface DesignSystemNavGroup {
  title: string
  items: DesignSystemNavItem[]
}

export function useDesignSystemNav() {
  const route = useRoute()

  const navigation: DesignSystemNavGroup[] = [
    {
      title: 'Cores',
      items: [
        { title: 'Cores da Marca', path: '/design-system' },
        { title: 'Base (Neutros)', path: '/design-system/cores/base' },
        { title: 'Feedback', path: '/design-system/cores/feedback' },
        { title: 'Semânticas', path: '/design-system/cores/semanticas' }
      ]
    },
    {
      title: 'Componentes',
      items: [{ title: 'Botões', path: '/design-system/componentes/botoes' }]
    }
  ]

  const flatItems = computed(() => navigation.flatMap(group => group.items))

  const currentIndex = computed(() => flatItems.value.findIndex(item => item.path === route.path))

  const prevPage = computed(() =>
    currentIndex.value > 0 ? flatItems.value[currentIndex.value - 1] : null
  )

  const nextPage = computed(() =>
    currentIndex.value < flatItems.value.length - 1 ? flatItems.value[currentIndex.value + 1] : null
  )

  return {
    navigation,
    flatItems,
    currentIndex,
    prevPage,
    nextPage
  }
}
