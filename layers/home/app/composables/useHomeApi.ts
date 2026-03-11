import type { PanoramaData, RegionRow, SelectOption } from './types'

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
        region: 'Norte',
        todos: { level: 'Normal', value: '4%', trend: 'down' },
        drogarias: { level: 'Normal', value: '4%', trend: 'down' },
        upa: { level: 'Normal', value: '4%', trend: 'down' },
        ubs: { level: 'Normal', value: '4%', trend: 'down' }
      },
      {
        region: 'Nordeste',
        todos: { level: 'Moderado', value: '7%', trend: 'up' },
        drogarias: { level: 'Moderado', value: '17%', trend: 'up' },
        upa: { level: 'Normal', value: '4%', trend: 'up' },
        ubs: { level: 'Normal', value: '4%', trend: 'up' }
      },
      {
        region: 'Centro-Oeste',
        todos: { level: 'Normal', value: '4%', trend: 'down' },
        drogarias: { level: 'Normal', value: '4%', trend: 'down' },
        upa: { level: 'Normal', value: '4%', trend: 'down' },
        ubs: { level: 'Normal', value: '4%', trend: 'down' }
      },
      {
        region: 'Sudeste',
        todos: { level: 'Normal', value: '4%', trend: 'down' },
        drogarias: { level: 'Normal', value: '4%', trend: 'down' },
        upa: { level: 'Normal', value: '4%', trend: 'down' },
        ubs: { level: 'Normal', value: '4%', trend: 'down' }
      },
      {
        region: 'Sul',
        todos: { level: 'Elevado', value: '421%', trend: 'up' },
        drogarias: { level: 'Elevado', value: '421%', trend: 'up' },
        upa: { level: 'Elevado', value: '421%', trend: 'up' },
        ubs: { level: 'Elevado', value: '421%', trend: 'up' }
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

  return { getPanorama, getRegionTable, getEstados, getSemanas }
}
