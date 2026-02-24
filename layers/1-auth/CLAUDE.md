# Layer Auth - CLAUDE.md

Sistema de autenticacao com BFF (Backend-for-Frontend) pattern.

## Arquitetura

```
Cliente -> BFF (Nuxt Server) -> API Sinapse
              |
    Tokens em cookies httpOnly
```

Os tokens JWT **nunca** sao expostos ao JavaScript do cliente. O servidor Nuxt atua como proxy, armazenando tokens em cookies seguros.

## Estrutura

```
layers/1-auth/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── AuthLoginForm.vue         # Formulario de login (username/password, toggle visibilidade)
│   │   ├── AuthResetPasswordForm.vue # Formulario de reset password (email)
│   │   └── AuthUserMenu.vue          # Menu dropdown: avatar, perfil, admin, logout
│   │
│   ├── composables/
│   │   ├── types.ts                  # Tipos: AuthUser, AuthState, LoginCredentials, etc.
│   │   ├── useAuthApi.ts             # Service: chamadas ao BFF local (/api/auth/*)
│   │   └── useAuthStore.ts           # Pinia: estado global de auth
│   │
│   ├── middleware/
│   │   ├── auth.global.ts            # Inicializa estado no cliente (fetchUser uma vez)
│   │   └── auth-guard.ts             # Protege rotas (nomeado, suporta permissions/groups)
│   │
│   ├── pages/auth/
│   │   ├── login.vue                 # /auth/login (layout: false)
│   │   ├── logout.vue                # /auth/logout (redirect automatico)
│   │   └── reset-password.vue        # /auth/reset-password (layout: false)
│   │
│   └── utils/
│       └── auth.ts                   # isValidRedirectUrl, getSafeRedirectUrl
│
└── server/
    ├── api/auth/
    │   ├── login.post.ts             # POST /api/auth/login
    │   ├── logout.post.ts            # POST /api/auth/logout
    │   ├── refresh.post.ts           # POST /api/auth/refresh
    │   ├── me.get.ts                 # GET /api/auth/me
    │   ├── reset-password.post.ts    # POST /api/auth/reset-password
    │   └── signup.post.ts            # POST /api/auth/signup (publico)
    │
    ├── middleware/
    │   └── 01.auth.ts                # Auto-refresh de tokens, injeta event.context.auth
    │
    └── utils/
        └── auth.ts                   # fetchSinapse, parseJwt, cookies, refresh
```

## Fluxo de Autenticacao

### Login

```
1. Cliente envia credenciais -> POST /api/auth/login
2. BFF autentica na API Sinapse, valida com Zod (tokenSchema)
3. BFF armazena tokens em cookies httpOnly
4. BFF busca /usuarios/me para dados do usuario
5. BFF retorna { user } (sem tokens)
6. Cliente atualiza useAuthStore
```

### Requests Autenticados

```
1. Cliente faz request -> /api/*
2. Server middleware (01.auth.ts) intercepta
3. Le access_token do cookie
4. Se expirado/proximo: renova automaticamente (tryRefreshTokens)
5. Injeta event.context.auth = { isAuthenticated, accessToken }
6. Continua para handler
```

### Logout

```
1. Cliente chama authStore.logout()
2. POST /api/auth/logout
3. BFF notifica API Sinapse (erro nao bloqueia)
4. BFF limpa cookies (sempre executa)
5. Cliente limpa estado
```

## Uso

### Proteger Rotas

```vue
<script setup>
// Apenas autenticacao
definePageMeta({ middleware: 'auth-guard' })

// Com permissoes (qualquer uma da lista)
definePageMeta({
  middleware: 'auth-guard',
  requiredPermissions: ['dashboard.view', 'reports.view']
})

// Com grupo
definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})
</script>
```

### Verificar Autenticacao

```vue
<script setup>
const authStore = useAuthStore()

authStore.isAuthenticated // boolean
authStore.userName // string
authStore.userInitials // "JS" para "Joao Silva"
authStore.hasPermission('dashboard.view')
authStore.hasGroup('administradores')
</script>
```

## Endpoints BFF

| Metodo | Rota                       | Descricao                              |
| ------ | -------------------------- | -------------------------------------- |
| POST   | `/api/auth/login`          | Login com credenciais                  |
| POST   | `/api/auth/logout`         | Logout                                 |
| POST   | `/api/auth/refresh`        | Renovar tokens                         |
| GET    | `/api/auth/me`             | Dados do usuario (retorna null se 401) |
| POST   | `/api/auth/reset-password` | Solicitar reset de senha               |
| POST   | `/api/auth/signup`         | Cadastro publico                       |

## Seguranca

| Aspecto    | Implementacao                                        |
| ---------- | ---------------------------------------------------- |
| Tokens     | Cookies httpOnly (nao acessivel via JS)              |
| Secure     | `true` em producao                                   |
| SameSite   | `strict`                                             |
| Refresh    | maxAge 7 dias                                        |
| CSRF       | Desabilitado em `/api/auth/*` (usa cookies httpOnly) |
| Rate Limit | Login: 10 req/5min, Reset/Signup: 5 req/5min         |
| Validacao  | Zod em todos os endpoints                            |

## Server Utils (`server/utils/auth.ts`)

Auto-importado pelo Nitro em **todos** os endpoints BFF do projeto:

| Funcao                               | O que faz                                             |
| ------------------------------------ | ----------------------------------------------------- |
| `fetchSinapse<T>(endpoint, options)` | Fetch para API Sinapse com timeout 15s e headers auto |
| `tryRefreshTokens(event)`            | Renova tokens automaticamente, atualiza cookies       |
| `getAccessToken(event)`              | Le access_token do cookie                             |
| `setAuthCookies(event, a, r)`        | Define cookies httpOnly/secure/strict                 |
| `clearAuthCookies(event)`            | Remove cookies de auth                                |
| `parseJwt(token)`                    | Decodifica payload JWT (sem verificar assinatura)     |
| `isTokenExpired(token, margin?)`     | Verifica se JWT expirou                               |
| `shouldRefreshToken(token)`          | True se expira em menos de 5 min                      |
| `isSinapseError(error)`              | Type guard para erros da API                          |
| `logAuthError(context, error)`       | Log seguro (detalhes em dev, contexto em prod)        |

## Client Utils (`app/utils/auth.ts`)

| Funcao                               | O que faz                                           |
| ------------------------------------ | --------------------------------------------------- |
| `isValidRedirectUrl(url)`            | Valida URL relativa interna (previne open redirect) |
| `getSafeRedirectUrl(url, fallback?)` | Retorna URL segura ou fallback (default `/`)        |

## Store (useAuthStore)

**Estado:** user, isLoading, error, isInitialized

**Getters:** isAuthenticated, userName, userEmail, userInitials, permissions, groups

**Actions:** login, logout, fetchUser, resetPassword, clearError

**Helpers:** hasPermission, hasAnyPermission, hasGroup, hasAnyGroup

## Tipos Principais

```typescript
// Re-exports do Kubb
type LoginCredentials = LoginRequest      // { username, password }
type TokenResponse = Token                // { access_token, refresh_token }
type SinapseUser = UsuarioSchemaDetalhes

// Tipos BFF (nao expoem tokens)
interface AuthUser {
  id, nome, email, ativo, telefone?, estado?, cidade?,
  funcao?, instituicao?, ultimo_login?, permissoes[], grupos[]
}
type LoginResponse = { user: AuthUser }   // Sem tokens
```
