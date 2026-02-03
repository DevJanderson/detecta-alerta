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
  // Ordem de prioridade: 0-core < 1-base < 3-auth < 4-landing
  // Número maior = maior prioridade = sobrescreve layers anteriores

  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    '@nuxt/image',
    'nuxt-security',
    'vue-sonner/nuxt'
  ],

  // Security - nuxt-security (headers, rate limiter, CSRF, etc.)
  // Docs: https://nuxt-security.vercel.app
  security: {
    // Headers de segurança
    headers: {
      crossOriginResourcePolicy: 'same-origin',
      crossOriginOpenerPolicy: 'same-origin',
      crossOriginEmbedderPolicy:
        process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'credentialless',
      contentSecurityPolicy: {
        'base-uri': ["'self'"],
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", 'data:', 'https:'],
        'font-src': ["'self'", 'data:'],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'self'"],
        'form-action': ["'self'"],
        'object-src': ["'none'"]
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
    }
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
