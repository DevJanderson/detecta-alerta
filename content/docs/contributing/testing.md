---
title: Testes
description: Guia de testes do Detecta Alerta.
---

# Testes

O projeto usa **Vitest** para testes unitários/integração e **Playwright** para E2E.

## Comandos

| Comando                 | Descrição                                     |
| ----------------------- | --------------------------------------------- |
| `npm run test`          | Watch mode                                    |
| `npm run test:run`      | Todos os testes (uma vez)                     |
| `npm run test:unit`     | Projeto "unit" (Node puro, rápido)            |
| `npm run test:nuxt`     | Projeto "nuxt" (happy-dom + @nuxt/test-utils) |
| `npm run test:coverage` | Com cobertura                                 |
| `npm run test:e2e`      | Playwright E2E                                |

## Estrutura

```
tests/
├── unit/           # Node puro (funções puras, services)
├── integration/    # @nuxt/test-utils (stores, composables)
└── e2e/            # Playwright
```

## Dois projetos Vitest

| Projeto  | Ambiente                     | Velocidade      | Quando usar             |
| -------- | ---------------------------- | --------------- | ----------------------- |
| **unit** | Node puro                    | Rápido (~500ms) | Funções puras, services |
| **nuxt** | happy-dom + @nuxt/test-utils | Lento (~25s)    | Stores, composables Vue |

## Padrão AAA

Todos os testes seguem o padrão **Arrange-Act-Assert**:

```typescript
it('deve fazer login com sucesso', async () => {
  // Arrange
  const store = useAuthStore()

  // Act
  await store.login({ username: 'test@example.com', password: '123' })

  // Assert
  expect(store.isAuthenticated).toBe(true)
})
```

## Mocking

### Unit tests

```typescript
// Mock de $fetch
vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ data: [] }))
```

### Nuxt tests

```typescript
// Mock de composables Nuxt
mockNuxtImport('useRouter', () => () => ({
  push: vi.fn()
}))
```

## Testes unitários

```typescript
// tests/unit/utils/format.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from '~/layers/0-base/app/utils/format'

describe('formatDate', () => {
  it('deve formatar data ISO para pt-BR', () => {
    expect(formatDate('2024-01-15')).toBe('15/01/2024')
  })
})
```

## Testes de integração (Nuxt)

```typescript
// tests/integration/stores/auth.test.ts
import { describe, it, expect } from 'vitest'
import { setup } from '@nuxt/test-utils'

describe('useAuthStore', async () => {
  await setup({ server: false })

  it('deve iniciar deslogado', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
  })
})
```

## Testes E2E (Playwright)

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('deve fazer login', async ({ page }) => {
  await page.goto('/auth/login')
  await page.fill('[name="email"]', 'user@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/rumores')
})
```

::docs-tip
Prefira testes unitários (rápidos) para lógica de negócio e testes E2E para fluxos críticos do usuário.
::
