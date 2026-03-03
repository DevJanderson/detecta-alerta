import type { PanoramaData, RegionRow, SelectOption, RegionOption } from './types'

export function useHomeApi() {
  // TODO: substituir por $fetch('/api/home/panorama', { query: params })
  async function getPanorama(_params?: Record<string, string>): Promise<PanoramaData> {
    return {
      percentage: '44.7%',
      level: 'Médio',
      description: 'dos estabelecimentos acima da média histórica. Tendência de alta.',
      insight:
        'Centro-Oeste mostra variação moderada. Os demais 4 regiões estão dentro do esperado. Tendência de aumento nas últimas semanas.',
      totalEstabelecimentos: 3365,
      drogarias: 880,
      ubs: 510,
      upas: 244
    }
  }

  // TODO: substituir por $fetch('/api/home/region-table', { query: params })
  async function getRegionTable(_params?: Record<string, string>): Promise<RegionRow[]> {
    return [
      {
        region: 'Centro-Oeste',
        todos: { level: 'Médio', value: '46.5%', trend: 'up' },
        drogarias: { level: 'Baixo', value: '46.9%', trend: 'up' },
        upa: { level: 'Médio', value: '49.4%', trend: 'down' },
        ubs: { level: 'Baixo', value: '43.4%', trend: 'up' }
      },
      {
        region: 'Nordeste',
        todos: { level: 'Médio', value: '43.4%', trend: 'stable' },
        drogarias: { level: 'Baixo', value: '45.5%', trend: 'stable' },
        upa: { level: 'Médio', value: '49.7%', trend: 'up' },
        ubs: { level: 'Baixo', value: '35%', trend: 'down' }
      },
      {
        region: 'Norte',
        todos: { level: 'Médio', value: '44.3%', trend: 'up' },
        drogarias: { level: 'Baixo', value: '46%', trend: 'stable' },
        upa: { level: 'Médio', value: '47.7%', trend: 'up' },
        ubs: { level: 'Baixo', value: '39.3%', trend: 'stable' }
      },
      {
        region: 'Sudeste',
        todos: { level: 'Médio', value: '44.8%', trend: 'up' },
        drogarias: { level: 'Baixo', value: '42%', trend: 'stable' },
        upa: { level: 'Médio', value: '48.9%', trend: 'up' },
        ubs: { level: 'Baixo', value: '43.6%', trend: 'up' }
      },
      {
        region: 'Sul',
        todos: { level: 'Médio', value: '44.2%', trend: 'up' },
        drogarias: { level: 'Baixo', value: '47.8%', trend: 'stable' },
        upa: { level: 'Médio', value: '44.6%', trend: 'down' },
        ubs: { level: 'Baixo', value: '41.4%', trend: 'up' }
      }
    ]
  }

  // TODO: substituir por $fetch('/api/home/estados')
  async function getEstados(): Promise<SelectOption[]> {
    return [
      { value: '', label: 'Todos os Estados' },
      { value: 'AC', label: 'Acre' },
      { value: 'AL', label: 'Alagoas' },
      { value: 'AP', label: 'Amapá' },
      { value: 'AM', label: 'Amazonas' },
      { value: 'BA', label: 'Bahia' },
      { value: 'CE', label: 'Ceará' },
      { value: 'DF', label: 'Distrito Federal' },
      { value: 'ES', label: 'Espírito Santo' },
      { value: 'GO', label: 'Goiás' },
      { value: 'MA', label: 'Maranhão' },
      { value: 'MT', label: 'Mato Grosso' },
      { value: 'MS', label: 'Mato Grosso do Sul' },
      { value: 'MG', label: 'Minas Gerais' },
      { value: 'PA', label: 'Pará' },
      { value: 'PB', label: 'Paraíba' },
      { value: 'PR', label: 'Paraná' },
      { value: 'PE', label: 'Pernambuco' },
      { value: 'PI', label: 'Piauí' },
      { value: 'RJ', label: 'Rio de Janeiro' },
      { value: 'RN', label: 'Rio Grande do Norte' },
      { value: 'RS', label: 'Rio Grande do Sul' },
      { value: 'RO', label: 'Rondônia' },
      { value: 'RR', label: 'Roraima' },
      { value: 'SC', label: 'Santa Catarina' },
      { value: 'SP', label: 'São Paulo' },
      { value: 'SE', label: 'Sergipe' },
      { value: 'TO', label: 'Tocantins' }
    ]
  }

  // TODO: substituir por $fetch('/api/home/semanas')
  async function getSemanas(): Promise<SelectOption[]> {
    return [
      { value: '4', label: 'Semana 4 (25 a 31 jan. 2026)' },
      { value: '3', label: 'Semana 3 (18 a 24 jan. 2026)' },
      { value: '2', label: 'Semana 2 (11 a 17 jan. 2026)' },
      { value: '1', label: 'Semana 1 (04 a 10 jan. 2026)' }
    ]
  }

  function getRegions(): RegionOption[] {
    return [
      { id: 'brasil', label: 'Brasil' },
      { id: 'norte', label: 'Norte' },
      { id: 'nordeste', label: 'Nordeste' },
      { id: 'centro-oeste', label: 'Centro-Oeste' },
      { id: 'sudeste', label: 'Sudeste' },
      { id: 'sul', label: 'Sul' }
    ]
  }

  return { getPanorama, getRegionTable, getEstados, getSemanas, getRegions }
}
