/**
 * Layer Base - Configuração
 * Fundação da aplicação: app.vue, error.vue, composables,
 * utilitários e tipos compartilhados entre todos os layers.
 *
 * CSS e componentes UI ficam na layer design-system.
 */
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  alias: {
    '#shared': resolve('./shared')
  }
})
