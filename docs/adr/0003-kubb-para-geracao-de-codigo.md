# ADR-0003: Kubb para Geração de Código a partir do OpenAPI

## Status

Accepted

## Contexto

A API Sinapse fornece uma especificação OpenAPI. Precisávamos de tipos TypeScript,
validação runtime e dados de teste sincronizados com essa especificação. Manter
isso manualmente seria propenso a erros e desatualização.

## Decisão

Usar **Kubb** para gerar automaticamente a partir do OpenAPI:

| Plugin         | Gera             | Uso                                 |
| -------------- | ---------------- | ----------------------------------- |
| `pluginTs`     | Tipos TypeScript | Composables, stores, endpoints BFF  |
| `pluginZod`    | Schemas Zod      | Validação de respostas no BFF       |
| `pluginFaker`  | Mocks com Faker  | Testes unitários                    |
| `pluginMsw`    | MSW Handlers     | Testes de integração                |
| `pluginClient` | Cliente HTTP     | **NÃO usado** (preferimos `$fetch`) |

**Decisão crítica**: Mocks e MSW **não são exportados no barrel** (`barrelType: false`)
para evitar carregar `@faker-js/faker` (~6MB) no bundle de produção.

## Opções Consideradas

### Opção 1: Tipos e validações manuais

- **Prós**: Controle total
- **Contras**: Propenso a desatualização, manutenção pesada

### Opção 2: OpenAPI Generator

- **Prós**: Maduro, suporta muitas linguagens
- **Contras**: Templates complexos, menos flexível para Zod/MSW

### Opção 3: Kubb (escolhida)

- **Prós**: Plugins modulares, gera Zod + MSW + Faker, TypeScript-first
- **Contras**: Projeto mais jovem, precisa de config específica para `verbatimModuleSyntax`

## Racional

Kubb é o único gerador que produz **tipos + Zod + Faker + MSW** em um único pipeline,
tudo TypeScript-first. A integração com `verbatimModuleSyntax` requer `extension: { '.ts': '' }`
no output e não usar `typed: true` no pluginZod.

## Consequências

### Positivas

- Type safety ponta a ponta (API → BFF → Cliente)
- Validação runtime com Zod garante que a API não mudou silenciosamente
- Mocks realistas para testes sem depender da API real
- `npm run api:generate` sincroniza tudo em um comando

### Negativas

- Código gerado precisa ser commitado (não está no .gitignore)
- Configuração específica para `verbatimModuleSyntax`
- Cliente gerado (`pluginClient`) não é usado (preferimos `$fetch` do Nuxt)

## Referências

- [docs/KUBB.md](../KUBB.md)
- [kubb.config.ts](../../kubb.config.ts)
