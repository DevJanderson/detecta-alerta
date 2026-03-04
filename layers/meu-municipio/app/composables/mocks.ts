export interface MockNoticia {
  id: string
  title: string
  source: string
  time: string
  tags?: { diseases: string[]; regions: string[] }
}

export const mockNoticias: MockNoticia[] = [
  {
    id: '1',
    title: 'Aumento de casos de dengue preocupa autoridades em São Paulo',
    source: 'Folha de S.Paulo',
    time: 'Há 2h',
    tags: { diseases: ['Dengue'], regions: ['São Paulo'] }
  },
  {
    id: '2',
    title: 'UBS da zona leste registra lotação acima da média nesta semana',
    source: 'G1',
    time: 'Há 5h',
    tags: { diseases: [], regions: ['Sudeste'] }
  },
  {
    id: '3',
    title: 'Campanha de vacinação contra gripe começa na próxima semana',
    source: 'Estadão',
    time: 'Ontem',
    tags: { diseases: ['Gripe'], regions: [] }
  },
  {
    id: '4',
    title: 'Surto de chikungunya atinge bairros da zona norte da capital',
    source: 'UOL',
    time: 'Há 2 dias',
    tags: { diseases: ['Chikungunya'], regions: ['São Paulo'] }
  },
  {
    id: '5',
    title: 'Secretaria de Saúde reforça equipes em UPAs lotadas',
    source: 'R7',
    time: 'Há 3 dias',
    tags: { diseases: [], regions: ['São Paulo'] }
  }
]
