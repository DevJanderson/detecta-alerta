---
title: Instalação
description: Como configurar o ambiente de desenvolvimento do Detecta Alerta.
---

# Instalação

## Pré-requisitos

- **Node.js** 20+ (recomendado: última LTS)
- **npm** 10+
- **Git**

## Clone o repositório

```bash
git clone <url-do-repositório>
cd detecta-alerta
```

## Instale as dependências

```bash
npm install
```

## Configure os git hooks

```bash
npm run setup
```

Isso configura o **Husky** para git hooks e o **Commitlint** para padronização de commits.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```dotenv
# URL da API Sinapse (incluir /api/v1)
NUXT_SINAPSE_API_URL=https://staging.sinapse.org.br/api/v1

# URL pública do site (opcional)
NUXT_PUBLIC_SITE_URL=https://alerta.sinapse.org.br
```

::docs-warning
Nunca commite o arquivo `.env` no repositório. Ele já está no `.gitignore`.
::

## Verifique a instalação

```bash
# Verificar tipos TypeScript
npm run typecheck

# Rodar testes
npm run test:run
```

Se tudo passou sem erros, seu ambiente está pronto.

## Próximo passo

Veja o [Início Rápido](/docs/getting-started/quick-start) para rodar o projeto.
