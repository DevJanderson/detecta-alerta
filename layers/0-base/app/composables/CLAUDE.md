# Composables Globais - CLAUDE.md

Composables reutilizaveis compartilhados por todas as layers.

## Estrutura

```
layers/0-base/app/composables/
├── useSeoPage.ts           # SEO: OG, Twitter Cards, canonical
└── useDebounce.ts          # Debounce reativo
```

## Composables Existentes

### useSeoPage

Composable de SEO para todas as paginas. Gera Open Graph, Twitter Cards e canonical URL automaticamente.

> **Nota:** Robots e controlado via `X-Robots-Tag` headers em `routeRules` no `nuxt.config.ts`, nao pelo composable.

```typescript
interface SeoPageOptions {
  title: string
  description?: string // Default: descricao padrao do projeto
  path?: string // Default: route.path
  ogImage?: string // Default: /og-image.png
}

useSeoPage({
  title: 'Minha Pagina - Detecta Alerta',
  description: 'Descricao da pagina'
})
```

### useDebounce

Retorna um `Ref` com o valor atrasado pelo delay especificado. Usa `watch` + `setTimeout` com `onWatcherCleanup`.

```typescript
const search = ref('')
const debouncedSearch = useDebounce(search, 500)

watch(debouncedSearch, term => {
  fetchResults(term)
})
```

---

## Utils vs Composables

| Tipo            | Pasta                            | Quando usar                               |
| --------------- | -------------------------------- | ----------------------------------------- |
| **Utils**       | `layers/0-base/app/utils/`       | Funcoes puras, sem estado, sem Vue        |
| **Composables** | `layers/0-base/app/composables/` | Logica com estado reativo (ref, computed) |

```typescript
// Isso e um util, nao composable
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('pt-BR')
}

// Composable com estado reativo
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> { ... }
```

---

## Convencoes

| Item            | Convencao                 |
| --------------- | ------------------------- |
| Nome do arquivo | `use{Nome}.ts`            |
| Nome da funcao  | `use{Nome}`               |
| Retorno         | Objeto com refs e funcoes |
| Estado local    | `ref()` dentro da funcao  |
| Estado global   | `ref()` fora da funcao    |

---

## @vueuse/core

A biblioteca `@vueuse/core` esta disponivel no projeto. Antes de criar um composable novo, verifique se ja existe algo equivalente em [vueuse.org](https://vueuse.org/).
