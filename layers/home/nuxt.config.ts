/**
 * Layer Home - Configuração
 * Homepage e páginas públicas
 */
export default defineNuxtConfig({
  // ECharts precisa de transpile para funcionar com SSR/client-only
  build: {
    transpile: [/echarts/, /vue-echarts/]
  }
})
