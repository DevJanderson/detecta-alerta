---
name: feature-breakdown
description: Break down features into implementable tasks following project patterns
---

## Feature Breakdown Skill

### Ordem de implementação

Sempre criar nesta ordem — cada passo depende do anterior:

```
1. types.ts → 2. useFeatureApi.ts → 3. useFeatureStore.ts → 4. Componentes → 5. Testes
```

Se a feature tiver BFF (endpoints server), inserir entre os passos 1 e 2:

```
1. types.ts → 1b. server/api/ (BFF) → 2. useFeatureApi.ts → ...
```

---

### 1. Types (`types.ts`)

Arquivo: `layers/{feature}/app/composables/types.ts`

Centraliza **todos** os tipos da feature. Componentes nunca definem tipos inline.

```typescript
// Tipos de dados
export type Level = 'Baixo' | 'Médio' | 'Alto'
export type Trend = 'up' | 'down' | 'stable'

export interface CellData {
  level: Level
  value: string
  trend: Trend
}

// Tipos de filtros
export interface FeatureFilters {
  region: string
  estado: string
  semana: string
}

// Tipos de opções de select
export interface SelectOption {
  value: string
  label: string
}
```

**Regras:**

- Se existir tipo Kubb equivalente, re-exportar: `export type { Noticia } from '~/generated/sinapse/types/Noticia'`
- Tipos de filtros sempre com interface própria (`FeatureFilters`)
- Tipos de opções de select reutilizar `SelectOption` (value + label)
- Componentes importam com `import type { X } from '../composables/types'`

---

### 1b. BFF Endpoints (quando aplicável)

Diretório: `layers/{feature}/server/api/{feature}/`

```typescript
// layers/{feature}/server/api/{feature}/index.get.ts
export default defineEventHandler(async event => {
  const qs = buildQueryString(getQuery(event), ['page', 'search', 'status'])
  return handleSinapseRequest({
    fn: () => fetchSinapse(`/endpoint${qs}`, { event }),
    errorContext: 'Erro ao buscar dados',
    schema: myZodSchema // opcional
  })
})
```

**Utilitários auto-importados:** `fetchSinapse`, `handleSinapseRequest`, `validateBody`, `validateRouteParam`, `buildQueryString`, `logger`

---

### 2. Service (`useFeatureApi.ts`)

Arquivo: `layers/{feature}/app/composables/use{Feature}Api.ts`

Função simples (NÃO Pinia), stateless. Cada método = uma chamada de API.

```typescript
import type { DataType, SelectOption, RegionOption } from './types'

export function useFeatureApi() {
  // TODO: substituir por $fetch('/api/feature/data', { query: params })
  async function getData(_params?: Record<string, string>): Promise<DataType> {
    return {
      /* mock data */
    }
  }

  // TODO: substituir por $fetch('/api/feature/opcoes')
  async function getOpcoes(): Promise<SelectOption[]> {
    return [
      { value: '', label: 'Todos' },
      { value: 'a', label: 'Opção A' }
    ]
  }

  // Dados estáticos podem ser síncronos
  function getRegions(): RegionOption[] {
    return [
      { id: 'brasil', label: 'Brasil' },
      { id: 'norte', label: 'Norte' }
    ]
  }

  return { getData, getOpcoes, getRegions }
}
```

**Regras:**

- Retorna tipos importados de `types.ts`, nunca define tipos inline
- Mock data com `// TODO: substituir por $fetch(...)` para rastreabilidade
- Parâmetros mock usam `_params` (underscore) para evitar warning de unused
- Métodos async mesmo para mocks — manter a assinatura que será usada com `$fetch`
- Dados estáticos (listas fixas como regiões) podem ser síncronos
- Quando integrar API: trocar mock por `$fetch('/api/feature/endpoint', { query: params })`

---

### 3. Store (`useFeatureStore.ts`)

Arquivo: `layers/{feature}/app/composables/use{Feature}Store.ts`

Pinia store com Composition API (setup function).

