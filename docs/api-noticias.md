# API Notícias (Rumores) - Referência

Documentação da API de notícias/rumores epidemiológicos para apoio ao desenvolvimento da layer de rumores.

> Fonte: OpenAPI spec `openapi/sinapse-api.json` (v0.5.5)

---

## Endpoints

### CRUD

| Método | Rota                                        | Descrição                                | Request         | Response                       |
| ------ | ------------------------------------------- | ---------------------------------------- | --------------- | ------------------------------ |
| GET    | `/api/v1/noticias/`                         | Listar notícias (paginação cursor-based) | Query params    | `NoticiaListResponse`          |
| POST   | `/api/v1/noticias/`                         | Criar notícia                            | `NoticiaCreate` | `Noticia`                      |
| GET    | `/api/v1/noticias/{unique_id}`              | Obter por UUID                           | Path param      | `Noticia`                      |
| PUT    | `/api/v1/noticias/{unique_id}`              | Atualizar por UUID                       | `NoticiaUpdate` | `Noticia`                      |
| DELETE | `/api/v1/noticias/{unique_id}`              | Soft delete por UUID                     | Path param      | -                              |
| GET    | `/api/v1/noticias/{unique_id}/relacionadas` | Notícias relacionadas                    | Query params    | `NoticiasRelacionadasResponse` |

### Estatísticas

| Método | Rota                                       | Descrição                      | Response                    |
| ------ | ------------------------------------------ | ------------------------------ | --------------------------- |
| GET    | `/api/v1/noticias/estatisticas/resumo`     | Stats gerais (totais, tops)    | `NoticiaStats`              |
| GET    | `/api/v1/noticias/estatisticas/temporal`   | Análise de tendências no tempo | `AnaliseTemporalNoticias`   |
| GET    | `/api/v1/noticias/estatisticas/geografica` | Distribuição geográfica        | `AnaliseGeograficaNoticias` |
| GET    | `/api/v1/noticias/estatisticas/alertas`    | Alertas epidemiológicos        | `ResumoAlertasNoticias`     |

### Operações / Lookups

| Método | Rota                                      | Descrição                                  |
| ------ | ----------------------------------------- | ------------------------------------------ |
| GET    | `/api/v1/noticias/operacoes/doencas`      | Listar doenças cadastradas                 |
| GET    | `/api/v1/noticias/operacoes/sintomas`     | Listar sintomas cadastrados                |
| GET    | `/api/v1/noticias/operacoes/localizacoes` | Listar localizações cadastradas            |
| POST   | `/api/v1/noticias/operacoes/bulk`         | Criar notícias em massa (com deduplicação) |

---

## Schemas

### Noticia (resposta completa)

Schema de resposta para notícias. Campos traduzidos para português.

#### Identificação

| Campo       | Tipo      | Nullable | Descrição                                             |
| ----------- | --------- | -------- | ----------------------------------------------------- |
| `id`        | `integer` | Não      | ID numérico interno                                   |
| `unique_id` | `string`  | Não      | UUID público (usado nas rotas)                        |
| `status`    | `string`  | Não      | `active`, `archived` ou `flagged` (default: `active`) |

#### Títulos

| Campo                   | Tipo     | Nullable | Descrição                                      |
| ----------------------- | -------- | -------- | ---------------------------------------------- |
| `titulo`                | `string` | Não      | Título principal (max 500 chars)               |
| `titulo_original`       | `string` | Sim      | Título original da matéria jornalística        |
| `titulo_epidemiologico` | `string` | Sim      | Título com foco epidemiológico (gerado por IA) |

#### Conteúdo

| Campo       | Tipo     | Nullable | Descrição                    |
| ----------- | -------- | -------- | ---------------------------- |
| `conteudo`  | `string` | Não      | Conteúdo completo da notícia |
| `descricao` | `string` | Sim      | Descrição resumida           |

#### Fonte

