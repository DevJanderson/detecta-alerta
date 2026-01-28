import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

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
        { name: 'theme-color', content: '#e63946' }
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    }
  },

  // Desabilita sourcemaps em produção (evita warning do @tailwindcss/vite)
  sourcemap: {
    client: false,
    server: false
  },

  // Nuxt Layers - auto-scan de ~/layers (Nuxt 4+)
  // Ordem de prioridade: 0-core < 1-base < 2-example < 3-auth < 4-landing
  // Número maior = maior prioridade = sobrescreve layers anteriores

  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/image',
    'nuxt-security',
    'nuxt-csurf'
  ],

  // Security - Headers e proteções
  security: {
    headers: {
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
      contentSecurityPolicy: {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"]
      }
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300000
    },
    xssValidator: {},
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 8000000
    }
  },

  // CSRF Protection
  csurf: {
    https: process.env.NODE_ENV === 'production',
    cookieKey: 'csrf',
    methodsToProtect: ['POST', 'PUT', 'PATCH', 'DELETE']
  },

  // Desabilitar CSRF para rotas de auth (usa cookies httpOnly para segurança)
  routeRules: {
    '/api/auth/login': { csurf: false },
    '/api/auth/logout': { csurf: false },
    '/api/auth/refresh': { csurf: false },
    '/api/auth/reset-password': { csurf: false }
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
    componentDir: './layers/1-base/app/components/ui'
  },

  runtimeConfig: {
    // Private (server only)
    sinapseApiUrl: '', // NUXT_SINAPSE_API_URL

    // Public (exposed to client)
    public: {
      apiBaseUrl: '' // NUXT_PUBLIC_API_BASE_URL
    }
  },

  vite: {
    plugins: [tailwindcss()],

    // Performance - Build optimizations
    build: {
      // Minificação rápida
      minify: 'esbuild',
      // Limite para inline de assets (4kb)
      assetsInlineLimit: 4096
    }
  }

  // CSS global está em layers/0-core/
})
