# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

**Sempre responda em Português Brasileiro (pt-BR).**

## Sobre o Projeto

**Detecta Alerta** é uma plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil. Centraliza dados de estabelecimentos de saúde (UBS, UPA, Drogarias) para análise de padrões epidemiológicos e detecção precoce de surtos.

## Setup Inicial

```bash
npm install
npm run setup          # Configura git hooks (Husky, Commitlint)
```

### Variáveis de Ambiente

Criar arquivo `.env` a partir do `.env.example`:

```bash
cp .env.example .env
```

| Variável               | Obrigatória | Descrição                                                      |
| ---------------------- | ----------- | -------------------------------------------------------------- |
| `NUXT_SINAPSE_API_URL` | Sim         | URL da API Sinapse (incluir `/api/v1`)                         |
| `NUXT_PUBLIC_SITE_URL` | Não         | URL pública do site (default: `https://alerta.sinapse.org.br`) |

> **Pre-commit hooks:** `lint-staged` roda automaticamente ESLint + Prettier em arquivos staged (`*.{js,ts,vue,json,css,md}`).

## Comandos Principais

```bash
npm run dev              # Servidor dev http://localhost:3000
npm run build            # Build produção
npm run typecheck        # Verificar tipos (USAR para detectar erros)
npm run quality:fix      # Lint + format
npm run test:run         # Vitest (todos os projetos)
npm run test:unit        # Vitest projeto "unit" (Node puro, rápido)
npm run test:nuxt        # Vitest projeto "nuxt" (happy-dom + @nuxt/test-utils)
npm run test -- path/to/file.test.ts  # Teste específico
npm run test:e2e         # Playwright E2E
npm run api:generate     # Gera cliente a partir do OpenAPI
npm run api:lint         # Valida OpenAPI spec com Spectral
npm run geo:convert      # Converte GeoJSON → TopoJSON (public/geo/)
```

## Princípio ETC (Easier to Change)

Valor guia do projeto, inspirado no livro "The Pragmatic Programmer". ETC não é uma regra — é a pergunta que fazemos antes de cada decisão: **"isso vai facilitar mudanças futuras?"**

### Checklist ETC

Antes de criar ou modificar código, pergunte:

- **Isolamento**: a mudança está contida em uma layer/arquivo, ou espalha impacto?
- **Constantes**: valores mágicos estão nomeados e centralizados?
- **Abstrações**: estou criando uma abstração útil ou prematura?
- **Acoplamento**: componentes dependem de detalhes internos de outros?
- **Testes**: a mudança é protegida por testes que detectam regressão?

### Como o ETC se manifesta no Detecta Alerta

| Decisão                       | Por quê é ETC                                      |
| ----------------------------- | -------------------------------------------------- |
| Nuxt Layers                   | Trocar/remover uma feature = mexer em uma layer só |
| BFF isolando a API Sinapse    | API externa muda, frontend não sente               |
| Kubb gerando tipos            | Contrato muda → `npm run api:generate` → pronto    |
| CSS variables (design system) | Uma variável muda a cor em todos os componentes    |
| Store/Service separation      | Trocar o HTTP client = mexer só no service         |
| useSeoPage composable         | Mudar estratégia de SEO = alterar um composable    |

### Anti-patterns ETC

- Valores hardcoded (magic numbers, URLs inline, cores hex/rgb)
- Componentes God Object (>300 linhas fazendo tudo)
- Lógica duplicada sem extração
- Acoplamento direto entre layers (import horizontal)
- Ausência de testes em fluxos críticos

## Regras Críticas

### Git - Branching (Gitflow)

O projeto usa **Gitflow** com três branches permanentes:

```
feature/* ──→ develop ──→ staging ──→ main
               (dev)       (QA)      (produção)
```

| Branch    | Propósito                        | Deploy           |
| --------- | -------------------------------- | ---------------- |
| `main`    | Produção — código estável        | Produção         |
| `staging` | QA/homologação antes de produção | Ambiente staging |
| `develop` | Integração de features           | Ambiente dev     |

#### Regras de branching

- **Branch de trabalho padrão:** `develop` (nunca commitar direto na `main` ou `staging`)
- **Feature branches:** criar a partir de `develop`, prefixo pelo tipo do commit
  - `feat/descricao`, `fix/descricao`, `refactor/descricao`, `chore/descricao`
