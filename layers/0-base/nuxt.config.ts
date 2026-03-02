/**
 * Layer Base - Configuração
 * Fundação da aplicação: app.vue, error.vue, CSS global, componentes UI,
 * composables, utilitários e tipos compartilhados entre todos os layers
 *
 * Usa createResolver para paths relativos à layer (não ao projeto consumidor).
 * Isso permite renomear/mover a layer sem quebrar referências.
 */
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  css: [resolve('./app/assets/css/main.css')],
  alias: {
    '#shared': resolve('./shared')
  }
})
