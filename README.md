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

| Módulo            | Descrição                                                                            |
| ----------------- | ------------------------------------------------------------------------------------ |
| **Dashboard**     | Painel com mapa do Brasil, gráficos de tendências, alertas por região e estatísticas |
| **Meu Município** | WebGIS interativo com MapLibre GL para explorar dados epidemiológicos por município  |
| **Mapa de Risco** | Mapa de risco epidemiológico por região                                              |
| **Rumores**       | Feed de notícias epidemiológicas para monitorar tendências e boatos de saúde         |
| **Usuários**      | Gestão de perfil, usuários, grupos e permissões (administradores)                    |

## Dados Monitorados

- Taxa de ocupação de unidades de saúde
- Z-score (detecção de anomalias)
- Tendências (alta/baixa/estável)
- Alertas por cor (verde/amarelo/vermelho)
- Dados CNES de profissionais de saúde
- Notícias e rumores epidemiológicos por região

## Stack

| Categoria  | Tecnologia                          |
| ---------- | ----------------------------------- |
| Framework  | Nuxt 4, Vue 3.5, TypeScript         |
| UI         | Tailwind CSS 4, shadcn-vue          |
| State      | Pinia                               |
| Validação  | Zod, VeeValidate                    |
| Mapas      | MapLibre GL (OpenFreeMap)           |
| API Client | Tipos manuais + Zod (`#shared`)     |
| Qualidade  | ESLint, Prettier, Husky, Commitlint |
| Testes     | Vitest, Playwright                  |

## Início Rápido

```bash
npm install
npm run setup    # Configura git hooks
cp .env.example .env  # Configurar variáveis
npm run dev      # http://localhost:3000
```

## Comandos

```bash
# Desenvolvimento
npm run dev              # Servidor dev
npm run build            # Build produção
npm run typecheck        # Verificar tipos

# Qualidade de código
npm run quality:fix      # Lint + format

# Testes
npm run test:run         # Todos os testes
npm run test:unit        # Testes unitários (Node puro)
npm run test:nuxt        # Testes com ambiente Nuxt
npm run test:e2e         # Testes E2E (Playwright)

# API e dados
npm run geo:convert      # Converte GeoJSON → TopoJSON
npm run docs:llms        # Gera public/llms-full.txt
```

## Estrutura

```
layers/
├── base/            # Fundação: Tailwind, shadcn-vue, utils, tipos, domain
├── auth/            # Autenticação BFF (cookies httpOnly, refresh)
├── home/            # Homepage (dashboard, panorama, tabela)
├── meu-municipio/   # WebGIS municipal (MapLibre GL, alertas, rumores)
├── mapa-risco/      # Mapa de risco epidemiológico
├── usuarios/        # Perfil, usuários, grupos, permissões (admin)
├── rumores/         # Feed de rumores epidemiológicos
└── docs/            # Documentação (Nuxt Content)

content/docs/        # Markdown da documentação
tests/               # unit/, integration/, e2e/
```

## Documentação

- **Desenvolvedores**: Documentação navegável em `/docs` (Nuxt Content)
- **IA/LLMs**: [`/llms.txt`](public/llms.txt) — índice para IA, [`/llms-full.txt`](public/llms-full.txt) — docs completas
- **Agentes de código**: `CLAUDE.md` na raiz com instruções de arquitetura e padrões

## Licença

Proprietária © 2025 [ITpS - Instituto Todos pela Saúde](https://itps.org.br) - Todos os direitos reservados.
