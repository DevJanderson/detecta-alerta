# tests/CLAUDE.md

Instrucoes para testes no Detecta Alerta.

## Estrutura

```
tests/
├── setup.ts           # Setup para projeto "nuxt" (stubs NuxtLink, ClientOnly, NuxtImg, Icon)
├── unit/              # Projeto "unit" - Node puro, sem Nuxt (rapido)
│   └── auth/
│       └── useAuthApi.test.ts
├── integration/       # Projeto "nuxt" - happy-dom + @nuxt/test-utils
│   ├── auth/
│   │   └── useAuthStore.test.ts
│   └── composables/
│       └── useSeoPage.test.ts
└── e2e/               # Testes E2E (Playwright)
    ├── helpers.ts     # waitForHydration(page)
    ├── auth.spec.ts   # Formularios login/reset, toggle password, navegacao
    └── homepage.spec.ts # Carregamento, responsividade, lang pt-BR
```

## Vitest Dual-Project

O projeto usa **2 projetos Vitest** para otimizar velocidade:

| Projeto  | Ambiente  | Pasta                | Quando usar                                    |
| -------- | --------- | -------------------- | ---------------------------------------------- |
| **unit** | Node puro | `tests/unit/`        | Funcoes puras, services (sem auto-imports)     |
| **nuxt** | happy-dom | `tests/integration/` | Stores, composables (precisam de auto-imports) |

### Regra: onde colocar o teste?

- **Usa auto-imports do Nuxt** (`useRoute`, `useRouter`, `useHead`, `useSeoMeta`, `defineStore`)? -> `tests/integration/`
- **Apenas `$fetch` mockado e funcoes puras**? -> `tests/unit/`

### Diferencas entre projetos

| Aspecto        | Projeto `unit`                       | Projeto `nuxt`                     |
| -------------- | ------------------------------------ | ---------------------------------- |
| Setup file     | Nenhum                               | `tests/setup.ts`                   |
| Auto-imports   | Nao disponiveis                      | Reais do Nuxt                      |
| Alias `~`      | Via `resolve.alias` no vitest.config | Via `@nuxt/test-utils`             |
| Mock de router | N/A                                  | `mockNuxtImport('useRouter', ...)` |
| Coverage       | v8 provider                          | v8 provider                        |
| Velocidade     | ~500ms                               | ~25s (inclui build do Nuxt)        |

## Convencoes

| Convencao    | Padrao                                              |
| ------------ | --------------------------------------------------- |
| Nomenclatura | `*.test.ts` (unit/integration) ou `*.spec.ts` (e2e) |
| Localizacao  | Pasta `tests/` separada (nao colocated)             |
| Organizacao  | Espelhar estrutura das layers                       |

## Ferramentas

| Ferramenta           | Uso                           |
| -------------------- | ----------------------------- |
| Vitest               | Testes unitarios e integracao |
| Playwright           | Testes E2E (end-to-end)       |
| @nuxt/test-utils     | Ambiente Nuxt para testes     |
| @vue/test-utils      | Montar componentes Vue        |
| @testing-library/vue | Testes focados no usuario     |
| happy-dom            | DOM environment               |

## Comandos

```bash
# Testes Vitest
npm run test           # Watch mode (todos os projetos)
npm run test:run       # Executa uma vez (todos os projetos)
npm run test:unit      # Apenas projeto "unit" (rapido)
npm run test:nuxt      # Apenas projeto "nuxt" (com Nuxt)
npm run test:coverage  # Com cobertura (v8, reports: text/json/html)
npm run test:ui        # Interface visual

# Teste especifico
npm run test -- path/to/file.test.ts

# Testes E2E (Playwright)
npm run test:e2e           # Executa testes
npm run test:e2e:ui        # Interface visual
npm run test:e2e:headed    # Com browser visivel
npm run test:e2e:install   # Instala browsers
```

---

## Testes Unitarios (projeto `unit`)

Rodam em Node puro, sem Nuxt. Para services que usam apenas `$fetch`.

```typescript
// tests/unit/auth/useAuthApi.test.ts
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

import { useAuthApi } from '~/layers/1-auth/app/composables/useAuthApi'

describe('useAuthApi', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('deve chamar /api/auth/login com credenciais', async () => {
    mockFetch.mockResolvedValue({ user: { id: 1 } })
    const api = useAuthApi()
    await api.login({ username: 'test@example.com', password: '123' })
    expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
      method: 'POST',
      body: { username: 'test@example.com', password: '123' }
    })
  })
})
```

---

## Testes de Integracao (projeto `nuxt`)

Rodam com `@nuxt/test-utils` — auto-imports reais do Nuxt disponiveis.

```typescript
// tests/integration/auth/useAuthStore.test.ts
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('~/layers/1-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({ user: mockUser }),
    logout: vi.fn()
  })
}))

mockNuxtImport('useRouter', () => () => ({
  push: vi.fn(),
  replace: vi.fn()
}))

const { useAuthStore } = await import('~/layers/1-auth/app/composables/useAuthStore')

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve iniciar sem usuario', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })
})
```

---

## Testes E2E (Playwright)

### Browsers

| Browser         | Viewport       | Local | CI  |
| --------------- | -------------- | ----- | --- |
| Desktop Chrome  | 1920x1200      | Sim   | Sim |
| Desktop Firefox | 1920x1200      | Sim   | Sim |
| Laptop Chrome   | 1366x768       | Sim   | Sim |
| Tablet (iPad)   | iPad Pro 11    | Sim   | Sim |
| Mobile Chrome   | Pixel 5        | Sim   | Sim |
| Desktop Safari  | device default | Nao   | Sim |
| Mobile Safari   | iPhone 12      | Nao   | Sim |

> Safari/Mobile Safari rodam apenas no CI (`process.env.CI`).

### Hidratacao (waitForHydration)

Testes que interagem com elementos reativos **devem aguardar a hidratacao**:

```typescript
import { waitForHydration } from './helpers'

test('deve interagir com elemento reativo', async ({ page }) => {
  await page.goto('/auth/login')
  await waitForHydration(page) // networkidle + Vue app mount

  await page.locator('input#username').fill('usuario@teste.com')
})
```

**Quando usar:** Antes de `fill()`, `click()` em handlers Vue, navegacao SPA.

**Quando NAO e necessario:** Verificar conteudo SSR (`toContainText`, `toBeVisible`), atributos HTML estaticos.

---

## Mocking

### Mock de $fetch (projeto `unit`)

```typescript
const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})
```

### Mock de Nuxt auto-imports (projeto `nuxt`)

```typescript
import { mockNuxtImport } from '@nuxt/test-utils/runtime'

mockNuxtImport('useRouter', () => () => ({
  push: vi.fn(),
  replace: vi.fn()
}))
```

### Mock de Composable

```typescript
vi.mock('~/layers/1-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({ user: { id: 1 } })
  })
}))
```

---

## Boas Praticas

- Descrever comportamento em portugues: `it('deve mostrar erro quando email e invalido')`
- Seguir Arrange-Act-Assert (AAA)
- Usar `data-testid` para seletores E2E estaveis
- Tipos Kubb podem ser usados em testes para type safety
