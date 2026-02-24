import type { Page } from '@playwright/test'

/**
 * Aguarda hidratação completa do Vue/Nuxt antes de interagir com o DOM.
 *
 * Usa `networkidle` como sinal principal (garante que todo JS foi carregado
 * e executado). Tenta verificar `__vue_app__` como confirmação adicional,
 * mas aceita `networkidle` como suficiente em engines onde a propriedade
 * não é acessível (ex: WebKit em builds fallback do Playwright).
 */
export async function waitForHydration(page: Page) {
  await page.waitForLoadState('networkidle')
  await page
    .waitForFunction(
      () => {
        const el = document.querySelector('#__nuxt')
        return el && '__vue_app__' in el
      },
      { timeout: 5000 }
    )
    .catch(() => {
      // WebKit fallback: networkidle já garante que o JS foi executado
    })
}
