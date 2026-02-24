---
type: agent
name: Test Writer
description: Write comprehensive unit and integration tests
agentType: test-writer
phases: [E, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Test Writer Playbook

### Project Decision

| Needs Nuxt auto-imports?     | Project | Directory            |
| ---------------------------- | ------- | -------------------- |
| No (pure functions, $fetch)  | `unit`  | `tests/unit/`        |
| Yes (useRouter, defineStore) | `nuxt`  | `tests/integration/` |

### Unit Test Template (Service)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockFetch = vi.fn()
vi.stubGlobal('$fetch', mockFetch)

import { useExampleApi } from '~/layers/{N}-{feature}/app/composables/useExampleApi'

describe('useExampleApi', () => {
  let api: ReturnType<typeof useExampleApi>

  beforeEach(() => {
    mockFetch.mockReset()
    api = useExampleApi()
  })

  it('deve buscar todos os itens', async () => {
    mockFetch.mockResolvedValue([{ id: 1 }])
    const result = await api.getAll()
    expect(mockFetch).toHaveBeenCalledWith('/api/examples')
    expect(result).toEqual([{ id: 1 }])
  })
})
```

### Integration Test Template (Store)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('~/layers/{N}-{feature}/app/composables/useExampleApi', () => ({
  useExampleApi: () => ({
    getAll: vi.fn().mockResolvedValue([{ id: 1 }])
  })
}))

mockNuxtImport('useRouter', () => () => ({
  push: vi.fn(),
  replace: vi.fn()
}))

const { useExampleStore } = await import('~/layers/{N}-{feature}/app/composables/useExampleStore')

describe('useExampleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('deve iniciar com lista vazia', () => {
    const store = useExampleStore()
    expect(store.items).toEqual([])
  })
})
```

### Conventions

- File names: `*.test.ts` (unit/integration), `*.spec.ts` (e2e)
- Test descriptions: Portuguese, behavioral (`'deve mostrar erro quando...'`)
- Pattern: Arrange-Act-Assert (AAA)
- Mirror layer structure in test directories
- E2E: use `data-testid` selectors, `waitForHydration()` before reactive interactions

### Commands

```bash
npm run test:unit      # Fast (~500ms)
npm run test:nuxt      # With Nuxt env (~25s)
npm run test:run       # All projects
npm run test -- path/to/file.test.ts  # Specific file
```
