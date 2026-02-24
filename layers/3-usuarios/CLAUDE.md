# Layer Usuarios - CLAUDE.md

Gestao de perfil (self-service), administracao de usuarios, grupos e permissoes.

## Arquitetura

```
Cliente -> BFF (Nuxt Server) -> API Sinapse
```

Todas as operacoes passam pelo BFF. Endpoints admin requerem grupo `administradores` (verificado pelo middleware `02.admin.ts`).

## Estrutura

```
layers/3-usuarios/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── UsuariosPerfilForm.vue         # Form editar perfil (mascara telefone via vMaska)
│   │   ├── UsuariosPerfilFoto.vue         # Upload foto (preview local, limite 2MB)
│   │   ├── UsuariosAdminTable.vue         # Tabela usuarios (colunas: nome, email, status, grupos)
│   │   ├── UsuariosAdminFilters.vue       # Filtros busca (search com debounce, select status)
│   │   ├── UsuariosAdminForm.vue          # Dialog criar/editar (modo 'create' | 'edit')
│   │   ├── UsuariosAdminDetail.vue        # Card detalhes (dados, grupos, permissoes, datas)
│   │   ├── GruposTable.vue                # Tabela grupos
│   │   ├── GruposForm.vue                 # Dialog criar/editar grupo
│   │   ├── GruposMembros.vue             # Gerenciar membros (busca + add/remove)
│   │   ├── PermissoesTable.vue            # Tabela permissoes
│   │   ├── PermissoesForm.vue             # Dialog criar/editar permissao
│   │   └── PermissoesUsuarioManager.vue   # Checkboxes para atribuir permissoes a usuario
│   │
│   ├── composables/
│   │   ├── types.ts                       # Re-export Kubb + tipos BFF
│   │   ├── useUsuariosApi.ts              # Service: perfil + admin + signup
│   │   ├── useUsuariosStore.ts            # Pinia: CRUD usuarios + perfil
│   │   ├── useGruposApi.ts                # Service: CRUD grupos + membros
│   │   ├── useGruposStore.ts              # Pinia: CRUD grupos
│   │   ├── usePermissoesApi.ts            # Service: CRUD permissoes + atribuicao
│   │   └── usePermissoesStore.ts          # Pinia: CRUD permissoes (sem paginacao)
│   │
│   └── pages/
│       ├── perfil/
│       │   └── index.vue                  # /perfil (auth-guard, abas: dados + foto)
│       └── admin/
│           ├── usuarios/
│           │   ├── index.vue              # /admin/usuarios (listagem paginada + filtros)
│           │   └── [id].vue               # /admin/usuarios/:id (detalhe + edit + delete)
│           ├── grupos/
│           │   ├── index.vue              # /admin/grupos (listagem paginada)
│           │   └── [id].vue               # /admin/grupos/:id (detalhes + membros)
│           └── permissoes/
│               └── index.vue              # /admin/permissoes (listagem simples)
│
└── server/
    ├── utils/
    │   └── admin.ts                       # requireAdmin(event), requireAuth(event)
    ├── middleware/
    │   └── 02.admin.ts                    # Injeta isAdmin no contexto (rotas /api/usuarios/admin/*)
    └── api/usuarios/
        ├── perfil/
        │   ├── me.get.ts                  # GET perfil
        │   ├── me.put.ts                  # PUT atualizar perfil
        │   └── upload-foto.post.ts        # POST upload foto (JPEG/PNG/WebP, max 5MB)
        └── admin/
            ├── index.get.ts               # GET listar usuarios (paginado)
            ├── index.post.ts              # POST criar usuario
            ├── [id].get.ts                # GET detalhes
            ├── [id].put.ts                # PUT atualizar
            ├── [id].delete.ts             # DELETE remover
            ├── grupos/
            │   ├── index.get.ts           # GET listar grupos (paginado)
            │   ├── index.post.ts          # POST criar grupo
            │   ├── [id].get.ts            # GET detalhes
            │   ├── [id].put.ts            # PUT atualizar
            │   ├── [id].delete.ts         # DELETE remover
            │   ├── [id].usuarios.[userId].post.ts    # POST add usuario ao grupo
            │   └── [id].usuarios.[userId].delete.ts  # DELETE remove usuario do grupo
            └── permissoes/
                ├── index.get.ts           # GET listar (array, sem paginacao)
                ├── index.post.ts          # POST criar
                ├── [id].get.ts            # GET detalhes
                ├── [id].put.ts            # PUT atualizar
                ├── [id].delete.ts         # DELETE remover
                ├── usuarios.[userId].add.[permId].post.ts    # POST add permissao a usuario
                └── usuarios.[userId].remove.[permId].delete.ts # DELETE remove permissao
```

