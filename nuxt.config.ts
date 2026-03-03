import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: process.env.NUXT_DEVTOOLS === 'true' },

  // Performance - Experimental features
  experimental: {
    crossOriginPrefetch: true
  },

  // Performance - Nitro (servidor)
  nitro: {
    compressPublicAssets: true
  },

  // SEO - Meta tags globais
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      title: 'Detecta Alerta',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.'
        },
        { name: 'theme-color', content: '#e63946' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'pt_BR' },
        { property: 'og:site_name', content: 'Detecta Alerta' }
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }]
    }
  },

  // Desabilita sourcemaps em produção (evita warning do @tailwindcss/vite)
  sourcemap: {
    client: false,
    server: false
  },

  // Nuxt Layers - extends explícito (ordem = prioridade crescente)
  extends: [
    './layers/base',
    './layers/auth',
    './layers/home',
    './layers/usuarios',
    './layers/rumores',
    './layers/docs'
  ],

  site: {
    url: 'https://alerta.sinapse.org.br',
    name: 'Detecta Alerta',
    description:
      'Plataforma de vigilância e monitoramento epidemiológico em tempo real para o Brasil.',
    defaultLocale: 'pt-BR'
  },

  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
  },

  ogImage: { enabled: false },
  linkChecker: { enabled: false },
  seo: {
    // Desabilitar tree-shaking de useSeoMeta em testes (Vitest)
    // para que mocks de useSeoMeta funcionem corretamente
    treeShakeUseSeoMeta: !process.env.VITEST
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/content',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/image',
    'nuxt-security',
    ['vue-sonner/nuxt', { css: false }],
    '@nuxtjs/seo',
    '@nuxtjs/color-mode',
    'pinia-plugin-persistedstate/nuxt'
  ],

  robots: {
    disallow: ['/api/', '/auth/', '/geo/'],
    sitemap: '/sitemap.xml'
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'ITpS - Instituto Todos pela Saúde',
      url: 'https://itps.org.br'
    }
  },

  // Nuxt Icon - auto-import de ícones
  // Docs: https://nuxt.com/modules/icon
  icon: {
    serverBundle: 'remote',
    clientBundle: {
      scan: true,
      // Ícones escaneados automaticamente; aumentar limite se necessário
      sizeLimitKb: 256
    }
  },

  // Security - nuxt-security (headers, rate limiter, CSRF, etc.)
  // Docs: https://nuxt-security.vercel.app
  security: {
    // Headers de segurança
    headers: {
      crossOriginResourcePolicy: 'same-origin',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'credentialless',
      // CSP desabilitado em dev (interfere com HMR do Vite ao acessar via rede)
      // Ref: https://nuxt-security.vercel.app/advanced/faq
      contentSecurityPolicy:
        process.env.NODE_ENV === 'development'
          ? false
          : {
              'base-uri': ["'self'"],
              'default-src': ["'self'"],
              'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
              'style-src': ["'self'", "'unsafe-inline'"],
              'img-src': ["'self'", 'data:', 'https:'],
              'font-src': ["'self'", 'data:'],
              'connect-src': ["'self'"],
              'frame-ancestors': ["'self'"],
              'form-action': ["'self'"],
              'object-src': ["'none'"],
              'upgrade-insecure-requests': true
            },
      // Permissions-Policy: restringe features do navegador não utilizadas
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        'display-capture': []
      },
      referrerPolicy: 'strict-origin-when-cross-origin',
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubdomains: true
      },
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'SAMEORIGIN',
      xXSSProtection: '0' // Desabilitado (obsoleto, CSP é suficiente)
    },

    // Rate limiter - 150 requests por 5 minutos
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000
    },

    // Limite de tamanho de requisição
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000, // 2MB
      maxUploadFileRequestInBytes: 8000000 // 8MB
    },

    // XSS Validator (objeto vazio = usar defaults)
    xssValidator: {},

    // Oculta header X-Powered-By
    hidePoweredBy: true,

    // Habilita nonce para CSP (necessário para Report-Only nonce-based)
    nonce: true,

    // CSRF Protection (usa nuxt-csurf internamente)
    csrf: {
      https: process.env.NODE_ENV === 'production',
      cookieKey: 'csrf',
      methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE']
    }
  },

  // Configurações por rota
  // Docs: https://nuxt-security.vercel.app/getting-started/usage
  routeRules: {
    // Rotas de auth: CSRF desabilitado (usam cookies httpOnly)
    '/api/auth/login': {
      security: { rateLimiter: { tokensPerInterval: 10, interval: 300000 } },
      csurf: false
    },
    '/api/auth/logout': { csurf: false },
    '/api/auth/refresh': { csurf: false },
    '/api/auth/reset-password': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 300000 } },
      csurf: false
    },
    '/api/auth/signup': {
      security: { rateLimiter: { tokensPerInterval: 5, interval: 300000 } },
      csurf: false
    },

    // Rotas de usuarios: CSRF desabilitado (usam cookies httpOnly + SameSite strict)
    '/api/usuarios/**': { csurf: false },

    // Rotas de rumores admin: CSRF desabilitado (usam cookies httpOnly + SameSite strict)
    '/api/rumores/admin/**': { csurf: false },

    // Nuxt Content: API interna usa POST para queries
    '/__nuxt_content/**': { csurf: false, security: { rateLimiter: false } },
    '/api/_content/**': { csurf: false, security: { rateLimiter: false } },

    // SEO: robots noindex para rotas internas (header X-Robots-Tag)
    '/auth/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/perfil/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/admin/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/rumores/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/docs/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }
  },

  // VeeValidate - validação de formulários
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage'
    }
  },

  // Nuxt Image - otimização de imagens
  image: {
    quality: 80,
    format: ['webp', 'avif']
  },

  shadcn: {
    prefix: '',
    componentDir: './layers/base/app/components/ui'
  },

  runtimeConfig: {
    // Private (server only)
    sinapseApiUrl: '', // NUXT_SINAPSE_API_URL

    // Public (exposed to client)
    public: {
      apiBaseUrl: '', // NUXT_PUBLIC_API_BASE_URL
      siteUrl: 'https://alerta.sinapse.org.br' // NUXT_PUBLIC_SITE_URL
    }
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: { default: 'github-dark', dark: 'github-dark' },
          // Apenas linguagens usadas nos docs — adicionar conforme necessário
          langs: ['bash', 'typescript', 'vue']
        }
      }
    }
  },

  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- @tailwindcss/vite type mismatch with Nuxt's bundled vite types
    plugins: [tailwindcss() as any],

    // Performance - Excluir generated/ do file watcher (877 arquivos Kubb)
    server: {
      watch: {
        ignored: ['**/generated/**']
      }
    },

    // Pré-bundlar dependências pesadas (transforma uma vez, reutiliza)
    optimizeDeps: {
      include: [
        'reka-ui',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'lucide-vue-next',
        '@tanstack/vue-table',
        '@vueuse/core',
        '@internationalized/date',
        'zod',
        'embla-carousel-vue',
        'vaul-vue',
        'maska'
      ]
    },

    // Performance - Build optimizations
    build: {
      // Minificação rápida
      minify: 'esbuild',
      // Limite para inline de assets (4kb)
      assetsInlineLimit: 4096
    }
  }
})
