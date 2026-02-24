# tests/CLAUDE.md

Instruções para testes no Detecta Alerta.

## Estrutura

```
tests/
├── setup.ts           # Setup para projeto "nuxt" (stubs de componentes)
├── unit/              # Projeto "unit" - Node puro, sem Nuxt (rápido)
│   └── auth/          # Testes de services (useAuthApi)
├── integration/       # Projeto "nuxt" - happy-dom + @nuxt/test-utils
│   ├── auth/          # Testes de stores (useAuthStore)
│   └── composables/   # Testes de composables (useSeoPage)
└── e2e/               # Testes E2E (Playwright)
    ├── helpers.ts     # Helpers compartilhados (waitForHydration)
    ├── auth.spec.ts   # Testes de autenticação
    └── homepage.spec.ts # Testes da homepage
```

## Vitest Dual-Project

O projeto usa **2 projetos Vitest** para otimizar velocidade:

| Projeto  | Ambiente  | Pasta                | Quando usar                                    |
| -------- | --------- | -------------------- | ---------------------------------------------- |
| **unit** | Node puro | `tests/unit/`        | Funções puras, services (sem auto-imports)     |
| **nuxt** | happy-dom | `tests/integration/` | Stores, composables (precisam de auto-imports) |

### Regra: onde colocar o teste?

- **Usa auto-imports do Nuxt** (`useRoute`, `useRouter`, `useHead`, `useSeoMeta`, `defineStore`)? → `tests/integration/`
- **Apenas `$fetch` mockado e funções puras**? → `tests/unit/`

### Diferenças entre projetos

| Aspecto        | Projeto `unit`                       | Projeto `nuxt`                      |
| -------------- | ------------------------------------ | ----------------------------------- |
| Setup file     | Nenhum                               | `tests/setup.ts`                    |
| Auto-imports   | Não disponíveis                      | Reais do Nuxt                       |
| Mock de `#app` | Não necessário                       | Não necessário (auto-imports reais) |
| Alias `~`      | Via `resolve.alias` no vitest.config | Via `@nuxt/test-utils`              |
| Mock de router | N/A                                  | `mockNuxtImport('useRouter', ...)`  |
| Velocidade     | ~500ms                               | ~25s (inclui build do Nuxt)         |

## Convenções

| Convenção    | Padrão                                              |
| ------------ | --------------------------------------------------- |
| Nomenclatura | `*.test.ts` (unit/integration) ou `*.spec.ts` (e2e) |
| Localização  | Pasta `tests/` separada (não colocated)             |
| Organização  | Espelhar estrutura das layers                       |

## Ferramentas

| Ferramenta           | Uso                                |
| -------------------- | ---------------------------------- |
| Vitest               | Testes unitários e integração      |
| Playwright           | Testes E2E (end-to-end)            |
| @nuxt/test-utils     | Ambiente Nuxt para testes          |
| @vue/test-utils      | Montar componentes Vue             |
| @testing-library/vue | Testes focados no usuário          |
| happy-dom            | DOM environment                    |
| Kubb Mocks           | Dados fake gerados (Faker)         |
| Kubb MSW             | Handlers para interceptar requests |

## Comandos

```bash
# Testes Vitest
npm run test           # Watch mode (todos os projetos)
npm run test:run       # Executa uma vez (todos os projetos)
npm run test:unit      # Apenas projeto "unit" (rápido)
npm run test:nuxt      # Apenas projeto "nuxt" (com Nuxt)
npm run test:coverage  # Com cobertura
npm run test:ui        # Interface visual

# Testes E2E (Playwright)
npm run test:e2e           # Executa testes
npm run test:e2e:ui        # Interface visual
npm run test:e2e:headed    # Com browser visível
npm run test:e2e:install   # Instala browsers
```

---

## Testes Unitários (projeto `unit`)

Rodam em Node puro, sem Nuxt. Para services que usam apenas `$fetch`.

### Teste de Service (API)

```typescript
// tests/unit/auth/useAuthApi.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

import { useAuthApi } from '~/layers/1-auth/app/composables/useAuthApi'

describe('useAuthApi', () => {
  let api: ReturnType<typeof useAuthApi>

  beforeEach(() => {
    mockFetch.mockReset()
    api = useAuthApi()
  })

  it('deve chamar /api/auth/login com credenciais', async () => {
    mockFetch.mockResolvedValue({ user: { id: 1, nome: 'Test' } })

    await api.login({ username: 'test@example.com', password: '123' })

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { username: 'test@example.com', password: '123' }
    })
  })
})
```

---

## Testes de Integração (projeto `nuxt`)

Rodam com `@nuxt/test-utils` — auto-imports reais do Nuxt disponíveis.

### Teste de Store (Pinia)

