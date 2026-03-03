import type {
  LotacaoData,
  MunicipioOption,
  RumorDestaque,
  RumorItem,
  SelectOption,
  UnidadeSaude,
  UnitTypeSummary
} from './types'

export function useMeuMunicipioApi() {
  async function searchMunicipios(_query: string): Promise<MunicipioOption[]> {
    // TODO: substituir por $fetch('/api/meu-municipio/municipios', { query: { q: query } })
    return [
      { ibgeCode: '3550308', nome: 'São Paulo', uf: 'SP' },
      { ibgeCode: '3304557', nome: 'Rio de Janeiro', uf: 'RJ' },
      { ibgeCode: '5300108', nome: 'Brasília', uf: 'DF' },
      { ibgeCode: '2927408', nome: 'Salvador', uf: 'BA' },
      { ibgeCode: '4106902', nome: 'Curitiba', uf: 'PR' },
      { ibgeCode: '1302603', nome: 'Manaus', uf: 'AM' },
      { ibgeCode: '2611606', nome: 'Recife', uf: 'PE' },
      { ibgeCode: '3106200', nome: 'Belo Horizonte', uf: 'MG' }
    ]
  }

  async function getUnitTypeSummaries(_ibgeCode: string): Promise<UnitTypeSummary[]> {
    // TODO: substituir por $fetch('/api/meu-municipio/unit-summaries', { query: { ibgeCode } })
    return [
      { type: 'drogaria', count: 1247, percentage: 68, trend: 'up' },
      { type: 'ubs', count: 423, percentage: 45, trend: 'stable' },
      { type: 'upa', count: 89, percentage: 82, trend: 'down' }
    ]
  }

  async function getUnidades(_ibgeCode: string): Promise<UnidadeSaude[]> {
    // TODO: substituir por $fetch('/api/meu-municipio/unidades', { query: { ibgeCode } })
    return [
      {
        placeId: 'u-001',
        nome: 'Drogaria São Paulo - Pinheiros',
        tipo: 'drogaria',
        endereco: 'Rua dos Pinheiros, 1200',
        cidade: 'São Paulo',
        uf: 'SP',
        ocupacao: 72,
        ativa: true,
        dadosTempoReal: true,
        coordinates: { lat: -23.5613, lng: -46.6912 }
      },
      {
        placeId: 'u-002',
        nome: 'UBS Vila Mariana',
        tipo: 'ubs',
        endereco: 'Rua Domingos de Moraes, 800',
        cidade: 'São Paulo',
        uf: 'SP',
        ocupacao: 45,
        ativa: true,
        dadosTempoReal: true,
        coordinates: { lat: -23.5891, lng: -46.6369 }
      },
      {
        placeId: 'u-003',
        nome: 'UPA Campo Limpo',
        tipo: 'upa',
        endereco: 'Estrada do Campo Limpo, 3500',
        cidade: 'São Paulo',
        uf: 'SP',
        ocupacao: 91,
        ativa: true,
        dadosTempoReal: false,
        coordinates: { lat: -23.6473, lng: -46.7589 }
      },
      {
        placeId: 'u-004',
        nome: 'Drogaria Raia - Moema',
        tipo: 'drogaria',
        endereco: 'Av. Ibirapuera, 2315',
        cidade: 'São Paulo',
        uf: 'SP',
        ocupacao: 58,
        ativa: true,
        dadosTempoReal: true,
        coordinates: { lat: -23.6007, lng: -46.6659 }
      },
      {
        placeId: 'u-005',
        nome: 'UBS Sacomã',
        tipo: 'ubs',
        endereco: 'Rua Agostinho Gomes, 300',
        cidade: 'São Paulo',
        uf: 'SP',
        ocupacao: 37,
        ativa: true,
        dadosTempoReal: true,
        coordinates: { lat: -23.6102, lng: -46.5978 }
      }
    ]
  }

  async function getLotacao(_ibgeCode: string): Promise<LotacaoData> {
    // TODO: substituir por $fetch('/api/meu-municipio/lotacao', { query: { ibgeCode } })
    return {
      level: 'Médio',
      series: [
        { semana: 'SE 1', value: 62, average: 58 },
        { semana: 'SE 2', value: 65, average: 59 },
        { semana: 'SE 3', value: 71, average: 60 },
        { semana: 'SE 4', value: 68, average: 60 },
        { semana: 'SE 5', value: 73, average: 61 },
        { semana: 'SE 6', value: 69, average: 61 },
        { semana: 'SE 7', value: 75, average: 62 },
        { semana: 'SE 8', value: 72, average: 62 }
      ]
    }
  }

  async function getUnidadeDetalhe(_placeId: string): Promise<UnidadeSaude> {
    // TODO: substituir por $fetch(`/api/meu-municipio/unidades/${placeId}`)
    return {
      placeId: _placeId,
      nome: 'UPA Campo Limpo',
      tipo: 'upa',
      endereco: 'Estrada do Campo Limpo, 3500',
      cidade: 'São Paulo',
      uf: 'SP',
      ocupacao: 91,
      ativa: true,
      dadosTempoReal: false,
      coordinates: { lat: -23.6473, lng: -46.7589 }
    }
  }

  async function getUnidadeLotacao(_placeId: string): Promise<LotacaoData> {
    // TODO: substituir por $fetch(`/api/meu-municipio/unidades/${placeId}/lotacao`)
    return {
      level: 'Alto',
      series: [
        { semana: 'SE 1', value: 78, average: 65 },
        { semana: 'SE 2', value: 82, average: 66 },
        { semana: 'SE 3', value: 85, average: 66 },
        { semana: 'SE 4', value: 88, average: 67 },
        { semana: 'SE 5', value: 91, average: 67 },
        { semana: 'SE 6', value: 87, average: 68 },
        { semana: 'SE 7', value: 93, average: 68 },
        { semana: 'SE 8', value: 91, average: 69 }
      ]
    }
  }

  async function getRumores(
    _uf: string,
    _limit?: number
  ): Promise<{ destaque: RumorDestaque; items: RumorItem[] }> {
    // TODO: substituir por $fetch('/api/meu-municipio/rumores', { query: { uf, limit } })
    return {
      destaque: {
        titulo: 'Aumento de casos respiratórios na região metropolitana',
        resumo:
          'A análise de dados das últimas 4 semanas epidemiológicas indica um aumento de 23% nos atendimentos por síndromes respiratórias em unidades de saúde da região metropolitana de São Paulo, com destaque para UPAs do Campo Limpo e Capão Redondo.',
        tags: ['síndrome respiratória', 'alerta', 'SP'],
        link: '/rumores/1'
      },
      items: [
        {
          id: 'r-001',
          titulo: 'Surto de dengue preocupa autoridades em bairros da zona sul',
          fonte: 'Folha de S.Paulo',
          fonteUrl: 'https://folha.uol.com.br',
          data: '2026-02-28',
          tags: ['dengue', 'zona sul']
        },
        {
          id: 'r-002',
          titulo: 'Farmácias registram aumento na venda de antigripais',
          fonte: 'Estadão',
          fonteUrl: 'https://estadao.com.br',
          data: '2026-02-27',
          tags: ['gripe', 'farmácias']
        },
        {
          id: 'r-003',
          titulo: 'UPAs da capital operam acima da capacidade',
          fonte: 'G1 SP',
          fonteUrl: 'https://g1.globo.com',
          data: '2026-02-26',
          tags: ['UPA', 'lotação']
        },
        {
          id: 'r-004',
          titulo: 'Campanha de vacinação contra gripe tem baixa adesão',
          fonte: 'Agência Brasil',
          fonteUrl: 'https://agenciabrasil.ebc.com.br',
          data: '2026-02-25',
          tags: ['vacinação', 'gripe']
        }
      ]
    }
  }

  async function getSemanas(): Promise<SelectOption[]> {
    // TODO: substituir por $fetch('/api/meu-municipio/semanas')
    return [
      { value: '8', label: 'SE 8 (17/02 - 23/02)' },
      { value: '7', label: 'SE 7 (10/02 - 16/02)' },
      { value: '6', label: 'SE 6 (03/02 - 09/02)' },
      { value: '5', label: 'SE 5 (27/01 - 02/02)' },
      { value: '4', label: 'SE 4 (20/01 - 26/01)' },
      { value: '3', label: 'SE 3 (13/01 - 19/01)' },
      { value: '2', label: 'SE 2 (06/01 - 12/01)' },
      { value: '1', label: 'SE 1 (30/12 - 05/01)' }
    ]
  }

  return {
    searchMunicipios,
    getUnitTypeSummaries,
    getUnidades,
    getLotacao,
    getUnidadeDetalhe,
    getUnidadeLotacao,
    getRumores,
    getSemanas
  }
}