| Campo           | Tipo            | Nullable | Descrição                         |
| --------------- | --------------- | -------- | --------------------------------- |
| `fonte`         | `string`        | Sim      | Nome da fonte (ex: "G1", "Folha") |
| `fonte_oficial` | `string`        | Sim      | Fonte oficial vinculada           |
| `icone_fonte`   | `array<string>` | Sim      | URLs dos ícones/logos das fontes  |
| `url_fonte`     | `string`        | Sim      | URL da matéria original           |
| `url_imagem`    | `string`        | Sim      | URL da imagem de capa             |

#### Classificação epidemiológica

| Campo                     | Tipo     | Nullable | Descrição                                                                                      |
| ------------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------- |
| `categoria`               | `string` | Sim      | Categoria da notícia                                                                           |
| `classificacao_onehealth` | `string` | Sim      | Classificação One Health: `Humana`, `Animal`, `Ambiental`                                      |
| `tipo_evento`             | `string` | Sim      | Tipo do evento epidemiológico                                                                  |
| `doenca_principal`        | `string` | Sim      | Doença principal mencionada                                                                    |
| `tipo_contagem`           | `string` | Sim      | `novos_periodo`, `acumulado_ano`, `acumulado_historico`, `nao_epidemiologico`, `indeterminado` |

#### Dados epidemiológicos

| Campo           | Tipo      | Nullable | Descrição                          |
| --------------- | --------- | -------- | ---------------------------------- |
| `numero_casos`  | `integer` | Sim      | Número de casos mencionados        |
| `numero_mortes` | `integer` | Sim      | Número de mortes mencionadas       |
| `relevancia`    | `number`  | Não      | Score de relevância (default: 0.0) |

#### Relações

| Campo                  | Tipo             | Nullable | Descrição                                         |
| ---------------------- | ---------------- | -------- | ------------------------------------------------- |
| `doencas`              | `array<Doenca>`  | Não      | Doenças associadas (default: [])                  |
| `sintomas`             | `array<Sintoma>` | Não      | Sintomas associados (default: [])                 |
| `localizacoes`         | `array<Regiao>`  | Não      | Localizações associadas (default: [])             |
| `cluster_id`           | `string`         | Sim      | ID do cluster semântico                           |
| `artigos_relacionados` | `array<integer>` | Sim      | IDs de artigos relacionados (similaridade 70-89%) |

#### Datas

| Campo             | Tipo     | Nullable | Descrição                     |
| ----------------- | -------- | -------- | ----------------------------- |
| `data_coleta`     | `string` | Sim      | Data do scraping              |
| `data_publicacao` | `string` | Sim      | Data de publicação original   |
| `data_evento`     | `string` | Sim      | Data do evento epidemiológico |
| `created_at`      | `string` | Não      | Data de criação no sistema    |
| `updated_at`      | `string` | Não      | Última atualização            |
| `deleted_at`      | `string` | Sim      | Data do soft delete           |

---

### NoticiaResumida (listagem de relacionadas)

Versão compacta para cards/listagens.

| Campo          | Tipo            | Nullable | Descrição                                               |
| -------------- | --------------- | -------- | ------------------------------------------------------- |
| `id`           | `integer`       | Não      | ID numérico                                             |
| `unique_id`    | `string`        | Não      | UUID                                                    |
| `titulo`       | `string`        | Não      | Título principal                                        |
| `conteudo`     | `string`        | Não      | Resumo (primeiros 200 chars)                            |
| `relevancia`   | `number`        | Não      | Score de relevância                                     |
| `match_score`  | `number`        | Não      | Score de similaridade (doenças + localizações em comum) |
| `fonte`        | `string`        | Sim      | Nome da fonte                                           |
| `icone_fonte`  | `array<string>` | Sim      | URLs dos ícones                                         |
| `url_imagem`   | `string`        | Sim      | URL da imagem de capa                                   |
| `data_coleta`  | `string`        | Sim      | Data do scraping                                        |
| `doencas`      | `array<string>` | Não      | Nomes das doenças                                       |
| `localizacoes` | `array<string>` | Não      | Nomes das localizações                                  |

---

### Sub-tipos

#### Doenca

