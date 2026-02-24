---
title: Padrões de Código
description: Convenções de código e estilo do Detecta Alerta.
---

# Padrões de Código

## Prettier

O projeto usa Prettier com a seguinte configuração:

- **Sem ponto-e-vírgula**
- **Aspas simples**
- **100 colunas**
- **Sem trailing comma**
- **Arrow parens: avoid**

```typescript
// ✅ Correto
const name = 'detecta'
const fn = x => x + 1
import { ref } from 'vue'

// ❌ Incorreto
const name = 'detecta'
const fn = x => x + 1
```

## ESLint

### Regras principais

| Regra                   | Configuração                            |
| ----------------------- | --------------------------------------- |
| `no-console`            | Apenas `console.warn` e `console.error` |
| `prefer-const`          | Obrigatório (error)                     |
| `no-unused-vars`        | Variáveis `_prefixadas` são ignoradas   |
| `vue/html-self-closing` | Sempre auto-fechar (`<MyComp />`)       |

### Corrigir automaticamente

```bash
npm run quality:fix
```

## Padrões Vue

### Componentes

```vue
<script setup lang="ts">
// 1. Props e emits
const props = defineProps<{
  title: string
  variant?: 'default' | 'outline'
}>()

const emit = defineEmits<{
  click: [value: string]
}>()

// 2. Composables e refs
const loading = ref(false)

// 3. Computed
const displayTitle = computed(() => props.title.toUpperCase())

// 4. Funções
function handleClick() {
  emit('click', props.title)
}
</script>

<template>
  <div @click="handleClick">
    {{ displayTitle }}
  </div>
</template>
```

### Auto-fechar componentes

```vue
<!-- ✅ Correto -->
<Button />
<MyComponent />
<Icon name="lucide:search" />

<!-- ❌ Incorreto -->
<Button></Button>
<MyComponent></MyComponent>
```

## Padrões TypeScript

### Service (API)

```typescript
export function useExampleApi() {
  async function getAll() {
    return $fetch('/api/examples')
  }
  return { getAll }
}
```

### Store (Pinia - Composition API)

```typescript
export const useExampleStore = defineStore('example', () => {
  const items = ref<Example[]>([])
  const api = useExampleApi()

  async function fetchAll() {
    items.value = await api.getAll()
  }

  return { items, fetchAll }
})
```

### Persistência de estado

```typescript
export const useExampleStore = defineStore(
  'example',
  () => {
    const filtros = ref({})
    const items = ref([])
    return { filtros, items }
  },
  {
    persist: {
      pick: ['filtros'] // Persistir APENAS campos específicos
    }
  }
)
```

::docs-warning
Nunca persista dados de API, auth state ou dados sensíveis. Use `pick` para ser explícito sobre o que persistir.
::

## Design System

### Cores

| Cor               | Classe Tailwind               | Uso                   |
| ----------------- | ----------------------------- | --------------------- |
| `brand-primary`   | `bg-brand-primary-{50-950}`   | Vermelho/Coral - CTAs |
| `brand-secondary` | `bg-brand-secondary-{50-950}` | Azul - Links          |
| `base`            | `bg-base-{0-950}`             | Neutros               |
| `success`         | `bg-success-{50-950}`         | Feedback positivo     |
| `alert`           | `bg-alert-{50-950}`           | Avisos                |
| `danger`          | `bg-danger-{50-950}`          | Erros                 |

### Regras

- **Cores da marca** para elementos customizados
- **Semânticas shadcn** (`primary`, `secondary`, `muted`) para componentes UI
- **Nunca usar cores hardcoded** — sempre variáveis do design system
