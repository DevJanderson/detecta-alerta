# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

Sempre responda em Português Brasileiro (pt-BR).

## Git

- Não incluir `Co-Authored-By` nos commits
- Mensagens de commit em português ou inglês (consistente com o projeto)

## Comandos

```bash
# Desenvolvimento
npm run dev          # Servidor dev http://localhost:3000
npm run build        # Build produção

# Qualidade de código
npm run lint:fix     # Corrigir ESLint
npm run format       # Formatar com Prettier
npm run typecheck    # Verificar tipos
npm run quality:fix  # Corrigir lint + formatar

# Testes
npm run test:run           # Vitest (uma execução)
npm run test -- path/to/file.test.ts  # Executar teste específico
npm run test:e2e           # Playwright E2E
npm run test:e2e:install   # Instala browsers (primeiro uso)

# API Client (Kubb)
npm run api:generate       # Gera cliente a partir do OpenAPI
npm run api:watch          # Regenera automaticamente ao alterar spec
```

## Componentes shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes ficam em `layers/1-base/app/components/ui/` (auto-import).

## Design System - Cores

Arquivo de cores: `layers/0-core/app/assets/css/main.css`
Visualização: http://localhost:3000/styles

### Cores da Marca (usar estas)

| Cor                 | Classe Tailwind               | Uso                              |
| ------------------- | ----------------------------- | -------------------------------- |
| **brand-primary**   | `bg-brand-primary-{50-950}`   | Vermelho/Coral - CTAs, destaques |
| **brand-secondary** | `bg-brand-secondary-{50-950}` | Azul - Links, ações secundárias  |
| **brand-tertiary**  | `bg-brand-tertiary-{50-500}`  | Verde/Cinza - Acentos sutis      |
| **base**            | `bg-base-{0-950}`             | Neutros/Cinzas - Textos, fundos  |
| **success**         | `bg-success-{50-950}`         | Verde - Feedback positivo        |
| **alert**           | `bg-alert-{50-950}`           | Amarelo - Avisos                 |
| **danger**          | `bg-danger-{50-950}`          | Vermelho - Erros                 |

### Cores Semânticas (shadcn/ui)

Usam as cores da marca internamente:

| Semântica               | Origem              | Uso                |
| ----------------------- | ------------------- | ------------------ |
| `bg-primary`            | brand-primary-700   | Botões principais  |
| `bg-secondary`          | brand-secondary-700 | Botões secundários |
| `bg-destructive`        | danger-600          | Ações destrutivas  |
| `bg-muted`              | base-100            | Fundos sutis       |
| `bg-accent`             | brand-tertiary-100  | Destaques leves    |
| `text-foreground`       | base-900            | Texto principal    |
| `text-muted-foreground` | base-600            | Texto secundário   |

### Exemplos de Uso

```vue
<!-- Feedback de sucesso -->
<div class="rounded-lg bg-success-100 p-4">
  <p class="text-success-800">Operação concluída!</p>
</div>

<!-- Feedback de erro -->
<div class="rounded-lg bg-danger-100 p-4">
  <p class="text-danger-800">Algo deu errado.</p>
</div>

<!-- Alerta/Aviso -->
<div class="rounded-lg bg-alert-100 p-4">
  <p class="text-alert-800">Atenção!</p>
</div>

<!-- Botão com cor da marca -->
<button class="bg-brand-primary-600 hover:bg-brand-primary-700 text-base-0">
  Ação Principal
</button>

<!-- Usando semânticas do shadcn -->
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Deletar</Button>
```

### Regras

1. **Preferir cores da marca** (`brand-*`, `success`, `alert`, `danger`) para elementos customizados
2. **Usar semânticas** (`primary`, `secondary`, `muted`) para componentes shadcn/ui
3. **Tons baixos (50-200)** para fundos, **tons altos (600-900)** para textos
4. **Nunca usar cores hardcoded** - sempre usar as variáveis do design system

## Arquitetura

Nuxt 4 + shadcn-vue + Tailwind CSS v4 + **Nuxt Layers**.

**Tudo é layer** - não existe pasta `app/` na raiz. Arquitetura layers-only.

### Estrutura Principal

