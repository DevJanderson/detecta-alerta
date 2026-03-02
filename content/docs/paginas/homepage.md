---
title: 'Homepage — Visão Geral'
description: 'Contexto, objetivo, público-alvo e escopo da homepage do Detecta Alerta.'
order: 1
---

# Homepage — Visão Geral

## Contexto

O **Detecta Alerta** é uma plataforma de vigilância epidemiológica em tempo real para o Brasil, desenvolvida pelo Instituto Todos pela Saúde (ITpS). A plataforma centraliza dados de lotação de estabelecimentos de saúde — Drogarias, UBS e UPAs — para análise de padrões epidemiológicos e detecção precoce de surtos.

A homepage é a **porta de entrada** da plataforma. É a primeira página que qualquer visitante vê e precisa comunicar imediatamente o valor do produto: transformar dados dispersos de saúde em informação visual e acionável.

## Problema

Gestores de saúde, epidemiologistas e o público geral não têm uma forma unificada e visual de acompanhar a lotação de estabelecimentos de saúde por região. Os dados existem mas estão dispersos em sistemas diferentes, com formatos incompatíveis e sem contexto histórico para comparação.

**Consequências:**

- Surtos são detectados tardiamente por falta de visão consolidada
- Gestores não conseguem comparar sua região com o panorama nacional
- Decisões de alocação de recursos são baseadas em dados desatualizados
- O público não tem acesso a informações compreensíveis sobre o cenário epidemiológico

## Objetivo da Homepage

Apresentar um **panorama nacional da vigilância epidemiológica** de forma clara e acessível, permitindo que qualquer pessoa:

1. **Entenda o cenário atual** — nível de risco, tendência e comparativo regional
2. **Explore por região** — filtre dados por região geográfica, estado e semana epidemiológica
3. **Analise tendências** — compare lotação semanal com a média histórica
4. **Tome decisão** — acesse análises de especialistas e dados detalhados por tipo de estabelecimento

## Público-alvo

| Perfil                        | Necessidade principal                                  | Como usa a homepage                                               | Frequência     |
| ----------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------- | -------------- |
| **Gestor de saúde municipal** | Monitorar lotação na sua região para tomada de decisão | Filtra por estado, analisa panorama e tabela comparativa          | Diária/Semanal |
| **Epidemiologista**           | Analisar tendências e detectar surtos precocemente     | Usa gráfico de tendência, cruza dados por tipo de estabelecimento | Semanal        |
| **Público geral**             | Entender o cenário epidemiológico do país              | Visualiza panorama nacional e mapa, lê análise de especialistas   | Eventual       |
| **Jornalista / Pesquisador**  | Acessar dados abertos para reportagens e estudos       | Consulta tabela e gráficos, exporta informações                   | Eventual       |

## Proposta de Valor

A homepage se diferencia por:

- **Visão consolidada** — todos os dados de lotação em uma única tela, filtráveis por região
- **Contexto histórico** — gráfico de 8 semanas comparando com média móvel (não só o dado atual)
- **Análise humana** — textos de especialistas que contextualizam os números
- **Dados abertos** — acesso público sem necessidade de cadastro para visualizar o panorama

## Escopo

### Dentro do escopo (homepage)

- Panorama nacional e regional de lotação
- Mapa interativo do Brasil por estados
- Gráfico de tendência (lotação semanal vs. média histórica)
- Tabela comparativa por região e tipo de estabelecimento
- Filtros por região, estado e semana epidemiológica
- Indicadores regionais no topo
- CTA para "Meu Município"
- Login overlay

### Fora do escopo (outras páginas)

- Dados por município individual → **Meu Município** (`/municipio`)
- Feed de notícias epidemiológicas → **Rumores** (`/rumores`)
- Mapa de calor detalhado → **Mapa de Risco** (`/mapa-risco`)
- Exportação de relatórios → **Relatórios** (`/relatorios`)
- Gestão de usuários e permissões → **Admin** (`/admin`)

## Métricas de Sucesso

| Métrica                                | Meta                             | Como medir                |
| -------------------------------------- | -------------------------------- | ------------------------- |
| Tempo até primeira interação           | < 3 segundos                     | Lighthouse / Web Vitals   |
| Taxa de clique nas tabs de região      | > 30% dos visitantes             | Analytics                 |
| Taxa de conversão para "Meu Município" | > 10% dos visitantes             | Analytics (clique no CTA) |
| Tempo médio na página                  | > 2 minutos                      | Analytics                 |
| Taxa de login a partir da homepage     | > 20% dos visitantes recorrentes | Analytics                 |

## Premissas e Dependências

### Premissas

- Os dados da API Sinapse são atualizados semanalmente (por semana epidemiológica)
- O visitante tem navegador moderno com JavaScript habilitado
- A homepage é acessível sem login (dados públicos), login desbloqueia funcionalidades extras

### Dependências

| Dependência                        | Tipo       | Status                  |
| ---------------------------------- | ---------- | ----------------------- |
| API Sinapse (`/api/v1`)            | Backend    | ✅ Disponível (staging) |
| TopoJSON do Brasil (`public/geo/`) | Asset      | ✅ Disponível           |
| Leaflet (mapa interativo)          | Biblioteca | 🔲 Não integrado        |
| ApexCharts (gráficos)              | Biblioteca | 🔲 Não integrado        |
| Dados de semanas epidemiológicas   | API        | 🔲 Endpoint não mapeado |
| Análise de especialistas           | API/IA     | 🔲 Endpoint não mapeado |

## Informações Técnicas

| Item           | Valor                                        |
| -------------- | -------------------------------------------- |
| **Rota**       | `/`                                          |
| **Layer**      | `home`                                       |
| **Acesso**     | Público (com login overlay)                  |
| **Página**     | `layers/home/app/pages/index.vue`            |
| **SEO**        | `useSeoPage()` + `defineWebSite()` (JSON-LD) |
| **Middleware** | `auth-guard`                                 |

## Estrutura da Página

A homepage é composta por **8 seções** principais, detalhadas na página de [Requisitos](/docs/paginas/homepage-requisitos):

1. Barra de Indicadores Regionais (Top Bar)
2. Header / Navegação
3. Hero Section
4. Seletor de Região (Tabs)
5. Painel Principal (Mapa + Filtros + Panorama + Gráfico + Tabela)
6. CTA — Meu Município
7. Footer
8. Login Overlay (Dialog)
