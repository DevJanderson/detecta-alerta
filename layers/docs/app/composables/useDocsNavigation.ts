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
      title: 'Arquitetura',
      items: [
        {
          title: 'Visão Geral',
          path: '/docs/arquitetura/visao-geral',
          icon: 'lucide:blocks'
        },
        {
          title: 'Domain Primitives',
          path: '/docs/arquitetura/domain-primitives',
          icon: 'lucide:diamond'
        },
        {
          title: 'Error Handling',
          path: '/docs/arquitetura/error-handling',
          icon: 'lucide:alert-triangle'
        },
        {
          title: 'Padrão Feature Layer',
          path: '/docs/arquitetura/feature-layer',
          icon: 'lucide:layers'
        }
      ]
    },
    {
      title: 'Meu Município',
      items: [
        {
          title: 'Visão Geral',
          path: '/docs/paginas/meu-municipio',
          icon: 'lucide:map-pin'
        }
      ]
    },
    {
      title: 'API',
      items: [{ title: 'Sinapse', path: '/docs/api/overview', icon: 'lucide:plug' }]
    },
    {
      title: 'Segurança',
      items: [
        { title: 'Visão Geral', path: '/docs/seguranca/visao-geral', icon: 'lucide:shield' },
        {
          title: 'Autenticação',
          path: '/docs/seguranca/autenticacao',
          icon: 'lucide:lock'
        },
        {
          title: 'Headers e Proteções',
          path: '/docs/seguranca/headers-protecoes',
          icon: 'lucide:shield-check'
        },
        {
          title: 'Guia para Devs',
          path: '/docs/seguranca/guia-desenvolvimento',
          icon: 'lucide:code'
        }
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