| Campo         | Tipo      | Nullable | Descrição      |
| ------------- | --------- | -------- | -------------- |
| `id`          | `integer` | Não      | ID             |
| `name`        | `string`  | Não      | Nome da doença |
| `cid_code`    | `string`  | Sim      | Código CID     |
| `description` | `string`  | Sim      | Descrição      |
| `created_at`  | `string`  | Não      | Criação        |
| `updated_at`  | `string`  | Não      | Atualização    |

#### Sintoma

| Campo         | Tipo      | Nullable | Descrição       |
| ------------- | --------- | -------- | --------------- |
| `id`          | `integer` | Não      | ID              |
| `name`        | `string`  | Não      | Nome do sintoma |
| `description` | `string`  | Sim      | Descrição       |
| `created_at`  | `string`  | Não      | Criação         |
| `updated_at`  | `string`  | Não      | Atualização     |

#### Regiao (localização)

| Campo        | Tipo      | Nullable | Descrição                |
| ------------ | --------- | -------- | ------------------------ |
| `id`         | `integer` | Não      | ID                       |
| `name`       | `string`  | Não      | Nome da localização      |
| `country`    | `string`  | Não      | País (default: "Brasil") |
| `state`      | `string`  | Sim      | Sigla do estado          |
| `city`       | `string`  | Sim      | Nome da cidade           |
| `latitude`   | `number`  | Sim      | Latitude                 |
| `longitude`  | `number`  | Sim      | Longitude                |
| `created_at` | `string`  | Não      | Criação                  |
| `updated_at` | `string`  | Não      | Atualização              |

---

## Paginação (cursor-based)

A listagem de notícias usa paginação por cursor (não offset).

### PaginationInfo

| Campo             | Tipo             | Descrição                     |
| ----------------- | ---------------- | ----------------------------- |
| `limit`           | `integer`        | Limite de itens solicitado    |
| `returned`        | `integer`        | Itens retornados nesta página |
| `has_next`        | `boolean`        | Há próxima página             |
| `has_previous`    | `boolean`        | Há página anterior            |
| `next_cursor`     | `string \| null` | Cursor para próxima página    |
| `previous_cursor` | `string \| null` | Cursor para página anterior   |

### Uso

```
GET /api/v1/noticias/?limit=50
GET /api/v1/noticias/?limit=50&cursor=<next_cursor>
```

---

## Filtros da Listagem

`GET /api/v1/noticias/` aceita os seguintes query params:

| Param                     | Tipo            | Descrição                            |
| ------------------------- | --------------- | ------------------------------------ |
| `cursor`                  | `string`        | Cursor para paginação                |
| `limit`                   | `integer`       | Itens por página (default: 50)       |
| `search_term`             | `string`        | Busca textual                        |
| `doencas`                 | `array<string>` | Filtrar por doenças                  |
| `sintomas`                | `array<string>` | Filtrar por sintomas                 |
| `localizacoes`            | `array<string>` | Filtrar por localizações             |
| `states`                  | `array<string>` | Filtrar por estados                  |
| `fonte`                   | `array<string>` | Filtrar por fontes                   |
| `status`                  | `string`        | `active`, `archived` ou `flagged`    |
| `relevancia_minima`       | `number`        | Relevância mínima (0.0 - 10.0)       |
| `tipo_evento`             | `string`        | Filtrar por tipo de evento           |
| `categoria`               | `string`        | Filtrar por categoria                |
| `classificacao_onehealth` | `string`        | Filtrar por classificação One Health |
| `data_coleta_de`          | `date`          | Data coleta início                   |
| `data_coleta_ate`         | `date`          | Data coleta fim                      |
| `data_evento_de`          | `date`          | Data evento início                   |
| `data_evento_ate`         | `date`          | Data evento fim                      |

---

## Estatísticas

### NoticiaStats (resumo geral)

| Campo              | Tipo            | Descrição               |
| ------------------ | --------------- | ----------------------- |
| `total_count`      | `integer`       | Total de notícias       |
| `active_count`     | `integer`       | Notícias ativas         |
| `archived_count`   | `integer`       | Notícias arquivadas     |
| `flagged_count`    | `integer`       | Notícias sinalizadas    |
| `date_range`       | `object`        | Período dos dados       |
| `top_doencas`      | `array<object>` | Top doenças mencionadas |
| `top_fontes`       | `array<object>` | Top fontes              |
| `top_localizacoes` | `array<object>` | Top localizações        |
| `top_sintomas`     | `array<object>` | Top sintomas            |

