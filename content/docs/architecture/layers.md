---
title: Layers
description: Sistema de Nuxt Layers do Detecta Alerta.
---

# Layers

O Detecta Alerta usa **Nuxt Layers** para organizar o código por domínio. Cada layer é uma unidade independente com seus próprios componentes, páginas, composables e endpoints.

## Ordem de prioridade

```
5-docs > 4-rumores > 3-usuarios > 2-home > 1-auth > 0-base
```

Número maior = maior prioridade = sobrescreve layers anteriores.

## Layers do projeto

| Layer        | Domínio      | Descrição                                             |
| ------------ | ------------ | ----------------------------------------------------- |
| `0-base`     | Fundação     | app.vue, CSS, shadcn-vue, utils, tipos compartilhados |
| `1-auth`     | Autenticação | Login, logout, refresh, reset-password (BFF)          |
| `2-home`     | Homepage     | Landing page e páginas públicas                       |
| `3-usuarios` | Usuários     | Perfil, gestão de usuários, grupos e permissões       |
| `4-rumores`  | Rumores      | Feed de rumores epidemiológicos                       |
| `5-docs`     | Documentação | Esta documentação                                     |

## Estrutura de uma feature layer

```
layers/{N}-{feature}/
├── nuxt.config.ts              # Obrigatório (pode ser vazio)
├── app/
│   ├── components/             # Prefixar: {Feature}Card.vue
│   ├── composables/
│   │   ├── types.ts            # Interfaces
│   │   ├── use{Feature}Api.ts  # Service ($fetch)
│   │   └── use{Feature}Store.ts # Pinia store
│   └── pages/{feature}/
└── server/api/{feature}/       # CRUD endpoints
```

::docs-warning
Use hífen (`-`) no nome das layers, não ponto. Layers em `~/layers` são auto-registradas pelo Nuxt 4.
::

## Convenções

### Caminhos

Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` não funcionam.

```typescript
// ✅ Correto
css: ['~/layers/0-base/app/assets/css/main.css']

// ❌ Incorreto
css: ['./app/assets/css/main.css']
```

### Componentes

Prefixe componentes com o nome da feature para evitar conflitos:

```
layers/4-rumores/app/components/
  RumoresCard.vue
  RumoresFeed.vue
  RumoresFilters.vue
```

### Service pattern

```typescript
// layers/{N}-{feature}/app/composables/use{Feature}Api.ts
export function useRumoresApi() {
  async function getAll(params?: Record<string, string>) {
    return $fetch('/api/rumores', { params })
  }

  async function getById(id: string) {
    return $fetch(`/api/rumores/${id}`)
  }

  return { getAll, getById }
}
```

### Store pattern

```typescript
// layers/{N}-{feature}/app/composables/use{Feature}Store.ts
export const useRumoresStore = defineStore('rumores', () => {
  const items = ref<Rumor[]>([])
  const api = useRumoresApi()

  async function fetchAll() {
    items.value = await api.getAll()
  }

  return { items, fetchAll }
})
```
