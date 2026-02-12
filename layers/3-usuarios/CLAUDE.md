# Layer Usuarios - CLAUDE.md

Gestao de perfil (self-service), administracao de usuarios, grupos e permissoes.

## Arquitetura

```
Cliente -> BFF (Nuxt Server) -> API Sinapse
```

Todas as operacoes passam pelo BFF. Endpoints admin requerem grupo `administradores`.

## Estrutura

```
layers/3-usuarios/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── UsuariosPerfilForm.vue         # Form editar perfil
│   │   ├── UsuariosPerfilFoto.vue         # Upload foto
│   │   ├── UsuariosAdminTable.vue         # Tabela usuarios
│   │   ├── UsuariosAdminFilters.vue       # Filtros busca
│   │   ├── UsuariosAdminForm.vue          # Dialog criar/editar
│   │   ├── UsuariosAdminDeleteDialog.vue  # Confirmacao exclusao
│   │   ├── UsuariosAdminDetail.vue        # Card detalhes
│   │   ├── GruposTable.vue                # Tabela grupos
│   │   ├── GruposForm.vue                 # Dialog criar/editar grupo
│   │   ├── GruposDeleteDialog.vue         # Confirmacao exclusao
│   │   ├── GruposMembros.vue             # Gerenciar membros
│   │   ├── PermissoesTable.vue            # Tabela permissoes
│   │   ├── PermissoesForm.vue             # Dialog criar/editar
│   │   ├── PermissoesDeleteDialog.vue     # Confirmacao exclusao
│   │   └── PermissoesUsuarioManager.vue   # Atribuir a usuarios
│   │
│   ├── composables/
│   │   ├── types.ts                       # Re-export Kubb + tipos BFF
│   │   ├── useUsuariosApi.ts              # Service: perfil + admin
│   │   ├── useUsuariosStore.ts            # Pinia: CRUD usuarios
│   │   ├── useGruposApi.ts                # Service: grupos
│   │   ├── useGruposStore.ts              # Pinia: CRUD grupos
│   │   ├── usePermissoesApi.ts            # Service: permissoes
│   │   └── usePermissoesStore.ts          # Pinia: CRUD permissoes
│   │
│   └── pages/
│       ├── perfil/
│       │   └── index.vue                  # /perfil (auth-guard)
│       └── admin/
│           ├── usuarios/
│           │   ├── index.vue              # /admin/usuarios
│           │   └── [id].vue               # /admin/usuarios/:id
│           ├── grupos/
│           │   ├── index.vue              # /admin/grupos
│           │   └── [id].vue               # /admin/grupos/:id
│           └── permissoes/
│               └── index.vue              # /admin/permissoes
│
└── server/
    ├── utils/
    │   └── admin.ts                       # isAdmin(), requireAdmin(), requireAuth()
    ├── middleware/
    │   └── 02.admin.ts                    # Injeta isAdmin no contexto
    └── api/usuarios/
        ├── perfil/
        │   ├── me.get.ts                  # GET perfil
        │   ├── me.put.ts                  # PUT atualizar perfil
        │   └── upload-foto.post.ts        # POST upload foto
        └── admin/
            ├── index.get.ts               # GET listar usuarios
            ├── index.post.ts              # POST criar usuario
            ├── [id].get.ts                # GET detalhes
            ├── [id].put.ts                # PUT atualizar
            ├── [id].delete.ts             # DELETE remover
            ├── signup.post.ts             # POST signup (publico)
            ├── grupos/
            │   ├── index.get.ts           # GET listar grupos
            │   ├── index.post.ts          # POST criar grupo
            │   ├── [id].get.ts            # GET detalhes
            │   ├── [id].put.ts            # PUT atualizar
            │   ├── [id].delete.ts         # DELETE remover
            │   ├── [id].usuarios.[userId].post.ts    # POST add usuario
            │   └── [id].usuarios.[userId].delete.ts  # DELETE remove usuario
            └── permissoes/
                ├── index.get.ts           # GET listar
                ├── index.post.ts          # POST criar
                ├── [id].get.ts            # GET detalhes
                ├── [id].put.ts            # PUT atualizar
                ├── [id].delete.ts         # DELETE remover
                ├── usuarios.[userId].add.[permId].post.ts    # POST add
                └── usuarios.[userId].remove.[permId].delete.ts # DELETE remove
```

## Protecao de Rotas

```vue
<script setup>
// Pagina que requer admin
definePageMeta({
  middleware: 'auth-guard',
  requiredGroups: ['administradores']
})
</script>
```

