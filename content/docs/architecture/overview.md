---
title: Arquitetura
description: Visão geral da arquitetura do Detecta Alerta.
---

# Arquitetura

O Detecta Alerta é construído com **Nuxt 4** usando uma arquitetura **layers-only** com **shadcn-vue** e **Tailwind CSS v4**.

## Princípios

- **Tudo é layer** — não existe pasta `app/` na raiz
- **Separação por domínio** — cada feature tem sua própria layer
- **BFF (Backend-for-Frontend)** — o servidor Nuxt atua como proxy seguro para a API
- **Type-safe** — tipos gerados automaticamente a partir do OpenAPI

## Fluxo de dados

```
UI → Composable/Store → Service → API Sinapse
```

1. **UI (Vue)**: Componentes e páginas interagem com stores Pinia
2. **Store (Pinia)**: Gerencia estado reativo e chama services
3. **Service (composable)**: Faz chamadas `$fetch` para endpoints BFF
4. **BFF (server/)**: Proxy seguro que adiciona auth e valida respostas
5. **API Sinapse**: Backend externo com dados epidemiológicos

## Stack

| Camada          | Tecnologia                                  |
| --------------- | ------------------------------------------- |
| **UI**          | Vue 3 + shadcn-vue + Tailwind CSS v4        |
| **Estado**      | Pinia + pinia-plugin-persistedstate         |
| **Formulários** | VeeValidate + Zod                           |
| **Server**      | Nitro (Nuxt server engine)                  |
| **Testes**      | Vitest + Playwright                         |
| **API Client**  | Kubb (geração de tipos e schemas)           |
| **SEO**         | @nuxtjs/seo (sitemap, robots, schema.org)   |
| **Segurança**   | nuxt-security (headers, rate limiter, CSRF) |

## Módulos Nuxt

```typescript
modules: [
  '@nuxt/eslint',
  '@nuxt/icon',
  '@nuxt/content',
  'shadcn-nuxt',
  '@pinia/nuxt',
  '@vee-validate/nuxt',
  '@nuxt/image',
  'nuxt-security',
  'vue-sonner/nuxt',
  '@nuxtjs/seo',
  '@nuxtjs/color-mode',
  'pinia-plugin-persistedstate/nuxt'
]
```

## Data Fetching

| Método     | Quando usar                    | SSR |
| ---------- | ------------------------------ | --- |
| `useFetch` | Carregamento inicial (páginas) | Sim |
| `$fetch`   | Eventos do usuário (cliques)   | Não |
