# Mapa API / BFF - Layer de Notícias

Mapeamento entre endpoints BFF (Nuxt Server) e API Sinapse para a layer `4-noticias`.

> Data: 2026-02-12

---

## Princípios

1. **Todo acesso à API Sinapse passa pelo BFF** - nunca chamar a API Sinapse diretamente do cliente
2. **Tokens em cookies httpOnly** - o BFF injeta o `Authorization` header usando `fetchSinapse()`
3. **Validação com Zod** - todas as respostas da API são validadas com schemas gerados pelo Kubb
4. **Endpoints públicos** não requerem autenticação no BFF (mas o BFF ainda faz o proxy)
5. **Endpoints admin** usam `requireAdmin()` do `server/utils/admin.ts`

---

## Endpoints BFF

### Leitura pública

Endpoints acessíveis sem autenticação. O BFF faz proxy sem token.

| BFF (Nuxt Server)                          | API Sinapse                            | Auth | Validação                   |
| ------------------------------------------ | -------------------------------------- | ---- | --------------------------- |
| `GET /api/noticias/`                       | `GET /noticias/`                       | Não  | `noticiaListResponseSchema` |
| `GET /api/noticias/operacoes/doencas`      | `GET /noticias/operacoes/doencas`      | Não  | Schema de doença            |
| `GET /api/noticias/operacoes/sintomas`     | `GET /noticias/operacoes/sintomas`     | Não  | Schema de sintoma           |
| `GET /api/noticias/operacoes/localizacoes` | `GET /noticias/operacoes/localizacoes` | Não  | Schema de região            |

> **Nota:** A listagem pública retorna dados completos da API, mas o **componente Vue** renderiza apenas campos públicos no card.

### Leitura autenticada

Endpoints que requerem `requireAuth()` (retorna accessToken).

| BFF (Nuxt Server)                           | API Sinapse                              | Auth          | Validação                            |
| ------------------------------------------- | ---------------------------------------- | ------------- | ------------------------------------ |
| `GET /api/noticias/:uniqueId`               | `GET /noticias/{unique_id}`              | `requireAuth` | `noticiaSchema`                      |
| `GET /api/noticias/:uniqueId/relacionadas`  | `GET /noticias/{unique_id}/relacionadas` | `requireAuth` | `noticiasRelacionadasResponseSchema` |
| `GET /api/noticias/estatisticas/resumo`     | `GET /noticias/estatisticas/resumo`      | `requireAuth` | `noticiaStatsSchema`                 |
| `GET /api/noticias/estatisticas/temporal`   | `GET /noticias/estatisticas/temporal`    | `requireAuth` | `analiseTemporalNoticiasSchema`      |
| `GET /api/noticias/estatisticas/geografica` | `GET /noticias/estatisticas/geografica`  | `requireAuth` | `analiseGeograficaNoticiasSchema`    |
| `GET /api/noticias/estatisticas/alertas`    | `GET /noticias/estatisticas/alertas`     | `requireAuth` | `resumoAlertasNoticiasSchema`        |

### Admin (moderação)

Endpoints que requerem `requireAdmin()`.

| BFF (Nuxt Server)                      | API Sinapse                    | Auth           | Validação                                                 |
| -------------------------------------- | ------------------------------ | -------------- | --------------------------------------------------------- |
| `PUT /api/noticias/admin/:uniqueId`    | `PUT /noticias/{unique_id}`    | `requireAdmin` | `noticiaUpdateSchema` (body) + `noticiaSchema` (response) |
| `DELETE /api/noticias/admin/:uniqueId` | `DELETE /noticias/{unique_id}` | `requireAdmin` | -                                                         |

---

## Estrutura de arquivos (server/)

```
layers/4-noticias/server/
├── api/noticias/
│   ├── index.get.ts                      # GET /api/noticias/
│   ├── [uniqueId].get.ts                 # GET /api/noticias/:uniqueId
│   ├── [uniqueId].relacionadas.get.ts    # GET /api/noticias/:uniqueId/relacionadas
│   │
│   ├── estatisticas/
│   │   ├── resumo.get.ts                 # GET /api/noticias/estatisticas/resumo
│   │   ├── temporal.get.ts               # GET /api/noticias/estatisticas/temporal
│   │   ├── geografica.get.ts             # GET /api/noticias/estatisticas/geografica
│   │   └── alertas.get.ts               # GET /api/noticias/estatisticas/alertas
│   │
│   ├── operacoes/
│   │   ├── doencas.get.ts                # GET /api/noticias/operacoes/doencas
│   │   ├── sintomas.get.ts               # GET /api/noticias/operacoes/sintomas
│   │   └── localizacoes.get.ts           # GET /api/noticias/operacoes/localizacoes
│   │
│   └── admin/
│       ├── [uniqueId].put.ts             # PUT /api/noticias/admin/:uniqueId
│       └── [uniqueId].delete.ts          # DELETE /api/noticias/admin/:uniqueId
```

