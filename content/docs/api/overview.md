---
title: API
description: Visão geral da API e integração com o Sinapse.
---

# API

O Detecta Alerta consome a **API Sinapse** para dados epidemiológicos. A comunicação é feita exclusivamente via BFF (Backend-for-Frontend).

## Arquitetura

```
Frontend ($fetch) → BFF (server/) → API Sinapse
```

O frontend nunca acessa a API Sinapse diretamente. Todas as chamadas passam pelo BFF que:

1. Adiciona autenticação (Bearer token do cookie)
2. Valida respostas com schemas Zod
3. Aplica rate limiting
4. Trata erros de forma padronizada

## Endpoints BFF

### Autenticação

| Método | Rota                       | Descrição                |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/auth/login`          | Login com credenciais    |
| POST   | `/api/auth/logout`         | Logout (limpa cookies)   |
| POST   | `/api/auth/refresh`        | Renovar token            |
| GET    | `/api/auth/me`             | Dados do usuário logado  |
| POST   | `/api/auth/reset-password` | Solicitar reset de senha |

### Rumores

| Método | Rota                                  | Descrição            |
| ------ | ------------------------------------- | -------------------- |
| GET    | `/api/rumores/`                       | Listar rumores       |
| GET    | `/api/rumores/:uniqueId`              | Detalhe de um rumor  |
| GET    | `/api/rumores/:uniqueId/relacionadas` | Rumores relacionados |
| GET    | `/api/rumores/operacoes/doencas`      | Listar doenças       |
| GET    | `/api/rumores/operacoes/sintomas`     | Listar sintomas      |
| GET    | `/api/rumores/operacoes/localizacoes` | Listar localizações  |

### Usuários

| Método | Rota                      | Descrição                |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/usuarios/perfil/me` | Perfil do usuário logado |
| PUT    | `/api/usuarios/perfil/me` | Atualizar perfil         |
| GET    | `/api/usuarios/admin`     | Listar usuários (admin)  |
| POST   | `/api/usuarios/admin`     | Criar usuário (admin)    |

## Configuração

A URL da API é configurada via variável de ambiente:

```dotenv
NUXT_SINAPSE_API_URL=https://staging.sinapse.org.br/api/v1
```

Acessível no servidor via `useRuntimeConfig()`:

```typescript
const config = useRuntimeConfig()
const apiUrl = config.sinapseApiUrl
```