```typescript
// tests/integration/auth/useAuthStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'

// Mock do service
vi.mock('~/layers/1-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({ user: mockUser }),
    logout: vi.fn()
  })
}))

// Mock do useRouter via @nuxt/test-utils
mockNuxtImport('useRouter', () => () => ({
  push: vi.fn(),
  replace: vi.fn()
}))

const { useAuthStore } = await import('~/layers/1-auth/app/composables/useAuthStore')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve iniciar sem usuário', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
```

### Teste de Composable

```typescript
// tests/integration/composables/useSeoPage.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

const mockUseHead = vi.fn()
const mockUseSeoMeta = vi.fn()

mockNuxtImport(
  'useHead',
  () =>
    (...args: unknown[]) =>
      mockUseHead(...args)
)
mockNuxtImport(
  'useSeoMeta',
  () =>
    (...args: unknown[]) =>
      mockUseSeoMeta(...args)
)

const { useSeoPage } = await import('~/layers/0-base/app/composables/useSeoPage')

describe('useSeoPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('deve definir title e description', () => {
    useSeoPage({ title: 'Teste' })
    expect(mockUseSeoMeta).toHaveBeenCalledWith(expect.objectContaining({ title: 'Teste' }))
  })
})
```

---

## Testes E2E (Playwright)

### Browsers

| Browser       | Local | CI  | Engine                      |
| ------------- | ----- | --- | --------------------------- |
| Chromium      | ✅    | ✅  | Blink (Chrome/Edge)         |
| Firefox       | ✅    | ✅  | Gecko                       |
| Mobile Chrome | ✅    | ✅  | Blink (viewport Pixel 5)    |
| WebKit        | ❌    | ✅  | WebKit (Safari)             |
| Mobile Safari | ❌    | ✅  | WebKit (viewport iPhone 12) |

> WebKit/Mobile Safari rodam apenas no CI (`process.env.CI`) porque requerem OS oficialmente suportado pelo Playwright.

### Hidratação (waitForHydration)

Testes que interagem com elementos reativos (cliques, `fill()`, navegação SPA) **devem aguardar a hidratação do Vue/Nuxt** antes de interagir. Usar o helper compartilhado:

```typescript
import { waitForHydration } from './helpers'

test('deve interagir com elemento reativo', async ({ page }) => {
  await page.goto('/auth/login')
  await waitForHydration(page) // Aguarda networkidle + Vue app mount

  await page.locator('input#username').fill('usuario@teste.com')
  // ...
})
```

**Quando usar `waitForHydration`:**

- Antes de `fill()` em inputs com `v-model`
- Antes de `click()` em botões com handlers Vue (`@click`)
- Antes de clicar em `NuxtLink` (SPA navigation via Vue Router)

**Quando NÃO é necessário:**

- Verificar conteúdo renderizado pelo SSR (`toContainText`, `toBeVisible`)
- Verificar atributos HTML estáticos (`toHaveAttribute`)

---

## Mocking

### Mock de $fetch (projeto `unit`)

```typescript
import { vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})
```

### Mock de Nuxt auto-imports (projeto `nuxt`)

```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

// Usar mockNuxtImport em vez de vi.mock('#app')
mockNuxtImport('useRouter', () => () => ({
  push: vi.fn(),
  replace: vi.fn()
}))
```

### Mock de Composable

```typescript
vi.mock('~/layers/1-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({ user: { id: 1 } }),
    logout: vi.fn()
  })
}))
```

### Tipos Kubb em Testes

Os tipos e schemas Zod gerados pelo Kubb podem ser usados em testes para type safety:

```typescript
import type { Token } from '~/generated/sinapse/types/Token'
import { tokenSchema } from '~/generated/sinapse/zod/tokenSchema'
```

---

## Boas Práticas

### Nomenclatura

```typescript
// ✅ BOM - Descreve comportamento em português
it('deve mostrar erro quando email é inválido', () => {})
it('deve redirecionar para login quando não autenticado', () => {})

// ❌ RUIM - Vago
it('test 1', () => {})
it('works', () => {})
```

### Arrange-Act-Assert (AAA)

```typescript
it('deve fazer login com sucesso', async () => {
  // Arrange
  const store = useAuthStore()
  const credentials = { username: 'test@example.com', password: '123' }

  // Act
  const success = await store.login(credentials)

  // Assert
  expect(success).toBe(true)
  expect(store.isAuthenticated).toBe(true)
})
```

### Data-testid para E2E

```vue
<!-- ✅ BOM - Seletor estável -->
<button data-testid="submit-button">Enviar</button>

<!-- ❌ RUIM - Seletor frágil -->
<button class="btn btn-primary">Enviar</button>
```

---

## Referências

- [Nuxt Test Utils](https://nuxt.com/docs/getting-started/testing)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library Vue](https://testing-library.com/docs/vue-testing-library/intro)
