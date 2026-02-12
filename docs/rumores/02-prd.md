# PRD - Layer de Notícias Epidemiológicas (Rumores)

Product Requirements Document para a layer `4-noticias` do Detecta Alerta.

> Data: 2026-02-12

---

## Visão

Disponibilizar um painel de vigilância epidemiológica baseado em notícias/rumores coletados automaticamente pela API Sinapse, permitindo que profissionais de saúde e público geral acompanhem surtos, tendências e alertas epidemiológicos no Brasil.

---

## Público-alvo

| Persona                   | Descrição                               | Acesso                                              |
| ------------------------- | --------------------------------------- | --------------------------------------------------- |
| **Público geral**         | Cidadãos, jornalistas, pesquisadores    | Feed de notícias (listagem)                         |
| **Profissional de saúde** | Epidemiologistas, agentes de vigilância | Detalhes completos, filtros avançados, estatísticas |
| **Administrador**         | Equipe do Detecta Alerta                | Moderação (alterar status, editar classificação)    |

---

## Modelo de acesso

| Funcionalidade                                          | Público | Autenticado | Admin |
| ------------------------------------------------------- | ------- | ----------- | ----- |
| Feed de notícias (listagem com resumo)                  | Sim     | Sim         | Sim   |
| Filtros básicos (doença, estado, data)                  | Sim     | Sim         | Sim   |
| Detalhes completos da notícia                           | Não     | Sim         | Sim   |
| Filtros avançados (relevância, tipo evento, One Health) | Não     | Sim         | Sim   |
| Dashboard de estatísticas                               | Não     | Sim         | Sim   |
| Mapa epidemiológico                                     | Não     | Sim         | Sim   |
| Alertas epidemiológicos                                 | Não     | Sim         | Sim   |
| Notícias relacionadas                                   | Não     | Sim         | Sim   |
| Moderação (alterar status, editar)                      | Não     | Não         | Sim   |

---

## Features

### F1. Feed de notícias (público)

**Descrição:** Página principal da layer. Lista de notícias epidemiológicas com cards resumidos, ordenadas por data de coleta (mais recentes primeiro).

**API:** `GET /api/v1/noticias/` → BFF `GET /api/noticias/`

**Campos por card:**

- `titulo` - título principal
- `descricao` ou truncar `conteudo` (primeiros ~150 chars)
- `doenca_principal` ou `doencas[0].name` - badge de doença
- `localizacoes[0]` - badge de localização (estado/cidade)
- `fonte` + `icone_fonte` - ícone e nome da fonte
- `url_imagem` - imagem de capa (se disponível)
- `data_publicacao` ou `data_coleta` - data relativa ("há 2 horas")
- `relevancia` - indicador visual discreto

**Comportamento:**

- Paginação cursor-based com infinite scroll ou botão "carregar mais"
- Sem dados sensíveis ou epidemiológicos detalhados
- Clicar no card: se autenticado → detalhe; se não → prompt de login

**Filtros visíveis (público):**

- `search_term` - busca textual
- `doencas` - select/combobox com doenças (lookup `/operacoes/doencas`)
- `states` - select com estados brasileiros
- `data_coleta_de` / `data_coleta_ate` - range de datas

---

### F2. Detalhe da notícia (autenticado)

**Descrição:** Página com todos os dados de uma notícia específica.

**API:** `GET /api/v1/noticias/{unique_id}` → BFF `GET /api/noticias/:uniqueId`

**Seções:**

1. **Header:** título, título epidemiológico (se diferente), badges (doença, localização, One Health, tipo evento)
2. **Conteúdo:** texto completo da notícia
3. **Metadados:** fonte (com link), data publicação, data evento, data coleta, categoria, tipo contagem
4. **Dados epidemiológicos:** número de casos, número de mortes, relevância (score visual)
5. **Classificação:** classificação One Health, tipo evento, tipo contagem
6. **Relações:** lista de doenças (com CID), sintomas, localizações (com mapa pontual)
7. **Notícias relacionadas:** cards compactos (via endpoint `/relacionadas`)
8. **Fonte original:** link externo para matéria original (`url_fonte`)

**Comportamento:**

- Middleware `auth-guard` na rota
- Breadcrumb: Home > Notícias > [título truncado]
- Botão "voltar" para feed com scroll position preservado
- Compartilhar (copiar link)

---

### F3. Filtros avançados (autenticado)

**Descrição:** Filtros adicionais disponíveis apenas para usuários autenticados, em painel expansível.

**Filtros adicionais:**

- `relevancia_minima` - slider (0 a 10)
- `tipo_evento` - select com tipos
- `categoria` - select com categorias
- `classificacao_onehealth` - select: Humana, Animal, Ambiental
- `sintomas` - multi-select (lookup `/operacoes/sintomas`)
- `fonte` - multi-select com fontes
- `localizacoes` - multi-select (lookup `/operacoes/localizacoes`)
- `data_evento_de` / `data_evento_ate` - range de data do evento
- `status` - select: active, archived, flagged (admin-only)

**Comportamento:**

- Indicador de "N filtros ativos" (ref BEACON)
- Limpar todos os filtros
- Filtros persistem na URL (query params) para compartilhamento
- Debounce na busca textual (500ms)

---

### F4. Dashboard de estatísticas (autenticado)

**Descrição:** Painel analítico com visualizações dos dados epidemiológicos.

**Seções:**

#### 4a. Resumo geral

**API:** `GET /api/v1/noticias/estatisticas/resumo` → BFF `GET /api/noticias/estatisticas/resumo`

