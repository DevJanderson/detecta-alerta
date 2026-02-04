import { describe, it, expect, beforeEach, vi } from 'vitest'

import { useSeoPage } from '~/layers/1-base/app/composables/useSeoPage'

// Mock dos composables de head do Nuxt (auto-imports via #app/composables/head)
const mockUseHead = vi.fn()
const mockUseSeoMeta = vi.fn()
vi.mock('#app/composables/head', () => ({
  useHead: (...args: unknown[]) => mockUseHead(...args),
  useSeoMeta: (...args: unknown[]) => mockUseSeoMeta(...args)
}))

// O useRoute mockado no setup.ts retorna path: '/'
// Testes que precisam de path diferente usam a opção `path` do composable

describe('useSeoPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('configuração básica', () => {
    it('deve definir title e description padrão', () => {
      useSeoPage({ title: 'Minha Página - Detecta Alerta' })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Minha Página - Detecta Alerta',
          description:
            'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'
        })
      )
    })

    it('deve usar description customizada quando fornecida', () => {
      useSeoPage({
        title: 'Teste',
        description: 'Descrição customizada'
      })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Descrição customizada',
          ogDescription: 'Descrição customizada',
          twitterDescription: 'Descrição customizada'
        })
      )
    })
  })

  describe('canonical URL', () => {
    it('deve gerar canonical usando rota atual', () => {
      useSeoPage({ title: 'Teste' })

      expect(mockUseHead).toHaveBeenCalledWith({
        link: [{ rel: 'canonical', href: 'https://alerta.sinapse.org.br/' }]
      })
    })

    it('deve aceitar path customizado', () => {
      useSeoPage({ title: 'Teste', path: '/custom-path' })

      expect(mockUseHead).toHaveBeenCalledWith({
        link: [{ rel: 'canonical', href: 'https://alerta.sinapse.org.br/custom-path' }]
      })
    })
  })

  describe('Open Graph', () => {
    it('deve definir meta tags OG completas', () => {
      useSeoPage({ title: 'Teste OG' })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          ogType: 'website',
          ogTitle: 'Teste OG',
          ogUrl: 'https://alerta.sinapse.org.br/',
          ogImage: 'https://alerta.sinapse.org.br/og-image.png',
          ogSiteName: 'Detecta Alerta',
          ogLocale: 'pt_BR'
        })
      )
    })

    it('deve aceitar ogImage customizada', () => {
      useSeoPage({
        title: 'Teste',
        ogImage: 'https://cdn.example.com/custom-image.png'
      })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          ogImage: 'https://cdn.example.com/custom-image.png'
        })
      )
    })
  })

  describe('Twitter Cards', () => {
    it('deve definir meta tags Twitter completas', () => {
      useSeoPage({
        title: 'Teste Twitter',
        description: 'Desc twitter'
      })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          twitterCard: 'summary_large_image',
          twitterTitle: 'Teste Twitter',
          twitterDescription: 'Desc twitter',
          twitterImage: 'https://alerta.sinapse.org.br/og-image.png'
        })
      )
    })
  })

  describe('robots', () => {
    it('deve ser index, follow por padrão', () => {
      useSeoPage({ title: 'Teste' })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          robots: 'index, follow'
        })
      )
    })

    it('deve ser noindex, nofollow quando noindex: true', () => {
      useSeoPage({ title: 'Teste', noindex: true })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          robots: 'noindex, nofollow'
        })
      )
    })
  })
})