```vue
<script setup>
// Pagina que requer apenas auth
definePageMeta({
  middleware: 'auth-guard'
})
</script>
```

## Endpoints BFF

### Perfil (self-service)

| Metodo | Rota                               | Descricao        |
| ------ | ---------------------------------- | ---------------- |
| GET    | `/api/usuarios/perfil/me`          | Dados do perfil  |
| PUT    | `/api/usuarios/perfil/me`          | Atualizar perfil |
| POST   | `/api/usuarios/perfil/upload-foto` | Upload foto      |

### Admin - Usuarios

| Metodo | Rota                         | Descricao       |
| ------ | ---------------------------- | --------------- |
| GET    | `/api/usuarios/admin`        | Listar usuarios |
| POST   | `/api/usuarios/admin`        | Criar usuario   |
| GET    | `/api/usuarios/admin/:id`    | Detalhes        |
| PUT    | `/api/usuarios/admin/:id`    | Atualizar       |
| DELETE | `/api/usuarios/admin/:id`    | Remover         |
| POST   | `/api/usuarios/admin/signup` | Signup publico  |

### Admin - Grupos

| Metodo | Rota                                           | Descricao      |
| ------ | ---------------------------------------------- | -------------- |
| GET    | `/api/usuarios/admin/grupos`                   | Listar grupos  |
| POST   | `/api/usuarios/admin/grupos`                   | Criar grupo    |
| GET    | `/api/usuarios/admin/grupos/:id`               | Detalhes       |
| PUT    | `/api/usuarios/admin/grupos/:id`               | Atualizar      |
| DELETE | `/api/usuarios/admin/grupos/:id`               | Remover        |
| POST   | `/api/usuarios/admin/grupos/:id/usuarios/:uid` | Add usuario    |
| DELETE | `/api/usuarios/admin/grupos/:id/usuarios/:uid` | Remove usuario |

### Admin - Permissoes

| Metodo | Rota                                                       | Descricao  |
| ------ | ---------------------------------------------------------- | ---------- |
| GET    | `/api/usuarios/admin/permissoes`                           | Listar     |
| POST   | `/api/usuarios/admin/permissoes`                           | Criar      |
| GET    | `/api/usuarios/admin/permissoes/:id`                       | Detalhes   |
| PUT    | `/api/usuarios/admin/permissoes/:id`                       | Atualizar  |
| DELETE | `/api/usuarios/admin/permissoes/:id`                       | Remover    |
| POST   | `/api/usuarios/admin/permissoes/usuarios/:uid/add/:pid`    | Add a user |
| DELETE | `/api/usuarios/admin/permissoes/usuarios/:uid/remove/:pid` | Remove     |

## Integracao com Kubb

### Tipos Usados

```typescript
// Re-exportados em app/composables/types.ts
import type { UsuarioSchemaDetalhes } from '~/generated/sinapse/types/UsuarioSchemaDetalhes'
import type { GrupoSchemaDetalhes } from '~/generated/sinapse/types/GrupoSchemaDetalhes'
import type { PermissaoAcessoSchemaList } from '~/generated/sinapse/types/PermissaoAcessoSchemaList'
```

### Schemas Zod para Validacao

```typescript
// Usados nos endpoints BFF
import { usuarioSchemaCreateSchema } from '~/generated/sinapse/zod/usuarioSchemaCreateSchema'
import { grupoSchemaCreateSchema } from '~/generated/sinapse/zod/grupoSchemaCreateSchema'
import { permissaoAcessoSchemaCreateSchema } from '~/generated/sinapse/zod/permissaoAcessoSchemaCreateSchema'
```

## Stores

### useUsuariosStore

- **Estado:** perfil, items, total, page, isLoading, error
- **Actions:** fetchPerfil, updatePerfil, uploadFoto, fetchAll, criar, atualizar, remover

### useGruposStore

- **Estado:** items, selectedGrupo, total, page, isLoading, error
- **Actions:** fetchAll, criar, obter, atualizar, remover, addUsuario, removeUsuario

### usePermissoesStore

- **Estado:** items, isLoading, error
- **Actions:** fetchAll, criar, atualizar, remover, addToUser, removeFromUser

## Server Utils

### `server/utils/admin.ts`

- `isAdmin(event)`: Verifica se usuario e admin
- `requireAdmin(event)`: Lanca 403 se nao admin
- `requireAuth(event)`: Retorna accessToken ou lanca 401
