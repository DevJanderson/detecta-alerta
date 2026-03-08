interface AlertCity {
  name: string
  coords: Coordenadas
  level: string
  cases: number
  trend: string
}

interface CityConnection {
  from: string
  to: string
}

export const BRAZIL_CENTER: Coordenadas = Object.freeze({ lng: -51.9253, lat: -14.235 })
export const BRAZIL_ZOOM = 4

// Estilo vetorial gratuito (OpenFreeMap — sem API key)
export const VECTOR_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

// Dados mock: cidades com "alerta epidemiológico"
export const ALERT_CITIES: AlertCity[] = [
  {
    name: 'São Paulo',
    coords: { lng: -46.6333, lat: -23.5505 },
    level: 'alto',
    cases: 1247,
    trend: '+12%'
  },
  {
    name: 'Rio de Janeiro',
    coords: { lng: -43.1729, lat: -22.9068 },
    level: 'alto',
    cases: 892,
    trend: '+8%'
  },
  {
    name: 'Belo Horizonte',
    coords: { lng: -43.9378, lat: -19.9191 },
    level: 'medio',
    cases: 534,
    trend: '+3%'
  },
  {
    name: 'Salvador',
    coords: { lng: -38.5108, lat: -12.9714 },
    level: 'medio',
    cases: 421,
    trend: '+5%'
  },
  {
    name: 'Recife',
    coords: { lng: -34.8771, lat: -8.0476 },
    level: 'medio',
    cases: 387,
    trend: '+2%'
  },
  {
    name: 'Fortaleza',
    coords: { lng: -38.5434, lat: -3.7172 },
    level: 'baixo',
    cases: 198,
    trend: '-4%'
  },
  {
    name: 'Manaus',
    coords: { lng: -60.0217, lat: -3.119 },
    level: 'alto',
    cases: 756,
    trend: '+15%'
  },
  {
    name: 'Curitiba',
    coords: { lng: -49.2715, lat: -25.4284 },
    level: 'baixo',
    cases: 145,
    trend: '-2%'
  },
  {
    name: 'Porto Alegre',
    coords: { lng: -51.1694, lat: -30.0346 },
    level: 'baixo',
    cases: 112,
    trend: '-6%'
  },
  {
    name: 'Brasília',
    coords: { lng: -47.8825, lat: -15.7942 },
    level: 'medio',
    cases: 367,
    trend: '+1%'
  },
  {
    name: 'Belém',
    coords: { lng: -48.5044, lat: -1.4558 },
    level: 'alto',
    cases: 623,
    trend: '+18%'
  },
  {
    name: 'Goiânia',
    coords: { lng: -49.2533, lat: -16.6869 },
    level: 'baixo',
    cases: 178,
    trend: '-1%'
  }
]

// Conexões entre cidades (rotas de propagação simuladas)
export const CONNECTIONS: CityConnection[] = [
  { from: 'São Paulo', to: 'Rio de Janeiro' },
  { from: 'São Paulo', to: 'Belo Horizonte' },
  { from: 'São Paulo', to: 'Curitiba' },
  { from: 'Rio de Janeiro', to: 'Salvador' },
  { from: 'Salvador', to: 'Recife' },
  { from: 'Recife', to: 'Fortaleza' },
  { from: 'Manaus', to: 'Belém' },
  { from: 'Brasília', to: 'Goiânia' },
  { from: 'Belo Horizonte', to: 'Brasília' },
  { from: 'Curitiba', to: 'Porto Alegre' }
]

export const LEVEL_COLORS: Record<string, string> = {
  alto: '#e53e3e',
  medio: '#eab308',
  baixo: '#22c55e'
}

export const LEVEL_LABELS: Record<string, string> = {
  alto: 'Alto',
  medio: 'Moderado',
  baixo: 'Baixo'
}

export const REGION_COLORS: Record<string, string> = {
  Norte: '#22c55e',
  Nordeste: '#eab308',
  'Centro-Oeste': '#f97316',
  Sudeste: '#3b82f6',
  Sul: '#8b5cf6'
}
