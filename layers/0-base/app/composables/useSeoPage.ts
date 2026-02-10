interface SeoPageOptions {
  title: string
  description?: string
  path?: string
  noindex?: boolean
  ogImage?: string
}

const SITE_NAME = 'Detecta Alerta'
const DEFAULT_DESCRIPTION =
  'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'

/**
 * Composable para SEO de página.
 * Gera: title, description, og:*, twitter:*, canonical, robots.
 */
export function useSeoPage(options: SeoPageOptions) {
  const route = useRoute()
  const config = useRuntimeConfig()

  const siteUrl = (config.public.siteUrl as string) || 'https://alerta.sinapse.org.br'
  const path = options.path ?? route.path
  const canonical = `${siteUrl}${path}`
  const description = options.description ?? DEFAULT_DESCRIPTION
  const ogImage = options.ogImage ?? `${siteUrl}/og-image.png`

  useHead({
    link: [{ rel: 'canonical', href: canonical }]
  })

  useSeoMeta({
    title: options.title,
    description,
    ogType: 'website',
    ogTitle: options.title,
    ogDescription: description,
    ogUrl: canonical,
    ogImage,
    ogSiteName: SITE_NAME,
    ogLocale: 'pt_BR',
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: description,
    twitterImage: ogImage,
    robots: options.noindex ? 'noindex, nofollow' : 'index, follow'
  })
}
