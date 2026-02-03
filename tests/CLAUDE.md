# tests/CLAUDE.md

Instruções para testes no Detecta Alerta.

## Estrutura

```
tests/
├── setup.ts           # Setup global (mocks do Nuxt)
├── unit/              # Testes unitários (funções puras, stores, composables)
│   └── auth/          # Testes da layer de autenticação
├── integration/       # Testes de integração (futuro)
└── e2e/               # Testes E2E (Playwright)
```

## Convenções

| Convenção    | Padrão                                  |
| ------------ | --------------------------------------- |
| Nomenclatura | `*.test.ts` (unit) ou `*.spec.ts` (e2e) |
| Localização  | Pasta `tests/` separada (não colocated) |
| Organização  | Espelhar estrutura das layers           |

## Ferramentas

| Ferramenta           | Uso                                |
| -------------------- | ---------------------------------- |
| Vitest               | Testes unitários e integração      |
| Playwright           | Testes E2E (end-to-end)            |
| @vue/test-utils      | Montar componentes Vue             |
| @testing-library/vue | Testes focados no usuário          |
| happy-dom            | DOM environment                    |
| Kubb Mocks           | Dados fake gerados (Faker)         |
| Kubb MSW             | Handlers para interceptar requests |

## Comandos

```bash
# Testes unitários (Vitest)
npm run test           # Watch mode
npm run test:run       # Executa uma vez
npm run test:coverage  # Com cobertura
npm run test:ui        # Interface visual

# Testes E2E (Playwright)
npm run test:e2e           # Executa testes
npm run test:e2e:ui        # Interface visual
npm run test:e2e:headed    # Com browser visível
npm run test:e2e:install   # Instala browsers
```

---

## Testes Unitários

### Teste de Composable (API Service)

```typescript
// tests/unit/auth/useAuthApi.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

import { useAuthApi } from '~/layers/3-auth/app/composables/useAuthApi'

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

### Teste de Store (Pinia)

```typescript
// tests/unit/auth/useAuthStore.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock do useAuthApi
vi.mock('~/layers/3-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({ user: mockUser }),
    logout: vi.fn(),
    getMe: vi.fn(),
    resetPassword: vi.fn(),
    refresh: vi.fn()
  })
}))

import { useAuthStore } from '~/layers/3-auth/app/composables/useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve iniciar sem usuário', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('deve fazer login com sucesso', async () => {
    const store = useAuthStore()
    const success = await store.login({
      username: 'test@example.com',
      password: '123'
    })

    expect(success).toBe(true)
    expect(store.isAuthenticated).toBe(true)
  })
})
```

---

## Testes E2E (Playwright)

### Teste de Homepage

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should display correctly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Detecta Alerta/)
    await expect(page.locator('h1')).toContainText('Detecta Alerta')
  })

  test('should navigate to login', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/auth/login"]')
    await expect(page).toHaveURL('/auth/login')
  })
})
```

### Teste de Autenticação

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('deve exibir formulário de login', async ({ page }) => {
    await page.goto('/auth/login')

    await expect(page.locator('input#username')).toBeVisible()
    await expect(page.locator('input#password')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('botão deve estar desabilitado sem credenciais', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test('botão deve estar habilitado com credenciais', async ({ page }) => {
    await page.goto('/auth/login')

    await page.fill('input#username', 'usuario@teste.com')
    await page.fill('input#password', 'senha123')

    await expect(page.locator('button[type="submit"]')).toBeEnabled()
  })
})
```

---

## Mocking

### Mock de $fetch

```typescript
import { vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})
```

### Mock de Composable

```typescript
vi.mock('~/layers/3-auth/app/composables/useAuthApi', () => ({
  useAuthApi: () => ({
    login: vi.fn().mockResolvedValue({ user: { id: 1 } }),
    logout: vi.fn()
  })
}))
```

### Mocks Gerados pelo Kubb

O Kubb gera mocks automáticos com Faker e handlers MSW. **Importar DIRETO da pasta** (não do barrel):

```typescript
// ✅ CORRETO - Importar direto
import { createToken } from '~/generated/sinapse/mocks/createToken'
import { createUsuarioSchemaDetalhes } from '~/generated/sinapse/mocks/createUsuarioSchemaDetalhes'

// Usar em testes
const mockToken = createToken()
const mockUser = createUsuarioSchemaDetalhes()

// ❌ ERRADO - Não funciona (não exportado no barrel principal)
import { createToken } from '~/generated/sinapse'
```

### MSW Handlers (API Mocking)

```typescript
import { setupServer } from 'msw/node'
import { loginHandler } from '~/generated/sinapse/msw/AutenticaçãoHandlers'

const server = setupServer(...loginHandler)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

> **Nota:** Mocks e MSW não são exportados no barrel principal para evitar carregar `@faker-js/faker` no bundle de produção. Ver [docs/KUBB.md](../docs/KUBB.md) para detalhes.

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
