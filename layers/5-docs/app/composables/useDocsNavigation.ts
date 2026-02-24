export interface DocsNavItem {
  title: string
  path: string
  icon?: string
}

export interface DocsNavGroup {
  title: string
  items: DocsNavItem[]
}

export function useDocsNavigation() {
  const route = useRoute()

  const navigation: DocsNavGroup[] = [
    {
      title: 'Primeiros Passos',
      items: [
        { title: 'Visão Geral', path: '/docs', icon: 'lucide:book-open' },
        {
          title: 'Instalação',
          path: '/docs/getting-started/installation',
          icon: 'lucide:download'
        },
        {
          title: 'Início Rápido',
          path: '/docs/getting-started/quick-start',
          icon: 'lucide:rocket'
        }
      ]
    },
    {
      title: 'Arquitetura',
      items: [
        { title: 'Visão Geral', path: '/docs/architecture/overview', icon: 'lucide:layout' },
        { title: 'Layers', path: '/docs/architecture/layers', icon: 'lucide:layers' },
        { title: 'Padrão BFF', path: '/docs/architecture/bff-pattern', icon: 'lucide:server' },
        { title: 'Segurança', path: '/docs/architecture/security', icon: 'lucide:shield' }
      ]
    },
    {
      title: 'API',
      items: [
        { title: 'Visão Geral', path: '/docs/api/overview', icon: 'lucide:plug' },
        { title: 'Integração Kubb', path: '/docs/api/kubb-integration', icon: 'lucide:code' }
      ]
    },
    {
      title: 'Desenvolvimento',
      items: [
        { title: 'Guia', path: '/docs/contributing/development', icon: 'lucide:terminal' },
        {
          title: 'Padrões de Código',
          path: '/docs/contributing/code-style',
          icon: 'lucide:file-code'
        },
        { title: 'Testes', path: '/docs/contributing/testing', icon: 'lucide:test-tube' }
      ]
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
