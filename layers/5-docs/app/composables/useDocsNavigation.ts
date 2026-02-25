export function useDocsNavigation() {
  return useNavigation([
    {
      title: 'Introdução',
      items: [{ title: 'Visão Geral', path: '/docs', icon: 'lucide:book-open' }]
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
