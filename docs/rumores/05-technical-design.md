# Technical Design - Layer 4-noticias

Especificação técnica para implementação da layer de notícias epidemiológicas.

> Data: 2026-02-12

---

## Estrutura da layer

```
layers/4-noticias/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── NoticiasCard.vue              # Card de notícia (feed)
│   │   ├── NoticiasFeed.vue              # Lista de cards com infinite scroll
│   │   ├── NoticiasFilters.vue           # Filtros básicos (público)
│   │   ├── NoticiasFiltersAdvanced.vue   # Filtros avançados (auth)
│   │   ├── NoticiasDetalhe.vue           # Conteúdo completo da notícia
│   │   ├── NoticiasRelacionadas.vue      # Cards de notícias relacionadas
│   │   ├── NoticiasBadges.vue            # Badges de doença, localização, etc.
│   │   ├── NoticiasAdminActions.vue      # Dropdown de ações admin
│   │   ├── NoticiasAdminStatusDialog.vue # Dialog alterar status
│   │   ├── NoticiasAdminEditDialog.vue   # Dialog editar classificação
│   │   │
│   │   ├── stats/
│   │   │   ├── StatsResumo.vue           # Cards de resumo
│   │   │   ├── StatsTendencias.vue       # Gráfico temporal
│   │   │   ├── StatsGeografico.vue       # Mapa coroplético
│   │   │   └── StatsAlertas.vue          # Lista de alertas
│   │   │
│   │   └── ui/
│   │       ├── DateRangePicker.vue       # Seletor de período
│   │       └── RelevanciaIndicator.vue   # Indicador visual de relevância
│   │
│   ├── composables/
│   │   ├── types.ts                      # Re-export Kubb + tipos BFF
│   │   ├── useNoticiasApi.ts             # Service: chamadas ao BFF
│   │   └── useNoticiasStore.ts           # Pinia: estado + cache + filtros
│   │
│   └── pages/
│       └── noticias/
│           ├── index.vue                 # /noticias (feed público)
│           ├── [uniqueId].vue            # /noticias/:uniqueId (detalhe, auth)
│           └── estatisticas.vue          # /noticias/estatisticas (dashboard, auth)
│
└── server/
    └── api/noticias/
        ├── index.get.ts
        ├── [uniqueId].get.ts
        ├── [uniqueId].relacionadas.get.ts
        ├── estatisticas/
        │   ├── resumo.get.ts
        │   ├── temporal.get.ts
        │   ├── geografica.get.ts
        │   └── alertas.get.ts
        ├── operacoes/
        │   ├── doencas.get.ts
        │   ├── sintomas.get.ts
        │   └── localizacoes.get.ts
        └── admin/
            ├── [uniqueId].put.ts
            └── [uniqueId].delete.ts
```

---

## nuxt.config.ts

```typescript
// layers/4-noticias/nuxt.config.ts
export default defineNuxtConfig({
  // Layer mínima - herda tudo de 0-base
})
```

---

## Composables

### types.ts

