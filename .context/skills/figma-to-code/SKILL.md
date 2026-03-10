---
name: figma-to-code
description: Converte designs do Figma em componentes Vue seguindo as convenções do Detecta Alerta. Usar quando o usuário fornecer um link do Figma ou pedir para implementar um design.
---

# Figma to Code — Detecta Alerta

Skill para converter designs do Figma em componentes Vue/Nuxt seguindo as convenções do projeto.

---

## Quando Usar

- Usuário fornece um **link do Figma** (`figma.com/design/...`)
- Pedido para **implementar um design** ou **atualizar componente** a partir do Figma
- Comparar implementação atual com o design do Figma

---

## Passo a Passo

### 1. Extrair Design do Figma

Extrair `fileKey` e `nodeId` da URL do Figma:

- `figma.com/design/:fileKey/:fileName?node-id=:nodeId` — converter `-` para `:` no nodeId
- `figma.com/design/:fileKey/branch/:branchKey/:fileName` — usar branchKey como fileKey

Chamar `mcp__figma__get_design_context` com:

- `fileKey` e `nodeId` extraídos
- `clientFrameworks: "vue, nuxt"`
- `clientLanguages: "typescript, html, css"`

### 2. Analisar o Screenshot

O design context retorna um **screenshot** do nó. Usar como referência visual principal para:

- Identificar layout, espaçamento, cores e tipografia
- Comparar com componentes já existentes no projeto
- Detectar variantes de estado (hover, active, disabled)

### 3. Identificar Componentes Existentes

Antes de criar código novo, verificar se já existem componentes no projeto que correspondam:

```
layers/base/app/components/ui/       — shadcn-vue (primitivos)
layers/base/app/components/common/   — componentes globais
layers/{feature}/app/components/     — componentes de feature
```

Priorizar **reutilização** de componentes existentes sobre criação de novos.

### 4. Converter para Vue/Nuxt

O código do Figma vem em **React + Tailwind**. Converter para o stack do projeto:

| De (Figma/React)         | Para (Detecta Alerta)                        |
| ------------------------ | -------------------------------------------- |
| `className`              | `class`                                      |
| `React.useState`         | `ref()` / `reactive()`                       |
| `onClick`                | `@click`                                     |
| JSX `{condition && ...}` | `v-if` / `v-show`                            |
| `{items.map(...)}`       | `v-for`                                      |
| `<img src={...} />`      | `<NuxtImg src="..." />`                      |
| `<a href="...">`         | `<NuxtLink to="...">`                        |
| Cores hex hardcoded      | Classes do design system (`primary-*`)       |
| `px` absolutos           | Classes Tailwind (`p-4`, `gap-6`, `text-sm`) |
| Font family inline       | Sem declarar (herda do design system)        |
| SVG assets (URLs)        | Baixar SVGs e usar inline ou como `<Icon />` |

### 5. Aplicar Convenções do Projeto

#### CSS / Tailwind

- Usar **variáveis do design system** (`primary-*`, `secondary-*`, `base-*`)
- Nunca cores hardcoded (`#hex`, `rgb()`)
- Seguir a escala Tailwind para espaçamento e tamanhos

#### Componentes

- shadcn-vue para primitivos UI (`Button`, `Card`, `Input`, `Dialog`)
- `<Icon name="lucide:*" />` para icones (não SVGs avulsos quando possivel)
- Auto-import: nao precisa importar componentes UI

#### Imagens e Assets

- SVGs do Figma: baixar via URL do asset, analisar o conteudo
  - Se for icone simples: verificar se existe equivalente no Lucide (`lucide:*`)
  - Se for icone custom: usar SVG inline com `currentColor` para herdar cor
  - Se for ilustracao/logo: converter para WebP e salvar em `public/`
- Imagens raster (PNG, JPG): **sempre converter para WebP** antes de salvar
  - Usar Pillow: `Image.open(src).save(dst, 'WEBP', quality=85, method=6)`
  - SVGs com raster embutido (`data:image/png;base64,...`): extrair o raster e converter para WebP
  - SVGs vetoriais puros (paths, shapes): manter como SVG — não converter
  - Salvar em `public/` com nome descritivo e usar `<NuxtImg />`

#### Code Style

- Sem ponto-e-virgula
- Aspas simples
- 100 colunas max
- Sem trailing comma
- Arrow parens: avoid (`x => x + 1`)

### 6. Validar

- [ ] Componente segue a estrutura de layers (feature layer correta)?
- [ ] Cores usam design system (nenhum hex hardcoded)?
- [ ] Componentes shadcn-vue reutilizados onde possivel?
- [ ] Responsivo (mobile-first com breakpoints `sm:`, `lg:`)?
- [ ] Sem dependencias novas desnecessarias?
- [ ] `npm run typecheck` passa sem erros?

---

## Exemplo de Uso

```
/figma-to-code https://figma.com/design/eWqOtaEsUiOMNpJKUTrgtp/ITPS?node-id=11-940
```

Fluxo:

1. Extrai `fileKey=eWqOtaEsUiOMNpJKUTrgtp`, `nodeId=11:940`
2. Chama `get_design_context` para obter codigo + screenshot
3. Analisa screenshot e identifica elementos
4. Busca componentes existentes no projeto
5. Converte React/Tailwind para Vue/Nuxt com convencoes do projeto
6. Aplica ou cria o componente na layer correta

---

## Mapeamento de Cores (Figma → Projeto)

| Token Figma                       | Classe Tailwind        |
| --------------------------------- | ---------------------- |
| `--primary/text/default`          | `text-primary-700`     |
| `--primary/background/default`    | `bg-primary-*`         |
| `--secondary/text/default`        | `text-secondary-600`   |
| `--secondary/text/accessible-min` | `text-secondary-600`   |
| `--secondary/background/default`  | `bg-secondary-50`      |
| `--secondary/border/default`      | `border-secondary-200` |
| `--base/background/default-1`     | `bg-white`             |
| `--base/border/default`           | `border-base-100`      |

---

## Troubleshooting

| Problema                         | Solucao                                                    |
| -------------------------------- | ---------------------------------------------------------- |
| Asset URL expirado (7 dias)      | Re-executar `get_design_context` para obter novas URLs     |
| Screenshot muito pequeno         | Usar `get_screenshot` no no especifico para zoom           |
| Componente Figma com variantes   | Pedir nodeId especifico da variante desejada               |
| SVG retornado como imagem raster | Usar `get_design_context` no no do vetor, nao no frame pai |
