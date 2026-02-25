export function useDocsNavigation() {
  return useNavigation([
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
