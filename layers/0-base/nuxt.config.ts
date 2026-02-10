/**
 * Layer Base - Configuração
 * Fundação da aplicação: app.vue, error.vue, CSS global, componentes UI,
 * composables, utilitários e tipos compartilhados entre todos os layers
 */
export default defineNuxtConfig({
  css: ['~/layers/0-base/app/assets/css/main.css'],
  alias: {
    '#shared': '../layers/0-base/shared'
  }
})