```typescript
// layers/4-noticias/app/composables/types.ts

// Re-export dos tipos Kubb
export type { Noticia } from '~/generated/sinapse/types/Noticia'
export type { NoticiaListResponse } from '~/generated/sinapse/types/NoticiaListResponse'
export type { NoticiaResumida } from '~/generated/sinapse/types/NoticiaResumida'
export type { NoticiaUpdate } from '~/generated/sinapse/types/NoticiaUpdate'
export type { NoticiaStats } from '~/generated/sinapse/types/NoticiaStats'
export type { AnaliseTemporalNoticias } from '~/generated/sinapse/types/AnaliseTemporalNoticias'
export type { AnaliseGeograficaNoticias } from '~/generated/sinapse/types/AnaliseGeograficaNoticias'
export type { ResumoAlertasNoticias } from '~/generated/sinapse/types/ResumoAlertasNoticias'
export type { NoticiasRelacionadasResponse } from '~/generated/sinapse/types/NoticiasRelacionadasResponse'

// Tipos BFF (não existem no Kubb)
export interface NoticiasListParams {
  cursor?: string
  limit?: number
  search_term?: string
  doencas?: string[]
  sintomas?: string[]
  localizacoes?: string[]
  states?: string[]
  fonte?: string[]
  status?: 'active' | 'archived' | 'flagged'
  relevancia_minima?: number
  tipo_evento?: string
  categoria?: string
  classificacao_onehealth?: string
  data_coleta_de?: string
  data_coleta_ate?: string
  data_evento_de?: string
  data_evento_ate?: string
}

export interface EstatisticasTemporalParams {
  data_inicio: string
  data_fim: string
  granularidade?: 'dia' | 'semana' | 'mes'
  doencas?: string[]
  estados?: string[]
  cidades?: string[]
  incluir_alertas?: boolean
  limite_alertas?: number
}

export interface EstatisticasGeograficaParams {
  data_inicio: string
  data_fim: string
  nivel_geografico?: 'estadual' | 'municipal'
  estados?: string[]
  doencas?: string[]
  incluir_concentracoes?: boolean
  incluir_vazios?: boolean
  limite_municipios?: number
}

export interface EstatisticasAlertasParams {
  dias_analise?: number
  severidade_minima?: 'baixa' | 'media' | 'alta'
  estados?: string[]
  incluir_indicadores?: boolean
  limite_alertas?: number
}
```

### useNoticiasApi.ts

```typescript
// layers/4-noticias/app/composables/useNoticiasApi.ts
import type {
  Noticia,
  NoticiaListResponse,
  NoticiaUpdate,
  NoticiaStats,
  AnaliseTemporalNoticias,
  AnaliseGeograficaNoticias,
  ResumoAlertasNoticias,
  NoticiasRelacionadasResponse,
  NoticiasListParams,
  EstatisticasTemporalParams,
  EstatisticasGeograficaParams,
  EstatisticasAlertasParams
} from './types'

export function useNoticiasApi() {
  // === Leitura pública ===
  async function listar(params?: NoticiasListParams): Promise<NoticiaListResponse> {
    return $fetch('/api/noticias/', { query: params })
  }

  async function listarDoencas() {
    return $fetch('/api/noticias/operacoes/doencas')
  }

  async function listarSintomas() {
    return $fetch('/api/noticias/operacoes/sintomas')
  }

  async function listarLocalizacoes() {
    return $fetch('/api/noticias/operacoes/localizacoes')
  }

  // === Leitura autenticada ===
  async function obter(uniqueId: string): Promise<Noticia> {
    return $fetch(`/api/noticias/${uniqueId}`)
  }

  async function relacionadas(uniqueId: string, limit = 5): Promise<NoticiasRelacionadasResponse> {
    return $fetch(`/api/noticias/${uniqueId}/relacionadas`, {
      query: { limit }
    })
  }

  // === Estatísticas ===
  async function estatisticasResumo(): Promise<NoticiaStats> {
    return $fetch('/api/noticias/estatisticas/resumo')
  }

  async function estatisticasTemporal(
    params: EstatisticasTemporalParams
  ): Promise<AnaliseTemporalNoticias> {
    return $fetch('/api/noticias/estatisticas/temporal', { query: params })
  }

  async function estatisticasGeografica(
    params: EstatisticasGeograficaParams
  ): Promise<AnaliseGeograficaNoticias> {
    return $fetch('/api/noticias/estatisticas/geografica', { query: params })
  }

  async function estatisticasAlertas(
    params?: EstatisticasAlertasParams
  ): Promise<ResumoAlertasNoticias> {
    return $fetch('/api/noticias/estatisticas/alertas', { query: params })
  }

  // === Admin ===
  async function atualizar(uniqueId: string, body: NoticiaUpdate): Promise<Noticia> {
    return $fetch(`/api/noticias/admin/${uniqueId}`, { method: 'PUT', body })
  }

  async function remover(uniqueId: string): Promise<void> {
    return $fetch(`/api/noticias/admin/${uniqueId}`, { method: 'DELETE' })
  }

  return {
    listar,
    obter,
    relacionadas,
    listarDoencas,
    listarSintomas,
    listarLocalizacoes,
    estatisticasResumo,
    estatisticasTemporal,
    estatisticasGeografica,
    estatisticasAlertas,
    atualizar,
    remover
  }
}
```

