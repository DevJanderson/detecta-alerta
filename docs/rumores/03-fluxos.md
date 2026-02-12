# Fluxos de Usuário - Layer de Notícias

Mapeamento dos fluxos de usuário para a layer `4-noticias`.

> Data: 2026-02-12

---

## Fluxo 1: Visitante navega pelo feed público

```
[Homepage]
    │
    ▼
[Feed de Notícias] (/noticias)
    │
    ├── Scroll → Carrega mais notícias (cursor pagination)
    │
    ├── Filtrar por doença → Select com lookup /operacoes/doencas
    ├── Filtrar por estado → Select com estados BR
    ├── Filtrar por data → Date range picker
    ├── Buscar texto → Input com debounce 500ms
    │
    ├── Clicar em card de notícia
    │       │
    │       ├── Autenticado? → [Detalhe da Notícia] (/noticias/:uniqueId)
    │       │
    │       └── Não autenticado? → [Prompt de Login]
    │               │
    │               ├── Fazer login → Redirect para detalhe
    │               └── Cancelar → Volta ao feed
    │
    └── Clicar em badge de doença/estado → Aplica filtro correspondente
```

**Pontos de atenção:**

- Feed é SSR para SEO (indexável)
- Cards mostram apenas dados públicos (sem dados epidemiológicos detalhados)
- URL preserva filtros via query params (`/noticias?doencas=dengue&states=SP`)
- Infinite scroll ou botão "carregar mais" (cursor-based)

---

## Fluxo 2: Usuário autenticado explora detalhes

```
[Feed de Notícias] (/noticias)
    │
    ▼
[Detalhe da Notícia] (/noticias/:uniqueId)
    │
    ├── Seção: Conteúdo completo
    │
    ├── Seção: Dados epidemiológicos
    │       ├── Casos: N | Mortes: N
    │       ├── Relevância: [score visual]
    │       └── Classificação One Health: [badge]
    │
    ├── Seção: Localizações
    │       └── Mapa pontual (lat/lng da localização)
    │
    ├── Seção: Doenças e Sintomas
    │       ├── Badges de doenças (com CID quando disponível)
    │       └── Badges de sintomas
    │
    ├── Seção: Notícias relacionadas
    │       └── Cards compactos (NoticiaResumida)
    │               └── Clicar → Navega para outra notícia
    │
    ├── Ação: Abrir fonte original → Link externo (url_fonte)
    ├── Ação: Compartilhar → Copia URL
    └── Ação: Voltar → Feed (scroll position preservado)
```

**Pontos de atenção:**

- Middleware `auth-guard` protege a rota
- Breadcrumb: Home > Notícias > [título truncado a ~60 chars]
- Notícias relacionadas vêm do endpoint `/relacionadas` (cluster semântico ou similaridade)
- Link externo abre em nova aba

---

## Fluxo 3: Usuário autenticado usa filtros avançados

```
[Feed de Notícias] (/noticias)
    │
    ├── Painel de filtros básicos (sempre visível)
    │       ├── Busca textual
    │       ├── Doença
    │       ├── Estado
    │       └── Data
    │
    └── [Expandir filtros avançados] (autenticado)
            │
            ├── Relevância mínima → Slider 0-10
            ├── Tipo de evento → Select
            ├── Categoria → Select
            ├── Classificação One Health → Select (Humana/Animal/Ambiental)
            ├── Sintomas → Multi-select (lookup /operacoes/sintomas)
            ├── Fontes → Multi-select
            ├── Localizações → Multi-select (lookup /operacoes/localizacoes)
            └── Data do evento → Date range
            │
            ├── Indicador: "N filtros ativos"
            ├── Ação: Limpar filtros → Reset todos
            └── Resultados atualizam em tempo real (debounce)
```

**Pontos de atenção:**

- Filtros avançados ficam ocultos para visitante não-autenticado
- Lookups (doenças, sintomas, localizações) são carregados uma vez e cacheados
- Todos os filtros refletem na URL para compartilhamento
- Estado dos filtros persiste durante navegação feed ↔ detalhe

---

## Fluxo 4: Usuário acessa dashboard de estatísticas

