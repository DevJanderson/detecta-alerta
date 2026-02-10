# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

**Sempre responda em Português Brasileiro (pt-BR).**

## Regras Críticas

### Git

- **NÃO** incluir `Co-Authored-By` nos commits
- Mensagens de commit em português ou inglês (consistente com o projeto)
- Commitlint exige `subject-case: lower-case` (severity error)
  - ✅ `feat(auth): implementa login com oauth`
  - ❌ `feat(auth): Implementa Login` ← falha no commit
  - Nomes de função/classe (PascalCase) só no body, nunca no subject

### Execução

- **NUNCA** rodar `npm run dev` em background ou com timeout - deixar o usuário iniciar no terminal dele
- Para verificar erros, usar apenas `npm run typecheck` ou `npm run build`
- Evitar processos que ficam rodando indefinidamente

### Code Style

Projeto usa Prettier com: **sem ponto-e-vírgula**, **aspas simples**, **100 colunas**, **sem trailing comma**, **arrow parens: avoid**.

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

## Sobre o Projeto

**Detecta Alerta** é uma plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil. Centraliza dados de estabelecimentos de saúde (UBS, UPA, Drogarias) para análise de padrões epidemiológicos e detecção precoce de surtos.

## Setup Inicial

```bash
npm install
npm run setup          # Configura git hooks (Husky, Commitlint)
```

### Variáveis de Ambiente

Criar arquivo `.env` na raiz:

```env
# URL da API Sinapse (incluir /api/v1)
NUXT_SINAPSE_API_URL=https://staging.sinapse.org.br/api/v1

# URL pública do site (opcional, default: https://alerta.sinapse.org.br)
NUXT_PUBLIC_SITE_URL=https://alerta.sinapse.org.br
```

## Comandos Principais

```bash
npm run dev              # Servidor dev http://localhost:3000
npm run build            # Build produção
npm run typecheck        # Verificar tipos (USAR para detectar erros)
npm run quality:fix      # Lint + format
npm run test:run         # Vitest (uma execução)
npm run test -- path/to/file.test.ts  # Teste específico
npm run test:e2e         # Playwright E2E
npm run api:generate     # Gera cliente a partir do OpenAPI
```

## SEO

### Composable `useSeoPage`

Usar `useSeoPage` (não `useSeoMeta`) em todas as páginas. Gera automaticamente: title, description, Open Graph, Twitter Cards, canonical URL e robots.

```vue
<script setup lang="ts">
// Página pública (indexável)
useSeoPage({
  title: 'Detecta Alerta - Vigilância Epidemiológica',
  description: 'Monitoramento epidemiológico em tempo real para o Brasil.'
})

// Página interna (não indexável)
useSeoPage({
  title: 'Login - Detecta Alerta',
  noindex: true
})
</script>
```

### Sitemap e Robots

- **Sitemap**: gerado automaticamente por `@nuxtjs/sitemap` em `/sitemap.xml`
- **Robots**: `public/robots.txt` bloqueia `/api/`, `/auth/`, `/design-system/`
- **JSON-LD**: apenas na homepage (`layers/4-home/app/pages/index.vue`)

## Componentes shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes ficam em `layers/0-base/app/components/ui/` (auto-import).

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

## Arquitetura

Nuxt 4 + shadcn-vue + Tailwind CSS v4 + **Nuxt Layers**.

**Tudo é layer** - não existe pasta `app/` na raiz. Arquitetura layers-only.

### Estrutura Principal

```
layers/                 # TUDO fica aqui (incluindo server/)
  0-base/               # Fundação + UI: app.vue, error.vue, CSS, shadcn-vue, utils, tipos
  3-auth/               # Autenticação BFF (Backend-for-Frontend)
  4-home/               # Landing page
tests/                  # unit/, integration/, e2e/
generated/              # Código gerado (Kubb) - NÃO EDITAR
openapi/                # Especificações OpenAPI
```

> Use hífen (`-`) no nome das layers, não ponto. Layers em `~/layers` são auto-registradas.

**Caminhos em layers:** Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` não funcionam.

### Ordem de Prioridade (Layers)

```
4-home > 3-auth > 0-base
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
| **Mocks/MSW**   | ✅ Sim | Testes unitários e integração      |

### Estrutura

```
openapi/
  sinapse-api.json          # Especificação OpenAPI da API Sinapse
generated/
  sinapse/
    types/                  # Tipos TypeScript (USAR)
    zod/                    # Schemas Zod para validação (USAR)
    mocks/                  # Faker mocks para dados de teste (importar direto)
    msw/                    # MSW handlers para interceptar requests (importar direto)
    index.ts                # Barrel file (NÃO inclui mocks/msw)
kubb.config.ts              # Configuração do Kubb
```

### ⚠️ IMPORTANTE: Mocks e MSW

**Mocks e MSW NÃO são exportados no barrel principal (`index.ts`)** para evitar:

- Carregar `@faker-js/faker` (~6MB) no bundle de produção
- Travar o dev server com milhares de arquivos desnecessários

**Importar diretamente quando necessário em testes:**

```typescript
// ✅ CORRETO - Importar direto para testes
import { createToken } from '~/generated/sinapse/mocks/createToken'
import { loginHandler } from '~/generated/sinapse/msw/AutenticaçãoHandlers'

// ❌ ERRADO - NÃO exporta mocks/msw
import { createToken } from '~/generated/sinapse' // Não funciona
```

**Configuração crítica em `kubb.config.ts`:**

```typescript
pluginFaker({ output: { barrelType: false } }) // NÃO mudar para 'named'
pluginMsw({ output: { barrelType: false } }) // NÃO mudar para 'named'
```

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

1. Adicionar spec OpenAPI em `openapi/<nome>-api.json`
2. Criar nova config em `kubb.config.ts` ou arquivo separado
3. Ajustar `output.path` para `./generated/<nome>`
4. Executar `npm run api:generate`

### Troubleshooting

| Erro                           | Solução                                               |
| ------------------------------ | ----------------------------------------------------- |
| `allowImportingTsExtensions`   | Adicionar `extension: { '.ts': '' }` no output        |
| `verbatimModuleSyntax` + ToZod | Remover `typed: true` e `inferred: true` do pluginZod |
| Tipos não reconhecidos         | Verificar se `generated/` não está no `.gitignore`    |

## Documentação

### Por Diretório (CLAUDE.md)

| Documento                                                                          | Conteúdo                                |
| ---------------------------------------------------------------------------------- | --------------------------------------- |
| [layers/0-base/CLAUDE.md](layers/0-base/CLAUDE.md)                                 | Fundação + UI: shadcn-vue, utils, tipos |
| [layers/0-base/app/components/CLAUDE.md](layers/0-base/app/components/CLAUDE.md)   | Componentes UI                          |
| [layers/0-base/app/composables/CLAUDE.md](layers/0-base/app/composables/CLAUDE.md) | Padrões de composables                  |
| [layers/3-auth/CLAUDE.md](layers/3-auth/CLAUDE.md)                                 | Autenticação BFF, login, logout         |
| [layers/4-home/CLAUDE.md](layers/4-home/CLAUDE.md)                                 | Homepage, páginas públicas              |
| [tests/CLAUDE.md](tests/CLAUDE.md)                                                 | Vitest, Playwright, mocking             |
