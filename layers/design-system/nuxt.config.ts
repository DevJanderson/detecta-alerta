/**
 * Layer Design System - Configuração
 * Tokens CSS, componentes shadcn-vue, utilitários (cn, buttonVariants)
 * e páginas de showcase do design system.
 *
 * Usa createResolver para paths relativos à layer (portável).
 */
import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  css: [resolve('./app/assets/css/main.css')]
})