- **Merge para develop:** via PR com squash ou merge commit
- **Merge develop → staging:** quando features estão prontas para QA
- **Merge staging → main:** após aprovação em staging (release)
- **Hotfix:** branch `hotfix/descricao` a partir de `main`, merge em `main` e `develop`

#### Fluxo típico

```bash
git checkout develop
git pull origin develop
git checkout -b feat/nova-feature
# ... trabalhar ...
git push -u origin feat/nova-feature
# Abrir PR para develop
```

### Git - Commits

- **NÃO** incluir `Co-Authored-By` nos commits
- Mensagens de commit em português ou inglês (consistente com o projeto)
- Commitlint exige `subject-case: lower-case` (severity error)
  - ✅ `feat(auth): implementa login com oauth`
  - ❌ `feat(auth): Implementa Login` ← falha no commit
  - Nomes de função/classe (PascalCase) só no body, nunca no subject
  - Limites: subject ≤ 72 chars, body ≤ 100 chars por linha
  - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`
  - Scopes: `auth`, `home`, `usuarios`, `rumores`, `docs`, `base`, `deps`, `kubb`

### Execução

- **NUNCA** rodar `npm run dev` em background ou com timeout - deixar o usuário iniciar no terminal dele
- Para verificar erros, usar apenas `npm run typecheck` ou `npm run build`
- Evitar processos que ficam rodando indefinidamente

### Code Style

Projeto usa Prettier com: **sem ponto-e-vírgula**, **aspas simples**, **100 colunas**, **sem trailing comma**, **arrow parens: avoid**, **endOfLine: lf**, **vueIndentScriptAndStyle: false**.

```typescript
// ✅ Correto
const name = 'detecta'
const fn = x => x + 1
import { ref } from 'vue'

