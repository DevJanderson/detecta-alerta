---
title: Início Rápido
description: Rode o Detecta Alerta em minutos.
---

# Início Rápido

Após completar a [instalação](/docs/getting-started/installation), você pode iniciar o servidor de desenvolvimento.

## Servidor de desenvolvimento

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`.

## Comandos principais

| Comando                | Descrição                      |
| ---------------------- | ------------------------------ |
| `npm run dev`          | Servidor de desenvolvimento    |
| `npm run build`        | Build de produção              |
| `npm run typecheck`    | Verificar tipos TypeScript     |
| `npm run quality:fix`  | Lint + format automático       |
| `npm run test:run`     | Rodar todos os testes          |
| `npm run test:unit`    | Testes unitários (Node puro)   |
| `npm run test:nuxt`    | Testes de integração (Nuxt)    |
| `npm run test:e2e`     | Testes end-to-end (Playwright) |
| `npm run api:generate` | Gerar cliente API (Kubb)       |

## Páginas disponíveis

| Rota             | Descrição                       |
| ---------------- | ------------------------------- |
| `/`              | Homepage                        |
| `/auth/login`    | Login                           |
| `/design-system` | Visualização do design system   |
| `/docs`          | Documentação (esta página)      |
| `/rumores`       | Feed de rumores epidemiológicos |

## Estrutura do projeto

O projeto segue uma arquitetura **layers-only** — não existe pasta `app/` na raiz. Tudo fica dentro de `layers/`:

```
layers/
  0-base/       # Fundação: app.vue, CSS, shadcn-vue, utils
  1-auth/       # Autenticação BFF
  2-home/       # Landing page
  3-usuarios/   # Gestão de usuários e permissões
  4-rumores/    # Feed de rumores epidemiológicos
  5-docs/       # Documentação (esta seção)
```

::docs-tip
Consulte a seção [Arquitetura](/docs/architecture/overview) para entender em detalhes como as layers funcionam.
::