```typescript
import type { DataType, FeatureFilters, SelectOption, RegionOption } from './types'

export const useFeatureStore = defineStore(
  'feature',
  () => {
    const api = useFeatureApi()

    // === Estado principal ===
    const data = ref<DataType | null>(null) // ref() para objetos únicos
    const items = shallowRef<ItemType[]>([]) // shallowRef() para listas
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // === Filtros centralizados ===
    const filtros = ref<FeatureFilters>({
      region: 'brasil',
      estado: '',
      semana: '4'
    })

    // === Lookups (carregados uma vez) ===
    const opcoes = shallowRef<SelectOption[]>([]) // shallowRef() para listas
    const regions = shallowRef<RegionOption[]>([])
    const lookupsLoaded = ref(false)

    // === Computed derivados ===
    const regionLabel = computed(() => {
      const found = regions.value.find(r => r.id === filtros.value.region)
      return found?.label ?? 'Brasil'
    })

    // === Actions ===

    // Lookups com guard — carrega uma vez, não re-busca
    async function fetchLookups() {
      if (lookupsLoaded.value) return
      try {
        const [o] = await Promise.all([api.getOpcoes()])
        opcoes.value = o
        regions.value = api.getRegions()
        lookupsLoaded.value = true
      } catch {
        // Lookups são opcionais — não bloqueia a página
      }
    }

    // Actions com withStoreAction — elimina boilerplate try/catch
    async function fetchData() {
      return withStoreAction({ isLoading, error }, 'Erro ao carregar dados', async () => {
        data.value = await api.getData({
          region: filtros.value.region,
          estado: filtros.value.estado
        })
      })
    }

    // fetchAll — carrega múltiplos dados em paralelo
    async function fetchAll() {
      return withStoreAction({ isLoading, error }, 'Erro ao carregar dados', async () => {
        const [d, i] = await Promise.all([
          api.getData({ region: filtros.value.region }),
          api.getItems({ estado: filtros.value.estado })
        ])
        data.value = d
        items.value = i
      })
    }

    // Setters async — atualizam filtro E re-buscam dados
    async function setRegion(region: string) {
      filtros.value.region = region
      await fetchData()
    }

    async function setEstado(estado: string) {
      filtros.value.estado = estado
      await fetchAll()
    }

    return {
      // Estado
      data,
      items,
      isLoading,
      error,
      filtros,
      // Lookups
      opcoes,
      regions,
      lookupsLoaded,
      // Computed
      regionLabel,
      // Actions
      fetchLookups,
      fetchData,
      fetchAll,
      setRegion,
      setEstado
    }
  },
  {
    persist: {
      pick: ['filtros'] // APENAS filtros — nunca dados de API
    }
  }
)
```

**Padrões obrigatórios:**

| Padrão                    | Regra                                                      | Por quê                                                                                                      |
| ------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `ref()` vs `shallowRef()` | `ref` para objetos únicos, `shallowRef` para listas/arrays | Vue `shallowRef` evita overhead de reatividade profunda em listas que são substituídas inteiras (vue-skilld) |
| `withStoreAction`         | Usar para toda action que faz fetch                        | Elimina boilerplate de `isLoading`/`error`/`try-catch-finally` (`layers/base/app/utils/store-helpers.ts`)    |
| Lookups com guard         | `if (lookupsLoaded.value) return`                          | Carrega opções de select uma vez, não re-busca desnecessariamente                                            |
| Setters async             | `setX(value)` atualiza filtro + re-fetcha                  | Filtros disparam re-fetch — por isso não usar v-model nos componentes                                        |
| `persist.pick`            | Apenas `['filtros']`                                       | Nunca persistir dados de API (pinia-skilld)                                                                  |
| `api` no setup            | `const api = useFeatureApi()` no topo                      | Instanciar antes de qualquer `await` (pinia-skilld: contexto pinia pode mudar após await)                    |

---

### 4. Componentes

#### 4a. Dashboard/Page — orquestra o carregamento

```vue
<script setup lang="ts">
const store = useFeatureStore()

onMounted(async () => {
  await store.fetchLookups()
  await store.fetchAll()
})
</script>

<template>
  <FeatureFilters />
  <FeatureContent />
  <FeatureTable />
</template>
```

**Regras:**

- `onMounted` carrega lookups + dados iniciais
- Sem props de dados para filhos — todos leem do store
- `useSeoPage()` em todas as pages

#### 4b. Filtros — `@change` com setters (NUNCA v-model)

```vue
<script setup lang="ts">
const store = useFeatureStore()

function onEstadoChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  store.setEstado(value)
}
</script>

<template>
  <select :value="store.filtros.estado" @change="onEstadoChange">
    <option v-for="opt in store.opcoes" :key="opt.value" :value="opt.value">
      {{ opt.label }}
    </option>
  </select>
</template>
```

