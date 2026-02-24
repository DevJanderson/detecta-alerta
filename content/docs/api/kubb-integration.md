---
title: Integração Kubb
description: Geração automática de tipos e schemas a partir do OpenAPI.
---

# Integração Kubb

O **Kubb** gera automaticamente tipos TypeScript e schemas Zod a partir da especificação OpenAPI da API Sinapse.

## O que é gerado

| Componente           | Usar? | Onde                               |
| -------------------- | ----- | ---------------------------------- |
| **Tipos TypeScript** | Sim   | Composables, stores, endpoints BFF |
| **Schemas Zod**      | Sim   | Validação de respostas no BFF      |

## Estrutura

```
kubb.config.ts              # Configuração
generated/
  sinapse/
    types/                  # Tipos TypeScript
    zod/                    # Schemas Zod
    index.ts                # Barrel file
```

::docs-warning
Nunca edite arquivos na pasta `generated/`. Eles são sobrescritos a cada `npm run api:generate`.
::

## Uso

### Tipos para autocomplete

```typescript
import type { Token } from '~/generated/sinapse/types/Token'
import type { CasoAgravo } from '~/generated/sinapse/types/CasoAgravo'
```

### Schemas Zod para validação

```typescript
import { tokenSchema } from '~/generated/sinapse/zod/tokenSchema'

// No endpoint BFF (server/)
const rawResponse = await $fetch('/auth/login', { ... })
const validated = tokenSchema.parse(rawResponse)
```

## Regenerar

Após mudanças na especificação OpenAPI:

```bash
npm run api:generate
```

::docs-info
A spec OpenAPI é buscada diretamente de `https://staging.sinapse.org.br/openapi.json` (sem arquivo local).
::

## Configuração importante

O projeto usa `verbatimModuleSyntax: true` no TypeScript, o que exige:

```typescript
// kubb.config.ts
output: {
  path: './generated/sinapse',
  clean: true,
  extension: { '.ts': '' } // Remove extensão .ts dos imports
}
```

### Regras para plugins

| Plugin      | Configuração                                   | Motivo                              |
| ----------- | ---------------------------------------------- | ----------------------------------- |
| `pluginZod` | **Não** usar `typed: true` ou `inferred: true` | Conflita com `verbatimModuleSyntax` |
| `pluginTs`  | Usar normalmente                               | Sem restrições                      |

## Troubleshooting

| Erro                           | Solução                                               |
| ------------------------------ | ----------------------------------------------------- |
| `allowImportingTsExtensions`   | Adicionar `extension: { '.ts': '' }` no output        |
| `verbatimModuleSyntax` + ToZod | Remover `typed: true` e `inferred: true` do pluginZod |
| Tipos não reconhecidos         | Verificar se `generated/` não está no `.gitignore`    |