**Total: 13 endpoints BFF**

---

## Padrão de implementação

### Endpoint público (sem auth)

```typescript
// layers/4-noticias/server/api/noticias/index.get.ts
import { noticiaListResponseSchema } from '~/generated/sinapse/zod/noticiaListResponseSchema'

export default defineEventHandler(async event => {
  const query = getQuery(event)

  // Proxy query params para API Sinapse
  const queryString = new URLSearchParams(
    Object.entries(query).filter(([_, v]) => v !== undefined) as [string, string][]
  ).toString()

  const rawResponse = await fetchSinapse(`/noticias/?${queryString}`)
  return noticiaListResponseSchema.parse(rawResponse)
})
```

### Endpoint autenticado

```typescript
// layers/4-noticias/server/api/noticias/[uniqueId].get.ts
import { noticiaSchema } from '~/generated/sinapse/zod/noticiaSchema'

export default defineEventHandler(async event => {
  const accessToken = requireAuth(event)
  const uniqueId = getRouterParam(event, 'uniqueId')

  const rawResponse = await fetchSinapse(`/noticias/${uniqueId}`, {
    accessToken
  })

  return noticiaSchema.parse(rawResponse)
})
```

### Endpoint admin

```typescript
// layers/4-noticias/server/api/noticias/admin/[uniqueId].put.ts
import { noticiaUpdateSchema } from '~/generated/sinapse/zod/noticiaUpdateSchema'
import { noticiaSchema } from '~/generated/sinapse/zod/noticiaSchema'

export default defineEventHandler(async event => {
  await requireAdmin(event)
  const accessToken = requireAuth(event)
  const uniqueId = getRouterParam(event, 'uniqueId')

  const body = await readBody(event)
  const validatedBody = noticiaUpdateSchema.parse(body)

  const rawResponse = await fetchSinapse(`/noticias/${uniqueId}`, {
    method: 'PUT',
    body: validatedBody,
    accessToken
  })

  return noticiaSchema.parse(rawResponse)
})
```

---

## Passagem de query params

### Listagem (GET /api/noticias/)

O BFF faz pass-through dos query params recebidos para a API Sinapse:

```
Cliente: GET /api/noticias/?doencas=dengue&states=SP&limit=20
  ↓
BFF: GET {SINAPSE_URL}/noticias/?doencas=dengue&states=SP&limit=20
```

### Estatísticas

O BFF faz pass-through dos params obrigatórios e opcionais:

```
Cliente: GET /api/noticias/estatisticas/temporal?data_inicio=2026-01-01&data_fim=2026-02-12&granularidade=semana
  ↓
BFF: GET {SINAPSE_URL}/noticias/estatisticas/temporal?data_inicio=2026-01-01&data_fim=2026-02-12&granularidade=semana
```

---

## Schemas Kubb utilizados

### Tipos (imports de tipo)

```typescript
import type { Noticia } from '~/generated/sinapse/types/Noticia'
import type { NoticiaListResponse } from '~/generated/sinapse/types/NoticiaListResponse'
import type { NoticiaResumida } from '~/generated/sinapse/types/NoticiaResumida'
import type { NoticiaCreate } from '~/generated/sinapse/types/NoticiaCreate'
import type { NoticiaUpdate } from '~/generated/sinapse/types/NoticiaUpdate'
import type { NoticiaStats } from '~/generated/sinapse/types/NoticiaStats'
import type { AnaliseTemporalNoticias } from '~/generated/sinapse/types/AnaliseTemporalNoticias'
import type { AnaliseGeograficaNoticias } from '~/generated/sinapse/types/AnaliseGeograficaNoticias'
import type { ResumoAlertasNoticias } from '~/generated/sinapse/types/ResumoAlertasNoticias'
import type { NoticiasRelacionadasResponse } from '~/generated/sinapse/types/NoticiasRelacionadasResponse'
```

