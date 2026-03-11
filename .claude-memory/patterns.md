# Padroes e Convencoes - Detecta Alerta

## Padroes que Funcionam Bem (usar sempre)

### 1. withStoreAction (7 stores usam)

```typescript
async function fetchAll(): Promise<void> {
  return withStoreAction(refs, UsuariosErrors.LIST_FAILED, async () => {
    items.value = await api.listar()
  })
}
```

Gerencia isLoading, error, try-catch automaticamente.

### 2. handleSinapseRequest (20+ endpoints usam)

```typescript
return handleSinapseRequest({
  fn: () => fetchSinapse(endpoint, { accessToken }),
  errorContext: UsuariosErrors.LIST_FAILED,
  schema: zodSchema // opcional
})
```

Centraliza chamadas Sinapse, valida com Zod, trata erros.

### 3. Domain Errors (30+ imports)

Erros tipados em pt-BR por domínio: AuthErrors, UsuariosErrors, GruposErrors, etc.

### 4. Validacao Server

- `validateBody(event, zodSchema)` — body + Zod
- `validateRouteParam(event, 'id')` — param numerico
- `validateUniqueId(event, 'uniqueId')` — param UUID
- `buildQueryString(query, allowedParams)` — whitelist

### 5. Store Composition API

Todos os stores seguem: defineStore('name', () => { ... }) com refs + api + actions.

### 6. Componentes com Prefixo da Feature

- HomeChart, HomeFilters, HomeTable
- MeuMunicipioMap, MeuMunicipioAside
- UsuariosAdminTable, UsuariosPerfilForm

## Padroes Existentes mas NAO Usados em Producao

| Padrao                                         | Arquivo                               | Motivo                                  |
| ---------------------------------------------- | ------------------------------------- | --------------------------------------- |
| Result<T> (ok/fail)                            | shared/domain/result.ts               | Apenas em testes, 0 uso runtime         |
| Value Objects (Email, CodigoIBGE, Coordenadas) | base/app/utils/                       | 55+ testes mas 0 imports em componentes |
| useVoField                                     | base/app/composables/useVoField.ts    | 0 uso em .vue files                     |
| useSeoPage                                     | base/app/composables/useSeoPage.ts    | 0 uso em paginas                        |
| useNavigation                                  | base/app/composables/useNavigation.ts | 0 uso                                   |
| formatDate                                     | base/app/utils/date.ts                | 0 uso                                   |
| ESTADOS_BR                                     | base/app/utils/constants.ts           | 0 uso                                   |
| RequestOptions                                 | shared/types/api.ts                   | Exportado, nunca importado              |
| MeuMunicipioErrors                             | shared/domain/errors.ts               | Exportado, nunca importado              |

## Convencoes de Codigo

- `no-console`: warn (nao bloqueia, mas evitar console.log)
- `prefer-const`: error
- Variáveis `_prefixadas` ignoradas por no-unused-vars
- Componentes single-word permitidos (Button.vue ok)
- Vue 3 fragments permitidos (multiplos root elements)
- Auto-close em componentes: `<MyComp />`

## Tailwind CSS — Regras Importantes

- **SEMPRE usar classes canônicas** — nunca `h-[22px]` quando existe `h-5.5`, nunca `w-[5px]` quando existe `w-1.25`, nunca `h-[180px]` quando existe `h-45`. O VSCode avisa com `suggestCanonicalClasses`.
- **SEMPRE usar classes Tailwind** — nunca `<style>` ou CSS inline, exceto caso muito específico que Tailwind não suporte
- **Criar `@utility` no `main.css`** para padrões visuais reutilizáveis (nunca CSS scoped para estilos reaproveitáveis)
- Tailwind v4 usa `@utility` para classes customizadas (ex: `@utility bg-dot-grid { ... }`)
- Classes customizadas existentes:
  - `bg-dot-grid` — pattern de dots azul (`secondary-300`, 50% opacidade, 4px grid). Usado na home map section.
  - `scrollbar-hidden` — esconde scrollbar nativo
