# Layer Rumores - CLAUDE.md

Rumores epidemiologicos: feed publico, detalhe autenticado, filtros, estatisticas e moderacao admin.

## Arquitetura

```
Cliente -> BFF (Nuxt Server) -> API Sinapse (/noticias)
```

A API Sinapse usa o termo "noticias" internamente. O BFF expoe como `/api/rumores/`.

## Estrutura

```
layers/4-rumores/
├── nuxt.config.ts
├── CLAUDE.md
│
├── app/
│   ├── components/
│   │   ├── RumoresCard.vue               # Card individual (feed)
│   │   ├── RumoresFeed.vue               # Lista + infinite scroll
│   │   ├── RumoresFilters.vue            # Filtros basicos (publico)
│   │   ├── RumoresDetalhe.vue            # Conteudo completo
│   │   ├── RumoresRelacionados.vue       # Cards relacionados
│   │   └── RumoresBadges.vue             # Badges doenca/localizacao
│   │
│   ├── composables/
│   │   ├── types.ts                      # Re-export Kubb + tipos BFF
│   │   ├── useRumoresApi.ts              # Service: chamadas ao BFF
│   │   └── useRumoresStore.ts            # Pinia: estado + filtros + paginacao
│   │
│   └── pages/rumores/
│       ├── index.vue                     # /rumores (feed publico)
│       ├── [uniqueId].vue                # /rumores/:uniqueId (detalhe, auth)
│       └── estatisticas.vue              # /rumores/estatisticas (dashboard, auth)
│
└── server/api/rumores/
    ├── index.get.ts                      # GET /api/rumores/
    ├── [uniqueId].get.ts                 # GET /api/rumores/:uniqueId
    ├── [uniqueId].relacionadas.get.ts    # GET /api/rumores/:uniqueId/relacionadas
    ├── estatisticas/
    │   ├── resumo.get.ts
    │   ├── temporal.get.ts
    │   ├── geografica.get.ts
    │   └── alertas.get.ts
    ├── operacoes/
    │   ├── doencas.get.ts
    │   ├── sintomas.get.ts
    │   └── localizacoes.get.ts
    └── admin/
        ├── [uniqueId].put.ts
        └── [uniqueId].delete.ts
```

## Protecao de Rotas

Todas as paginas requerem autenticacao (API Sinapse exige token em todos os endpoints de noticias).

```vue
<script setup>
definePageMeta({ middleware: 'auth-guard' })
</script>
```

## Endpoints BFF

### Leitura (autenticada)

Todos os endpoints requerem token (API Sinapse exige OAuth2 em todos os endpoints de noticias).

| Metodo | Rota                                   | API Sinapse                              |
| ------ | -------------------------------------- | ---------------------------------------- |
| GET    | `/api/rumores/`                        | `GET /noticias/`                         |
| GET    | `/api/rumores/:uniqueId`               | `GET /noticias/{unique_id}`              |
| GET    | `/api/rumores/:uniqueId/relacionadas`  | `GET /noticias/{unique_id}/relacionadas` |
| GET    | `/api/rumores/operacoes/doencas`       | `GET /noticias/operacoes/doencas`        |
| GET    | `/api/rumores/operacoes/sintomas`      | `GET /noticias/operacoes/sintomas`       |
| GET    | `/api/rumores/operacoes/localizacoes`  | `GET /noticias/operacoes/localizacoes`   |
| GET    | `/api/rumores/estatisticas/resumo`     | `GET /noticias/estatisticas/resumo`      |
| GET    | `/api/rumores/estatisticas/temporal`   | `GET /noticias/estatisticas/temporal`    |
| GET    | `/api/rumores/estatisticas/geografica` | `GET /noticias/estatisticas/geografica`  |
| GET    | `/api/rumores/estatisticas/alertas`    | `GET /noticias/estatisticas/alertas`     |

### Admin

| Metodo | Rota                           | API Sinapse                    |
| ------ | ------------------------------ | ------------------------------ |
| PUT    | `/api/rumores/admin/:uniqueId` | `PUT /noticias/{unique_id}`    |
| DELETE | `/api/rumores/admin/:uniqueId` | `DELETE /noticias/{unique_id}` |

## Integracao com Kubb

```typescript
// Tipos
import type { Noticia } from '~/generated/sinapse/types/Noticia'
import type { NoticiaListResponse } from '~/generated/sinapse/types/NoticiaListResponse'

// Schemas Zod
import { noticiaSchema } from '~/generated/sinapse/zod/noticiaSchema'
import { noticiaListResponseSchema } from '~/generated/sinapse/zod/noticiaListResponseSchema'
```
