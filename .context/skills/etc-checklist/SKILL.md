---
name: etc-checklist
description: Checklist do princípio Easier to Change adaptado ao Detecta Alerta — usar antes de criar ou modificar código
disable-model-invocation: true
---

# ETC Checklist — Detecta Alerta

> "ETC é um valor, não uma regra." — The Pragmatic Programmer

Use este checklist antes de criar ou modificar código. A pergunta central é sempre: **isso vai facilitar mudanças futuras?**

---

## 1. Isolamento

- [ ] A mudança está contida em **uma layer** (não espalha impacto para outras)?
- [ ] Se cross-layer, a dependência segue a direção correta (layer N pode depender de N-1, nunca o inverso)?
- [ ] Shared code vai para `base` apenas se realmente cross-cutting?
- [ ] Feature-specific permanece na layer da feature?

## 2. Constantes & Configuração

- [ ] Sem **magic numbers** — valores extraídos em constantes nomeadas?
- [ ] Configurações ambientais usam `runtimeConfig` (não hardcoded)?
- [ ] URLs, timeouts e limites são **centralizados** (um lugar para mudar)?
- [ ] Rate limits definidos em `routeRules` no `nuxt.config.ts` (não inline nos endpoints)?

## 3. Componentes & Funções

- [ ] Componente tem **responsabilidade única** (<200 linhas de template)?
- [ ] Lógica repetida extraída em **utils** (pura) ou **composables** (com estado)?
- [ ] Service (`use*Api`) separado de Store (`use*Store`)?
- [ ] Funções fazem uma coisa e fazem bem?

## 4. Acoplamento

- [ ] Componentes dependem de **interfaces**, não de detalhes internos?
- [ ] Props e events bem definidos (contrato claro entre pai e filho)?
- [ ] Sem import horizontal entre layers de mesmo nível?
- [ ] BFF (`fetchSinapse`) isola completamente a API Sinapse do frontend?

## 5. Testes

- [ ] Fluxo crítico tem **teste** que detecta regressão?
- [ ] Utils e formatters têm testes (funções puras = fácil de testar)?
- [ ] Refatoração preservou todos os testes existentes?
- [ ] Teste no projeto correto? (unit → `tests/unit/`, nuxt → `tests/integration/`)

## 6. Nomeação & Documentação

- [ ] Nomes revelam **intenção** (não implementação)?
- [ ] Componentes prefixados com o nome da layer (`RumoresCard`, `AuthLoginForm`)?
- [ ] Mudanças arquiteturais documentadas no CLAUDE.md raiz ou `.context/docs/`?

---

## Quick Reference — ETC no Detecta Alerta

| Decisão           | ETC                                            | Anti-ETC                                              |
| ----------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Cor do tema       | `bg-primary-600` (design system)               | `bg-[#e63946]` hardcoded                              |
| API externa       | BFF proxy (`fetchSinapse`)                     | `$fetch('https://staging.sinapse.org.br/...')` direto |
| Tipos             | Kubb gerado (`npm run api:generate`)           | Tipos manuais copiados da API                         |
| Tokens auth       | httpOnly cookies via `01.auth.ts` middleware   | `localStorage.setItem('token', ...)`                  |
| SEO               | `useSeoPage()` composable                      | `useSeoMeta()` + `useHead()` repetidos                |
| Rate limits       | `routeRules` centralizados no `nuxt.config.ts` | Valores inline em cada endpoint                       |
| Componente grande | Extrair subcomponentes focados (prefixados)    | Página de 400+ linhas                                 |

---

## Quando NÃO aplicar ETC

- **YAGNI prevalece**: não criar abstrações para cenários hipotéticos
- **3 linhas similares > abstração prematura**: só extrair quando repetir 3+ vezes
- **Código gerado** (`generated/sinapse/`): não refatorar — regenerar com Kubb
- **Protótipos**: em fase exploratória, velocidade > estrutura (refatorar depois)
