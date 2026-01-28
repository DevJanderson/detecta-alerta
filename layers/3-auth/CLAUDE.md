# Layer Auth - CLAUDE.md

Sistema de autenticação com BFF (Backend-for-Frontend) pattern.

## Arquitetura

```
Cliente → BFF (Nuxt Server) → API Sinapse
              ↓
    Tokens em cookies httpOnly
```

Os tokens JWT **nunca** são expostos ao JavaScript do cliente. O servidor Nuxt atua como proxy, armazenando tokens em cookies seguros.

## Estrutura

```
layers/3-auth/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── AuthLoginForm.vue         # Formulário de login
│   │   ├── AuthResetPasswordForm.vue # Formulário de reset password
│   │   └── AuthUserMenu.vue          # Menu do usuário (avatar, logout)
│   │
│   ├── composables/
│   │   ├── types.ts                  # Tipos: AuthUser, AuthState
│   │   ├── useAuthApi.ts             # Service: chamadas ao BFF local
│   │   └── useAuthStore.ts           # Pinia: estado global de auth
│   │
│   ├── middleware/
│   │   ├── auth.global.ts            # Inicializa estado no cliente
│   │   └── auth-guard.ts             # Protege rotas (nomeado)
│   │
│   └── pages/auth/
│       ├── login.vue                 # /auth/login
│       ├── logout.vue                # /auth/logout (redirect)
│       └── reset-password.vue        # /auth/reset-password
│
└── server/
    ├── api/auth/
    │   ├── login.post.ts             # POST /api/auth/login
    │   ├── logout.post.ts            # POST /api/auth/logout
    │   ├── refresh.post.ts           # POST /api/auth/refresh
    │   ├── me.get.ts                 # GET /api/auth/me
    │   └── reset-password.post.ts    # POST /api/auth/reset-password
    │
    ├── middleware/
    │   └── 01.auth.ts                # Auto-refresh de tokens
    │
    └── utils/
        └── auth.ts                   # Helpers: parseJwt, cookies
```

## Fluxo de Autenticação

### Login

```
1. Cliente envia credenciais → POST /api/auth/login
2. BFF autentica na API Sinapse
3. BFF armazena tokens em cookies httpOnly
4. BFF retorna dados do usuário (sem tokens)
5. Cliente atualiza useAuthStore
```

### Requests Autenticados

```
1. Cliente faz request → /api/*
2. Server middleware (01.auth.ts) intercepta
3. Lê access_token do cookie
4. Se expirado/próximo: renova automaticamente
5. Adiciona header Authorization
6. Continua para handler
```

### Logout

```
1. Cliente chama authStore.logout()
2. POST /api/auth/logout
3. BFF notifica API Sinapse
4. BFF limpa cookies
5. Cliente limpa estado
```

## Uso

### Login

```vue
<script setup>
const authStore = useAuthStore()
const router = useRouter()

async function handleLogin() {
  const success = await authStore.login({
    username: 'email@exemplo.com',
    password: 'senha123'
  })

  if (success) {
    router.push('/dashboard')
  }
}
</script>
```

### Verificar Autenticação

```vue
<script setup>
const authStore = useAuthStore()

// Verificar se está autenticado
if (authStore.isAuthenticated) {
  console.log('Usuário:', authStore.userName)
}

// Verificar permissões
if (authStore.hasPermission('dashboard.view')) {
  // pode ver dashboard
}

// Verificar grupos
if (authStore.hasGroup('administradores')) {
  // é admin
}
</script>
```

### Proteger Rotas

```vue
<script setup>
// Página que requer autenticação
definePageMeta({
  middleware: 'auth-guard'
})
</script>
```

```vue
<script setup>
// Página com permissões específicas
definePageMeta({
  middleware: 'auth-guard',
  requiredPermissions: ['dashboard.view', 'reports.view'] // qualquer uma
})
</script>
```

### Menu do Usuário

```vue
<template>
  <header>
    <AuthUserMenu />
  </header>
</template>
```

## Configuração

### Variáveis de Ambiente

```env
# .env (incluir /api/v1 na URL)
NUXT_SINAPSE_API_URL=https://staging.sinapse.org.br/api/v1
```

### RuntimeConfig

A variável `sinapseApiUrl` é privada (server-only) e definida em `nuxt.config.ts`:

```ts
runtimeConfig: {
  sinapseApiUrl: '', // NUXT_SINAPSE_API_URL
}
```

## Segurança

| Aspecto    | Implementação                           |
| ---------- | --------------------------------------- |
| Tokens     | Cookies httpOnly (não acessível via JS) |
| Secure     | `true` em produção                      |
| SameSite   | `strict`                                |
| CSRF       | Protegido via `nuxt-csurf`              |
| Rate Limit | 150 req/5min via `nuxt-security`        |
| Validação  | Zod em todos os endpoints               |

## Endpoints BFF

| Método | Rota                       | Descrição                |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/auth/login`          | Login com credenciais    |
| POST   | `/api/auth/logout`         | Logout                   |
| POST   | `/api/auth/refresh`        | Renovar tokens           |
| GET    | `/api/auth/me`             | Dados do usuário         |
| POST   | `/api/auth/reset-password` | Solicitar reset de senha |

## Tipos Principais

```typescript
interface AuthUser {
  id: number
  nome: string
  email: string
  ativo: boolean
  telefone?: string | null
  estado?: string | null
  cidade?: string | null
  funcao?: string | null
  instituicao?: string | null
  ultimo_login?: string | null
  permissoes: AuthPermissao[]
  grupos: AuthGrupo[]
}

interface LoginCredentials {
  username: string
  password: string
}
```

## Store (useAuthStore)

### Estado

- `user`: Usuário autenticado ou null
- `isLoading`: Carregando
- `error`: Mensagem de erro
- `isInitialized`: Estado inicializado

### Getters

- `isAuthenticated`: Está autenticado?
- `userName`: Nome do usuário
- `userEmail`: Email do usuário
- `userInitials`: Iniciais (para avatar)
- `permissions`: Lista de códigos de permissão
- `groups`: Lista de nomes de grupos

### Actions

- `login(credentials)`: Fazer login (retorna boolean)
- `logout()`: Fazer logout (retorna boolean)
- `fetchUser()`: Buscar dados do usuário
- `resetPassword(data)`: Solicitar reset de senha
- `hasPermission(codigo)`: Verificar permissão
- `hasAnyPermission(codigos)`: Verificar qualquer permissão
- `hasGroup(nome)`: Verificar grupo
- `hasAnyGroup(nomes)`: Verificar qualquer grupo

## Utilitários

### Server (`server/utils/auth.ts`)

- `isSinapseError(error)`: Type guard para erros da API
- `logAuthError(context, error)`: Log seguro (não expõe detalhes em produção)
- `tryRefreshTokens(event)`: Renova tokens automaticamente
- `fetchSinapse<T>(endpoint, options)`: Fetch com timeout e headers

### Client (`app/utils/auth.ts`)

- `isValidRedirectUrl(url)`: Valida URL de redirect (previne open redirect)
- `getSafeRedirectUrl(url, fallback)`: Retorna URL segura ou fallback
