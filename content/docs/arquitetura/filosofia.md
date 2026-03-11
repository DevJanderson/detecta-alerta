---
title: 'Arquitetura — Filosofia e Estilo'
description: 'Princípios, influências e decisões que definem o estilo arquitetural do Detecta Alerta.'
order: 0
---

# Filosofia e Estilo Arquitetural

O Detecta Alerta adota um estilo que chamamos de **DDD Funcional Leve** — pegamos conceitos de Domain-Driven Design e Clean Code que agregam valor real ao projeto, sem a cerimônia enterprise que adiciona complexidade desnecessária.

## Princípio Guia: ETC (Easier to Change)

Do livro _The Pragmatic Programmer_. Antes de cada decisão, a pergunta é:

> **"Isso vai facilitar mudanças futuras?"**

| Aspecto         | Pergunta                                                         |
| --------------- | ---------------------------------------------------------------- |
| **Isolamento**  | A mudança está contida em uma layer/arquivo, ou espalha impacto? |
| **Constantes**  | Valores mágicos estão nomeados e centralizados?                  |
| **Abstrações**  | Estou criando uma abstração útil ou prematura?                   |
| **Acoplamento** | Componentes dependem de detalhes internos de outros?             |

ETC não é uma regra rígida — é um filtro mental aplicado em toda decisão de design.

---

## O que adotamos

### Do DDD (estilo funcional)

| Conceito          | Implementação no projeto                              | Estilo                                         |
| ----------------- | ----------------------------------------------------- | ---------------------------------------------- |
| **Value Objects** | `createEmail()`, `createUserModel()`                  | Factory + `Object.freeze()` (não classes)      |
| **Result type**   | `ok()`, `fail()`, `unwrap()`, `combineResults()`      | Discriminated union (não classe `Result<T>`)   |
| **Domain Errors** | `AuthErrors`, `HomeErrors`, `MeuMunicipioErrors`      | Objetos `as const` (não exceções tipadas)      |
| **Domain Models** | `createUserModel()` enriquece DTO com lógica derivada | Factory + `Object.freeze()` (mesmo padrão VOs) |
| **Use Cases**     | `executeLogin()` retorna `Result<T>`                  | Função async pura (não classe `UseCase<I,O>`)  |

**Padrão funcional**: tudo é função pura + objeto imutável. Sem classes, sem herança, sem `this`. Mais idiomático no Vue/TypeScript e mais fácil de testar.

Detalhes de implementação: [Domain Primitives](/docs/padroes/domain-primitives)

### Do Clean Code

| Princípio                  | Como aplicamos                                                            |
| -------------------------- | ------------------------------------------------------------------------- |
| **Funções pequenas**       | Composables orquestradores delegam para funções puras em `utils/`         |
| **Nomes descritivos**      | `withStoreAction`, `extractErrorMessage`, `buildQueryString` — sem siglas |
| **Responsabilidade única** | Cada layer é autônoma; cada arquivo tem uma razão para mudar              |
| **DRY com critério**       | Extrair só quando a duplicação é real (2+ ocorrências), não hipotética    |
| **Separação de concerns**  | UI → Store → Service → BFF → API externa                                  |

### Do Pragmatic Programmer

| Princípio               | Aplicação                                                                                           |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| **ETC**                 | Filtro para toda decisão de design                                                                  |
| **Ortogonalidade**      | Layers não importam entre si; mudança em `auth` não afeta `home`                                    |
| **Reversibilidade**     | Decisões fáceis de desfazer — VOs funcionais são mais fáceis de refatorar que hierarquias de classe |
| **Não se repita (DRY)** | `withStoreAction` elimina try/catch em todos os stores; domain errors centralizam mensagens         |

---

## O que rejeitamos (e por quê)

### DDD Enterprise Clássico

| Conceito rejeitado             | Motivo                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `class Result<T>`              | Discriminated unions têm narrowing nativo do TS — `.ok` em vez de `.isOk()`     |
| `class ValueObject<T>`         | Projeto já usava factory + freeze — classes criariam dois estilos incompatíveis |
| `class Entity<Type, Props>`    | BFF é proxy, não gerencia ciclo de vida de entidades                            |
| `class UseCase<IN, OUT>`       | Função async pura faz o mesmo sem indireção                                     |
| Repository pattern             | Desnecessário num BFF que repassa chamadas para API Sinapse                     |
| Bounded Contexts formais       | Layers do Nuxt já isolam domínios naturalmente                                  |
| Event Sourcing / Domain Events | Complexidade desproporcional para um frontend BFF                               |

**Motivação central**: abstração prematura dificulta mudanças futuras (viola ETC). O projeto é um BFF que faz proxy para a API Sinapse — não gerencia persistência, transações ou agregados complexos.

### Over-engineering

| Anti-pattern                    | Regra do projeto                                         |
| ------------------------------- | -------------------------------------------------------- |
| Abstração antes de duplicação   | Extrair só quando repete 2+ vezes                        |
| God composables (>300 linhas)   | Quebrar em orquestrador + funções puras em `utils/`      |
| Componentes genéricos demais    | Mover para `base/common/` só quando outra layer precisar |
| Feature flags / backward compat | Mudar direto — o código é nosso                          |
| Classes onde funções bastam     | Preferir funções puras composáveis                       |

---

## Resumo: como decidir

```
Preciso de validação/formatação de dados do domínio?
  → Value Object (factory + freeze + tryCreate)

Preciso representar sucesso/falha sem exceção?
  → Result type (ok/fail)

Preciso de lógica derivada sobre um DTO da API?
  → Domain Model (factory que enriquece DTO)

Preciso de lógica de negócio no server?
  → Use Case (função async pura → Result)

Preciso de error handling em store action?
  → withStoreAction (não Result)

Preciso centralizar mensagens de erro?
  → Domain Errors (as const por módulo)

Nenhuma dessas opções se aplica?
  → Provavelmente é simples demais para abstrair. Faça direto.
```

---

## Referências

- [Domain Primitives](/docs/padroes/domain-primitives) — Result, Value Objects, useVoField, Domain Models
- [Error Handling](/docs/padroes/error-handling) — domain errors, withStoreAction, fluxo completo
- [Padrão Feature Layer](/docs/padroes/feature-layer) — types → api → store → componentes
- [Decisões Técnicas](/docs/projeto/decisoes) — ADRs com contexto e motivação de cada escolha
