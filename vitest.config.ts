import { defineVitestConfig } from '@nuxt/test-utils/config'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const coverageOptions = {
  provider: 'v8' as const,
  reporter: ['text', 'json', 'html'],
  reportsDirectory: './coverage',
  exclude: [
    'node_modules/',
    '.nuxt/',
    '.output/',
    'coverage/',
    'tests/',
    '**/*.d.ts',
    '**/*.config.*'
  ]
}

// Projeto "unit": Node puro, sem Nuxt, sem setup.ts
const unitProject = defineConfig({
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('.', import.meta.url)),
      '#shared': fileURLToPath(new URL('./layers/base/shared', import.meta.url))
    }
  },
  test: {
    name: 'unit',
    environment: 'node',
    globals: true,
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['tests/e2e/**/*', 'node_modules/**/*'],
    coverage: coverageOptions
  }
})

// Projeto "nuxt": happy-dom + @nuxt/test-utils
const nuxtProject = defineVitestConfig({
  test: {
    name: 'nuxt',
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom'
      }
    },
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/integration/**/*.test.ts'],
    exclude: ['tests/e2e/**/*', 'node_modules/**/*'],
    coverage: coverageOptions
  }
})

export default defineConfig({
  test: {
    projects: [unitProject, nuxtProject]
  }
})
