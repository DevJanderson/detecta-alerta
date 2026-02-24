# Components - CLAUDE.md

Instrucoes para componentes Vue na base layer.

## Estrutura

```
layers/0-base/app/components/
├── ui/                     # shadcn-vue (auto-import, 21 grupos)
│   ├── alert/
│   ├── alert-dialog/
│   ├── avatar/
│   ├── badge/
│   ├── button/             # Variantes extras: brand-outline, brand-secondary-soft
│   ├── card/
│   ├── checkbox/
│   ├── collapsible/
│   ├── dialog/
│   ├── dropdown-menu/
│   ├── input/
│   ├── label/
│   ├── pagination/
│   ├── scroll-area/
│   ├── select/
│   ├── separator/
│   ├── sheet/
│   ├── switch/
│   ├── table/
│   ├── tabs/
│   └── textarea/
└── common/                 # Componentes compartilhados (auto-import)
    ├── AppHeader.vue           # Header principal (logos, nav, menu mobile, auth)
    ├── AppLoading.vue          # Spinner (props: size, text)
    └── DeleteConfirmDialog.vue # Dialog generico de exclusao
```

## Tipos de Componentes

| Pasta                                  | Uso                          | Auto-import |
| -------------------------------------- | ---------------------------- | ----------- |
| `layers/0-base/app/components/ui/`     | shadcn-vue (primitivos)      | Sim         |
| `layers/0-base/app/components/common/` | Componentes globais          | Sim         |
| `layers/*/app/components/`             | Especificos da feature layer | Sim         |

## Adicionar Componente shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes sao instalados em `layers/0-base/app/components/ui/` (configurado via `components.json`).

## Variantes do Button

```vue
<!-- Variantes padrao shadcn -->
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<!-- Variantes customizadas do design system -->
<Button variant="brand-outline">Brand Outline</Button>
<Button variant="brand-secondary-soft">Brand Secondary</Button>

<!-- Sizes -->
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
<Button size="brand-sm">Brand SM</Button>
<Button size="brand-md">Brand MD</Button>
<Button size="brand-lg">Brand LG</Button>
```

## Componentes Comuns

### AppHeader

Header principal da aplicacao. Usa `useAuthStore` para estado de autenticacao e renderiza `AuthUserMenu` (da layer 1-auth). Navegacao desktop com 5 links, menu mobile via `Sheet`.

### AppLoading

Spinner de carregamento com icone `lucide:loader-2` animado.

```vue
<AppLoading />
<!-- Default: md -->
<AppLoading size="sm" />
<!-- Pequeno -->
<AppLoading size="lg" text="Carregando dados..." />
<!-- Grande com texto -->
```

### DeleteConfirmDialog

Dialog generico de confirmacao de exclusao. Reutilizado por todas as features.

```vue
<DeleteConfirmDialog
  v-model:open="showDelete"
  title="Excluir usuario"
  :item="selectedItem"
  @confirm="handleDelete"
/>
```

Props: `open` (boolean), `title` (string), `item: { id: number, nome: string } | null`.

## Icones (@nuxt/icon)

```vue
<template>
  <Icon name="lucide:search" class="size-4" />
  <Icon name="lucide:loader-2" class="size-4 animate-spin" />
</template>
```

## Convencoes

| Item               | Convencao                        |
| ------------------ | -------------------------------- |
| Nome do arquivo    | `PascalCase.vue`                 |
| Nome do componente | `PascalCase`                     |
| Props              | Interface `Props` com TypeScript |
| Emits              | Tipados com `defineEmits<{}>()`  |
| CSS                | Tailwind CSS (utility classes)   |
| Prefixo feature    | `{Feature}Nome.vue`              |
