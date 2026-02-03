import { test, expect } from '@playwright/test'

/**
 * Detecta Alerta - E2E Test Suite
 */
test.describe('Homepage', () => {
  test('should display the homepage correctly', async ({ page }) => {
    await page.goto('/')

    // Verifica se a página carregou com o título correto
    await expect(page).toHaveTitle(/Detecta Alerta/)

    // Verifica se o título principal está visível
    await expect(page.locator('h1')).toContainText('Vigilância Epidemiológica')
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    await expect(page).toHaveTitle(/Detecta Alerta/)
  })
})

test.describe('Navigation', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')

    // Aguarda botão "Fazer Login" no header aparecer após inicialização do auth
    const loginButton = page.locator('header').getByText('Fazer Login')
    await expect(loginButton).toBeVisible()
    await loginButton.click()
    await expect(page).toHaveURL('/auth/login')
  })
})

test.describe('Accessibility', () => {
  test('should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/')

    // Verifica lang attribute
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', 'pt-BR')
  })
})
