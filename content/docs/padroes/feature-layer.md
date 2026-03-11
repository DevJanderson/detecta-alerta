---
title: 'Padrão Feature Layer'
description: 'Passo-a-passo para criar uma feature layer completa: types, api, store e componentes.'
order: 1
---

# Padrão Feature Layer

Toda funcionalidade do Detecta Alerta segue a mesma receita. Este guia mostra o passo-a-passo para criar uma feature nova.

## Estrutura de pastas

Cada feature vive dentro de sua própria layer em `layers/`. A estrutura sempre segue este padrão:

```
layers/{feature}/
├── nuxt.config.ts                  # Obrigatório (pode ser vazio)
├── app/
│   ├── components/                 # Componentes visuais
│   ├── composables/
│   │   ├── types.ts                # Tipos e interfaces
│   │   ├── use{Feature}Api.ts      # Chamadas ao servidor
│   │   └── use{Feature}Store.ts    # Estado da feature
│   ├── pages/{feature}/            # Rotas/páginas
│   └── utils/                      # Funções auxiliares
└── server/api/{feature}/           # Endpoints do servidor
```

## Passo 1 — Types (`types.ts`)

Comece definindo os tipos da sua feature. Isso deixa claro quais dados você vai trabalhar:

```typescript
// layers/rumores/app/composables/types.ts

// Importar tipos da API se necessário
import type { UsuarioSchemaDetalhes } from '#shared/types/sinapse'

// Definir interfaces da feature
export interface ListarUsuariosParams {
  page?: number
  search?: string
}

// Reutilizar tipos da API com Pick (pegar só os campos necessários)
export type UsuarioSchemaList = Pick<UsuarioSchemaDetalhes, 'id' | 'nome' | 'email' | 'ativo'>
```

## Passo 2 — API Composable (`use{Feature}Api.ts`)

O composable de API faz as chamadas HTTP para o servidor. Ele é **simples de propósito** — só faz a chamada, sem tratar erros ou guardar estado:

```typescript
// layers/rumores/app/composables/useRumoresApi.ts

export function useRumoresApi() {
  async function listar(params?: ListarRumoresParams) {
    return $fetch('/api/rumores', { params })
  }

  async function criar(data: CriarRumorData) {
    return $fetch('/api/rumores', { method: 'POST', body: data })
  }

  async function obter(id: number) {
    return $fetch(`/api/rumores/${id}`)
  }

  return { listar, criar, obter }
}
```

**Regras importantes:**

| Regra                       | Por quê                                                  |
| --------------------------- | -------------------------------------------------------- |
| Sem `ref()` ou `computed()` | Guardar estado é trabalho do store                       |
| Sem `try/catch`             | Tratar erros é trabalho do store (via `withStoreAction`) |
| Instanciar dentro do store  | Garante que funciona com SSR                             |

## Passo 3 — Store (`use{Feature}Store.ts`)

O store é o "cérebro" da feature — guarda os dados, faz chamadas e trata erros:

```typescript
// layers/rumores/app/composables/useRumoresStore.ts

import { RumoresErrors } from '#shared/domain/errors'

export const useRumoresStore = defineStore('rumores', () => {
  // 1. Estado — os dados que os componentes vão ler
  const items = shallowRef<Rumor[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 2. API — instanciada aqui dentro
  const api = useRumoresApi()
  const refs = { isLoading, error }

  // 3. Actions — SEMPRE usam withStoreAction
  async function fetchAll(): Promise<void> {
    return withStoreAction(refs, RumoresErrors.LIST_FAILED, async () => {
      items.value = await api.listar()
    })
  }

  async function criar(data: CriarRumorData): Promise<boolean> {
    return withStoreAction(
      refs,
      RumoresErrors.CREATE_FAILED,
      async () => {
        await api.criar(data)
        return true
      },
      false // valor retornado se der erro
    )
  }

  return { items, isLoading, error, fetchAll, criar }
})
```

### O que o `withStoreAction` faz por você

Sem ele, você teria que escrever isso em **toda** action:

