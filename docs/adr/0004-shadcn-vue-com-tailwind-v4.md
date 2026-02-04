# ADR-0004: shadcn-vue com Tailwind CSS v4 e Design System Customizado

## Status

Accepted

## Contexto

O projeto precisava de uma biblioteca de componentes UI acessível, customizável e
alinhada à identidade visual do ITpS (Instituto Todos pela Saúde). O design system
requer paleta de cores específica (vermelho/coral, azul) e variantes de componentes
customizadas (brand-outline, brand-md).

## Decisão

Adotar **shadcn-vue** (componentes copiáveis baseados em Reka UI) com **Tailwind CSS v4**
e um **design system customizado** com tokens de cor semânticos.

### Paleta de Cores

| Token                  | Classe Tailwind               | Uso                              |
| ---------------------- | ----------------------------- | -------------------------------- |
| `brand-primary`        | `bg-brand-primary-{50-950}`   | Vermelho/Coral - CTAs, destaques |
| `brand-secondary`      | `bg-brand-secondary-{50-950}` | Azul - Links, ações              |
| `base`                 | `bg-base-{0-950}`             | Neutros - Textos, fundos         |
| `success/alert/danger` | `bg-{token}-{50-950}`         | Feedback semântico               |

## Opções Consideradas

### Opção 1: Vuetify (Material Design)

- **Prós**: Componentes completos, documentação extensa
- **Contras**: Visual Material Design é genérico, difícil customizar profundamente

### Opção 2: PrimeVue

- **Prós**: Muitos componentes, temas
- **Contras**: Bundle pesado, estilo próprio que conflita com Tailwind

### Opção 3: shadcn-vue + Tailwind v4 (escolhida)

- **Prós**: Componentes copiáveis (customizáveis), Reka UI acessível, Tailwind nativo
- **Contras**: Menos componentes prontos, precisa montar design system

### Opção 4: Tailwind puro sem biblioteca

- **Prós**: Controle total
- **Contras**: Reinventar acessibilidade (keyboard, ARIA, focus management)

## Racional

shadcn-vue copia componentes para o projeto (não é dependência em node_modules), permitindo
customização profunda. Reka UI fornece primitivos acessíveis (focus trap, keyboard nav, ARIA).
Tailwind v4 com `@source` resolve automaticamente classes em layers.

## Consequências

### Positivas

- Componentes 100% customizáveis (arquivo local, não pacote)
- Acessibilidade built-in via Reka UI
- Design system com variáveis CSS (dark mode ready)
- Variantes customizadas (brand-outline, brand-md) via CVA

### Negativas

- Menos componentes prontos que Vuetify/PrimeVue
- Atualizações de shadcn-vue requerem diff manual
- `@source "../../../../"` no CSS para scan de classes em layers

## Referências

- [shadcn-vue](https://www.shadcn-vue.com/)
- [Reka UI](https://reka-ui.com/)
- Design system visual: http://localhost:3000/design-system
