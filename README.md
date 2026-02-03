# Detecta Alerta

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxtdotjs&logoColor=white)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Propriet%C3%A1ria-red.svg)](LICENSE)

Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.

## Sobre

O **Detecta Alerta** centraliza dados de estabelecimentos de saúde (UBS, UPA, Drogarias) para análise de padrões epidemiológicos, identificação de alertas e suporte à tomada de decisão em saúde pública.

### Propósito

Permitir a detecção precoce de surtos e ameaças à saúde pública através do monitoramento contínuo de indicadores de ocupação e tendências em estabelecimentos de saúde em todo o Brasil.

## Funcionalidades

| Módulo                  | Descrição                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------ |
| **Dashboard**           | Painel com mapa do Brasil, gráficos de tendências, alertas por região e estatísticas |
| **Meu Município**       | WebGIS interativo para explorar unidades de saúde por município                      |
| **Rumores**             | Feed de notícias epidemiológicas para monitorar tendências e boatos de saúde         |
| **Lugares Monitorados** | Gestão de unidades de saúde (CRUD) - exclusivo para administradores                  |

## Dados Monitorados

- Taxa de ocupação de unidades de saúde
- Z-score (detecção de anomalias)
- Tendências (alta/baixa/estável)
- Alertas por cor (verde/amarelo/vermelho)
- Dados CNES de profissionais de saúde
- Notícias e rumores epidemiológicos por região

## Público-Alvo

1. **Gestores de Saúde Pública** - Secretários municipais, diretores de vigilância epidemiológica
2. **Epidemiologistas e Analistas** - Profissionais que investigam padrões e anomalias
3. **Administradores da Rede** - Responsáveis por manter a base de unidades monitoradas
4. **Público Geral** - Acesso a dados agregados para transparência

## Stack

| Categoria | Tecnologia                          |
| --------- | ----------------------------------- |
| Framework | Nuxt 4, Vue 3.5, TypeScript         |
| UI        | Tailwind CSS 4, shadcn-vue          |
| State     | Pinia                               |
| Validação | Zod, VeeValidate                    |
| Mapas     | WebGIS                              |
| Qualidade | ESLint, Prettier, Husky, Commitlint |
| Testes    | Vitest, Playwright, Testing Library |

## Início Rápido

```bash
npm install
npm run setup    # Configura git hooks
npm run dev      # http://localhost:3000
```

## Comandos

```bash
# Desenvolvimento
npm run dev          # Servidor dev
npm run build        # Build produção

# Qualidade de código
npm run lint:fix     # Corrigir ESLint
npm run format       # Formatar com Prettier
npm run typecheck    # Verificar tipos
npm run quality:fix  # Lint + format

# Testes
npm run test:run     # Testes unitários
npm run test:e2e     # Testes E2E
```

## Estrutura

```
layers/
├── 0-core/      # Fundação: app.vue, CSS global
├── 1-base/      # UI: shadcn-vue, utils, tipos
├── 3-auth/      # Autenticação BFF
└── 4-landing/   # Landing page

tests/           # Testes (unit, e2e)
```

## Licença

Proprietária © 2025 [ITpS - Instituto Todos pela Saúde](https://itps.org.br) - Todos os direitos reservados.