```
[Navegação]
    │
    ▼
[Dashboard] (/noticias/estatisticas)
    │
    ├── Tab: Resumo
    │       ├── Cards: total, ativas, arquivadas, sinalizadas
    │       ├── Top 5 doenças (barras horizontal)
    │       ├── Top 5 localizações (barras horizontal)
    │       └── Top 5 fontes (lista)
    │
    ├── Tab: Tendências
    │       ├── Seletor de período: 7d | 30d | 90d | custom
    │       ├── Seletor de granularidade: dia | semana | mês
    │       ├── Gráfico de linha (quantidade × tempo)
    │       ├── Indicador de tendência: ↑ crescente 15%
    │       ├── Doenças em alta (lista com variação %)
    │       └── Localizações em destaque
    │
    ├── Tab: Geográfico
    │       ├── Mapa coroplético do Brasil (por estado)
    │       ├── Toggle: estadual | municipal
    │       ├── Tabela: estado, quantidade, %, relevância
    │       ├── Concentrações identificadas
    │       └── Estados sem notícias
    │
    └── Tab: Alertas
            ├── Filtro por severidade: todas | alta | média | baixa
            ├── Lista de alertas (color-coded por severidade)
            │       ├── Tipo + título
            │       ├── Descrição
            │       ├── Localizações e doenças (badges)
            │       ├── Recomendação
            │       └── Quantidade de notícias relacionadas
            └── Indicadores monitorados
                    └── Valor atual vs esperado (gauge ou barra)
```

**Pontos de atenção:**

- Middleware `auth-guard` protege a rota
- Tabs como navegação principal (não sub-rotas)
- Período selecionado persiste entre tabs
- Loading state individual por seção (paralelo)
- Filtros de doença/estado aplicados no dashboard filtram todas as seções

---

## Fluxo 5: Admin modera notícias

```
[Feed de Notícias com filtro status] (/noticias?status=flagged)
    │
    ▼
[Card de notícia com ações admin]
    │
    ├── Dropdown menu (3 dots)
    │       ├── Alterar status → Dialog
    │       │       ├── active → archived
    │       │       ├── active → flagged
    │       │       ├── archived → active
    │       │       └── flagged → active
    │       │       └── Confirmar → PUT /api/noticias/admin/:id → Toast sucesso
    │       │
    │       ├── Editar classificação → Dialog
    │       │       ├── Doença principal → Select
    │       │       ├── Tipo de evento → Select
    │       │       ├── Categoria → Select
    │       │       ├── Classificação One Health → Select
    │       │       └── Salvar → PUT /api/noticias/admin/:id → Toast sucesso
    │       │
    │       └── Excluir (soft delete) → Dialog confirmação
    │               └── Confirmar → DELETE /api/noticias/admin/:id → Toast + remove do feed
    │
    └── No detalhe: mesmas ações no header da página
```

**Pontos de atenção:**

- Ações admin visíveis apenas para grupo `administradores`
- PUT e DELETE passam pelo BFF admin (com `requireAdmin`)
- Confirmação obrigatória para ações destrutivas
- Feedback via toast (componente shadcn)
- Filtro `status` só disponível para admin

---

## Mapa de rotas

| Rota                     | Acesso  | Página                 | Feature |
| ------------------------ | ------- | ---------------------- | ------- |
| `/noticias`              | Público | Feed de notícias       | F1      |
| `/noticias/:uniqueId`    | Auth    | Detalhe da notícia     | F2      |
| `/noticias/estatisticas` | Auth    | Dashboard estatísticas | F4      |

> Admin não tem rota separada - as ações ficam inline no feed e detalhe.

---

## Estados de UI

### Loading

| Contexto          | Comportamento                     |
| ----------------- | --------------------------------- |
| Feed inicial      | Skeleton cards (6 placeholders)   |
| Carregar mais     | Spinner no final da lista         |
| Detalhe           | Skeleton de página completa       |
| Estatísticas      | Skeleton por seção (independente) |
| Filtros (lookups) | Spinner no select                 |

### Erro

| Contexto               | Comportamento                                                            |
| ---------------------- | ------------------------------------------------------------------------ |
| Feed falha             | Alert com retry                                                          |
| Detalhe não encontrado | 404 page                                                                 |
| Estatísticas falham    | Alert por seção com retry                                                |
| Filtro sem resultados  | Empty state: "Nenhuma notícia encontrada" com sugestão de limpar filtros |

### Empty

| Contexto                  | Comportamento                                                  |
| ------------------------- | -------------------------------------------------------------- |
| Feed vazio (sem filtro)   | Ilustração + "Nenhuma notícia disponível"                      |
| Feed vazio (com filtro)   | "Nenhum resultado para os filtros selecionados" + botão limpar |
| Sem notícias relacionadas | Seção oculta                                                   |
| Sem alertas               | "Nenhum alerta ativo no período"                               |
