# Layer 5-docs - CLAUDE.md

Site de documentacao do Detecta Alerta. Layout 3 colunas (sidebar + conteudo + TOC) inspirado no Claude Code docs.

## Estrutura

```
layers/5-docs/
├── nuxt.config.ts
├── app/
│   ├── layouts/
│   │   └── docs.vue                  # Layout 3 colunas (sidebar, conteudo, TOC)
│   ├── pages/
│   │   └── docs/
│   │       └── [...slug].vue         # Catch-all para MD (queryCollection + ContentRenderer)
│   ├── components/
│   │   ├── DocsHeader.vue            # Header fixo (logo, busca, github, dark mode)
│   │   ├── DocsNav.vue               # Sidebar navegacao (grupos colapsaveis)
│   │   ├── DocsToc.vue               # Table of Contents (h2/h3 com destaque ativo)
│   │   ├── DocsPageNav.vue           # Prev/Next (via useDocsNavigation)
│   │   └── content/                  # Componentes MDC (usaveis dentro de .md)
│   │       ├── DocsCallout.vue       # Base: tip/info/warning/danger
│   │       ├── DocsTip.vue           # Callout verde (tip)
│   │       ├── DocsInfo.vue          # Callout azul (info)
│   │       ├── DocsWarning.vue       # Callout ambar (warning)
│   │       ├── DocsCardGroup.vue     # Grid responsivo de cards
│   │       ├── DocsCard.vue          # Card clicavel com icone
│   │       ├── DocsTabs.vue          # Container de abas
│   │       ├── DocsTab.vue           # Aba individual
│   │       ├── DocsSteps.vue         # Container de passos sequenciais
│   │       ├── DocsStep.vue          # Passo individual numerado
│   │       └── ProsePre.vue          # Override: bloco de codigo com copy button
│   └── composables/
│       ├── useDocsNavigation.ts      # Estrutura de nav (estatica), prev/next
│       └── useDocsToc.ts             # Heading ativo via IntersectionObserver
```

## Content Collections

Definidas em `content.config.ts` na raiz do projeto:

```typescript
// Collection 'docs' com schema customizado
defineCollection({
  type: 'page',
  source: 'docs/**/*.md',
  schema: z.object({
    icon: z.string().optional(),
    order: z.number().optional(),
    hidden: z.boolean().optional()
  })
})
```

## Conteudo Markdown

```
content/docs/
├── index.md                    # Pagina inicial da documentacao
├── api/
│   ├── kubb-integration.md     # Integracao com Kubb
│   └── overview.md             # Visao geral da API
├── architecture/
│   ├── bff-pattern.md          # Padrao BFF
│   ├── layers.md               # Arquitetura de Nuxt Layers
│   ├── overview.md             # Visao geral
│   └── security.md             # Seguranca
├── contributing/
│   ├── code-style.md           # Padroes de codigo
│   ├── development.md          # Guia de desenvolvimento
│   └── testing.md              # Testes
├── getting-started/
│   ├── installation.md         # Instalacao e setup
│   └── quick-start.md          # Inicio rapido
└── projeto/
    ├── backlog.md              # Backlog do projeto
    └── decisoes.md             # Decisoes tecnicas (ADRs)
```

## Componentes MDC

Usaveis dentro de `.md` via sintaxe MDC:

```md
::docs-tip
Dica importante aqui.
::

::docs-warning{title="Atencao"}
Conteudo do aviso.
::

::docs-card-group
::docs-card{title="Titulo" icon="lucide:book" href="/docs/intro"}
Descricao do card.
::
::

::docs-steps
::docs-step{title="Passo 1" step="1"}
Faca isso.
::
::docs-step{title="Passo 2" step="2"}
Depois isso.
::
::

::docs-tabs{:items='["npm", "yarn"]'}
::docs-tab{name="npm"}
npm install
::
::docs-tab{name="yarn"}
yarn add
::
::
```

## Composables

### useDocsNavigation

Estrutura de navegacao estatica (hardcoded) com 5 grupos e 13 itens. Exporta `navigation`, `flatItems`, `currentIndex`, `prevPage`, `nextPage`.

### useDocsToc

Controla heading ativo via `IntersectionObserver` (`rootMargin: '-80px 0px -70% 0px'`). Exporta `activeId`, `observe(container)`, `cleanup()`.

## Prioridade

```
5-docs > 4-rumores > 3-usuarios > 2-home > 1-auth > 0-base
```
