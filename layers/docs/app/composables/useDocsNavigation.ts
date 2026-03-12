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
          title: 'AppTopBar',
          path: '/docs/paginas/homepage-apptopbar',
          icon: 'lucide:bar-chart-2'
        },
        {
          title: 'Switcher de Regiões',
          path: '/docs/paginas/homepage-region-tabs',
          icon: 'lucide:map'
        },
        {
          title: 'Filtros',
          path: '/docs/paginas/homepage-filters',
          icon: 'lucide:filter'
        },
        {
          title: 'Panorama',
          path: '/docs/paginas/homepage-panorama',
          icon: 'lucide:activity'
        },
        {
          title: 'Gráfico',
          path: '/docs/paginas/homepage-chart',
          icon: 'lucide:bar-chart-3'
        },
        {
          title: 'Gráfico (Linha)',
          path: '/docs/paginas/homepage-chart-line',
          icon: 'lucide:trending-up'
        },
        {
          title: 'Tabela',
          path: '/docs/paginas/homepage-tabela',
          icon: 'lucide:table'
        },
        {
          title: 'Backlog',
          path: '/docs/paginas/homepage-backlog',
          icon: 'lucide:clipboard-list'
        }
      ]
    },
    {
      title: 'Arquitetura',
      items: [
        {
          title: 'Filosofia e Estilo',
          path: '/docs/arquitetura/filosofia',
          icon: 'lucide:compass'
        },
        {
          title: 'Visão Geral',
          path: '/docs/arquitetura/visao-geral',
          icon: 'lucide:blocks'
        }
      ]
    },
    {
      title: 'Padrões de Código',
      items: [
        {
          title: 'Visão Geral',
          path: '/docs/padroes',
          icon: 'lucide:book-marked'
        },
        {
          title: 'Feature Layer',
          path: '/docs/padroes/feature-layer',
          icon: 'lucide:layers'
        },
        {
          title: 'Domain Primitives',
          path: '/docs/padroes/domain-primitives',
          icon: 'lucide:diamond'
        },
        {
          title: 'Error Handling',
          path: '/docs/padroes/error-handling',
          icon: 'lucide:alert-triangle'
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
        },
        {
          title: 'Casos de Uso',
          path: '/docs/paginas/meu-municipio-casos-de-uso',
          icon: 'lucide:users'
        },
        {
          title: 'Requisitos',
          path: '/docs/paginas/meu-municipio-requisitos',
          icon: 'lucide:list-checks'
        },
        {
          title: 'Componentes',
          path: '/docs/paginas/meu-municipio-componentes',
          icon: 'lucide:component'
        },
        {
          title: 'Dados e APIs',
          path: '/docs/paginas/meu-municipio-dados',
          icon: 'lucide:database'
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