### Schemas Zod (validação runtime)

```typescript
import { noticiaSchema } from '~/generated/sinapse/zod/noticiaSchema'
import { noticiaListResponseSchema } from '~/generated/sinapse/zod/noticiaListResponseSchema'
import { noticiaUpdateSchema } from '~/generated/sinapse/zod/noticiaUpdateSchema'
import { noticiaStatsSchema } from '~/generated/sinapse/zod/noticiaStatsSchema'
import { analiseTemporalNoticiasSchema } from '~/generated/sinapse/zod/analiseTemporalNoticiasSchema'
import { analiseGeograficaNoticiasSchema } from '~/generated/sinapse/zod/analiseGeograficaNoticiasSchema'
import { resumoAlertasNoticiasSchema } from '~/generated/sinapse/zod/resumoAlertasNoticiasSchema'
```

> **Verificar:** Confirmar que esses schemas existem em `generated/sinapse/zod/` após o último `npm run api:generate`.

---

## Utils compartilhados (reutilizados)

| Util                 | Origem                                    | Uso                         |
| -------------------- | ----------------------------------------- | --------------------------- |
| `fetchSinapse()`     | `layers/1-auth/server/utils/auth.ts`      | Fetch com headers e timeout |
| `requireAuth()`      | `layers/3-usuarios/server/utils/admin.ts` | Retorna accessToken ou 401  |
| `requireAdmin()`     | `layers/3-usuarios/server/utils/admin.ts` | Verifica grupo admin ou 403 |
| `getSinapseApiUrl()` | `layers/1-auth/server/utils/auth.ts`      | URL base da API             |

> **Nota:** Os utils de `1-auth` e `3-usuarios` são auto-importados pelo Nuxt (server utils são globais entre layers).

---

## Composables (client-side)

### useNoticiasApi (service)

```typescript
// layers/4-noticias/app/composables/useNoticiasApi.ts
export function useNoticiasApi() {
  // Leitura pública
  async function listar(params?) {
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

  // Leitura autenticada
  async function obter(uniqueId) {
    return $fetch(`/api/noticias/${uniqueId}`)
  }
  async function relacionadas(uniqueId, params?) {
    return $fetch(`/api/noticias/${uniqueId}/relacionadas`, { query: params })
  }

  // Estatísticas
  async function estatisticasResumo() {
    return $fetch('/api/noticias/estatisticas/resumo')
  }
  async function estatisticasTemporal(params) {
    return $fetch('/api/noticias/estatisticas/temporal', { query: params })
  }
  async function estatisticasGeografica(params) {
    return $fetch('/api/noticias/estatisticas/geografica', { query: params })
  }
  async function estatisticasAlertas(params?) {
    return $fetch('/api/noticias/estatisticas/alertas', { query: params })
  }

  // Admin
  async function atualizar(uniqueId, body) {
    return $fetch(`/api/noticias/admin/${uniqueId}`, { method: 'PUT', body })
  }
  async function remover(uniqueId) {
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

### useNoticiasStore (Pinia)

```typescript
// layers/4-noticias/app/composables/useNoticiasStore.ts
export const useNoticiasStore = defineStore('noticias', () => {
  // Estado
  const items = ref([])           // Lista de notícias
  const noticiaAtual = ref(null)  // Notícia em detalhe
  const cursor = ref(null)        // Cursor para paginação
  const hasMore = ref(true)       // Tem mais páginas
  const isLoading = ref(false)
  const error = ref(null)
  const filtros = ref({})         // Filtros ativos

  // Lookups (cacheados)
  const doencas = ref([])
  const sintomas = ref([])
  const localizacoes = ref([])

  // Actions
  async function fetchNoticias(reset = false) { ... }
  async function fetchMais() { ... }  // Carrega próxima página
  async function fetchNoticia(uniqueId) { ... }
  async function fetchRelacionadas(uniqueId) { ... }
  async function fetchLookups() { ... }
  async function aplicarFiltros(novosFiltros) { ... }
  async function limparFiltros() { ... }

  // Admin
  async function atualizarNoticia(uniqueId, data) { ... }
  async function removerNoticia(uniqueId) { ... }

  return { ... }
})
```
