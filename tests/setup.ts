/// <reference types="vitest/globals" />
/**
 * Vitest Setup - Projeto "nuxt"
 * Executado antes dos testes em tests/integration/
 * No ambiente @nuxt/test-utils, auto-imports reais do Nuxt estão disponíveis.
 */
import { config } from '@vue/test-utils'

// Stubs de componentes Nuxt para evitar warnings
config.global.stubs = {
  NuxtLink: {
    template: '<a><slot /></a>'
  },
  ClientOnly: {
    template: '<slot />'
  },
  NuxtImg: {
    template: '<img />'
  },
  Icon: {
    template: '<span />'
  }
}

// Mock do @nuxtjs/color-mode para evitar erro de inicialização nos testes
// "Cannot read properties of undefined (reading 'preference')"
vi.stubGlobal('useColorMode', () => ({
  preference: 'light',
  value: 'light',
  forced: false
}))

// Suppress Vue warnings in tests
config.global.config.warnHandler = () => {}