### useNoticiasStore.ts

```typescript
// layers/4-noticias/app/composables/useNoticiasStore.ts
import type { Noticia, NoticiaListResponse, NoticiasListParams } from './types'

export const useNoticiasStore = defineStore('noticias', () => {
  const api = useNoticiasApi()

  // === Estado do feed ===
  const items = ref<Noticia[]>([])
  const cursor = ref<string | null>(null)
  const hasMore = ref(true)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // === Filtros ===
  const filtros = ref<NoticiasListParams>({})
  const filtrosAtivos = computed(
    () => Object.entries(filtros.value).filter(([_, v]) => v !== undefined && v !== '').length
  )

  // === Lookups (cacheados) ===
  const doencas = ref<Array<{ id: number; name: string }>>([])
  const sintomas = ref<Array<{ id: number; name: string }>>([])
  const localizacoes = ref<Array<{ id: number; name: string }>>([])
  const lookupsLoaded = ref(false)

  // === Notícia atual (detalhe) ===
  const noticiaAtual = ref<Noticia | null>(null)

  // === Actions ===

  async function fetchNoticias(reset = false) {
    if (reset) {
      items.value = []
      cursor.value = null
      hasMore.value = true
    }

    if (!hasMore.value || isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      const params: NoticiasListParams = {
        ...filtros.value,
        limit: 20,
        ...(cursor.value ? { cursor: cursor.value } : {})
      }

      const response = await api.listar(params)
      items.value = reset ? response.data : [...items.value, ...response.data]
      cursor.value = response.pagination?.next_cursor ?? null
      hasMore.value = response.pagination?.has_next ?? false
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar notícias'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchNoticia(uniqueId: string) {
    isLoading.value = true
    error.value = null

    try {
      noticiaAtual.value = await api.obter(uniqueId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erro ao carregar notícia'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchLookups() {
    if (lookupsLoaded.value) return

    try {
      const [d, s, l] = await Promise.all([
        api.listarDoencas(),
        api.listarSintomas(),
        api.listarLocalizacoes()
      ])
      doencas.value = d
      sintomas.value = s
      localizacoes.value = l
      lookupsLoaded.value = true
    } catch {
      // Silencioso - lookups são opcionais
    }
  }

  function aplicarFiltros(novosFiltros: Partial<NoticiasListParams>) {
    filtros.value = { ...filtros.value, ...novosFiltros }
    fetchNoticias(true) // Reset e recarrega
  }

  function limparFiltros() {
    filtros.value = {}
    fetchNoticias(true)
  }

  return {
    // Estado
    items,
    cursor,
    hasMore,
    isLoading,
    error,
    filtros,
    filtrosAtivos,
    noticiaAtual,
    doencas,
    sintomas,
    localizacoes,
    // Actions
    fetchNoticias,
    fetchNoticia,
    fetchLookups,
    aplicarFiltros,
    limparFiltros
  }
})
```

---

## Páginas

### /noticias (feed público)

```vue
<!-- layers/4-noticias/app/pages/noticias/index.vue -->
<script setup lang="ts">
useSeoPage({
  title: 'Notícias Epidemiológicas - Detecta Alerta',
  description: 'Acompanhe notícias e rumores epidemiológicos do Brasil em tempo real.'
})

const store = useNoticiasStore()
const authStore = useAuthStore()

// SSR: carrega dados iniciais
await store.fetchNoticias(true)
await store.fetchLookups()
</script>

<template>
  <div class="container mx-auto py-6">
    <!-- Filtros básicos (sempre visíveis) -->
    <NoticiasFilters />

    <!-- Filtros avançados (auth only) -->
    <NoticiasFiltersAdvanced v-if="authStore.isAuthenticated" />

    <!-- Feed -->
    <NoticiasFeed />
  </div>
</template>
```

### /noticias/:uniqueId (detalhe, auth)