```
layers/                 # TUDO fica aqui (incluindo server/)
  0-core/               # Fundação: app.vue, error.vue, CSS global, health check
  1-base/               # UI: shadcn-vue, utils, tipos globais
  2-example/            # Feature layer de exemplo (copiar para novas)
  3-auth/               # Autenticação BFF (Backend-for-Frontend)
  4-landing/            # Landing page
tests/                  # unit/, integration/, e2e/
docs/                   # Documentação técnica detalhada
generated/              # Cliente API gerado (Kubb) - NÃO EDITAR
openapi/                # Especificações OpenAPI
```

> Use hífen (`-`) no nome das layers, não ponto. Layers em `~/layers` são auto-registradas.

**Caminhos em layers:** Use `~/layers/...` (alias da raiz) para referenciar arquivos em `nuxt.config.ts` de layers. Caminhos relativos como `./app/...` não funcionam.

### Ordem de Prioridade (Layers)

```
4-landing > 3-auth > 2-example > 1-base > 0-core
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

### Utils vs Composables

- **Utils** (`layers/1-base/app/utils/`): Funções puras, sem estado Vue
- **Composables** (`layers/1-base/app/composables/`): Lógica com `ref`, `computed`

## Segurança

Módulos `nuxt-security` e `nuxt-csurf` já configurados.

```typescript
// Tokens em cookies httpOnly (nunca localStorage)
setCookie(event, 'token', value, { httpOnly: true, secure: true, sameSite: 'strict' })

// SEMPRE validar no servidor com Zod
const result = schema.safeParse(body)
if (!result.success) throw createError({ statusCode: 400 })
```

## API Client (Kubb)

Código TypeScript gerado automaticamente a partir da especificação OpenAPI.

### O que usar do Kubb

| Componente       | Usar?  | Onde                               |
| ---------------- | ------ | ---------------------------------- |
| **Tipos**        | ✅ Sim | Composables, stores, endpoints BFF |
| **Schemas Zod**  | ✅ Sim | Validação de respostas no BFF      |
| **Cliente HTTP** | ❌ Não | Usar `$fetch` do Nuxt com BFF      |

### Estrutura

```
openapi/
  sinapse-api.json          # Especificação OpenAPI da API Sinapse
generated/
  sinapse/
    client/                 # Funções de chamada (NÃO USAR - preferir $fetch)
    types/                  # Tipos TypeScript (USAR)
    zod/                    # Schemas Zod para validação (USAR)
    index.ts                # Barrel file
kubb.config.ts              # Configuração do Kubb
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

// ❌ EVITAR - Cliente Kubb (não integra com BFF/cookies httpOnly)
// import { loginApiV1AuthLoginPost } from '~/generated/sinapse/client/...'
```

> **Por que não usar o cliente?** O cliente gerado usa `fetch` puro, não integra com `$fetch` do Nuxt nem com o padrão BFF onde tokens ficam em cookies httpOnly.

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

| Plugin         | Configuração                                   | Motivo                                                          |
| -------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| `pluginZod`    | **NÃO usar** `typed: true` ou `inferred: true` | Gera `import { ToZod }` que conflita com `verbatimModuleSyntax` |
| `pluginTs`     | Usar normalmente                               | Sem restrições                                                  |
| `pluginClient` | Usar normalmente                               | Sem restrições                                                  |

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

## Documentação por Diretório

Cada diretório principal tem seu próprio `CLAUDE.md` com instruções específicas:

| Documento                                                                          | Conteúdo                            |
| ---------------------------------------------------------------------------------- | ----------------------------------- |
| [layers/0-core/CLAUDE.md](layers/0-core/CLAUDE.md)                                 | app.vue, error.vue, CSS global      |
| [layers/1-base/app/components/CLAUDE.md](layers/1-base/app/components/CLAUDE.md)   | shadcn-vue, componentes             |
| [layers/1-base/app/composables/CLAUDE.md](layers/1-base/app/composables/CLAUDE.md) | Padrões de composables              |
| [layers/2-example/CLAUDE.md](layers/2-example/CLAUDE.md)                           | Template para criar features        |
| [layers/3-auth/CLAUDE.md](layers/3-auth/CLAUDE.md)                                 | Autenticação BFF, login, logout     |
| [docs/BFF.md](docs/BFF.md)                                                         | O que é BFF e por que usar          |
| [docs/KUBB.md](docs/KUBB.md)                                                       | Kubb + BFF, geração de código       |
| [tests/CLAUDE.md](tests/CLAUDE.md)                                                 | Vitest, Playwright, mocking         |
| [docs/server.md](docs/server.md)                                                   | Nitro API routes, segurança, testes |