// ❌ Incorreto
const name = 'detecta'
const fn = x => x + 1
```

### Regras ESLint Importantes

- `no-console`: apenas `console.warn` e `console.error` permitidos
- `prefer-const`: obrigatório (`error`) - usar `const` quando não reatribui
- Variáveis prefixadas com `_` são ignoradas pelo `no-unused-vars`
- `vue/html-self-closing`: sempre auto-fechar componentes (`<MyComp />`)
- `vue/multi-word-component-names`: **off** — componentes single-word são permitidos (ex: `Button.vue`)
- `@typescript-eslint/no-explicit-any`: `warn` (não bloqueia, mas evitar)
- `vue/no-multiple-template-root`: **off** — múltiplos root elements no template são permitidos (Vue 3 fragments)
- `generated/**` é ignorado pelo ESLint

## Arquitetura

Nuxt 4 + shadcn-vue + Tailwind CSS v4 + **Nuxt Layers**.

**Tudo é layer** - não existe pasta `app/` na raiz. Arquitetura layers-only.

### Estrutura Principal

```
layers/                 # TUDO fica aqui (incluindo server/)
  0-base/               # Fundação + UI: app.vue, error.vue, CSS, shadcn-vue, utils, tipos
  1-auth/               # Autenticação BFF (Backend-for-Frontend)
  2-home/               # Landing page
  3-usuarios/           # Gestão de perfil, usuários, grupos e permissões
  4-rumores/            # Feed de rumores epidemiológicos (notícias de saúde)
  5-docs/               # Documentação do projeto (Nuxt Content)
content/docs/           # Arquivos markdown da documentação
tests/                  # unit/, integration/, e2e/
generated/              # Código gerado (Kubb) - NÃO EDITAR
```

> Use hífen (`-`) no nome das layers, não ponto. Layers em `~/layers` são auto-registradas.

**Caminhos em layers:** Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` não funcionam.

### Ordem de Prioridade (Layers)

```
5-docs > 4-rumores > 3-usuarios > 2-home > 1-auth > 0-base
```

Número maior = maior prioridade = sobrescreve layers anteriores.

### Fluxo de Dados

```
UI → Composable/Store → Service → API
```

### Estrutura de uma Feature Layer

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

## Padrões de Código

### Service (API)

```typescript
export function useExampleApi() {
  async function getAll() {
    return $fetch('/api/examples')
  }
  return { getAll }
}
```

### Store (Composition API)

```typescript
export const useExampleStore = defineStore('example', () => {
  const items = ref<Example[]>([])
  const api = useExampleApi() // Instanciar no setup

  async function fetchAll() {
    items.value = await api.getAll()
  }

  return { items, fetchAll }
})
```

### Persistência de Estado (pinia-plugin-persistedstate)

Para persistir estado de stores no localStorage entre navegações:

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

| Quando usar                           | Quando NÃO usar                   |
| ------------------------------------- | --------------------------------- |
| Filtros e preferências do usuário     | Dados de API (items, listas)      |
| Estado de UI (tema, layout)           | Auth state (usa cookies httpOnly) |
| Sempre usar `pick` para ser explícito | Dados sensíveis                   |

### Data Fetching

| Método     | Quando usar                    | SSR |
| ---------- | ------------------------------ | --- |
| `useFetch` | Carregamento inicial (páginas) | Sim |
| `$fetch`   | Eventos do usuário (cliques)   | Não |

### VeeValidate

Componentes auto-importados com prefixo `Vee`:

| Componente original | Nome no projeto   |
| ------------------- | ----------------- |
| `Form`              | `VeeForm`         |
| `Field`             | `VeeField`        |
| `FieldArray`        | `VeeFieldArray`   |
| `ErrorMessage`      | `VeeErrorMessage` |

### Server Middleware

Prefixo numérico define ordem de execução: `01.auth.ts` roda antes de `02.logger.ts`.

### Utils vs Composables

- **Utils** (`layers/0-base/app/utils/`): Funções puras, sem estado Vue
- **Composables** (`layers/0-base/app/composables/`): Lógica com `ref`, `computed`

### Server Utilities (BFF)

Utilitários em `layers/0-base/server/utils/` e `layers/1-auth/server/utils/` são **auto-importados** pelo Nitro em todos os endpoints BFF:

```typescript
// fetchSinapse — $fetch pré-configurado para API Sinapse (layers/1-auth/server/utils/)
// Injeta Authorization header automaticamente a partir do cookie
const data = await fetchSinapse('/endpoint', { event })

// handleSinapseRequest — wrapper centralizado para chamadas à API Sinapse (layers/0-base/server/utils/)
// Trata erros, valida resposta com Zod (opcional) e faz logging
export default defineEventHandler(async event => {
  return handleSinapseRequest({
    fn: () => fetchSinapse('/endpoint', { event }),
    errorContext: 'Erro ao buscar dados',
    schema: myZodSchema // opcional
  })
})

// validateBody — lê body + valida com Zod em uma chamada (layers/0-base/server/utils/)
const data = await validateBody(event, myZodSchema)

// validateRouteParam — valida que route param é numérico (previne path traversal)
const id = validateRouteParam(event, 'id')

// buildQueryString — constrói query params com whitelist (layers/0-base/server/utils/)
const qs = buildQueryString(getQuery(event), ['page', 'search', 'status'])
```

### Tipos Compartilhados (`#shared`)

Alias `#shared` aponta para `layers/0-base/shared/`. Tipos globais de API:

```typescript
import type { ApiResponse, PaginatedResponse } from '#shared/types'

// ApiResponse<T> — { data: T, success: boolean, message?: string }
// PaginatedResponse<T> — { data: T[], meta: { total, page, perPage, lastPage } }
```

## SEO

### Composable `useSeoPage`

Usar `useSeoPage` (não `useSeoMeta`) em todas as páginas. Gera automaticamente: title, description, Open Graph, Twitter Cards e canonical URL.

```vue
<script setup lang="ts">
useSeoPage({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description: 'Monitoramento epidemiológico em tempo real para o Brasil.'
})
</script>
```

> **Nota:** `useSeoPage` **não** controla robots. Robots é controlado via `X-Robots-Tag` headers em `routeRules` no `nuxt.config.ts`.

### Sitemap, Robots e Schema.org

Gerenciados pelo módulo unificado `@nuxtjs/seo` (substitui `@nuxtjs/sitemap`, `@nuxtjs/robots` e `nuxt-schema-org`).

- **Sitemap**: gerado automaticamente em `/sitemap.xml`
- **Robots.txt**: gerado pelo sub-módulo robots (não usar `public/robots.txt` estático)
- **X-Robots-Tag**: headers configurados em `routeRules` no `nuxt.config.ts` para rotas internas
- **Schema.org (JSON-LD)**: `useSchemaOrg()` + `defineWebSite()` na homepage
- **ogImage** e **linkChecker**: desabilitados (`enabled: false` no `nuxt.config.ts`)

### Content

Módulo `@nuxt/content` disponível para páginas com conteúdo em Markdown/YAML/JSON. Docs: [content.nuxt.com](https://content.nuxt.com)

## Componentes shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes ficam em `layers/0-base/app/components/ui/` (auto-import).

## Bibliotecas UI Disponíveis

| Biblioteca                | Uso                                        |
| ------------------------- | ------------------------------------------ |
| `vue-sonner`              | Toasts/notificações (módulo Nuxt, sem CSS) |
| `@tanstack/vue-table`     | Tabelas com sort/filter/pagination         |
| `maska`                   | Máscaras de input (CPF, telefone, etc.)    |
| `embla-carousel-vue`      | Carrossel/slider                           |
| `vaul-vue`                | Drawer/bottom sheet                        |
| `@vueuse/core`            | Composables utilitários Vue                |
| `@internationalized/date` | Datas internacionalizadas                  |
| `@tailwindcss/typography` | Plugin prose para Markdown                 |

## Design System - Cores

| Recurso          | Local                                   |
| ---------------- | --------------------------------------- |
| Arquivo de cores | `layers/0-base/app/assets/css/main.css` |
| Visualização     | http://localhost:3000/design-system     |

### Paleta Principal

| Cor               | Classe Tailwind               | Uso                              |
| ----------------- | ----------------------------- | -------------------------------- |
| `brand-primary`   | `bg-brand-primary-{50-950}`   | Vermelho/Coral - CTAs, destaques |
| `brand-secondary` | `bg-brand-secondary-{50-950}` | Azul - Links, ações secundárias  |
| `base`            | `bg-base-{0-950}`             | Neutros - Textos, fundos         |
| `success`         | `bg-success-{50-950}`         | Verde - Feedback positivo        |
| `alert`           | `bg-alert-{50-950}`           | Amarelo - Avisos                 |
| `danger`          | `bg-danger-{50-950}`          | Vermelho - Erros                 |

### Regras

- **Cores da marca** (`brand-*`, `success`, `alert`, `danger`) para elementos customizados
- **Semânticas shadcn** (`primary`, `secondary`, `muted`) para componentes UI
- **Tons baixos (50-200)** para fundos, **tons altos (600-900)** para textos
- **Nunca usar cores hardcoded** - sempre variáveis do design system

## Segurança

Módulo `nuxt-security` configurado com headers, rate limiter, CSRF e XSS protection.

> **Nota:** O CSRF usa `nuxt-csurf` internamente (não precisa instalar separadamente).

### Configuração Atual

| Feature           | Configuração                                                            |
| ----------------- | ----------------------------------------------------------------------- |
| **Headers**       | CSP (desabilitado em dev), HSTS, X-Frame-Options, etc.                  |
| **Rate Limiter**  | 150 req/5min (global), 10 req/5min (login), 5 req/5min (reset-password) |
| **CSRF**          | Habilitado para POST/PUT/PATCH/DELETE (desabilitado em `/api/auth/*`)   |
| **XSS Validator** | Habilitado com defaults                                                 |
| **Request Size**  | 2MB (geral), 8MB (upload)                                               |

### Desabilitar CSRF por Rota

```typescript
// nuxt.config.ts
routeRules: {
  '/api/minha-rota': { csurf: false }
}
```

### Padrões de Código

```typescript
// Tokens em cookies httpOnly (nunca localStorage)
setCookie(event, 'token', value, { httpOnly: true, secure: true, sameSite: 'strict' })

// SEMPRE validar no servidor com Zod
const result = schema.safeParse(body)
if (!result.success) throw createError({ statusCode: 400 })
```

Docs: [nuxt-security.vercel.app](https://nuxt-security.vercel.app)

## API Client (Kubb)

Código TypeScript gerado automaticamente a partir da especificação OpenAPI.

### O que usar do Kubb

| Componente      | Usar?  | Onde                               |
| --------------- | ------ | ---------------------------------- |
| **Tipos**       | ✅ Sim | Composables, stores, endpoints BFF |
| **Schemas Zod** | ✅ Sim | Validação de respostas no BFF      |

### Estrutura

```
kubb.config.ts              # Configuração do Kubb (input: URL remota)
generated/
  sinapse/
    types/                  # Tipos TypeScript (USAR)
    zod/                    # Schemas Zod para validação (USAR)
    index.ts                # Barrel file com todos os exports
```

> **Input:** Spec OpenAPI é buscada diretamente de `https://staging.sinapse.org.br/openapi.json` (sem arquivo local).

### Uso Recomendado

```typescript
// ✅ CORRETO - Tipos para autocomplete e type safety
import type { Token } from '~/generated/sinapse/types/Token'
import type { CasoAgravo } from '~/generated/sinapse/types/CasoAgravo'

// ✅ CORRETO - Schemas Zod para validar respostas no BFF
import { tokenSchema } from '~/generated/sinapse/zod/tokenSchema'

// No endpoint BFF (server/)
const rawResponse = await $fetch('/auth/login', { ... })
const validated = tokenSchema.parse(rawResponse) // Valida em runtime
```

### Regenerar após mudanças no OpenAPI

```bash
npm run api:generate
```

### Configuração Importante (`kubb.config.ts`)

O projeto usa `verbatimModuleSyntax: true` no TypeScript, o que exige configurações específicas:

```typescript
output: {
  path: './generated/sinapse',
  clean: true,
  // OBRIGATÓRIO: Remove extensão .ts dos imports
  // Sem isso: erro "allowImportingTsExtensions"
  extension: { '.ts': '' },
},
```

**Regras para plugins:**

| Plugin      | Configuração                                   | Motivo                                                          |
| ----------- | ---------------------------------------------- | --------------------------------------------------------------- |
| `pluginZod` | **NÃO usar** `typed: true` ou `inferred: true` | Gera `import { ToZod }` que conflita com `verbatimModuleSyntax` |
| `pluginTs`  | Usar normalmente                               | Sem restrições                                                  |

### Adicionar Nova API

1. Obter a URL do OpenAPI spec (ou arquivo local)
2. Criar nova config em `kubb.config.ts` ou arquivo separado
3. Ajustar `input.path` e `output.path` para `./generated/<nome>`
4. Executar `npm run api:generate`

### Troubleshooting

| Erro                           | Solução                                               |
| ------------------------------ | ----------------------------------------------------- |
| `allowImportingTsExtensions`   | Adicionar `extension: { '.ts': '' }` no output        |
| `verbatimModuleSyntax` + ToZod | Remover `typed: true` e `inferred: true` do pluginZod |
| Tipos não reconhecidos         | Verificar se `generated/` não está no `.gitignore`    |

## ai-context (Context Engineering)

Projeto usa **`@ai-coders/context`** via MCP para planejamento e execução estruturada de tarefas. Pasta `.context/` na raiz é a fonte de verdade (docs, agents, plans, skills, workflow).

### Regras

- **SEMPRE usar ai-context** para planejar e executar tarefas não-triviais
- **NÃO criar planos manualmente** em `.context/plans/` — usar MCP tools
- **NÃO usar `sync({ action: "exportContext" })`** — sobrescreve o CLAUDE.md
- Para tarefas triviais (typo, single-line fix), pode pular o workflow

### Workflow PREVC

Escalas: `QUICK` (E→V), `SMALL` (P→E→V), `MEDIUM` (P→R→E→V), `LARGE` (P→R→E→V→C).

Fluxo típico: `context({ action: "check" })` → `context({ action: "scaffoldPlan" })` → `workflow-init()` → `workflow-advance()`.

Ferramentas MCP disponíveis: `context`, `explore`, `plan`, `agent`, `skill`, `sync`, `workflow-init`, `workflow-status`, `workflow-advance`, `workflow-manage`. Detalhes em `.context/docs/`.

## Documentação

### PR Template

Disponível em `.github/PULL_REQUEST_TEMPLATE.md` — preenchido automaticamente ao abrir PRs no GitHub.
