/**
 * Tipos da feature meu-municipio
 */

/** Cidade com alerta epidemiológico ativo */
export interface AlertCity {
  name: string
  coords: Coordenadas
  level: 'alto' | 'medio' | 'baixo'
  cases: number
  trend: string
}

/** Conexão entre cidades (rota de propagação) */
export interface CityConnection {
  from: string
  to: string
}

/** Notícia/rumor epidemiológico */
export interface Noticia {
  id: string
  title: string
  source: string
  time: string
  tags?: { diseases: string[]; regions: string[] }
}

/** Município selecionado pelo usuário */
export interface MunicipioSelecionado {
  nome: string
  estado: string
  regiao: string
}

/** Aba ativa no aside */
export type AsideTab = 'resumo' | 'rumores'