```typescript
// ❌ SEM withStoreAction — muito repetitivo
async function fetchAll() {
  isLoading.value = true
  error.value = null
  try {
    items.value = await api.listar()
  } catch (e) {
    error.value = extractErrorMessage(e) || RumoresErrors.LIST_FAILED
  } finally {
    isLoading.value = false
  }
}
```

Com `withStoreAction`, tudo isso acontece automaticamente:

```typescript
// ✅ COM withStoreAction — limpo e consistente
async function fetchAll() {
  return withStoreAction(refs, RumoresErrors.LIST_FAILED, async () => {
    items.value = await api.listar()
  })
}
```

### Filtros com persistência

Se a feature tem filtros que o usuário escolhe, persista-os com `pinia-plugin-persistedstate`:

```typescript
export const useRumoresStore = defineStore(
  'rumores',
  () => {
    const filtros = ref({ categoria: 'todas', pagina: 1 })
    const items = ref([]) // NÃO persistir dados da API

    return { filtros, items }
  },
  {
    persist: { pick: ['filtros'] } // Só persistir filtros, nunca dados
  }
)
```

### Filtros com setters async

Quando o usuário muda um filtro, use um setter que busca os dados novos:

```typescript
// No store
async function setCategoria(categoria: string) {
  filtros.value.categoria = categoria
  await fetchAll() // Re-busca com o novo filtro
}
```

```vue
<!-- No componente — usar @change, não v-model -->
<select @change="store.setCategoria($event.target.value)">
  <option v-for="c in categorias" :key="c.value" :value="c.value">
    {{ c.label }}
  </option>
</select>
```

## Passo 4 — Componentes

Componentes leem dados diretamente do store — não precisa passar dados por props:

```vue
<script setup lang="ts">
const store = useRumoresStore()

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <!-- Estado de carregamento -->
  <div v-if="store.isLoading">Carregando...</div>

  <!-- Estado de erro -->
  <div v-else-if="store.error">{{ store.error }}</div>

  <!-- Dados carregados -->
  <div v-else>
    <RumorCard v-for="r in store.items" :key="r.id" :rumor="r" />
  </div>
</template>
```

**Prefixo nos nomes:** sempre use o nome da feature como prefixo nos componentes: `HomeChart`, `RumorCard`, `UsuarioForm`.

## Passo 5 — Server Routes (BFF)

Os endpoints no servidor seguem uma receita fixa:

```typescript
// layers/rumores/server/api/rumores/index.get.ts

import { RumoresErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  // 1. Verificar autenticação (se necessário)
  requireAuth(event)

  // 2. Pegar parâmetros da URL
  const query = getQuery(event)
  const qs = buildQueryString(query, ['page', 'search', 'categoria'])

  // 3. Chamar a API Sinapse
  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/rumores${qs}`, {
        accessToken: event.context.auth.accessToken
      }),
    errorContext: RumoresErrors.LIST_FAILED
  })
})
```

Para endpoints com body (POST, PUT):

```typescript
// layers/rumores/server/api/rumores/index.post.ts

export default defineEventHandler(async event => {
  requireAuth(event)
  const body = await validateBody(event, criarRumorSchema) // Zod valida
  return handleSinapseRequest({
    fn: () =>
      fetchSinapse('/rumores', {
        method: 'POST',
        body,
        accessToken: event.context.auth.accessToken
      }),
    errorContext: RumoresErrors.CREATE_FAILED
  })
})
```

## Checklist para nova feature

- [ ] Criar `layers/{feature}/nuxt.config.ts`
- [ ] Adicionar layer ao array `extends` do `nuxt.config.ts` raiz
- [ ] Criar `types.ts` com interfaces
- [ ] Criar `use{Feature}Api.ts` (chamadas HTTP)
- [ ] Criar `use{Feature}Store.ts` (estado + actions com `withStoreAction`)
- [ ] Adicionar domain errors em `#shared/domain/errors.ts`
- [ ] Criar server routes em `server/api/{feature}/`
- [ ] Criar componentes com prefixo `{Feature}*`
- [ ] Criar página em `pages/{feature}/`
- [ ] Adicionar testes