```vue
<!-- layers/4-noticias/app/pages/noticias/[uniqueId].vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

const route = useRoute()
const uniqueId = route.params.uniqueId as string

useSeoPage({
  title: 'Notícia - Detecta Alerta',
  noindex: true
})

const store = useNoticiasStore()
await store.fetchNoticia(uniqueId)
</script>

<template>
  <div class="container mx-auto py-6">
    <NoticiasDetalhe v-if="store.noticiaAtual" :noticia="store.noticiaAtual" />
  </div>
</template>
```

### /noticias/estatisticas (dashboard, auth)

```vue
<!-- layers/4-noticias/app/pages/noticias/estatisticas.vue -->
<script setup lang="ts">
definePageMeta({
  middleware: 'auth-guard'
})

useSeoPage({
  title: 'Estatísticas - Detecta Alerta',
  noindex: true
})
</script>

<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-6">Estatísticas Epidemiológicas</h1>

    <Tabs default-value="resumo">
      <TabsList>
        <TabsTrigger value="resumo">Resumo</TabsTrigger>
        <TabsTrigger value="tendencias">Tendências</TabsTrigger>
        <TabsTrigger value="geografico">Geográfico</TabsTrigger>
        <TabsTrigger value="alertas">Alertas</TabsTrigger>
      </TabsList>

      <TabsContent value="resumo"><StatsResumo /></TabsContent>
      <TabsContent value="tendencias"><StatsTendencias /></TabsContent>
      <TabsContent value="geografico"><StatsGeografico /></TabsContent>
      <TabsContent value="alertas"><StatsAlertas /></TabsContent>
    </Tabs>
  </div>
</template>
```

---

## Componentes-chave

### NoticiasCard.vue

Props: `noticia: Noticia`

Layout:

```
┌─────────────────────────────────────┐
│ [imagem]  Título da notícia         │
│           Descrição truncada...     │
│           🦟 Dengue  📍 SP          │
│           G1 · há 2 horas          │
└─────────────────────────────────────┘
```

- Imagem opcional (`url_imagem`) com fallback para cor sólida
- Badges de doença e localização (1-2 cada)
- Fonte com ícone (`icone_fonte[0]`)
- Data relativa (`data_publicacao` ou `data_coleta`)
- Click: navega para `/noticias/:uniqueId` (se auth) ou prompt login

### NoticiasFeed.vue

- Renderiza lista de `NoticiasCard`
- Infinite scroll via `IntersectionObserver` no último card
- Loading: skeleton cards (6)
- Empty state: "Nenhuma notícia encontrada"
- Error state: alert com botão retry

### NoticiasFilters.vue

- Input de busca com debounce (500ms)
- Combobox de doença (dados do lookup)
- Select de estado (lista fixa de UFs)
- DateRangePicker para data de coleta
- Indicador "N filtros ativos" + botão limpar

### StatsGeografico.vue

- Mapa coroplético do Brasil (SVG ou canvas)
- Coloração por quantidade de notícias (escala de cor)
- Tooltip com nome do estado + contagem
- Tabela complementar abaixo do mapa

---

## Decisões técnicas

### Bibliotecas de gráficos

| Opção                        | Prós                                            | Contras                       | Decisão             |
| ---------------------------- | ----------------------------------------------- | ----------------------------- | ------------------- |
| **Chart.js** via vue-chartjs | Leve (~60KB), conhecido, bom para barras/linhas | Menos customizável            | Recomendado para V1 |
| ECharts                      | Poderoso, mapas integrados                      | Pesado (~300KB)               | V2 se necessário    |
| D3.js                        | Máxima flexibilidade                            | Complexo, sem componentes Vue | Não recomendado     |

**Decisão:** `vue-chartjs` + `chart.js` para gráficos. Mapa coroplético via SVG estático do Brasil.

### Mapa coroplético

| Opção            | Prós                                 | Contras                           | Decisão         |
| ---------------- | ------------------------------------ | --------------------------------- | --------------- |
| **SVG estático** | Leve, sem deps, customizável via CSS | Requer SVG do Brasil              | Recomendado V1  |
| Leaflet          | Interativo, zoom, layers             | Pesado, complexo                  | V2              |
| GeoJSON + D3     | Flexível                             | Arquivo grande (8.7MB no projeto) | Não recomendado |

