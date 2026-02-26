export function useDocsNavigation() {
  return useNavigation([
    {
      title: 'Introdução',
      items: [{ title: 'Visão Geral', path: '/docs', icon: 'lucide:book-open' }]
    },
    {
      title: 'Homepage',
      items: [
        { title: 'Visão Geral', path: '/docs/paginas/homepage', icon: 'lucide:home' },
        {
          title: 'Casos de Uso',
          path: '/docs/paginas/homepage-casos-de-uso',
          icon: 'lucide:users'
        },
        {
          title: 'Requisitos',
          path: '/docs/paginas/homepage-requisitos',
          icon: 'lucide:list-checks'
        },
        {
          title: 'Não-Funcionais',
          path: '/docs/paginas/homepage-nao-funcionais',
          icon: 'lucide:gauge'
        },
        { title: 'Dados e APIs', path: '/docs/paginas/homepage-dados', icon: 'lucide:database' },
        {
          title: 'Estados da UI',
          path: '/docs/paginas/homepage-estados-ui',
          icon: 'lucide:layers'
        },
        {
          title: 'Componentes',
          path: '/docs/paginas/homepage-componentes',
          icon: 'lucide:component'
        }
      ]
    },
    {
      title: 'API',
      items: [{ title: 'Sinapse', path: '/docs/api/overview', icon: 'lucide:plug' }]
    },
    {
      title: 'Projeto',
      items: [
        { title: 'Backlog', path: '/docs/projeto/backlog', icon: 'lucide:list-checks' },
        {
          title: 'Decisões Técnicas',
          path: '/docs/projeto/decisoes',
          icon: 'lucide:landmark'
        }
      ]
    }
  ])
}
