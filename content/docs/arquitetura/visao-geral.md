---
title: 'Arquitetura — Visão Geral'
description: 'Estrutura de layers, fluxo de dados e princípios arquiteturais do Detecta Alerta.'
order: 1
---

# Arquitetura — Visão Geral

O Detecta Alerta usa **Nuxt 4** com arquitetura **layers-only** — não existe pasta `app/` na raiz. Todo código vive dentro de layers independentes que são compostas via `extends` no `nuxt.config.ts`.

## Princípio Guia: ETC (Easier to Change)

Antes de cada decisão arquitetural, a pergunta é: **"isso vai facilitar mudanças futuras?"**

- **Isolamento** — cada layer é autônoma, com seus próprios componentes, stores, APIs e server routes
- **Constantes nomeadas** — valores mágicos centralizados em objetos tipados
- **Abstrações sob demanda** — extrair só quando a duplicação é real (não hipotética)
- **Zero acoplamento horizontal** — layers não importam diretamente de outras layers

## Layers

| Layer           | Responsabilidade                                                       | Rota                  |
| --------------- | ---------------------------------------------------------------------- | --------------------- |
| `base`          | Fundação: Tailwind, shadcn-vue, utils, tipos compartilhados, `app.vue` | —                     |
| `auth`          | Autenticação BFF (login, logout, refresh, middlewares)                 | `/auth/*`             |
| `home`          | Homepage com panorama epidemiológico                                   | `/`                   |
| `meu-municipio` | Página do município (mapa MapLibre + aside com dados)                  | `/meu-municipio`      |
| `mapa-risco`    | Mapa de risco epidemiológico                                           | `/mapa-risco`         |
| `usuarios`      | Perfil, admin de usuários, grupos e permissões                         | `/perfil`, `/admin/*` |
| `rumores`       | Feed de rumores epidemiológicos                                        | `/rumores`            |
| `docs`          | Documentação do projeto (Nuxt Content)                                 | `/docs/*`             |

### Ordem de prioridade

Definida pela posição no array `extends` (último = maior prioridade):

```
docs > rumores > usuarios > mapa-risco > meu-municipio > home > auth > base
```

### Estrutura de uma Feature Layer

```
layers/{feature}/
├── nuxt.config.ts              # Obrigatório
├── app/
│   ├── components/             # Prefixo: {Feature}Card.vue
│   ├── composables/
│   │   ├── types.ts            # Interfaces da feature
│   │   ├── use{Feature}Api.ts  # Service ($fetch para BFF)
│   │   └── use{Feature}Store.ts # Pinia store
│   ├── pages/{feature}/        # Rotas da feature
│   └── utils/                  # Funções puras
└── server/api/{feature}/       # Endpoints BFF
```

## Fluxo de Dados

::docs-mermaid{title="Fluxo de uma requisição de dados"}
graph LR
A["Componente Vue"] --> B["Store (Pinia)"]
B --> C["API Composable ($fetch)"]
C --> D["Server Route (BFF)"]
D --> E["API Sinapse"]
E --> D
D --> C
C --> B
B --> A
::

O BFF (Backend-for-Frontend) no Nitro age como proxy seguro:

- **Client → BFF**: usa cookies `httpOnly` (sem tokens expostos)
- **BFF → Sinapse**: injeta `Authorization` header com access token
- **Validação**: body validado com Zod, route params com regex
- **Erros**: capturados e mapeados para domain errors tipados

## Shared Domain (`#shared`)

O alias `#shared` aponta para `layers/base/shared/`. Contém primitivos compartilhados entre client e server:

```
layers/base/shared/
├── domain/
│   ├── result.ts       # Result<T> — discriminated union
│   ├── errors.ts       # Domain errors tipados por módulo
│   └── index.ts        # Barrel export
└── types/
    └── api.ts          # ApiResponse<T>, PaginatedResponse<T>
```

Para detalhes sobre cada primitivo, veja:

- [Domain Primitives](/docs/arquitetura/domain-primitives) — Result, Value Objects, tryCreate
- [Error Handling](/docs/arquitetura/error-handling) — domain errors, withStoreAction, fluxo completo
- [Padrão Feature Layer](/docs/arquitetura/feature-layer) — types → api → store → componentes

## Tecnologias Principais

| Tecnologia                  | Uso                                                   |
| --------------------------- | ----------------------------------------------------- |
| **Nuxt 4**                  | Framework fullstack (SSR + SPA)                       |
| **Vue 3 + Composition API** | UI reativa                                            |
| **Tailwind CSS v4**         | Estilização (config em CSS, sem `tailwind.config.js`) |
| **shadcn-vue + reka-ui**    | Componentes UI acessíveis                             |
| **Pinia**                   | Gerenciamento de estado                               |
| **MapLibre GL**             | Mapas interativos                                     |
| **Kubb**                    | Geração de tipos e schemas Zod a partir do OpenAPI    |
| **Vitest**                  | Testes unitários e de integração                      |
| **Playwright**              | Testes E2E                                            |
