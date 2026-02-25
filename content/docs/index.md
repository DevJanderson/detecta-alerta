---
title: Visão Geral
description: Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.
---

# Detecta Alerta

**Detecta Alerta** é uma plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil. Centraliza dados de estabelecimentos de saúde (UBS, UPA, Drogarias) para análise de padrões epidemiológicos e detecção precoce de surtos.

## O que é

A plataforma coleta e processa dados de diversas fontes do sistema de saúde brasileiro, permitindo:

- **Monitoramento em tempo real** de indicadores epidemiológicos
- **Detecção precoce de surtos** através de algoritmos de vigilância
- **Análise de rumores** epidemiológicos a partir de notícias e fontes públicas
- **Visualização geográfica** da distribuição de casos e agravos

## Principais funcionalidades

::docs-card-group
::docs-card{title="Rumores Epidemiológicos" icon="lucide:newspaper" href="/docs/api/overview"}
Feed de notícias de saúde com classificação automática de relevância epidemiológica.
::

::docs-card{title="Vigilância Ativa" icon="lucide:shield" href="/docs/api/overview"}
Monitoramento contínuo com alertas configuráveis por região e agravo.
::

::docs-card{title="Análise Geográfica" icon="lucide:map-pin" href="/docs/api/overview"}
Visualização geoespacial de dados epidemiológicos em mapas interativos.
::

::docs-card{title="API Integrada" icon="lucide:plug" href="/docs/api/overview"}
API RESTful com documentação OpenAPI e cliente TypeScript gerado automaticamente.
::
::

## Stack tecnológica

| Tecnologia          | Uso                                        |
| ------------------- | ------------------------------------------ |
| **Nuxt 4**          | Framework fullstack (SSR + SPA)            |
| **Vue 3**           | Framework reativo de UI                    |
| **Tailwind CSS v4** | Estilização utility-first                  |
| **shadcn-vue**      | Componentes UI acessíveis                  |
| **Pinia**           | Gerenciamento de estado                    |
| **Vitest**          | Testes unitários e de integração           |
| **Playwright**      | Testes end-to-end                          |
| **Kubb**            | Geração de cliente API a partir do OpenAPI |
