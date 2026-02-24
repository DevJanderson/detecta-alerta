---
type: skill
name: Test Generation
description: Generate comprehensive test cases for code
skillSlug: test-generation
phases: [E, V]
generated: 2026-02-24
status: filled
scaffoldVersion: '2.0.0'
---

## Test Generation Skill

### Project Selection

| Code Uses                                      | Project | Directory            | File Pattern |
| ---------------------------------------------- | ------- | -------------------- | ------------ |
| Pure functions, `$fetch` only                  | `unit`  | `tests/unit/`        | `*.test.ts`  |
| Nuxt auto-imports (`useRouter`, `defineStore`) | `nuxt`  | `tests/integration/` | `*.test.ts`  |
| Browser interactions                           | E2E     | `tests/e2e/`         | `*.spec.ts`  |

### Unit Test Template

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

  it('deve buscar dados corretamente', async () => {
    mockFetch.mockResolvedValue([{ id: 1 }])
    const result = await api.getAll()
    expect(mockFetch).toHaveBeenCalledWith('/api/examples')
    expect(result).toEqual([{ id: 1 }])
  })
})
```

### Integration Test Template

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('~/layers/{N}-{feature}/app/composables/useExampleApi', () => ({
  useExampleApi: () => ({ getAll: vi.fn().mockResolvedValue([]) })
}))

mockNuxtImport('useRouter', () => () => ({ push: vi.fn() }))

const { useExampleStore } = await import('~/layers/{N}-{feature}/app/composables/useExampleStore')

describe('useExampleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('deve iniciar com lista vazia', () => {
    expect(useExampleStore().items).toEqual([])
  })
})
```

### Conventions

- Descriptions in Portuguese: `'deve mostrar erro quando...'`
- Pattern: Arrange-Act-Assert (AAA)
- E2E: use `data-testid` selectors and `waitForHydration()`
- Mirror layer directory structure in tests
