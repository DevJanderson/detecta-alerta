---
title: 'Padrões de Código'
description: 'Guias práticos de como escrever código no Detecta Alerta — receitas prontas para copiar e usar.'
order: 0
---

# Padrões de Código

Esta seção contém **receitas práticas** — código que você pode copiar e adaptar para construir funcionalidades no projeto.

> **Diferença entre Arquitetura e Padrões:**
>
> - [Arquitetura](/docs/arquitetura/visao-geral) responde **"como o sistema está organizado e por quê?"**
> - **Padrões de Código** (esta seção) responde **"como eu escrevo código que segue as regras do projeto?"**

## Guias disponíveis

### [Feature Layer](/docs/padroes/feature-layer)

O passo-a-passo completo para criar uma funcionalidade nova: types → api → store → componentes → server routes. Inclui checklist e exemplos reais.

### [Domain Primitives](/docs/padroes/domain-primitives)

Como usar `Result`, Value Objects e `useVoField` — as ferramentas de validação e tipagem do projeto.

### [Error Handling](/docs/padroes/error-handling)

Como tratar erros em todos os níveis: domain errors, `withStoreAction` nos stores, validação no servidor e o fluxo completo do erro até a tela.

## Quando consultar cada guia?

```
Vou criar uma feature nova do zero?
  → Feature Layer (passo-a-passo completo)

Vou validar dados ou criar um tipo especial?
  → Domain Primitives (Result, Value Objects)

Vou tratar erros em um store ou endpoint?
  → Error Handling (withStoreAction, domain errors)
```