**Decisão:** SVG inline do Brasil com estados como `<path>`. Estilização via Tailwind classes dinâmicas baseadas no dado.

### Paginação

Cursor-based (suportado pela API). Usar `IntersectionObserver` para infinite scroll:

```typescript
const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && hasMore.value) {
    fetchNoticias()
  }
})
```

### Filtros na URL

Filtros são sincronizados com query params via `useRoute` + `watch`:

```typescript
const route = useRoute()
const router = useRouter()

// URL → Store
watch(
  () => route.query,
  query => {
    store.aplicarFiltros(parseQueryParams(query))
  },
  { immediate: true }
)

// Store → URL
watch(
  () => store.filtros,
  filtros => {
    router.replace({ query: buildQueryParams(filtros) })
  }
)
```

### Cache de lookups

Lookups (doenças, sintomas, localizações) são carregados uma vez e cacheados no store. Em `useFetch` com key:

```typescript
// Na página, para SSR
const { data: doencas } = await useFetch('/api/noticias/operacoes/doencas', {
  key: 'noticias-doencas'
})
```

---

## Dependências novas

| Pacote        | Versão | Uso                       | Bundle impact |
| ------------- | ------ | ------------------------- | ------------- |
| `chart.js`    | ^4.x   | Gráficos                  | ~60KB gzip    |
| `vue-chartjs` | ^5.x   | Wrapper Vue para Chart.js | ~5KB          |

> **Nota:** Não instalar até iniciar a feature de estatísticas (F4). Feed e detalhe não precisam de dependências novas.

---

## Ordem de implementação

### Fase 1: Estrutura + Feed (F1)

1. Criar layer `4-noticias` com `nuxt.config.ts`
2. Criar `CLAUDE.md` da layer
3. Implementar `composables/types.ts`
4. Implementar `useNoticiasApi.ts`
5. Implementar endpoints BFF públicos (index.get, operacoes)
6. Implementar `useNoticiasStore.ts` (feed + filtros básicos)
7. Implementar `NoticiasCard.vue`
8. Implementar `NoticiasFilters.vue`
9. Implementar `NoticiasFeed.vue`
10. Implementar `pages/noticias/index.vue`

### Fase 2: Detalhe (F2)

11. Implementar endpoint BFF autenticado ([uniqueId].get, relacionadas.get)
12. Implementar `NoticiasDetalhe.vue`
13. Implementar `NoticiasBadges.vue`
14. Implementar `NoticiasRelacionadas.vue`
15. Implementar `pages/noticias/[uniqueId].vue`

### Fase 3: Filtros avançados (F3)

16. Implementar `NoticiasFiltersAdvanced.vue`
17. Sincronização filtros ↔ URL

### Fase 4: Estatísticas (F4)

18. Instalar chart.js + vue-chartjs
19. Implementar endpoints BFF de estatísticas
20. Implementar `StatsResumo.vue`
21. Implementar `StatsAlertas.vue`
22. Implementar `StatsTendencias.vue`
23. Implementar `StatsGeografico.vue` (SVG mapa)
24. Implementar `pages/noticias/estatisticas.vue`

### Fase 5: Admin (F5)

25. Implementar endpoints BFF admin
26. Implementar `NoticiasAdminActions.vue`
27. Implementar `NoticiasAdminStatusDialog.vue`
28. Implementar `NoticiasAdminEditDialog.vue`

---

## Testes

### Unitários (Vitest)

- `useNoticiasApi` - mock de $fetch, verificar chamadas corretas
- `useNoticiasStore` - mock do api, testar actions, filtros, paginação
- `NoticiasCard` - renderização com diferentes dados (com/sem imagem, com/sem doença)
- `NoticiasFilters` - interação com filtros, debounce

### E2E (Playwright)

- Feed público: carrega, scroll, filtros básicos
- Detalhe: auth redirect, conteúdo completo
- Estatísticas: tabs, gráficos renderizam
- Admin: ações de moderação