> **Nota:** Dialogs de exclusao usam o componente generico `DeleteConfirmDialog` da layer `0-base`, nao ha componentes _DeleteDialog_ nesta layer.

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

## Endpoints BFF

### Perfil (self-service, requer auth)

| Metodo | Rota                               | Descricao                            |
| ------ | ---------------------------------- | ------------------------------------ |
| GET    | `/api/usuarios/perfil/me`          | Dados do perfil                      |
| PUT    | `/api/usuarios/perfil/me`          | Atualizar perfil                     |
| POST   | `/api/usuarios/perfil/upload-foto` | Upload foto (JPEG/PNG/WebP, max 5MB) |

### Admin - Usuarios (requer grupo `administradores`)

| Metodo | Rota                      | Descricao                                                                                 |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------- |
| GET    | `/api/usuarios/admin`     | Listar (paginado, filtros: page, size, nome, email, admin, ativo, cidade, estado, search) |
| POST   | `/api/usuarios/admin`     | Criar usuario                                                                             |
| GET    | `/api/usuarios/admin/:id` | Detalhes                                                                                  |
| PUT    | `/api/usuarios/admin/:id` | Atualizar                                                                                 |
| DELETE | `/api/usuarios/admin/:id` | Remover                                                                                   |

### Admin - Grupos

| Metodo | Rota                                           | Descricao                                             |
| ------ | ---------------------------------------------- | ----------------------------------------------------- |
| GET    | `/api/usuarios/admin/grupos`                   | Listar (paginado, filtros: page, size, search, ativo) |
| POST   | `/api/usuarios/admin/grupos`                   | Criar grupo                                           |
| GET    | `/api/usuarios/admin/grupos/:id`               | Detalhes                                              |
| PUT    | `/api/usuarios/admin/grupos/:id`               | Atualizar                                             |
| DELETE | `/api/usuarios/admin/grupos/:id`               | Remover                                               |
| POST   | `/api/usuarios/admin/grupos/:id/usuarios/:uid` | Add usuario                                           |
| DELETE | `/api/usuarios/admin/grupos/:id/usuarios/:uid` | Remove usuario                                        |

### Admin - Permissoes

| Metodo | Rota                                                       | Descricao                     |
| ------ | ---------------------------------------------------------- | ----------------------------- |
| GET    | `/api/usuarios/admin/permissoes`                           | Listar (array, sem paginacao) |
| POST   | `/api/usuarios/admin/permissoes`                           | Criar                         |
| GET    | `/api/usuarios/admin/permissoes/:id`                       | Detalhes                      |
| PUT    | `/api/usuarios/admin/permissoes/:id`                       | Atualizar                     |
| DELETE | `/api/usuarios/admin/permissoes/:id`                       | Remover                       |
| POST   | `/api/usuarios/admin/permissoes/usuarios/:uid/add/:pid`    | Add a user                    |
| DELETE | `/api/usuarios/admin/permissoes/usuarios/:uid/remove/:pid` | Remove                        |

## Server Middleware (`02.admin.ts`)

Executa apos `01.auth.ts`. So age em rotas `/api/usuarios/admin/*`. Chama `/usuarios/me` na Sinapse e verifica grupo `administradores`. Injeta `event.context.isAdmin: boolean`.

## Server Utils (`admin.ts`)

| Funcao                | O que faz                                      |
| --------------------- | ---------------------------------------------- |
| `requireAdmin(event)` | Lanca 401 se nao autenticado, 403 se nao admin |
| `requireAuth(event)`  | Retorna accessToken ou lanca 401               |

## Stores

### useUsuariosStore

- **Estado:** perfil, items (shallowRef), selectedUsuario, total, page, size, pages, isLoading, error
- **Getters:** hasNextPage, hasPrevPage
- **Actions:** fetchPerfil, updatePerfil, uploadFoto, fetchAll, criar, obter, atualizar, remover, signup, clearError

### useGruposStore

- **Estado:** items (shallowRef), selectedGrupo, total, page, size, pages, isLoading, error
- **Getters:** hasNextPage, hasPrevPage
- **Actions:** fetchAll, criar, obter, atualizar, remover, addUsuario, removeUsuario, clearError

### usePermissoesStore

- **Estado:** items (shallowRef), isLoading, error (sem paginacao)
- **Actions:** fetchAll, criar, obter (retorna item ou null), atualizar, remover, addToUser, removeFromUser, clearError