**Por que `@change` e não `v-model`?** Setters são async (disparam re-fetch). Com `v-model`, a reatividade bidirecional pode causar loops — o filtro muda, dispara fetch, o fetch pode mudar estado que afeta o filtro.

#### 4c. Painéis de dados — leem do store com `v-if`

```vue
<script setup lang="ts">
const store = useFeatureStore()
</script>

<template>
  <div v-if="store.data">
    <h2>Panorama - {{ store.regionLabel }}</h2>
    <span>{{ store.data.percentage }}</span>
  </div>
</template>
```

#### 4d. Tabelas — tipos importados, mapeamentos visuais locais

```vue
<script setup lang="ts">
import type { Level, Trend } from '../composables/types'

const store = useFeatureStore()

// Mapeamentos visuais ficam NO COMPONENTE (são lógica de apresentação)
const levelColors: Record<Level, string> = {
  Baixo: 'text-success-800',
  Médio: 'text-alert-900',
  Alto: 'text-danger-900'
}

const trendIcons: Record<Trend, string> = {
  up: 'lucide:trending-up',
  down: 'lucide:trending-down',
  stable: 'lucide:minus'
}
</script>

<template>
  <tr v-for="row in store.items" :key="row.id">
    <td :class="levelColors[row.level]">{{ row.level }}</td>
  </tr>
</template>
```

**O que fica no componente vs no store:**

| No componente (apresentação)        | No store (dados/estado)            |
| ----------------------------------- | ---------------------------------- |
| Mapeamento de cores (`levelColors`) | Dados brutos (`items`, `data`)     |
| Mapeamento de ícones (`trendIcons`) | Filtros (`filtros`)                |
| Definição de colunas (`columns`)    | Lookups (`opcoes`, `regions`)      |
| Classes CSS condicionais            | Computed derivados (`regionLabel`) |

---

### 5. Testes

| Camada                    | Projeto Vitest | Diretório                      | O que testar                              |
| ------------------------- | -------------- | ------------------------------ | ----------------------------------------- |
| Service (`useFeatureApi`) | `unit`         | `tests/unit/{feature}/`        | Mock `$fetch`, verificar params e retorno |
| Store (`useFeatureStore`) | `nuxt`         | `tests/integration/{feature}/` | Mock API, testar actions e computed       |
| Componentes               | `nuxt`         | `tests/integration/{feature}/` | Mock store, testar renderização           |

---

### Task Sizing

| Size   | Descrição                 | Escopo típico                   |
| ------ | ------------------------- | ------------------------------- |
| Small  | Mudança em 1-2 arquivos   | Bug fix, ajuste de estilo       |
| Medium | 2-5 arquivos em uma layer | Novo endpoint + service + store |
| Large  | Múltiplas layers          | Feature layer completa do zero  |

### Checklist — Nova Feature Layer

- [ ] `layers/{feature}/nuxt.config.ts` (obrigatório, pode ser mínimo)
- [ ] `app/composables/types.ts`
- [ ] `app/composables/use{Feature}Api.ts`
- [ ] `app/composables/use{Feature}Store.ts`
- [ ] `app/components/{Feature}*.vue`
- [ ] `app/pages/{feature}/index.vue`
- [ ] `server/api/{feature}/` (se tiver BFF)
- [ ] `tests/unit/{feature}/`
- [ ] `tests/integration/{feature}/`
- [ ] Adicionar em `extends` no `nuxt.config.ts` raiz

### Referências vivas no projeto

| Padrão               | Arquivo de referência                               |
| -------------------- | --------------------------------------------------- |
| Types                | `layers/home/app/composables/types.ts`              |
| Service (mock)       | `layers/home/app/composables/useHomeApi.ts`         |
| Service (API real)   | `layers/rumores/app/composables/useRumoresApi.ts`   |
| Store                | `layers/home/app/composables/useHomeStore.ts`       |
| Store (avançado)     | `layers/rumores/app/composables/useRumoresStore.ts` |
| withStoreAction      | `layers/base/app/utils/store-helpers.ts`            |
| Dashboard            | `layers/home/app/components/HomeDashboard.vue`      |
| Filtros (@change)    | `layers/home/app/components/HomeFilters.vue`        |
| Tabela (visual maps) | `layers/home/app/components/HomeTable.vue`          |
