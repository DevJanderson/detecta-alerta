# Base Layer - CLAUDE.md

Camada de fundação com app.vue, error.vue, CSS global, componentes UI, composables, utilitários e tipos compartilhados por todas as outras layers.

---

## Propósito

Esta layer fornece:

- **Fundação da aplicação** - `app.vue`, `error.vue`, CSS global, health check
- **Componentes UI** (shadcn-vue) - Primitivos de interface reutilizáveis
- **Composables globais** - Lógica reativa compartilhada
- **Utilitários** - Funções puras para uso geral
- **Layouts** - Layout padrão da aplicação
- **Tipos compartilhados** - Interfaces TypeScript globais

---

## Estrutura

```
layers/0-base/
├── nuxt.config.ts              # Configuração (CSS global, alias #shared)
├── CLAUDE.md                   # Este arquivo
│
├── app/
│   ├── app.vue                 # Root component
│   ├── error.vue               # Página de erro (404, 500)
│   ├── assets/css/
│   │   └── main.css            # Tailwind CSS + variáveis de tema
│   ├── components/
│   │   ├── ui/                 # shadcn-vue (auto-import)
│   │   │   ├── alert/
│   │   │   ├── avatar/
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── dropdown-menu/
│   │   │   ├── input/
│   │   │   └── label/
│   │   ├── common/             # Componentes globais customizados
│   │   │   └── AppLoading.vue
│   │   └── CLAUDE.md           # Docs de componentes
│   │
│   ├── composables/
│   │   └── CLAUDE.md           # Docs de composables
│   │
│   ├── layouts/
│   │   └── default.vue         # Layout padrão
│   │
│   └── utils/
│       └── utils.ts            # cn() para classes Tailwind
│
├── server/
│   └── api/
│       └── health.get.ts       # GET /api/health - Health check
│
└── shared/
    └── types/                  # Tipos compartilhados
        ├── api.ts              # Tipos de API
        └── index.ts            # Barrel file
```

---

## O que vai nesta Layer

| Tipo                      | Exemplos                               | Local                    |
| ------------------------- | -------------------------------------- | ------------------------ |
| Arquivos globais          | app.vue, error.vue, main.css           | `app/`                   |
| Componentes UI primitivos | Button, Card, Input, Dialog            | `app/components/ui/`     |
| Componentes globais       | AppLoading, AppLogo, AppHeader         | `app/components/common/` |
| Composables reutilizáveis | useLoading, usePagination, useDebounce | `app/composables/`       |
| Funções utilitárias puras | formatDate, cn, slugify                | `app/utils/`             |
| Layouts globais           | default, dashboard                     | `app/layouts/`           |
| Tipos TypeScript globais  | ApiResponse, PaginatedResult           | `shared/types/`          |
| Endpoints utilitários     | health check                           | `server/api/`            |

---

## O que NÃO vai nesta Layer

| Tipo                               | Onde colocar                            |
| ---------------------------------- | --------------------------------------- |
| Componentes específicos de feature | `layers/{N}-{feature}/app/components/`  |
| Stores Pinia de feature            | `layers/{N}-{feature}/app/composables/` |
| Páginas                            | `layers/{N}-{feature}/app/pages/`       |
| Endpoints de API de feature        | `layers/{N}-{feature}/server/api/`      |

---

## Adicionar Componente shadcn-vue

```bash
# Adicionar componentes
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add dialog

# Ver todos disponíveis
npx shadcn-vue@latest add --help
```

Componentes são instalados em `app/components/ui/` (configurado em `components.json`).

---

## Uso dos Componentes

### shadcn-vue (auto-import)

```vue
<template>
  <!-- Não precisa importar -->
  <Button variant="outline">Clique</Button>

  <Card>
    <CardHeader>
      <CardTitle>Título</CardTitle>
    </CardHeader>
    <CardContent>Conteúdo</CardContent>
  </Card>
</template>
```

### Variantes do Button

```vue
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

---

## Configuração do CSS

No `nuxt.config.ts` desta layer, o CSS deve ser referenciado usando o alias `~` (raiz do projeto):

```ts
// layers/0-base/nuxt.config.ts
export default defineNuxtConfig({
  css: ['~/layers/0-base/app/assets/css/main.css']
})
```

> **IMPORTANTE:** Não use caminhos relativos como `./app/assets/css/main.css` em layers. O Nuxt resolve caminhos a partir da raiz do projeto, então use sempre `~/layers/...` para evitar erros de módulo não encontrado.

---

## Alias #shared

O `nuxt.config.ts` define um alias para tipos compartilhados:

```typescript
// nuxt.config.ts
alias: {
  '#shared': '../layers/0-base/shared'
}
```

**Uso:**

```typescript
import type { ApiResponse } from '#shared/types'
```

---

## Prioridade

Esta é a layer com **menor prioridade** (0). Todas as outras layers podem sobrescrever seus arquivos.

```
0-base < 3-auth < 4-home
```

---

## Documentação Detalhada

Para instruções completas sobre cada área:

| Área        | Documento                                              |
| ----------- | ------------------------------------------------------ |
| Componentes | [app/components/CLAUDE.md](app/components/CLAUDE.md)   |
| Composables | [app/composables/CLAUDE.md](app/composables/CLAUDE.md) |

---

## Checklist: Adicionar à Base Layer

- [ ] É reutilizável por 2+ features?
- [ ] Não tem dependência de lógica de negócio específica?
- [ ] É um primitivo de UI ou lógica genérica?

Se respondeu **sim** para todas, adicione aqui. Caso contrário, coloque na feature layer específica.

---

## Referências

- [shadcn-vue](https://www.shadcn-vue.com/)
- [Nuxt Layers](https://nuxt.com/docs/4.x/guide/going-further/layers)
- [Vue Composables](https://vuejs.org/guide/reusability/composables.html)
