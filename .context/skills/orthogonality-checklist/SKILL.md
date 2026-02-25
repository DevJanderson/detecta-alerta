---
name: Orthogonality Checklist
description: Checklist do princípio de Ortogonalidade adaptado ao Detecta Alerta — componentes independentes que não afetam uns aos outros
phases: [P, R, E, V]
---

# Orthogonality Checklist — Detecta Alerta

> "Elimine efeitos entre coisas não relacionadas." — The Pragmatic Programmer

Dois componentes são ortogonais quando mudar um não afeta o outro. Ortogonalidade reduz risco, aumenta produtividade e facilita testes. Cada decisão arquitetural do Detecta Alerta busca maximizar ortogonalidade.

---

## 1. Layers — Independência entre features

- [ ] Cada layer é **auto-contida** (nuxt.config, composables, pages, server)?
- [ ] Nenhuma layer importa diretamente de uma layer de **mesmo nível ou superior**?
- [ ] Dependências entre layers seguem a hierarquia: `N` pode depender de `N-1`, nunca o inverso?
- [ ] Remover uma layer (ex: `4-rumores`) não quebra as outras?

### Hierarquia válida de dependências

```
5-docs  →  pode usar: 0-base
4-rumores  →  pode usar: 0-base, 1-auth
3-usuarios  →  pode usar: 0-base, 1-auth
2-home  →  pode usar: 0-base
1-auth  →  pode usar: 0-base
0-base  →  não depende de nenhuma layer
```

## 2. Composables — Separação de responsabilidades

- [ ] **Service** (`use*Api.ts`) cuida apenas de HTTP — sem estado, sem lógica de negócio?
- [ ] **Store** (`use*Store.ts`) cuida de estado — não faz `$fetch` diretamente?
- [ ] **Types** (`types.ts`) cuida apenas de interfaces — sem lógica?
- [ ] Mudar a implementação do service não exige mudar o store?
- [ ] Mudar o store não exige mudar os componentes que o consomem (mesma API pública)?

## 3. Server — BFF isolando o frontend

- [ ] Frontend nunca acessa a API Sinapse diretamente (sempre via `/api/*`)?
- [ ] Endpoints BFF usam `fetchSinapse()` (não `$fetch` com URL externa)?
- [ ] Mudar a URL/estrutura da API Sinapse exige mudança **apenas** nos endpoints BFF?
- [ ] Middlewares têm responsabilidade única (`01.auth.ts` = tokens, `02.admin.ts` = permissões)?

## 4. Componentes — Isolamento visual

- [ ] Componentes recebem dados via **props** (não acessam stores diretamente quando desnecessário)?
- [ ] Eventos emitidos via **emit** (não chamam actions de store direto)?
- [ ] Componentes UI base (`layers/0-base/app/components/ui/`) são genéricos (sem lógica de feature)?
- [ ] Componentes de feature são prefixados e vivem na layer correta?

## 5. Testes — Independência de execução

- [ ] Testes unitários rodam **sem Nuxt** (projeto `unit`, Node puro)?
- [ ] Testes de integração usam mocks (não dependem de API real)?
- [ ] Cada teste é **independente** (ordem de execução não importa)?
- [ ] Mocks estão no nível certo (`vi.stubGlobal` para unit, `mockNuxtImport` para nuxt)?

## 6. Estilos — Design system como contrato

- [ ] Cores usam variáveis do design system (`primary`, `success`, etc.)?
- [ ] Componentes shadcn usam tokens semânticos (`primary`, `secondary`, `muted`)?
- [ ] Nenhum componente usa cores hardcoded (`#e63946`, `rgb(...)`, `oklch(...)`)?
- [ ] Mudar o tema no `main.css` propaga para todos os componentes automaticamente?

---

## Quick Reference — Ortogonalidade no Detecta Alerta

| Camada            | Ortogonal                                                       | Acoplado (anti-pattern)                             |
| ----------------- | --------------------------------------------------------------- | --------------------------------------------------- |
| **Layers**        | `4-rumores` só importa de `0-base` e `1-auth`                   | `4-rumores` importa de `3-usuarios`                 |
| **Service/Store** | Store chama `api.getAll()`                                      | Store faz `$fetch('/api/rumores')` direto           |
| **BFF/Frontend**  | Frontend chama `/api/rumores`                                   | Frontend chama `https://staging.sinapse.org.br/...` |
| **Middleware**    | `01.auth.ts` cuida de tokens, `02.admin.ts` cuida de permissões | Um middleware faz auth + admin + logging            |
| **Componentes**   | `<RumoresCard :rumor="item" />` via props                       | `<RumoresCard />` lê do store internamente          |
| **Estilos**       | `bg-primary-600` (variável)                                     | `bg-[#e63946]` (hardcoded)                          |
| **Testes**        | Unit test mocka `$fetch`, roda em 500ms                         | Unit test precisa de Nuxt + API real                |

---

## Teste de ortogonalidade

Faça a pergunta: **"Se eu mudar X, quantas coisas mais precisam mudar?"**

- Se a resposta é **0 ou 1** → bom, é ortogonal
- Se a resposta é **2+** → sinal de acoplamento, considere refatorar

### Exemplos

| Mudança                    | Ortogonal (1 lugar)             | Acoplado (N lugares)           |
| -------------------------- | ------------------------------- | ------------------------------ |
| URL da API Sinapse         | `.env` (`NUXT_SINAPSE_API_URL`) | Hardcoded em 20 endpoints      |
| Paleta de cores            | `main.css` (variáveis CSS)      | Hex em cada componente         |
| Esquema de auth            | `01.auth.ts` + cookies          | localStorage em 10 composables |
| Formato de resposta da API | `fetchSinapse()` + Zod schema   | Parse manual em cada endpoint  |
| Adicionar nova feature     | Nova layer `{N}-{feature}/`     | Editar 5 layers existentes     |
