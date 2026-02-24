# Layer Rumores - CLAUDE.md

Feed de rumores epidemiologicos com filtros, paginacao cursor-based e infinite scroll.

## Arquitetura

```
Cliente -> BFF (Nuxt Server) -> API Sinapse (/noticias)
```

A API Sinapse usa o termo **"noticias"** internamente. O BFF expoe como `/api/rumores/`.

## Estrutura

```
layers/4-rumores/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── RumoresBadges.vue             # Badges doenca/localizacao/onehealth
│   │   ├── RumoresCard.vue               # Card individual (imagem, titulo, badges, fonte, data)
│   │   ├── RumoresFeed.vue               # Lista + infinite scroll (IntersectionObserver)
│   │   └── RumoresFilters.vue            # Filtros: busca, doenca, estado (sync com URL)
│   │
│   ├── composables/
│   │   ├── types.ts                      # Re-export Kubb + RumoresListParams
│   │   ├── useRumoresApi.ts              # Service: chamadas ao BFF
│   │   └── useRumoresStore.ts            # Pinia: estado + filtros (persistidos) + lookups
│   │
│   └── pages/rumores/
│       └── index.vue                     # /rumores (feed, auth-guard)
│
└── server/api/rumores/
    ├── index.get.ts                      # GET /api/rumores/ (cursor-based, 14 query params)
    ├── [uniqueId].get.ts                 # GET /api/rumores/:uniqueId
    ├── [uniqueId].relacionadas.get.ts    # GET /api/rumores/:uniqueId/relacionadas
    └── operacoes/
        ├── doencas.get.ts                # GET lookups de doencas
        ├── sintomas.get.ts               # GET lookups de sintomas
        └── localizacoes.get.ts           # GET lookups de localizacoes
```

## Protecao de Rotas

Todas as paginas requerem autenticacao (API Sinapse exige token em todos os endpoints de noticias).

```vue
<script setup>
definePageMeta({ middleware: 'auth-guard' })
</script>
```

## Endpoints BFF

Todos requerem autenticacao (OAuth2).

| Metodo | Rota BFF                              | API Sinapse                              |
| ------ | ------------------------------------- | ---------------------------------------- |
| GET    | `/api/rumores/`                       | `GET /noticias/`                         |
| GET    | `/api/rumores/:uniqueId`              | `GET /noticias/{unique_id}`              |
| GET    | `/api/rumores/:uniqueId/relacionadas` | `GET /noticias/{unique_id}/relacionadas` |
| GET    | `/api/rumores/operacoes/doencas`      | `GET /noticias/operacoes/doencas`        |
| GET    | `/api/rumores/operacoes/sintomas`     | `GET /noticias/operacoes/sintomas`       |
| GET    | `/api/rumores/operacoes/localizacoes` | `GET /noticias/operacoes/localizacoes`   |

### Query params do feed (`GET /api/rumores/`)

Whitelist: `cursor`, `limit`, `search_term`, `doencas`, `sintomas`, `localizacoes`, `states`, `fonte`, `status`, `relevancia_minima`, `tipo_evento`, `categoria`, `classificacao_onehealth`, datas de coleta e evento.

## Store (useRumoresStore)

Persistencia: `filtros` sao salvos no localStorage via `pinia-plugin-persistedstate`.

**Estado:**

- `items` (shallowRef) — lista do feed
- `cursor` — cursor de paginacao (cursor-based, nao offset)
- `hasMore` — controle do infinite scroll
- `filtros` — filtros ativos (**persistidos**)
- `filtrosAtivos` (computed) — conta filtros aplicados
- `doencas`, `sintomas`, `localizacoes` (shallowRef) — lookups cacheados
- `lookupsLoaded` — evita re-fetch dos lookups
- `rumoreAtual` — detalhe da noticia selecionada

**Actions:**

- `fetchRumores(reset?)` — busca pagina (limit: 20); reset limpa lista + cursor
- `fetchRumore(uniqueId)` — busca detalhe
- `fetchLookups()` — busca doencas + sintomas + localizacoes em paralelo (idempotente)
- `aplicarFiltros(novosFiltros)` — merge e refetch
- `limparFiltros()` — reseta e refetch

## Componentes

### RumoresFilters

Sincroniza filtros com a URL via `router.replace({ query })`. Inicializa a partir de `route.query` no `onMounted`. Campos: busca (debounce 500ms via `useDebounce`), select doenca, select estado (27 UFs hardcoded).

### RumoresFeed

Implementa infinite scroll via `IntersectionObserver` com `rootMargin: '200px'`. Estados visuais: loading (6 skeletons), feed, fim, vazio (com/sem filtros), erro.

### RumoresCard

Card clicavel via `NuxtLink` para `/rumores/:uniqueId`. Exibe imagem (lazy), titulo (2 linhas), descricao truncada (150 chars), badges, favicon + fonte + data relativa.

### RumoresBadges

Badges: doenca principal (vermelho), localizacao "Nome, UF" (azul), classificacao onehealth (outline).
