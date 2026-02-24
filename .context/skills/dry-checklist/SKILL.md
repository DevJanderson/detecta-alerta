---
name: DRY Checklist
description: Checklist do princípio Don't Repeat Yourself adaptado ao Detecta Alerta — usar antes de criar ou modificar código
phases: [P, R, E, V]
---

# DRY Checklist — Detecta Alerta

> "Todo conhecimento deve ter uma representação única, não-ambígua e autoritativa dentro de um sistema." — The Pragmatic Programmer

DRY não é sobre código duplicado — é sobre **conhecimento duplicado**. Duas funções com código idêntico podem representar decisões diferentes (e devem ficar separadas). Uma função e um schema com formatos diferentes podem representar a mesma regra (e devem ser unificados).

---

## 1. Identificação — é DRY ou coincidência?

Antes de extrair, pergunte:

- [ ] Os trechos representam o **mesmo conhecimento** (mesma regra de negócio, mesma decisão)?
- [ ] Se um mudar, o outro **obrigatoriamente** precisa mudar junto?
- [ ] A duplicação aparece em **3+ lugares** (regra de três)?
- [ ] NÃO é coincidência estrutural (código parecido, intenções diferentes)?

> **Anti-pattern**: unificar endpoints de auth (login, refresh, reset-password) em um handler genérico — parecem iguais mas cada um tem lógica de erro e rate limit diferentes.

## 2. Server — BFF e endpoints

- [ ] Tratamento de erro segue padrão consistente (try/catch + `createError` com mensagem genérica)?
- [ ] Timeout da API Sinapse centralizado (não hardcoded em cada endpoint)?
- [ ] Validação Zod segue o padrão `schema.safeParse()` + `createError(400)`?
- [ ] Mensagens de erro são **estáticas e genéricas** (nunca detalhes internos da API)?
- [ ] `fetchSinapse()` usado para todas as chamadas à API Sinapse (não `$fetch` direto)?

## 3. Client — composables e services

- [ ] Services (`use*Api.ts`) são thin wrappers — sem lógica de estado?
- [ ] Stores (`use*Store.ts`) instanciam o service no setup (não recriam a lógica)?
- [ ] Extração de erro consistente entre stores (não pattern matching inline)?
- [ ] Filtros e preferências persistidos via `persist.pick` (não lógica manual de localStorage)?

## 4. Componentes — templates e estilos

- [ ] Padrões visuais repetidos 3+ vezes estão extraídos em componentes (prefixados com layer)?
- [ ] Cores usam **design system** (não valores hardcoded)?
- [ ] Classes CSS repetidas em variantes ou componentes wrapper?

## 5. Tipos e contratos

- [ ] Tipos da API vêm do Kubb (`generated/sinapse/types/`) — não recriados manualmente?
- [ ] Schemas Zod de validação vêm do Kubb (`generated/sinapse/zod/`) quando possível?
- [ ] Interfaces locais estão em `composables/types.ts` da layer (uma fonte de verdade)?
- [ ] Imports de tipos usam `import type` (não import regular)?

## 6. Validação pós-refactor

- [ ] A abstração tem **testes próprios** (não depende dos testes dos consumidores)?
- [ ] Typecheck passa (`npm run typecheck`)?
- [ ] Lint passa sem warnings (`npm run quality:fix`)?
- [ ] Testes existentes continuam passando (`npm run test:run`)?
- [ ] A abstração está no nível correto (layer 0-base se cross-cutting, layer da feature se local)?

---

## Quick Reference — DRY no Detecta Alerta

| Conhecimento        | DRY (centralizado)                                             | Repetido (anti-pattern)                                            |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------ |
| Chamada API Sinapse | `fetchSinapse(endpoint, options)`                              | `$fetch(sinapseUrl + endpoint, { headers: ... })` em cada endpoint |
| Tipos da API        | `import type { Token } from '~/generated/sinapse/types/Token'` | `interface Token { access_token: string; ... }` manual             |
| Validação           | `tokenSchema.safeParse(response)` (Kubb Zod)                   | Validação manual com `if/typeof`                                   |
| SEO nas páginas     | `useSeoPage({ title, description })`                           | `useSeoMeta()` + `useHead()` repetidos                             |
| Cor do tema         | `bg-brand-primary-600` (variável CSS)                          | `bg-[#e63946]` hardcoded                                           |
| Permissões          | `authStore.hasPermission('code')`                              | `authStore.permissions.includes('code')` repetido                  |
| Redirect seguro     | `getSafeRedirectUrl(url, '/fallback')`                         | Validação manual de URL em cada redirect                           |

---

## Os 4 tipos de duplicação (The Pragmatic Programmer)

1. **Imposta**: forçada pelo ambiente (ex: schema da API + tipo TypeScript → resolvido pelo Kubb)
2. **Inadvertida**: não percebemos que duplicamos (ex: mesma lógica de erro em 5 endpoints)
3. **Impaciente**: sabemos que é duplicação mas "é mais rápido copiar" (ex: try/catch inline)
4. **Entre desenvolvedores**: pessoas diferentes resolvem o mesmo problema (ex: validação de redirect)

## Quando NÃO aplicar DRY

- **Coincidência, não conhecimento**: código parecido com intenções diferentes (endpoints de auth)
- **Menos de 3 ocorrências**: abstração prematura é pior que repetição moderada
- **Código gerado** (`generated/sinapse/`): não refatorar — regenerar com Kubb
- **Acoplamento indesejado**: unificar coisas que evoluem independentemente cria fragilidade
- **Clareza > concisão**: se a abstração obscurece a intenção, manter explícito
