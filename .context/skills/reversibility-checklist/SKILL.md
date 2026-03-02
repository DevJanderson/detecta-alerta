---
name: Reversibility Checklist
description: Checklist do princípio de Reversibilidade adaptado ao Detecta Alerta — decisões fáceis de desfazer ou trocar
phases: [P, R, E, V]
---

# Reversibility Checklist — Detecta Alerta

> "Não existem decisões finais." — The Pragmatic Programmer

Nenhuma decisão é permanente. Tecnologias mudam, requisitos mudam, APIs mudam. O código deve ser escrito de forma que decisões possam ser **revertidas com custo mínimo**. Cada camada de indireção no Detecta Alerta existe para proteger contra mudanças externas.

---

## 1. Backend — A API Sinapse pode mudar

- [ ] Toda comunicação com a API Sinapse passa pelo BFF (`fetchSinapse()`)?
- [ ] Nenhum componente ou composable conhece a URL da API externa?
- [ ] Tipos vêm do Kubb (regeneráveis) — não são escritos à mão?
- [ ] Se a API Sinapse trocar um endpoint, a mudança fica contida em **um arquivo BFF**?
- [ ] Se trocar a API inteira (Sinapse → outra), só os endpoints em `server/api/` mudam?

### Camadas de proteção contra mudança na API

```
Componente → Store → Service → BFF endpoint → fetchSinapse() → API Sinapse
     ↑                                              ↑
  Não muda                                     Só aqui muda
```

## 2. Autenticação — O mecanismo pode mudar

- [ ] Tokens ficam em httpOnly cookies (server-side) — client nunca os manipula?
- [ ] Se trocar JWT por session-based, a mudança fica no middleware `01.auth.ts` + `auth.ts`?
- [ ] O store `useAuthStore` expõe `isAuthenticated`, `hasPermission` — não detalhes de JWT?
- [ ] Redirect seguro usa `getSafeRedirectUrl()` — não validação manual?

## 3. UI — O design system pode mudar

- [ ] Cores usam variáveis CSS, não valores literais?
- [ ] Se trocar a paleta inteira, basta alterar `main.css`?
- [ ] Componentes UI vêm do shadcn-vue — se trocar a lib, só `layers/base/app/components/ui/` muda?
- [ ] Se trocar de Tailwind para outra solução CSS, as layers de feature são minimamente afetadas?

## 4. Estado — A estratégia de state pode mudar

- [ ] Stores usam `defineStore` com setup function (padrão Pinia)?
- [ ] Persistência usa `persist.pick` com campos explícitos (não `persist: true` genérico)?
- [ ] Se trocar Pinia por outra lib, a interface pública dos stores (`items`, `fetchAll`, etc.) pode ser mantida?
- [ ] Se trocar localStorage por sessionStorage/IndexedDB, só a config de persist muda?

## 5. Testes — O framework pode mudar

- [ ] Testes unitários são Node puro (sem dependência de framework)?
- [ ] Mocks usam API padrão do Vitest (`vi.fn()`, `vi.mock()`) — portáveis?
- [ ] Assertions usam matchers padrão (`expect().toBe()`) — não helpers específicos de framework?
- [ ] Se trocar Vitest por Jest, a maioria dos testes roda sem mudança?

## 6. Infraestrutura — O deploy pode mudar

- [ ] Config usa `runtimeConfig` (env vars) — não hardcoded?
- [ ] Se trocar de hosting, apenas variáveis de ambiente mudam?
- [ ] Build produz output padrão Nitro (portável para Node, serverless, edge)?

---

## Quick Reference — Reversibilidade no Detecta Alerta

| Decisão atual             | Reversível por quê                                | Custo de mudança                           |
| ------------------------- | ------------------------------------------------- | ------------------------------------------ |
| **API Sinapse (FastAPI)** | BFF isola; Kubb regenera tipos                    | Baixo — mudar endpoints BFF + regenerar    |
| **JWT em cookies**        | Client não sabe que é JWT; middleware abstrai     | Baixo — mudar `01.auth.ts` + `auth.ts`     |
| **Pinia stores**          | Interface pública estável (`items`, `fetchAll`)   | Médio — trocar implementação, manter API   |
| **shadcn-vue**            | Componentes em `base/app/components/ui/` isolados | Médio — trocar UI base, features não mudam |
| **Tailwind CSS v4**       | Classes utilitárias são facilmente substituíveis  | Alto — muitas classes no template          |
| **Nuxt 4**                | Framework core — mais difícil de trocar           | Alto — mas layers encapsulam features      |
| **Design system (cores)** | Variáveis CSS centralizadas em `main.css`         | Baixo — alterar um arquivo                 |
| **Kubb (code gen)**       | Tipos e schemas são apenas arquivos `.ts`         | Baixo — trocar gerador, manter output      |

---

## Técnicas de reversibilidade

### 1. Indireção (camadas de abstração)

```
Não: Componente → API externa
Sim: Componente → Store → Service → BFF → API externa
```

Cada camada é um ponto onde você pode trocar a implementação sem afetar as camadas acima.

### 2. Configuração externalizada

```
Não: const API_URL = 'https://staging.sinapse.org.br/api/v1'
Sim: const { sinapseApiUrl } = useRuntimeConfig()  // vem do .env
```

### 3. Código gerado > código manual

```
Não: interface Token { access_token: string; refresh_token: string }
Sim: import type { Token } from '~/generated/sinapse/types/Token'
     // Regenerável: npm run api:generate
```

### 4. Interfaces estáveis, implementações flexíveis

```typescript
// Interface pública do store (contrato estável)
return { items, isLoading, error, fetchAll, create, update, remove }

// Implementação interna pode mudar livremente
// ($fetch → axios, Pinia → Vuex, localStorage → IndexedDB)
```

---

## Quando aceitar irreversibilidade

- **Framework core** (Nuxt, Vue): custo de troca é alto, aceite conscientemente
- **Linguagem** (TypeScript): decisão de longo prazo, aceitável
- **Banco de dados**: se houver um no futuro, isolá-lo em uma camada de acesso
- **Decisões irreversíveis devem ser tomadas com mais cuidado e documentação**