### Análise Temporal

Endpoint: `GET /api/v1/noticias/estatisticas/temporal`

**Params obrigatórios:** `data_inicio`, `data_fim`
**Params opcionais:** `granularidade` (dia/semana/mes), `doencas`, `estados`, `cidades`, `incluir_alertas`, `limite_alertas`

#### AnaliseTemporalNoticias

| Campo                      | Tipo                    | Descrição                                                 |
| -------------------------- | ----------------------- | --------------------------------------------------------- |
| `metadata`                 | `MetadadosAnalise`      | Período, filtros, versão do algoritmo                     |
| `serie_temporal`           | `array<PontoTemporal>`  | Série temporal com métricas por período                   |
| `estatisticas_periodo`     | `EstatisticasPeriodo`   | Totais, médias, dia de pico                               |
| `tendencia`                | `TendenciaTemporal`     | Direção (crescente/decrescente/estável), variação %       |
| `alertas`                  | `array<AlertaTemporal>` | Alertas identificados (aumento_subito, novo_padrao, etc.) |
| `doencas_em_alta`          | `array<object>`         | Doenças com maior crescimento                             |
| `localizacoes_em_destaque` | `array<object>`         | Localizações com maior atividade                          |

#### PontoTemporal

| Campo                     | Tipo            | Descrição                              |
| ------------------------- | --------------- | -------------------------------------- |
| `periodo`                 | `string`        | Data do período                        |
| `quantidade_noticias`     | `integer`       | Quantidade no período                  |
| `media_relevancia`        | `number`        | Média de relevância                    |
| `principais_doencas`      | `array<object>` | Top 3 doenças (nome + quantidade)      |
| `principais_localizacoes` | `array<object>` | Top 3 localizações (nome + quantidade) |

#### EstatisticasPeriodo

| Campo                    | Tipo      | Descrição                 |
| ------------------------ | --------- | ------------------------- |
| `total_noticias`         | `integer` | Total no período          |
| `media_por_dia`          | `number`  | Média diária              |
| `dia_pico`               | `string`  | Dia com mais notícias     |
| `quantidade_pico`        | `integer` | Quantidade no dia de pico |
| `media_relevancia_geral` | `number`  | Média geral de relevância |

#### TendenciaTemporal

| Campo                 | Tipo      | Descrição                               |
| --------------------- | --------- | --------------------------------------- |
| `direcao`             | `string`  | `crescente`, `decrescente` ou `estavel` |
| `variacao_percentual` | `number`  | Variação % no período                   |
| `dias_analisados`     | `integer` | Dias analisados                         |

### Análise Geográfica

Endpoint: `GET /api/v1/noticias/estatisticas/geografica`

**Params obrigatórios:** `data_inicio`, `data_fim`
**Params opcionais:** `nivel_geografico` (estadual/municipal), `estados`, `doencas`, `incluir_concentracoes`, `incluir_vazios`, `limite_municipios`

#### AnaliseGeograficaNoticias

| Campo                    | Tipo                            | Descrição                       |
| ------------------------ | ------------------------------- | ------------------------------- |
| `metadata`               | `MetadadosAnalise`              | Período, filtros, versão        |
| `distribuicao_estadual`  | `array<DadoGeografico>`         | Distribuição por estado         |
| `distribuicao_municipal` | `array<DadoGeografico>`         | Top municípios                  |
| `concentracoes`          | `array<ConcentracaoGeografica>` | Áreas de concentração           |
| `alertas`                | `array<AlertaGeografico>`       | Alertas geográficos             |
| `estados_sem_noticias`   | `array<string>`                 | Estados sem notícias no período |

#### DadoGeografico

