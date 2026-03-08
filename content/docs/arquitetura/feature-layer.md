---
title: 'Arquitetura — Padrão Feature Layer'
description: 'Como construir uma feature layer completa: types, api, store e componentes.'
order: 4
---

# Arquitetura — Padrão Feature Layer

Toda funcionalidade do Detecta Alerta segue o mesmo padrão de organização dentro de uma layer. Este documento descreve o fluxo `types → api → store → componentes`.

## Estrutura

```
layers/{feature}/
├── nuxt.config.ts                  # Obrigatório (pode ser vazio)
├── app/
│   ├── components/                 # Prefixo: {Feature}NomeComponente.vue
│   ├── composables/
│   │   ├── types.ts                # Interfaces e tipos da feature
│   │   ├── use{Feature}Api.ts      # Service stateless ($fetch)
│   │   └── use{Feature}Store.ts    # Pinia store (estado + actions)
│   ├── pages/{feature}/            # Rotas
│   └── utils/                      # Funções puras, Value Objects
└── server/api/{feature}/           # Endpoints BFF
```

## 1. Types (`types.ts`)

Define interfaces da feature. Pode importar tipos compartilhados da API:

```typescript
import type { UsuarioSchemaDetalhes } from '#shared/types/sinapse'

export interface ListarUsuariosParams {
  page?: number
  search?: string
}

export type UsuarioSchemaList = Pick<UsuarioSchemaDetalhes, 'id' | 'nome' | 'email' | 'ativo'>
```

## 2. API Composable (`use{Feature}Api.ts`)

Service stateless que encapsula chamadas `$fetch` ao BFF:

```typescript
export function useUsuariosApi() {
  async function listar(params?: ListarUsuariosParams) {
    return $fetch('/api/usuarios/admin', { params })
  }

  async function criar(data: UsuarioSchemaCreate) {
    return $fetch('/api/usuarios/admin', { method: 'POST', body: data })
  }

  async function obter(id: number) {
    return $fetch(`/api/usuarios/admin/${id}`)
  }

  return { listar, criar, obter }
}
```

**Regras:**

- Sem estado (`ref`, `computed`) — isso é papel do store
- Sem tratamento de erro — o store faz isso via `withStoreAction`
- Instanciado dentro do `setup` do store (não no topo do módulo)

## 3. Store (`use{Feature}Store.ts`)

Pinia store com Composition API que gerencia estado e actions:

```typescript
import type { UsuarioSchemaList, ListarUsuariosParams } from './types'
import { UsuariosErrors } from '#shared/domain/errors'

export const useUsuariosStore = defineStore('usuarios', () => {
  // Estado
  const items = shallowRef<UsuarioSchemaList[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // API instanciada no setup
  const api = useUsuariosApi()
  const refs = { isLoading, error }

  // Actions — sempre usam withStoreAction + domain error
  async function fetchAll(params?: ListarUsuariosParams): Promise<void> {
    return withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => {
      const response = await api.listar(params)
      items.value = response.usuarios
    })
  }

  async function criar(data: UsuarioSchemaCreate): Promise<boolean> {
    return withStoreAction(
      refs,
      UsuariosErrors.CREATE_FAILED,
      async () => {
        await api.criar(data)
        return true
      },
      false
    )
  }

  return { items, isLoading, error, fetchAll, criar }
})
```

### Padrões do store

| Padrão                           | Descrição                                                   |
| -------------------------------- | ----------------------------------------------------------- |
| `shallowRef` para listas         | Performance — evita deep reactivity em arrays grandes       |
| `withStoreAction` + domain error | Gerencia `isLoading`, `error` e `try-catch` automaticamente |
| `defaultValue: false`            | Actions que retornam `boolean` usam `false` como fallback   |
| `refs = { isLoading, error }`    | Objeto reutilizado em todas as actions                      |

### Persistência

Para filtros e preferências do usuário, usar `pinia-plugin-persistedstate` com `pick` explícito:

```typescript
export const useHomeStore = defineStore(
  'home',
  () => {
    const filtros = ref({ region: 'brasil', estado: '', semana: '4' })
    const panorama = ref(null) // NÃO persistir dados de API

    return { filtros, panorama }
  },
  {
    persist: { pick: ['filtros'] } // Apenas filtros
  }
)
```

## 4. Componentes

Componentes leem do store diretamente — sem props de dados do store:

```vue
<script setup lang="ts">
const store = useUsuariosStore()

onMounted(() => {
  store.fetchAll()
})
</script>

<template>
  <div v-if="store.isLoading">Carregando...</div>
  <div v-else-if="store.error">{{ store.error }}</div>
  <div v-else>
    <UsuarioCard v-for="u in store.items" :key="u.id" :usuario="u" />
  </div>
</template>
```

### Filtros com setters async

Filtros usam `@change` + setters async do store (não `v-model` direto no filtro que dispara fetch):

```vue
<select @change="store.setEstado($event.target.value)">
  <option v-for="e in store.estados" :key="e.value" :value="e.value">
    {{ e.label }}
  </option>
</select>
```

```typescript
// No store
async function setEstado(estado: string) {
  filtros.value.estado = estado
  await fetchAll() // Re-fetch com novo filtro
}
```

## 5. Server Routes (BFF)

Endpoints seguem padrão consistente:

```typescript
import { UsuariosErrors } from '#shared/domain/errors'

export default defineEventHandler(async event => {
  // 1. Auth
  requireAdmin(event)

  // 2. Validação
  const id = validateRouteParam(event, 'id')
  const body = await validateBody(event, updateSchema)

  // 3. Chamada à API Sinapse
  return handleSinapseRequest({
    fn: () =>
      fetchSinapse(`/usuarios/${id}`, {
        method: 'PUT',
        body,
        accessToken: event.context.auth.accessToken
      }),
    errorContext: UsuariosErrors.UPDATE_FAILED
  })
})
```

## Checklist para nova feature

- [ ] Criar `layers/{feature}/nuxt.config.ts`
- [ ] Adicionar layer ao array `extends` do `nuxt.config.ts` raiz
- [ ] Criar `types.ts` com interfaces
- [ ] Criar `use{Feature}Api.ts` (service stateless)
- [ ] Criar `use{Feature}Store.ts` (Pinia + withStoreAction)
- [ ] Adicionar domain errors em `#shared/domain/errors.ts`
- [ ] Criar server routes em `server/api/{feature}/`
- [ ] Criar componentes com prefixo `{Feature}*`
- [ ] Criar página em `pages/{feature}/`
- [ ] Adicionar testes unitários