- Cards com totais: total de notícias, ativas, arquivadas, sinalizadas
- Top 5 doenças (gráfico de barras horizontal)
- Top 5 localizações (gráfico de barras horizontal)
- Top 5 fontes (lista com contagem)
- Período dos dados

#### 4b. Tendências temporais

**API:** `GET /api/v1/noticias/estatisticas/temporal` → BFF `GET /api/noticias/estatisticas/temporal`

- Gráfico de linha: quantidade de notícias ao longo do tempo
- Seletor de granularidade: dia / semana / mês
- Seletor de período (presets: 7d, 30d, 90d, custom)
- Indicador de tendência (crescente/decrescente/estável com %)
- Doenças em alta (lista com variação)
- Localizações em destaque

#### 4c. Distribuição geográfica

**API:** `GET /api/v1/noticias/estatisticas/geografica` → BFF `GET /api/noticias/estatisticas/geografica`

- Mapa coroplético do Brasil por estado (sombreamento por quantidade)
- Tabela complementar: estado, quantidade, %, relevância média, principais doenças
- Toggle estadual/municipal
- Concentrações geográficas identificadas
- Estados sem notícias no período

#### 4d. Alertas epidemiológicos

**API:** `GET /api/v1/noticias/estatisticas/alertas` → BFF `GET /api/noticias/estatisticas/alertas`

- Lista de alertas com severidade color-coded (alta=vermelho, média=amarelo, baixa=azul)
- Cada alerta: tipo, título, descrição, localizações, doenças, recomendação
- Filtro por severidade mínima
- Indicadores monitorados: valor atual vs esperado, variação %

---

### F5. Moderação (admin)

**Descrição:** Funcionalidades de administração para moderar notícias.

**Ações:**

- Alterar status: `active` ↔ `archived` ↔ `flagged`
- Editar classificação epidemiológica (doença principal, tipo evento, categoria, One Health)
- Visualizar notícias por status (filtro `status` na listagem)

**API:**

- `PUT /api/v1/noticias/{unique_id}` → BFF `PUT /api/noticias/admin/:uniqueId`
- `DELETE /api/v1/noticias/{unique_id}` → BFF `DELETE /api/noticias/admin/:uniqueId`

**Comportamento:**

- Middleware `auth-guard` + `requiredGroups: ['administradores']`
- Ações inline na tabela de notícias (dropdown menu)
- Dialog de confirmação para delete/archive
- Toast de feedback

---

## Fora do escopo (V1)

| Feature                              | Motivo                                      | Versão futura    |
| ------------------------------------ | ------------------------------------------- | ---------------- |
| Criação manual de notícias           | Notícias vêm da API Sinapse (scraping + IA) | V2 se necessário |
| Alertas por email/push               | Requer sistema de notificação               | V2               |
| Mapa interativo com pins individuais | Complexidade; mapa coroplético é suficiente | V2               |
| Assistente conversacional            | Complexidade não justificada                | V3               |
| Knowledge graphs                     | Infraestrutura adicional                    | V3               |
| Exportação de dados (CSV/Excel)      | Pode ser adicionado depois                  | V2               |
| Submissão de relatos pelo usuário    | Modelo diferente de dados                   | V3               |

---

## Requisitos não-funcionais

| Requisito          | Especificação                                               |
| ------------------ | ----------------------------------------------------------- |
| **Performance**    | Feed carrega em <2s, estatísticas em <3s                    |
| **SEO**            | Feed público indexável, SSR completo, useSeoPage            |
| **Acessibilidade** | WCAG 2.1 AA mínimo                                          |
| **Responsividade** | Mobile-first, breakpoints: sm/md/lg/xl                      |
| **Segurança**      | BFF pattern, tokens httpOnly, Zod validation, rate limiting |
| **Paginação**      | Cursor-based (suportado pela API)                           |
| **Cache**          | useFetch com key para revalidação, stale-while-revalidate   |
| **i18n**           | Apenas pt-BR (V1)                                           |

---

## Métricas de sucesso

| Métrica                         | Meta                   |
| ------------------------------- | ---------------------- |
| Tempo de carregamento do feed   | < 2s (LCP)             |
| Taxa de interação com filtros   | > 30% dos visitantes   |
| Bounce rate do feed             | < 60%                  |
| Conversão feed → detalhe        | > 15%                  |
| Uso de filtros avançados (auth) | > 50% dos autenticados |

---

## Dependências

| Dependência                                  | Status       |
| -------------------------------------------- | ------------ |
| API Sinapse v0.5.5 (endpoints de notícias)   | Disponível   |
| Kubb types/zod gerados                       | Atualizado   |
| Layer 1-auth (autenticação)                  | Implementada |
| Layer 0-base (shadcn-vue, composables)       | Implementada |
| Biblioteca de gráficos (Chart.js ou similar) | A definir    |
| Biblioteca de mapas (para coroplético)       | A definir    |

---

## Prioridade de implementação

| Ordem | Feature                        | Esforço | Valor |
| ----- | ------------------------------ | ------- | ----- |
| 1     | F1. Feed de notícias (público) | Médio   | Alto  |
| 2     | F2. Detalhe da notícia         | Médio   | Alto  |
| 3     | F3. Filtros avançados          | Médio   | Médio |
| 4     | F4d. Alertas epidemiológicos   | Baixo   | Alto  |
| 5     | F4a. Resumo geral              | Baixo   | Médio |
| 6     | F4b. Tendências temporais      | Alto    | Médio |
| 7     | F4c. Distribuição geográfica   | Alto    | Médio |
| 8     | F5. Moderação                  | Médio   | Baixo |
