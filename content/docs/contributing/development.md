---
title: Guia de Desenvolvimento
description: Guia para contribuir com o desenvolvimento do Detecta Alerta.
---

# Guia de Desenvolvimento

## Setup inicial

::docs-steps
::docs-step{title="Clone e instale" :step="1"}

```bash
git clone <url-do-repositório>
cd detecta-alerta
npm install
```

::

::docs-step{title="Configure hooks" :step="2"}

```bash
npm run setup
```

Configura Husky e Commitlint.
::

::docs-step{title="Crie o .env" :step="3"}

```dotenv
NUXT_SINAPSE_API_URL=https://staging.sinapse.org.br/api/v1
NUXT_PUBLIC_SITE_URL=https://alerta.sinapse.org.br
```

::

::docs-step{title="Verifique" :step="4"}

```bash
npm run typecheck
npm run test:run
```

::
::

## Criar uma nova feature layer

1. Crie a pasta `layers/{N}-{feature}/`
2. Adicione um `nuxt.config.ts` (pode ser vazio)
3. Siga a estrutura padrão:

```
layers/{N}-{feature}/
├── nuxt.config.ts
├── app/
│   ├── components/
│   ├── composables/
│   └── pages/{feature}/
└── server/api/{feature}/
```

## Adicionar componentes shadcn-vue

```bash
npx shadcn-vue@latest add <componente>
```

Componentes são instalados em `layers/0-base/app/components/ui/`.

## Utils vs Composables

| Tipo            | Local                            | Quando usar                   |
| --------------- | -------------------------------- | ----------------------------- |
| **Utils**       | `layers/0-base/app/utils/`       | Funções puras, sem estado Vue |
| **Composables** | `layers/0-base/app/composables/` | Lógica com `ref`, `computed`  |

## Server Middleware

Prefixo numérico define ordem de execução:

```
server/middleware/
  01.auth.ts       # Executa primeiro
  02.logger.ts     # Executa depois
```

## Commits

O projeto usa **Commitlint** com a convenção conventional commits:

```bash
# ✅ Correto (lowercase no subject)
feat(auth): implementa login com oauth
fix(rumores): corrige paginação do feed

# ❌ Incorreto (PascalCase no subject)
feat(auth): Implementa Login
```

### Types permitidos

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`, `revert`

### Limites

- Subject: máximo 72 caracteres
- Body: máximo 100 caracteres por linha