| Campo                 | Tipo             | Descrição           |
| --------------------- | ---------------- | ------------------- |
| `nome`                | `string`         | Nome da região      |
| `estado`              | `string`         | Sigla do estado     |
| `cidade`              | `string \| null` | Nome da cidade      |
| `quantidade_noticias` | `integer`        | Quantidade          |
| `percentual_total`    | `number`         | % do total          |
| `media_relevancia`    | `number`         | Média de relevância |
| `principais_doencas`  | `array<object>`  | Principais doenças  |
| `coordenadas`         | `object \| null` | Lat/lng             |

#### ConcentracaoGeografica

| Campo                 | Tipo             | Descrição               |
| --------------------- | ---------------- | ----------------------- |
| `estados_afetados`    | `array<string>`  | Estados na concentração |
| `total_noticias`      | `integer`        | Total na área           |
| `percentual_nacional` | `number`         | % do total nacional     |
| `doenca_predominante` | `string \| null` | Doença mais mencionada  |

### Alertas

Endpoint: `GET /api/v1/noticias/estatisticas/alertas`

**Params opcionais:** `dias_analise` (default: 7), `severidade_minima` (default: baixa), `estados`, `incluir_indicadores`, `limite_alertas`

#### ResumoAlertasNoticias

| Campo                    | Tipo                         | Descrição                |
| ------------------------ | ---------------------------- | ------------------------ |
| `metadata`               | `MetadadosAnalise`           | Período, filtros, versão |
| `total_alertas_ativos`   | `integer`                    | Total de alertas ativos  |
| `alertas_por_severidade` | `object`                     | Contagem por severidade  |
| `alertas`                | `array<AlertaConsolidado>`   | Lista de alertas         |
| `indicadores`            | `array<IndicadorMonitorado>` | Indicadores monitorados  |

#### AlertaConsolidado

| Campo                   | Tipo             | Descrição                |
| ----------------------- | ---------------- | ------------------------ |
| `id`                    | `string`         | ID único do alerta       |
| `tipo`                  | `string`         | Tipo do alerta           |
| `severidade`            | `string`         | `baixa`, `media`, `alta` |
| `titulo`                | `string`         | Título descritivo        |
| `descricao`             | `string`         | Descrição detalhada      |
| `data_deteccao`         | `string`         | Quando foi detectado     |
| `localizacoes_afetadas` | `array<string>`  | Localizações             |
| `doencas_relacionadas`  | `array<string>`  | Doenças                  |
| `quantidade_noticias`   | `integer`        | Notícias relacionadas    |
| `recomendacao`          | `string \| null` | Recomendação de ação     |

#### IndicadorMonitorado

| Campo                 | Tipo     | Descrição                       |
| --------------------- | -------- | ------------------------------- |
| `nome`                | `string` | Nome do indicador               |
| `valor_atual`         | `number` | Valor atual                     |
| `valor_esperado`      | `number` | Valor esperado/normal           |
| `variacao_percentual` | `number` | Variação em relação ao esperado |
| `status`              | `string` | Status do indicador             |

---

## Notícias Relacionadas

Endpoint: `GET /api/v1/noticias/{unique_id}/relacionadas?limit=10`

Busca por cluster semântico (primário) ou doenças/localizações em comum (fallback).

#### NoticiasRelacionadasResponse

| Campo            | Tipo                     | Descrição                                    |
| ---------------- | ------------------------ | -------------------------------------------- |
| `noticia_id`     | `string`                 | UUID da notícia de referência                |
| `total`          | `integer`                | Total de relacionadas encontradas            |
| `criterio_usado` | `string`                 | `cluster` ou `similaridade`                  |
| `criterios`      | `object`                 | Detalhes (cluster_id, doenças, localizações) |
| `data`           | `array<NoticiaResumida>` | Lista de notícias relacionadas               |

---

## MetadadosAnalise (compartilhado)

Presente em todas as respostas de estatísticas.

| Campo               | Tipo     | Descrição                              |
| ------------------- | -------- | -------------------------------------- |
| `periodo_analise`   | `object` | `{ inicio, fim }`                      |
| `filtros_aplicados` | `object` | Filtros usados na análise              |
| `data_geracao`      | `string` | Timestamp da geração                   |
| `versao_analise`    | `string` | Versão do algoritmo (default: "0.0.1") |
